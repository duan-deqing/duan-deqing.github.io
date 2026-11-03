import { Fragment, useEffect, useRef } from 'react'

export default function AdminSidebar({ items, activeId, onSelect, dark, onToggleTheme }) {
  const activeRef = useRef(null)

  // 窄屏分区条横向滚动时，把当前分区带回可视区域
  useEffect(() => {
    if (!window.matchMedia('(max-width: 1023px)').matches) return
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [activeId])

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand-block">
        <span className="admin-brand">STYLAN</span>
        <span className="admin-brand-sub">内容后台</span>
      </div>

      <nav className="admin-nav" aria-label="后台导航">
        {items.map(({ id, label }, index) => (
          <Fragment key={id}>
            {id === 'posts' && <div className="admin-nav-divider" />}
            <button
              className={`admin-nav-btn ${activeId === id ? 'is-active' : ''}`}
              ref={activeId === id ? activeRef : null}
              onClick={() => onSelect(id)}
              aria-current={activeId === id ? 'page' : undefined}
            >
              <span>{label}</span>
              <span className="admin-nav-index" aria-hidden="true">{index + 1}</span>
            </button>
          </Fragment>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button type="button" className="admin-text-btn" onClick={onToggleTheme}>
          {dark ? '浅色主题' : '深色主题'}
        </button>
        <a className="admin-text-btn" href="/" target="_blank" rel="noopener noreferrer">
          打开前台 ↗
        </a>
      </div>
    </aside>
  )
}
