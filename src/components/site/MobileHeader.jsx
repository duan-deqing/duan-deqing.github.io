import { useLocation } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import ThemeLangControls from './ThemeLangControls'
import { MenuIcon } from './icons'
import { NAV_ITEMS, isNavActive } from './MenuContent'

export default function MobileHeader({ open, onOpenMenu }) {
  const { pathname } = useLocation()
  const { t } = useLanguage()
  const current = NAV_ITEMS.find((item) => isNavActive(pathname, item.href))

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b border-line bg-page px-3 lg:hidden">
      <button
        type="button"
        className="grid size-8 place-items-center rounded-md text-ink hover:bg-subtle"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={onOpenMenu}
      >
        <MenuIcon size={18} />
      </button>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight text-heading">
        {current ? t(current.label) : 'STYLAN'}
      </span>
      <ThemeLangControls />
    </header>
  )
}
