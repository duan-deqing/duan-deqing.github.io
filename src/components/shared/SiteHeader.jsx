import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import config from '../../content/site.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import TransitionLink from './TransitionLink'
import ThemeLangControls from './ThemeLangControls'

export default function SiteHeader() {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const links = config.navLinks || []

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-page">
        <div className="container-page flex h-14 items-center justify-between gap-4">
          <TransitionLink
            to="/"
            className="text-[15px] font-semibold tracking-[-0.02em] text-ink"
          >
            STYLAN
          </TransitionLink>

          <nav aria-label="Main" className="hidden items-center gap-0.5 md:flex">
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <TransitionLink
                  key={link.href}
                  to={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    active ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {t(link.label)}
                </TransitionLink>
              )
            })}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeLangControls />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="flex h-8 w-8 flex-col items-center justify-center gap-1 md:hidden"
            >
              <span className="block h-px w-4 bg-ink" />
              <span className="block h-px w-4 bg-ink" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-30 bg-page pt-14 md:hidden">
          <nav aria-label="Mobile" className="container-page flex flex-col py-6">
            <TransitionLink
              to="/"
              onClick={() => setOpen(false)}
              className="border-b border-line py-4 text-xl font-semibold tracking-[-0.02em] text-ink"
            >
              {t({ en: 'Home', zh: '首页' })}
            </TransitionLink>
            {links.map((link) => (
              <TransitionLink
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 text-xl font-semibold tracking-[-0.02em] text-ink"
              >
                {t(link.label)}
              </TransitionLink>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
