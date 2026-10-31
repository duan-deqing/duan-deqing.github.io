import { useEffect, useReducer, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/cn'
import {
  MODAL_EXIT_MS,
  isExiting,
  isMounted,
  isVisible,
  presenceReducer,
} from '../../utils/modalPresence'

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

// 把手内的可交互控件要让位给自身行为（关闭按钮、链接、可选中文字）
const INTERACTIVE = 'a, button, input, select, textarea, [data-no-drag]'

const DRAG_EDGE_MARGIN = 12

function clamp(value, min, max) {
  const lo = Math.min(min, max)
  const hi = Math.max(min, max)
  return Math.min(Math.max(value, lo), hi)
}

export default function Modal({
  open,
  onClose,
  label,
  children,
  panelClassName = '',
  backdropClassName = '',
  maxWidth = 'max-w-lg',
  flush = false,
  draggable = false,
}) {
  const panelRef = useRef(null)
  const restoreRef = useRef(null)
  const dragRef = useRef(null)
  const offsetRef = useRef({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const onCloseRef = useRef(onClose)
  const [presence, dispatch] = useReducer(
    presenceReducer,
    open ? 'entering' : 'closed'
  )
  const mounted = isMounted(presence)
  const visible = isVisible(presence)
  const exiting = isExiting(presence)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (open) {
      dispatch({ type: 'open' })
      let frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => dispatch({ type: 'shown' }))
      })
      return () => cancelAnimationFrame(frame)
    }

    dispatch({ type: 'close' })
    const timer = window.setTimeout(() => dispatch({ type: 'closed' }), MODAL_EXIT_MS)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open) return
    dragRef.current = null
    offsetRef.current = { x: 0, y: 0 }
    setDragging(false)
    if (panelRef.current) panelRef.current.style.translate = ''
  }, [open])

  function onPointerDown(event) {
    if (!draggable) return
    if (event.pointerType === 'mouse' && event.button !== 0) return

    const panel = panelRef.current
    const handle = event.target.closest?.('[data-modal-drag-handle]')
    if (!panel || !handle || !panel.contains(handle)) return
    if (event.target.closest?.(INTERACTIVE)) return

    const rect = panel.getBoundingClientRect()
    const { x, y } = offsetRef.current
    // translate 相对布局原点累加，钳制边界要按未位移的布局盒来算
    const layoutLeft = rect.left - x
    const layoutTop = rect.top - y
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      baseX: x,
      baseY: y,
      minX: DRAG_EDGE_MARGIN - layoutLeft,
      maxX: window.innerWidth - DRAG_EDGE_MARGIN - (layoutLeft + rect.width),
      minY: DRAG_EDGE_MARGIN - layoutTop,
      maxY: window.innerHeight - DRAG_EDGE_MARGIN - (layoutTop + rect.height),
    }
    // 快速抬起时指针可能已失效，捕获失败只影响跨面板边界的跟随
    try {
      handle.setPointerCapture?.(event.pointerId)
    } catch {
      /* 指针已结束 */
    }
    setDragging(true)
    // 拖动期间屏蔽把手上的文字选中与长按菜单
    event.preventDefault()
  }

  function onPointerMove(event) {
    const drag = dragRef.current
    const panel = panelRef.current
    if (!drag || !panel || drag.pointerId !== event.pointerId) return

    const x = clamp(drag.baseX + event.clientX - drag.startX, drag.minX, drag.maxX)
    const y = clamp(drag.baseY + event.clientY - drag.startY, drag.minY, drag.maxY)
    offsetRef.current = { x, y }
    // translate 与 transform 各自独立，位移不会打断面板的入场/退场过渡
    panel.style.translate = `${x}px ${y}px`
  }

  function onPointerUp(event) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    dragRef.current = null
    setDragging(false)
  }

  useEffect(() => {
    if (!open || !mounted) return undefined

    const panel = panelRef.current
    restoreRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusables = () => Array.from(panel?.querySelectorAll(FOCUSABLE) || [])
    const focusFirst = () => {
      const items = focusables()
      if (items.length > 0) items[0].focus()
      else panel?.focus()
    }
    const frame = requestAnimationFrame(focusFirst)

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        // 输入法组合期间的 Esc 属于 IME，不关闭弹窗；Tab 仍交给焦点陷阱
        if (event.isComposing || event.keyCode === 229) return
        event.preventDefault()
        onCloseRef.current?.()
        return
      }
      if (event.key !== 'Tab' || !panel) return

      const items = focusables()
      if (items.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }

      const active = document.activeElement
      if (!panel.contains(active)) {
        event.preventDefault()
        items[0].focus()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || active === panel)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      const restore = restoreRef.current
      if (restore instanceof HTMLElement) restore.focus()
    }
  }, [open, mounted])

  if (!mounted || typeof document === 'undefined') return null

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-[60] flex items-center justify-center p-4',
        !visible && 'pointer-events-none'
      )}
      data-state={presence}
      aria-hidden={open ? undefined : true}
    >
      <button
        type="button"
        tabIndex={-1}
        className={cn(
          'modal-backdrop absolute inset-0 bg-[var(--overlay)]',
          backdropClassName,
          visible && 'is-visible'
        )}
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={cn(
          'modal-panel relative max-h-[min(90dvh,720px)] w-full overflow-y-auto rounded-lg border border-line bg-page shadow-xl',
          flush ? 'p-0' : 'p-5',
          maxWidth,
          visible && 'is-visible',
          exiting && 'is-closing',
          dragging && 'is-dragging',
          panelClassName
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
