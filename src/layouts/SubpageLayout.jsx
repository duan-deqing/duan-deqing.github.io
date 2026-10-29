import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import MobileHeader from '../components/site/MobileHeader'
import MobileMenuSheet from '../components/site/MobileMenuSheet'
import SideMenu from '../components/site/SideMenu'

export default function SubpageLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
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
      <SideMenu />
      <div ref={scrollRef} className="flex min-w-0 flex-1 flex-col lg:h-dvh lg:overflow-y-auto">
        <MobileHeader open={menuOpen} onOpenMenu={openMenu} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 pt-8 lg:px-8 lg:pb-16 lg:pt-24">
          <Outlet />
        </main>
      </div>
      <MobileMenuSheet open={menuOpen} onClose={closeMenu} />
    </div>
  )
}
