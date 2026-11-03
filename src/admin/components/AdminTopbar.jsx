import IconButton, { ICON_BUTTON_CLASS } from '../../components/ui/IconButton'
import {
  ArrowUpRightIcon,
  EyeIcon,
  HistoryIcon,
  MoonIcon,
  SaveIcon,
  SunIcon,
} from '../../components/ui/icons'

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
}) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <span className="admin-breadcrumb">内容管理 / {label}</span>
      </div>
      <div className="admin-topbar-actions">
        {dirty ? <span className="admin-badge">未保存</span> : null}
        <IconButton
          label="撤销未保存修改"
          disabled={!dirty || saving}
          onClick={onDiscard}
        >
          <HistoryIcon />
        </IconButton>
        <IconButton
          label={saving ? '正在保存' : '保存'}
          disabled={saving || !dirty}
          onClick={onSave}
        >
          <SaveIcon />
        </IconButton>
        <IconButton
          label={previewOpen ? '收起预览' : '预览'}
          active={previewOpen}
          onClick={onTogglePreview}
        >
          <EyeIcon />
        </IconButton>
        <span className="admin-topbar-divider" aria-hidden="true" />
        <IconButton
          label={dark ? '切换到浅色主题' : '切换到深色主题'}
          onClick={onToggleTheme}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </IconButton>
        <a
          className={ICON_BUTTON_CLASS}
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="打开前台"
          title="打开前台"
        >
          <ArrowUpRightIcon />
        </a>
      </div>
    </header>
  )
}
