import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import config from '../../content/site.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import { cn } from '../../utils/cn'
import ThemeLangControls from './ThemeLangControls'
import { BookmarkIcon, CloseIcon, MenuIcon, WandSparklesIcon } from './icons'

const ICON_LINKS = {
  '/skills': WandSparklesIcon,
  '/bookmarks': BookmarkIcon,
}

const ICON_LINK =
  'inline-flex h-8 items-center justify-center rounded-none px-1 text-ink opacity-60 transition-opacity hover:opacity-100'

export default function HomeHeader({ background, onCycleBackground }) {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const links = config.navLinks || []
  const textLinks = links.filter((link) => !ICON_LINKS[link.href])
  const iconLinks = links.filter((link) => ICON_LINKS[link.href])
  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`)

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

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
          {textLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className="text-sm text-ink opacity-60 transition-opacity hover:opacity-100"
            >
              {t(link.label)}
            </Link>
          ))}
          <div className="flex items-center gap-1">
            {iconLinks.map((link) => {
              const Icon = ICON_LINKS[link.href]
              const label = t(link.label)
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-label={label}
                  title={label}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={ICON_LINK}
                >
                  <Icon size={16} />
                </Link>
              )
            })}
            {onCycleBackground ? (
              <ThemeLangControls
                background={background}
                onCycleBackground={onCycleBackground}
              />
            ) : (
              <ThemeLangControls />
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeLangControls
            background={background}
            onCycleBackground={onCycleBackground}
          />
          <button
            type="button"
            className="grid size-8 place-items-center rounded-md text-ink hover:bg-subtle"
            aria-label={
              open
                ? t({ en: 'Close menu', zh: '关闭菜单' })
                : t({ en: 'Open menu', zh: '打开菜单' })
            }
            aria-expanded={open}
            aria-controls="home-mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="home-mobile-nav"
          aria-label="Mobile"
          className="mt-4 flex flex-col divide-y divide-line border-y border-line md:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={cn(
                'py-3 text-base',
                isActive(link.href) ? 'text-heading' : 'text-muted-strong'
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
