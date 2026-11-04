import { useEffect, useState } from 'react'
import Modal from '../../components/ui/dialogs/Modal'
import { CloseIcon } from '../../components/ui/icons'
import ConfigSection from '../sections/ConfigSection'
import ConflictDialog from './ConflictDialog'
import MarkdownPreview from './MarkdownPreview'
import { useHomeFiles } from '../hooks/contentFiles'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { getIn } from '../lib/objectPath.js'
import { getContentSection } from '../schema'
import { useAdminLang, useAdminT } from '../i18n'

const TABS = [
  { id: 'personal', section: 'personal', label: '个人资料' },
  { id: 'contact', section: 'contact', label: '联系方式' },
  { id: 'home', label: '首页文案' },
]

const HOME_PAGES = [
  { id: 'index', label: '首页' },
  { id: 'home', label: '子页首页' },
]

const HOME_LANGS = [
  { id: 'zh', label: '中文' },
  { id: 'en', label: 'English' },
]

function configDirtyFor(dirtyPaths, prefix) {
  for (const key of dirtyPaths) {
    if (key.startsWith(prefix)) return true
  }
  return false
}

function HomeCopyEditor({ files }) {
  const t = useAdminT()
  const [page, setPage] = useState('index')
  const [lang, setLang] = useState('zh')
  const [previewVisible, setPreviewVisible] = useState(true)
  const activeKey = `${page}.${lang}`
  const active = files.items.find((item) => item.key === activeKey) || null
  const activePath = `content/home/${activeKey}.md`
  const debounced = useDebouncedValue(active?.content || '', 350)

  const isDirty = files.dirtyKeys.has(activeKey)

  return (
    <div className="admin-profile-markdown">
      <div className="admin-profile-controls">
        <div className="admin-profile-control">
          <span className="admin-sub">{t('页面')}</span>
          <div className="admin-segment" role="group" aria-label={t('页面')}>
            {HOME_PAGES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={page === item.id}
                className={`admin-segment-btn ${page === item.id ? 'is-active' : ''}`}
                onClick={() => setPage(item.id)}
              >
                {t(item.label)}
                {files.dirtyKeys.has(`${item.id}.zh`) || files.dirtyKeys.has(`${item.id}.en`) ? (
                  <span className="admin-dirty-dot" aria-hidden="true" />
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-profile-control">
          <span className="admin-sub">{t('语言')}</span>
          <div className="admin-segment" role="group" aria-label={t('语言')}>
            {HOME_LANGS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={lang === item.id}
                className={`admin-segment-btn ${lang === item.id ? 'is-active' : ''}`}
                onClick={() => setLang(item.id)}
              >
                {item.label}
                {files.dirtyKeys.has(`index.${item.id}`) || files.dirtyKeys.has(`home.${item.id}`) ? (
                  <span className="admin-dirty-dot" aria-hidden="true" />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      {files.loading ? <p className="text-sm text-muted">{t('加载中')}</p> : null}

      {files.error ? (
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="admin-error">{files.error}</span>
          <button type="button" className="admin-btn" onClick={files.reload}>
            {t('重试')}
          </button>
        </div>
      ) : null}

      {files.notice ? <p className="mb-3 admin-ok">{t(files.notice)}</p> : null}

      {active ? (
        <>
          <div className="admin-md-head">
            <span className="admin-panel-note">
              {activePath}
              {isDirty ? <span className="admin-dirty-dot" aria-label={t('未保存')} /> : null}
            </span>
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
              onChange={(event) => files.update(activeKey, event.target.value)}
              aria-label={t('正文（Markdown）')}
            />
            {previewVisible ? (
              <div className="admin-md-preview prose-admin">
                <MarkdownPreview source={debounced} />
              </div>
            ) : null}
          </div>
          <div className="admin-md-actions">
            {isDirty ? (
              <span className="admin-panel-note">{t('改动需保存后生效')}</span>
            ) : (
              <span />
            )}
            <button
              type="button"
              className="admin-btn"
              disabled={!isDirty || files.savingKey === activeKey}
              onClick={() => files.discard(activeKey)}
            >
              {t('撤销未保存修改')}
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default function AdminProfileDialog({ open, onClose, draft, onDirtyChange, onSaved }) {
  const t = useAdminT()
  const uiLang = useAdminLang()
  const files = useHomeFiles()
  const [activeTab, setActiveTab] = useState('personal')
  const [saving, setSaving] = useState(false)
  const [report, setReport] = useState(null)
  const [narrow, setNarrow] = useState(false)

  const personalDirty = configDirtyFor(draft.dirtyPaths, 'site:personal')
  const contactDirty = configDirtyFor(draft.dirtyPaths, 'site:contact')
  const homeDirty = files.dirty
  const dirty = draft.dirty || homeDirty
  const dirtyByTab = { personal: personalDirty, contact: contactDirty, home: homeDirty }

  useEffect(() => {
    onDirtyChange?.(dirty)
  }, [dirty, onDirtyChange])

  // 窄屏时标签栏改为横向，同步 aria-orientation
  useEffect(() => {
    const query = window.matchMedia('(max-width: 719px)')
    const sync = () => setNarrow(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (open) return
    setReport(null)
  }, [open])

  function homeLabel(key) {
    return `content/home/${key}.md`
  }

  function handleClose() {
    if (saving) return
    if (dirty && !window.confirm(t('有未保存的修改，确定关闭？'))) return
    onClose()
  }

  function handleTabKeyDown(event, tabId) {
    const index = TABS.findIndex((tab) => tab.id === tabId)
    let next = index
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % TABS.length
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft')
      next = (index - 1 + TABS.length) % TABS.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = TABS.length - 1
    else return
    event.preventDefault()
    const nextId = TABS[next].id
    setActiveTab(nextId)
    requestAnimationFrame(() => document.getElementById(`profile-tab-${nextId}`)?.focus())
  }

  async function handleSaveAll() {
    if (saving || !dirty) return
    setSaving(true)
    setReport(null)
    const saved = []
    const failed = []

    if (draft.dirty) {
      const ok = await draft.save()
      if (ok) saved.push(t('个人信息配置'))
      else failed.push({ label: t('个人信息配置'), error: t('配置保存失败，请查看错误或冲突提示') })
    }

    if (files.dirty) {
      const result = await files.saveMany([...files.dirtyKeys])
      saved.push(...result.saved.map(homeLabel))
      failed.push(
        ...result.failed.map((item) => ({
          label: homeLabel(item.key),
          error: item.error,
        }))
      )
    }

    setSaving(false)
    setReport({ saved, failed })
    if (saved.length) onSaved?.()
  }

  const title = t('个人信息')
  // 成功后再次编辑时优先显示未保存状态；有失败项则保留失败报告直到下次保存
  const showReport = report && (!dirty || report.failed.length > 0)
  const status = showReport ? (
    <div className="admin-profile-status">
      {report.failed.length ? (
        <span className="admin-error">
          {report.saved.length} {t('项已保存')}
          {uiLang === 'en' ? ', ' : '，'}
          {report.failed.length} {t('项失败')}
          {uiLang === 'en' ? '. ' : '；'}
          {t('失败项保留未保存状态')}
        </span>
      ) : (
        <span className="admin-ok">{t('已保存')}</span>
      )}
      {report.failed.length ? (
        <ul className="admin-profile-failures">
          {report.failed.map((item) => (
            <li key={`${item.label}:${item.error}`}>
              <strong>{item.label}</strong>：{item.error}
            </li>
          ))}
        </ul>
      ) : null}
      {draft.error ? <span className="admin-error">{draft.error}</span> : null}
    </div>
  ) : (
    <span className="admin-panel-note">
      {saving
        ? t('保存中…')
        : draft.error ||
          files.error ||
          (dirty ? `${t('有未保存的修改')}` : t('已同步'))}
    </span>
  )

  return (
    <Modal
      open={open}
      onClose={handleClose}
      label={title}
      maxWidth="max-w-[min(94vw,56rem)]"
      panelClassName="admin-profile-modal"
      draggable
      flush
    >
      <div className="admin-profile-shell">
        <header className="admin-profile-head" data-modal-drag-handle>
          <div className="min-w-0">
            <h2 className="admin-profile-title">{title}</h2>
            <p className="admin-profile-sub">
              {t('维护头像、名字、角色与联系方式，并编辑首页文案。')}
            </p>
          </div>
          <button
            type="button"
            className="admin-profile-close"
            onClick={handleClose}
            aria-label={t('关闭')}
          >
            <CloseIcon size={16} />
          </button>
        </header>

        <div className="admin-profile-body">
          <div
            className="admin-profile-rail"
            role="tablist"
            aria-orientation={narrow ? 'horizontal' : 'vertical'}
            aria-label={title}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`profile-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`profile-panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                className={`admin-profile-tab ${activeTab === tab.id ? 'is-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, tab.id)}
              >
                <span>{t(tab.label)}</span>
                {dirtyByTab[tab.id] ? (
                  <span className="admin-dirty-dot" aria-label={t('未保存')} />
                ) : null}
              </button>
            ))}
          </div>

          <div className="admin-profile-content">
            {draft.dirty && !personalDirty && !contactDirty ? (
              <p className="admin-help admin-profile-hint">
                {t('保存会一并提交其他页面的未保存配置修改。')}
              </p>
            ) : null}

            {TABS.filter((tab) => tab.section).map((tab) => {
              const section = getContentSection(tab.section)
              if (!section) return null
              const value = getIn(draft.documents[section.doc], section.path)
              return (
                <div
                  key={tab.id}
                  id={`profile-panel-${tab.id}`}
                  hidden={activeTab !== tab.id}
                  role="tabpanel"
                  aria-labelledby={`profile-tab-${tab.id}`}
                  className="admin-profile-section"
                >
                  <ConfigSection
                    section={section}
                    value={value}
                    onFieldChange={(key, next) =>
                      draft.update(section.doc, [...section.path, key], next)
                    }
                    onListChange={(next) => draft.update(section.doc, section.path, next)}
                  />
                </div>
              )
            })}

            <div
              id="profile-panel-home"
              hidden={activeTab !== 'home'}
              role="tabpanel"
              aria-labelledby="profile-tab-home"
              className="admin-profile-section"
            >
              <HomeCopyEditor files={files} />
            </div>
          </div>
        </div>

        <footer className="admin-profile-footer">
          <div className="admin-profile-status-slot">{status}</div>
          <div className="admin-profile-actions">
            <button type="button" className="admin-btn" disabled={saving} onClick={handleClose}>
              {t('关闭')}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={saving || !dirty}
              onClick={handleSaveAll}
            >
              {saving ? t('保存中…') : t('保存')}
            </button>
          </div>
        </footer>
      </div>

      <ConflictDialog
        open={Boolean(draft.conflict)}
        title={t('配置已被外部修改')}
        message={draft.conflict?.message}
        primaryLabel={t('用我的版本覆盖')}
        onPrimary={() => draft.resolveConflict('local')}
        secondaryLabel={t('加载磁盘版本')}
        onSecondary={() => draft.resolveConflict('server')}
        onCancel={() => draft.resolveConflict('cancel')}
      />
    </Modal>
  )
}
