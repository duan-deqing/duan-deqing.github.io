export default function AdminTopbar({
  label,
  dark,
  onToggleTheme,
  dirty,
  saving,
  onDiscard,
  onSave,
  previewOpen,
  onTogglePreview,
  actionsDisabled = false,
}) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <span className="admin-breadcrumb">内容管理 / {label}</span>
      </div>
      <div className="admin-topbar-actions">
        <button
          type="button"
          className="admin-btn admin-theme-toggle"
          onClick={onToggleTheme}
          aria-label={dark ? '切换到浅色主题' : '切换到深色主题'}
          title={dark ? '切换到浅色主题' : '切换到深色主题'}
        >
          {dark ? '浅色' : '深色'}
        </button>
        {dirty ? <span className="admin-badge">未保存</span> : null}
        <button className="admin-btn" onClick={onDiscard} disabled={!dirty || saving}>
          撤销
        </button>
        <button
          className="admin-btn admin-btn-primary"
          onClick={onSave}
          disabled={saving || !dirty || actionsDisabled}
        >
          {saving ? '保存中…' : '保存'}
        </button>
        <button className="admin-btn" onClick={onTogglePreview}>
          {previewOpen ? '收起预览' : '预览'}
        </button>
      </div>
    </header>
  )
}
