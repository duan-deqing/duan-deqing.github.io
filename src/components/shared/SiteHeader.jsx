import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import config from '../../content/site.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import ThemeLangControls from './ThemeLangControls'

export default function SiteHeader() {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const links = config.navLinks || []
  const isActive = (href) => pathname === href || pathname.startsWith(href + '/')

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const mq = window.matchMedia('(min-width: 768px)')
    const handleChange = (event) => {
      if (event.matches) setOpen(false)
    }
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [open])

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-page">
        <div className="container-page flex h-14 items-center justify-between gap-4">
          <Link
            to="/"
            className="text-[15px] font-semibold tracking-[-0.02em] text-ink"
          >
            STYLAN
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-0.5 md:flex">
            {links.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    active ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {t(link.label)}
                </Link>
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
            <Link
              to="/"
              onClick={() => setOpen(false)}
              aria-current={pathname === '/' ? 'page' : undefined}
              className={`border-b border-line py-4 text-xl font-semibold tracking-[-0.02em] ${
                pathname === '/' ? 'text-ink' : 'text-muted'
              }`}
            >
              {t({ en: 'Home', zh: '首页' })}
            </Link>
            {links.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`border-b border-line py-4 text-xl font-semibold tracking-[-0.02em] ${
                    active ? 'text-ink' : 'text-muted'
                  }`}
                >
                  {t(link.label)}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}
