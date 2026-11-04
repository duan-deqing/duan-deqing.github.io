import { useEffect, useRef } from 'react'
import ProfileAvatar from '../../components/layout/ProfileAvatar'
import { cn } from '../../utils/cn'
import { useAdminT } from '../i18n'

const GROUP_LABELS = {
  content: '内容',
  site: '站点',
}

// 按 schema 里的 group 分组；未分组的项（Dashboard）单独置顶
function groupsOf(items) {
  const groups = []
  for (const item of items) {
    const group = item.group || ''
    const last = groups[groups.length - 1]
    if (last && last.group === group) last.items.push(item)
    else groups.push({ group, items: [item] })
  }
  return groups
}

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
        {groupsOf(items).map(({ group, items: groupItems }) => (
          <div className="admin-nav-group" key={group || 'main'}>
            {group && GROUP_LABELS[group] ? (
              <span className="admin-nav-label">{t(GROUP_LABELS[group])}</span>
            ) : null}
            {groupItems.map(({ id, label }) => (
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
          </div>
        ))}
      </nav>
    </aside>
  )
}
