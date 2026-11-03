import { useEffect, useState } from 'react'
import AdminPanel from './AdminPanel'
import MarkdownPreview from './MarkdownPreview'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useAdminT } from '../i18n'

/**
 * 通用 Markdown 文件编辑面板：标签切换、编辑 + 实时预览、按文件保存。
 */
export default function MarkdownFilePanel({
  id,
  title,
  description,
  items,
  activeKey,
  onSelect,
  dirtyKeys,
  savingKey,
  loading,
  error,
  notice,
  onUpdate,
  onSave,
  onDiscard,
  onReload,
  embedded = false,
}) {
  const t = useAdminT()
  const active = items.find((item) => item.key === activeKey) || items[0] || null
  const [previewVisible, setPreviewVisible] = useState(true)
  const debounced = useDebouncedValue(active?.content || '', 350)

  useEffect(() => {
    if (!active && items.length > 0 && onSelect) onSelect(items[0].key)
  }, [active, items, onSelect])

  const isDirty = active ? dirtyKeys.has(active.key) : false
  const body = (
    <>
      {description ? <p className="mb-3 text-sm text-muted">{description}</p> : null}

      {error ? (
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="admin-error">{error}</span>
          <button type="button" className="admin-btn" onClick={onReload}>
            {t('重试')}
          </button>
        </div>
      ) : null}
      {notice ? <p className="mb-3 admin-ok">{t(notice)}</p> : null}

      {items.length === 0 && !loading ? (
        <p className="text-sm text-muted">{t('暂无内容')}</p>
      ) : null}

      {items.length > 0 ? (
        <>
          <div className="admin-tabs mb-3">
            {items.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`admin-tab ${item.key === active?.key ? 'is-active' : ''}`}
                onClick={() => onSelect(item.key)}
              >
                {item.label}
                {dirtyKeys.has(item.key) ? ' •' : ''}
              </button>
            ))}
          </div>

          {active ? (
            <>
              <div className="admin-md-head">
                <span className="admin-panel-note">{active.hint || active.key}</span>
                <button
                  type="button"
                  className="admin-btn"
                  onClick={() => setPreviewVisible((value) => !value)}
                >
                  {previewVisible ? t('收起预览') : t('预览')}
                </button>
              </div>
              <div className={`admin-md-grid ${previewVisible ? '' : 'is-single'}`}>
                <textarea
                  className="admin-input font-mono"
                  rows={18}
                  value={active.content}
                  onChange={(event) => onUpdate(active.key, event.target.value)}
                  aria-label={t('正文（Markdown）')}
                />
                {previewVisible ? (
                  <div className="admin-md-preview prose-admin">
                    <MarkdownPreview source={debounced} />
                  </div>
                ) : null}
              </div>
              <div className="admin-md-actions">
                <span className="admin-panel-note">
                  {isDirty ? t('改动需保存后生效') : t('已同步')}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="admin-btn"
                    disabled={!isDirty || savingKey === active.key}
                    onClick={() => onDiscard(active.key)}
                  >
                    {t('撤销未保存修改')}
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary"
                    disabled={!isDirty || savingKey === active.key}
                    onClick={() => onSave(active.key)}
                  >
                    {savingKey === active.key ? t('保存中…') : t('保存')}
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </>
      ) : null}
    </>
  )

  if (embedded) return body

  return (
    <AdminPanel
      id={id}
      title={title}
      note={
        loading
          ? t('加载中')
          : error
            ? t('读取失败')
            : dirtyKeys.size > 0
              ? `${dirtyKeys.size} ${t('处未保存修改')}`
              : t('已同步')
      }
      collapsible
      defaultOpen
    >
      {body}
    </AdminPanel>
  )
}
