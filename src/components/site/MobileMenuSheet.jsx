import { useEffect, useRef, useState } from 'react'
import quotesConfig from '@content/pages/quotes.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import { cn } from '../../utils/cn'
import ChangelogLink from './ChangelogLink'
import MenuContent from './MenuContent'
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
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)
  const [entered, setEntered] = useState(false)
  const [quote, setQuote] = useState(null)

  useEffect(() => {
    if (open) {
      const quotes = quotesConfig.quotes || []
      setQuote(quotes.length ? quotes[Math.floor(Math.random() * quotes.length)] : null)
      setMounted(true)
      setEntered(true)
      let frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setVisible(true))
      })
      return () => cancelAnimationFrame(frame)
    }
    setVisible(false)
    setEntered(false)
    const timer = window.setTimeout(() => setMounted(false), 320)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open || !mounted) return undefined
    restoreRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function onKeyDown(event) {
      if (document.querySelector('.modal-panel')) return
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
  }, [open, mounted, onClose])

  if (!mounted) return null

  return (
    <div className={cn('fixed inset-0 z-50 lg:hidden', !visible && 'pointer-events-none')}>
      <button
        type="button"
        className={cn(
          'mobile-sheet-backdrop absolute inset-0 bg-[var(--overlay)]',
          visible && 'is-visible'
        )}
        aria-label={t(CLOSE_LABEL)}
        onClick={onClose}
      />
      <div
        id="mobile-menu-sheet"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t(MENU_LABEL)}
        className={cn(
          'mobile-sheet-panel absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-y-auto rounded-t-2xl border-t border-line bg-page p-4 shadow-xl',
          visible && 'is-visible',
          entered && 'is-entered'
        )}
      >
        <div className="relative mb-2 flex h-8 items-center justify-center">
          {quote ? (
            <p
              className="mx-10 min-w-0 truncate text-center text-xs text-muted"
              title={t(quote)}
            >
              {t(quote)}
            </p>
          ) : null}
          <button
            ref={closeRef}
            type="button"
            className="absolute right-0 top-0 grid size-8 place-items-center rounded-full text-ink transition-colors hover:bg-subtle"
            aria-label={t(CLOSE_LABEL)}
            onClick={onClose}
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <MenuContent onNavigate={onClose} />
        <div className="mt-4 border-t border-line pt-3">
          <ChangelogLink onNavigate={onClose} />
        </div>
      </div>
    </div>
  )
}
