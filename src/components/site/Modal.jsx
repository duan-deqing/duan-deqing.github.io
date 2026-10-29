import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/cn'

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

export default function Modal({
  open,
  onClose,
  label,
  children,
  panelClassName = '',
  maxWidth = 'max-w-lg',
}) {
  const panelRef = useRef(null)
  const restoreRef = useRef(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined

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
  }, [open])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        tabIndex={-1}
        className="absolute inset-0 bg-[var(--overlay)]"
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
          'relative max-h-[min(90dvh,720px)] w-full overflow-y-auto rounded-lg border border-line bg-page p-5 shadow-xl',
          maxWidth,
          panelClassName
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
