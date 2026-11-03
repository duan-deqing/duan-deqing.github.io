import { useEffect, useRef } from 'react'
import ProfileAvatar from '../../components/layout/ProfileAvatar'
import { cn } from '../../utils/cn'

export default function AdminSidebar({ items, activeId, onSelect, profile }) {
  const activeRef = useRef(null)

  // 窄屏分区条横向滚动时，把当前分区带回可视区域
  useEffect(() => {
    if (!window.matchMedia('(max-width: 1023px)').matches) return
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [activeId])

  return (
    <aside className="admin-sidebar">
      <button
        type="button"
        className={cn('admin-profile', activeId === 'profile' && 'is-active')}
        onClick={() => onSelect('profile')}
        aria-current={activeId === 'profile' ? 'page' : undefined}
      >
        <ProfileAvatar avatar={profile.avatar} name={profile.name} role={profile.role} />
      </button>

      <nav className="admin-nav" aria-label="后台导航">
        {items.map(({ id, label }) => (
          <button
            key={id}
            className={`admin-nav-btn ${activeId === id ? 'is-active' : ''}`}
            ref={activeId === id ? activeRef : null}
            onClick={() => onSelect(id)}
            aria-current={activeId === id ? 'page' : undefined}
          >
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
