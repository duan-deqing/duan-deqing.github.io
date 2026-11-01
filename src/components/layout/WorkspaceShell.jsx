import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BackgroundLayer from '../../backgrounds/BackgroundLayer'
import MobileHeader from './MobileHeader'
import MobileMenuSheet from './MobileMenuSheet'
import SideMenu from './SideMenu'
import ThemeLangControls from './ThemeLangControls'
import { useLanguage } from '../../hooks/useLanguage'
import { cn } from '../../utils/cn'

/**
 * 子页工作区外壳：侧栏导航 + 可选的列表栏 + 内容滚动区 + 移动端顶栏/抽屉。
 * 各布局只需要传入 rail / landing / surface 与内容宽度。
 */
export default function WorkspaceShell({
  background = null,
  rail = null,
  landing = null,
  isLanding = false,
  maxWidth = 'max-w-6xl',
  surfaceClassName = '',
  children,
}) {
  const { lang } = useLanguage()
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
      {background ? <BackgroundLayer variant={background} /> : null}
      <SideMenu />
      <div className="flex min-w-0 flex-1 flex-col lg:h-dvh lg:overflow-hidden">
        <MobileHeader open={menuOpen} onOpenMenu={openMenu} />
        <div className="flex min-w-0 flex-1 lg:h-dvh lg:min-h-0">
          {rail}
          <div
            ref={scrollRef}
            className={cn(
              'relative z-10 min-w-0 flex-1 overflow-x-clip lg:h-dvh lg:overflow-y-auto',
              surfaceClassName
            )}
          >
            <div className="fixed right-8 top-6 z-40 hidden lg:block">
              <ThemeLangControls />
            </div>
            {isLanding ? landing : null}
            <main
              className={cn(
                'mx-auto w-full px-6 pb-16 pt-8 lg:px-8 lg:pb-16 lg:pt-24',
                maxWidth
              )}
            >
              {children ?? <Outlet key={lang} />}
            </main>
          </div>
        </div>
      </div>
      <MobileMenuSheet open={menuOpen} onClose={closeMenu} />
    </div>
  )
}
