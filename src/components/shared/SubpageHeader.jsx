/**
 * SubpageHeader — 子页导航；移动端与首页 site-mobile-menu 一致
 */

import { useState, useEffect } from 'react'
import config from '../../config'
import { useTheme } from '../../hooks/useTheme'
import { useLanguage } from '../../hooks/useLanguage'
import TransitionLink from './TransitionLink'

function ThemeLangControls() {
  const { isDark, toggle: toggleTheme } = useTheme()
  const { lang, toggle: toggleLang } = useLanguage()

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={toggleTheme}
        className="w-8 h-8 rounded-sm flex items-center justify-center hover:bg-[var(--accent-soft)] text-muted transition-colors"
        aria-label="Toggle theme"
      >
        <span className="font-mono-ui text-xs">{isDark ? '☾' : '☀'}</span>
      </button>
      <button
        onClick={toggleLang}
        className="h-8 px-2 rounded-sm font-mono-ui text-[11px] tracking-wider text-muted hover:bg-[var(--accent-soft)] hover:text-ink transition-colors"
        aria-label="Toggle language"
      >
        {lang === 'en' ? '中文' : 'EN'}
      </button>
    </div>
  )
}

export default function SubpageHeader() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const links = config.navLinks || []

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const menuItems = [
    { id: 'home', label: { en: 'Home', zh: '首页' }, href: '/' },
    ...links.map((l) => ({ id: l.href, label: l.label, href: l.href })),
  ]

  return (
    <>
      <header className="subpage-header">
        <div className="subpage-nav-pill">
          <TransitionLink
            to="/"
            className="font-display text-sm sm:text-base font-semibold tracking-tight text-ink shrink-0 pr-1 sm:pr-2 border-r border-line mr-1 sm:mr-2"
          >
            STYLAN
          </TransitionLink>

          <nav className="hidden md:flex items-center gap-0.5">
            {links.map((link) => (
              <TransitionLink
                key={link.href}
                to={link.href}
                className="font-mono-ui text-[10px] sm:text-[11px] tracking-[0.1em] uppercase text-muted hover:text-ink px-2.5 py-1.5 rounded-sm hover:bg-[var(--accent-soft)] transition-colors"
              >
                {t(link.label)}
              </TransitionLink>
            ))}
          </nav>

          <div className="hidden md:block ml-1 pl-2 border-l border-line">
            <ThemeLangControls />
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden site-mobile-menu-btn"
            aria-label="Menu"
            aria-expanded={open}
          >
            <span
              className="block w-4 h-px bg-[var(--ink)] transition-transform"
              style={{ transform: open ? 'translateY(2.5px) rotate(45deg)' : 'none' }}
            />
            <span
              className="block w-4 h-px bg-[var(--ink)] transition-transform"
              style={{ transform: open ? 'translateY(-2.5px) rotate(-45deg)' : 'none' }}
            />
          </button>
        </div>
      </header>

      {open && (
        <div className="site-mobile-menu md:hidden">
          <nav className="flex flex-col">
            {menuItems.map((item, index) => (
              <TransitionLink
                key={item.id}
                to={item.href}
                onClick={() => setOpen(false)}
                className="site-mobile-menu-link"
              >
                <span className="font-mono-ui text-[11px] tracking-[0.12em] text-muted min-w-[1.75rem]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
                  {t(item.label)}
                </span>
              </TransitionLink>
            ))}
          </nav>

          <div className="mt-auto pt-10">
            <p className="font-mono-ui text-[10px] tracking-wider text-muted">
              {config.footer?.copyright || `© ${new Date().getFullYear()} STYLAN`}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
