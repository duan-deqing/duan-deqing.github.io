import { useEffect, useRef } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import MenuContent from './MenuContent'
import ThemeLangControls from './ThemeLangControls'
import { CloseIcon } from './icons'

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

const MENU_LABEL = { en: 'Menu', zh: '菜单' }
const CLOSE_LABEL = { en: 'Close menu', zh: '关闭菜单' }

export default function MobileMenuSheet({ open, onClose }) {
  const { t } = useLanguage()
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const restoreRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    restoreRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const items = Array.from(panelRef.current.querySelectorAll(FOCUSABLE))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      const restore = restoreRef.current
      if (restore instanceof HTMLElement) restore.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-[var(--overlay)]"
        aria-label={t(CLOSE_LABEL)}
        onClick={onClose}
      />
      <div
        id="mobile-menu-sheet"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t(MENU_LABEL)}
        className="absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-y-auto rounded-t-2xl border-t border-line bg-page p-4 shadow-xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-heading">STYLAN</span>
          <button
            ref={closeRef}
            type="button"
            className="grid size-8 place-items-center rounded-md text-ink hover:bg-subtle"
            aria-label={t(CLOSE_LABEL)}
            onClick={onClose}
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <MenuContent onNavigate={onClose} />
        <div className="mt-3 border-t border-line pt-3">
          <ThemeLangControls variant="sidebar" className="justify-between" />
        </div>
      </div>
    </div>
  )
}
