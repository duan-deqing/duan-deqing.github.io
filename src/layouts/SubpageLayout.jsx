import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BackgroundLayer from '../backgrounds/BackgroundLayer'
import { pageBackgroundForPath } from '../backgrounds'
import MobileHeader from '../components/site/MobileHeader'
import MobileMenuSheet from '../components/site/MobileMenuSheet'
import SideMenu from '../components/site/SideMenu'
import ThemeLangControls from '../components/site/ThemeLangControls'
import { useLanguage } from '../hooks/useLanguage'

export default function SubpageLayout() {
  const { lang } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const background = pageBackgroundForPath(pathname)
  const scrollRef = useRef(null)
  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    closeMenu()
    window.scrollTo(0, 0)
    // 桌面端内容区是内层滚动容器，window 复位对它无效
    scrollRef.current?.scrollTo(0, 0)
  }, [pathname, closeMenu])

  return (
    <div className="min-h-dvh bg-page text-ink lg:flex lg:h-dvh lg:overflow-hidden">
      {background ? <BackgroundLayer variant={background} /> : null}
      <SideMenu />
      <div
        ref={scrollRef}
        className="relative z-10 flex min-w-0 flex-1 flex-col overflow-x-clip lg:h-dvh lg:overflow-y-auto"
      >
        <div className="fixed right-8 top-6 z-40 hidden lg:block">
          <ThemeLangControls />
        </div>
        <MobileHeader open={menuOpen} onOpenMenu={openMenu} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-8 lg:px-8 lg:pb-16 lg:pt-24">
          <Outlet key={lang} />
        </main>
      </div>
      <MobileMenuSheet open={menuOpen} onClose={closeMenu} />
    </div>
  )
}
