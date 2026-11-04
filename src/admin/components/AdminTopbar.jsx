import IconButton, { ICON_BUTTON_CLASS } from '../../components/ui/IconButton'
import ThemeLangControls from '../../components/layout/ThemeLangControls'
import { ArrowUpRightIcon, EyeIcon, HistoryIcon, SaveIcon } from '../../components/ui/icons'
import { useAdminT } from '../i18n'

export default function AdminTopbar({
  pageLabel,
  dirty,
  dirtyCount,
  saving,
  onDiscard,
  onSave,
  previewOpen,
  onTogglePreview,
}) {
  const t = useAdminT()

  return (
    <header className="admin-topbar">
      <nav className="admin-breadcrumb" aria-label={t('后台导航')}>
        <span>{t('内容后台')}</span>
        <span aria-hidden="true">/</span>
        <span className="admin-breadcrumb-current" aria-current="page">
          {pageLabel}
        </span>
      </nav>

      <div className="admin-topbar-actions">
        {/* 顶栏只负责配置草稿；Markdown / 文章保存状态由各自面板反馈 */}
        <span className="admin-topbar-status" role="status">
          {saving
            ? t('正在保存配置')
            : dirty
              ? `${t('配置未保存')}${dirtyCount > 0 ? ` · ${dirtyCount}` : ''}`
              : t('配置已同步')}
        </span>
        <IconButton
          label={t('撤销未保存修改')}
          disabled={!dirty || saving}
          onClick={onDiscard}
        >
          <HistoryIcon />
        </IconButton>
        <IconButton
          label={saving ? t('正在保存') : t('保存')}
          disabled={saving || !dirty}
          onClick={onSave}
        >
          <SaveIcon />
        </IconButton>
        <IconButton
          label={previewOpen ? t('收起预览') : t('预览')}
          active={previewOpen}
          onClick={onTogglePreview}
        >
          <EyeIcon />
        </IconButton>
        <span className="admin-topbar-divider" aria-hidden="true" />
        <ThemeLangControls variant="icon" />
        <a
          className={ICON_BUTTON_CLASS}
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('打开前台')}
          title={t('打开前台')}
        >
          <ArrowUpRightIcon />
        </a>
      </div>
    </header>
  )
}
