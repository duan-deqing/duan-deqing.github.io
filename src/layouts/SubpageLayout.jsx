import { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'
import MobileHeader from '../components/site/MobileHeader'
import MobileMenuSheet from '../components/site/MobileMenuSheet'
import SideMenu from '../components/site/SideMenu'

export default function SubpageLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <div className="min-h-dvh bg-page text-ink lg:flex lg:h-dvh lg:overflow-hidden">
      <SideMenu />
      <div className="flex min-w-0 flex-1 flex-col lg:h-dvh lg:overflow-y-auto">
        <MobileHeader open={menuOpen} onOpenMenu={openMenu} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 pt-8 lg:px-8 lg:pb-16 lg:pt-24">
          <Outlet />
        </main>
      </div>
      <MobileMenuSheet open={menuOpen} onClose={closeMenu} />
    </div>
  )
}
