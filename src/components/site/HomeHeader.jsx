import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import config from '@content/site.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import ThemeLangControls from './ThemeLangControls'
import HomeSignature from './HomeSignature'
import {
  BookmarkIcon,
  CodeIcon,
  FolderIcon,
  HomeIcon,
  PenIcon,
} from './icons'

const ICON_LINKS = {
  '/projects': FolderIcon,
  '/blog': PenIcon,
  '/stack': CodeIcon,
  '/bookmarks': BookmarkIcon,
}

const ICON_LINK =
  'inline-flex h-8 items-center justify-center rounded-none px-1 text-ink opacity-60 transition-opacity hover:opacity-100'
const NAV_ICON_SIZE = 19

export default function HomeHeader({ background, onCycleBackground }) {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const [hint, setHint] = useState(null)
  const iconEntries = [
    { href: '/home', label: { en: 'Home', zh: '首页' }, Icon: HomeIcon },
    ...(config.navLinks || []).map((link) => ({
      href: link.href,
      label: link.label,
      Icon: ICON_LINKS[link.href] || FolderIcon,
    })),
  ]
  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`)

  const showHintFor = (event) => {
    const target = event.target.closest('a[aria-label], button[aria-label]')
    if (target) setHint(target.getAttribute('aria-label'))
  }

  const refreshHint = (event) => {
    const target = event.target.closest('button[aria-label]')
    if (!target) return
    requestAnimationFrame(() => setHint(target.getAttribute('aria-label')))
  }

  return (
    <header className="mx-auto w-full max-w-6xl px-5 py-6 md:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/"
          className="home-signature-link inline-flex shrink-0 items-center text-heading"
          aria-label={t({ en: 'deqing — STYLAN home', zh: 'deqing — STYLAN 首页' })}
        >
          <HomeSignature />
        </Link>

        <nav
          aria-label="Main"
          className="relative hidden items-center gap-1 md:flex"
          onMouseOver={showHintFor}
          onMouseLeave={() => setHint(null)}
          onClick={refreshHint}
          onFocus={showHintFor}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setHint(null)
          }}
        >
          {iconEntries.map(({ href, label, Icon }) => {
            const text = t(label)
            return (
              <Link
                key={href}
                to={href}
                aria-label={text}
                aria-current={isActive(href) ? 'page' : undefined}
                className={ICON_LINK}
              >
                <Icon size={NAV_ICON_SIZE} />
              </Link>
            )
          })}
          {hint ? (
            <span className="home-icon-tooltip" aria-hidden="true">
              {hint}
            </span>
          ) : null}
          {onCycleBackground ? (
            <ThemeLangControls
              background={background}
              onCycleBackground={onCycleBackground}
              suppressTitle
            />
          ) : (
            <ThemeLangControls suppressTitle />
          )}
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          {iconEntries.map(({ href, label, Icon }) => {
            const text = t(label)
            return (
              <Link
                key={href}
                to={href}
                aria-label={text}
                aria-current={isActive(href) ? 'page' : undefined}
                className={ICON_LINK}
              >
                <Icon size={NAV_ICON_SIZE} />
              </Link>
            )
          })}
          <ThemeLangControls
            background={background}
            onCycleBackground={onCycleBackground}
          />
        </div>
      </div>
    </header>
  )
}
