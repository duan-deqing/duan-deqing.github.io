import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeLangControls from './ThemeLangControls'
import MenuContent, { NAV_ITEMS } from './MenuContent'

function isEditable(target) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

export default function SideMenu() {
  const navigate = useNavigate()

  useEffect(() => {
    function onKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isEditable(event.target)) return
      const index = Number(event.code.replace('Digit', '')) - 1
      const item = NAV_ITEMS[index]
      if (item && event.code.startsWith('Digit')) {
        event.preventDefault()
        navigate(item.href)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navigate])

  return (
    <aside className="hidden lg:flex lg:h-dvh lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-line lg:bg-sidebar xl:w-72">
      <div className="flex-1 overflow-y-auto p-3">
        <MenuContent />
      </div>
      <div className="border-t border-line p-3">
        <ThemeLangControls variant="sidebar" className="justify-between" />
      </div>
    </aside>
  )
}
