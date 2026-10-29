import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import config from '../../content/site.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import { cn } from '../../utils/cn'
import ThemeLangControls from './ThemeLangControls'
import { CloseIcon, MenuIcon } from './icons'

export default function HomeHeader() {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const links = config.navLinks || []

  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="mx-auto w-full max-w-6xl px-5 py-6 md:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/"
          className="text-sm font-semibold tracking-tight text-heading"
          aria-label={t({ en: 'STYLAN home', zh: 'STYLAN 首页' })}
        >
          STYLAN
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className="text-sm text-ink opacity-60 transition-opacity hover:opacity-100"
            >
              {t(link.label)}
            </Link>
          ))}
          <ThemeLangControls />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeLangControls />
          <button
            type="button"
            className="grid size-8 place-items-center rounded-md text-ink hover:bg-subtle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          aria-label="Mobile"
          className="mt-4 flex flex-col divide-y divide-line border-y border-line md:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'py-3 text-base',
                pathname === link.href ? 'text-heading' : 'text-muted-strong'
              )}
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  )
}
