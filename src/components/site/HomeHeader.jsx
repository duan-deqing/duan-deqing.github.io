import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import config from '../../content/site.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import { cn } from '../../utils/cn'
import ThemeLangControls from './ThemeLangControls'
import HomeSignature from './HomeSignature'
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
  const panelRef = useRef(null)
  const buttonRef = useRef(null)
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
    function handlePointerDown(event) {
      if (panelRef.current?.contains(event.target)) return
      if (buttonRef.current?.contains(event.target)) return
      setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [open])

  return (
    <header className="mx-auto w-full max-w-6xl px-5 py-6 md:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/"
          className="home-signature-link -m-2 inline-flex shrink-0 items-center p-2 text-heading"
          aria-label={t({ en: 'deqing — STYLAN home', zh: 'deqing — STYLAN 首页' })}
        >
          <HomeSignature />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-5 md:flex">
          {textLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className="home-nav-link text-sm"
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

        <div className="relative flex items-center gap-1 md:hidden">
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
          <ThemeLangControls
            background={background}
            onCycleBackground={onCycleBackground}
          />
          <button
            ref={buttonRef}
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

          {open ? (
            <nav
              ref={panelRef}
              id="home-mobile-nav"
              aria-label="Mobile"
              className="home-menu-enter absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-line bg-page p-1 shadow-lg"
            >
              {textLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={cn(
                    'block rounded-md px-3 py-2.5 text-sm transition-colors',
                    isActive(link.href)
                      ? 'bg-active text-active-fg'
                      : 'text-ink hover:bg-subtle'
                  )}
                >
                  {t(link.label)}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  )
}
