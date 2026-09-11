/**
 * SiteRail — Brittany 式左栏：身份 / 导航 / 底部社交与主题
 */

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import config from '../../config'
import { useTheme } from '../../hooks/useTheme'
import { useLanguage } from '../../hooks/useLanguage'
import ArrowIcon from './ArrowIcon'
import TransitionLink from './TransitionLink'

function ThemeLangControls({ stacked = false }) {
  const { isDark, toggle: toggleTheme } = useTheme()
  const { lang, toggle: toggleLang } = useLanguage()

  return (
    <div className={`flex items-center gap-1 ${stacked ? 'justify-start' : ''}`}>
      <button
        onClick={toggleTheme}
        className="w-9 h-9 rounded-sm flex items-center justify-center hover:bg-[var(--accent-soft)] text-muted"
        aria-label="Toggle theme"
        title={isDark ? 'Light' : 'Dark'}
      >
        <span className="font-mono-ui text-xs">{isDark ? '☾' : '☀'}</span>
      </button>
      <button
        onClick={toggleLang}
        className="h-9 px-2.5 rounded-sm font-mono-ui text-[11px] tracking-wider text-muted hover:bg-[var(--accent-soft)] hover:text-ink"
        aria-label="Toggle language"
      >
        {lang === 'en' ? '中文' : 'EN'}
      </button>
    </div>
  )
}

function SocialIcon({ platform, href }) {
  const label = platform.toLowerCase()
  let path = null
  if (label.includes('github')) {
    path = (
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    )
  } else if (label.includes('bilibili')) {
    path = (
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 01-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 01.16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
    )
  } else {
    path = <ArrowIcon direction="up-right" size={16} />
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center w-9 h-9 text-muted hover:text-accent transition-colors"
      aria-label={platform}
      title={platform}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {path}
      </svg>
    </a>
  )
}

export default function SiteRail() {
  const { t, lang } = useLanguage()
  const location = useLocation()
  const [activeId, setActiveId] = useState('about')
  const [menuOpen, setMenuOpen] = useState(false)
  const sections = config.homeSections || []
  const isHome = location.pathname === '/'

  useEffect(() => {
    if (!isHome) return
    const ids = sections.map((s) => s.id)
    const onScroll = () => {
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 160) current = id
      }
      setActiveId(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome, sections])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const socials = config.socialLinks || []

  return (
    <>
      {/* 桌面左栏 — Hero 身份 + 导航垂直居中，社交贴底 */}
      <aside className="site-rail">
        <div className="site-rail-main">
          <p
            className="font-mono-ui text-[11px] tracking-[0.14em] uppercase"
            style={{ color: 'var(--accent)' }}
          >
            {t(config.personal?.titlePrefix)}
          </p>

          <TransitionLink to="/" className="block mt-3 group">
            <h1
              className="font-display font-semibold tracking-tight text-ink leading-[0.95]"
              style={{ fontSize: 'clamp(2.5rem, 4vw, 3.25rem)' }}
            >
              {t(config.personal?.titleName) || 'STYLAN'}
            </h1>
          </TransitionLink>

          <p className="mt-4 text-sm text-muted leading-relaxed max-w-[20rem]">
            {t(config.personal?.bio)}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {(config.personal?.tags || []).map((tag) => (
              <span
                key={t(tag)}
                className="font-mono-ui text-[10px] tracking-[0.08em] uppercase px-2 py-0.5 rounded-sm border border-line text-muted"
              >
                {t(tag)}
              </span>
            ))}
          </div>

          <nav className="mt-12 flex flex-col">
            {isHome ? (
              sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`rail-link ${activeId === s.id ? 'is-active' : ''}`}
                >
                  {t(s.label)}
                </a>
              ))
            ) : (
              <>
                <TransitionLink to="/" className="rail-link">
                  {t({ en: 'Home', zh: '首页' })}
                </TransitionLink>
                {config.navLinks.map((link) => (
                  <TransitionLink
                    key={link.href}
                    to={link.href}
                    className={`rail-link ${location.pathname === link.href ? 'is-active' : ''}`}
                  >
                    {t(link.label)}
                  </TransitionLink>
                ))}
              </>
            )}
          </nav>
        </div>

        <div className="site-rail-foot">
          <div className="flex items-center gap-1 mb-4">
            {socials.map((s) => (
              <SocialIcon key={s.platform} platform={s.platform} href={s.url} />
            ))}
          </div>
          <ThemeLangControls />
          <p className="mt-5 font-mono-ui text-[10px] text-muted tracking-wider">
            {config.footer?.copyright || `© ${new Date().getFullYear()} STYLAN`}
          </p>
        </div>
      </aside>

      {/* 移动顶栏 — 与内容同宽的编辑部顶栏 */}
      <header className="site-mobile-header">
        <div className="site-mobile-header-inner">
          <TransitionLink
            to="/"
            className="font-display text-base font-semibold tracking-tight text-ink"
          >
            STYLAN
          </TransitionLink>
          <div className="flex items-center gap-0.5">
            <ThemeLangControls />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="site-mobile-menu-btn"
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <span
                className="block w-4 h-px bg-[var(--ink)] transition-transform"
                style={{
                  transform: menuOpen ? 'translateY(2.5px) rotate(45deg)' : 'none',
                }}
              />
              <span
                className="block w-4 h-px bg-[var(--ink)] transition-transform"
                style={{
                  transform: menuOpen ? 'translateY(-2.5px) rotate(-45deg)' : 'none',
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* 移动全屏菜单 */}
      {menuOpen && (
        <div className="site-mobile-menu lg:hidden">
          <nav className="flex flex-col">
            {(isHome
              ? sections.map((s) => ({ id: s.id, label: s.label, href: `#${s.id}` }))
              : [
                  { id: 'home', label: { en: 'Home', zh: '首页' }, href: '/' },
                  ...config.navLinks.map((l) => ({
                    id: l.href,
                    label: l.label,
                    href: l.href,
                  })),
                ]
            ).map((item, index) => {
              const isRoute = item.href.startsWith('/')
              const label = t(item.label)
              const inner = (
                <>
                  <span className="font-mono-ui text-[11px] tracking-[0.12em] text-muted min-w-[1.75rem]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
                    {label}
                  </span>
                </>
              )
              const className = 'site-mobile-menu-link'

              if (isRoute) {
                return (
                  <TransitionLink
                    key={item.id}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={className}
                  >
                    {inner}
                  </TransitionLink>
                )
              }
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={className}
                >
                  {inner}
                </a>
              )
            })}
          </nav>

          <div className="mt-auto pt-10">
            <div className="flex items-center gap-1 mb-4">
              {socials.map((s) => (
                <SocialIcon key={s.platform} platform={s.platform} href={s.url} />
              ))}
            </div>
            <p className="font-mono-ui text-[10px] tracking-wider text-muted">
              {config.footer?.copyright || `© ${new Date().getFullYear()} STYLAN`}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
