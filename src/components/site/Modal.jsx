import { useEffect, useReducer, useRef } from 'react'
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

export default function Modal({
  open,
  onClose,
  label,
  children,
  panelClassName = '',
  backdropClassName = '',
  maxWidth = 'max-w-lg',
  flush = false,
}) {
  const panelRef = useRef(null)
  const restoreRef = useRef(null)
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
        className={cn(
          'modal-panel relative max-h-[min(90dvh,720px)] w-full overflow-y-auto rounded-lg border border-line bg-page shadow-xl',
          flush ? 'p-0' : 'p-5',
          maxWidth,
          visible && 'is-visible',
          exiting && 'is-closing',
          panelClassName
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
