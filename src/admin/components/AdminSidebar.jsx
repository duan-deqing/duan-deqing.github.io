import { useEffect, useRef } from 'react'
import ProfileAvatar from '../../components/layout/ProfileAvatar'
import { cn } from '../../utils/cn'
import { useAdminT } from '../i18n'

export default function AdminSidebar({
  items,
  activeId,
  onSelect,
  onOpenProfile,
  profileOpen = false,
  profile,
}) {
  const t = useAdminT()
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
        className={cn('admin-profile', profileOpen && 'is-active')}
        onClick={onOpenProfile}
        aria-label={t('打开个人信息')}
        aria-haspopup="dialog"
        aria-expanded={profileOpen}
      >
        <ProfileAvatar avatar={profile.avatar} name={profile.name} role={profile.role} />
      </button>

      <nav className="admin-nav" aria-label={t('后台导航')}>
        {items.map(({ id, label }) => (
          <button
            key={id}
            className={`admin-nav-btn ${activeId === id ? 'is-active' : ''}`}
            ref={activeId === id ? activeRef : null}
            onClick={() => onSelect(id)}
            aria-current={activeId === id ? 'page' : undefined}
          >
            <span>{t(label)}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
