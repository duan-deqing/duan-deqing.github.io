import { useEffect, useState } from 'react'
import GlassDialog from '../../components/ui/dialogs/GlassDialog'
import ConfigSection from '../sections/ConfigSection'
import ConflictDialog from './ConflictDialog'
import MarkdownFilePanel from './MarkdownFilePanel'
import { useHomeFiles } from '../hooks/contentFiles'
import { getIn } from '../lib/objectPath.js'
import { getContentSection } from '../schema'
import { pickContent, useAdminLang, useAdminT } from '../i18n'

const TABS = [
  { id: 'personal', section: 'personal', label: '个人资料' },
  { id: 'contact', section: 'contact', label: '联系方式' },
  { id: 'home', label: '首页文案' },
]

function configDirtyFor(dirtyPaths, prefix) {
  for (const key of dirtyPaths) {
    if (key.startsWith(prefix)) return true
  }
  return false
}

export default function AdminProfileDialog({ open, onClose, draft, onDirtyChange, onSaved }) {
  const t = useAdminT()
  const uiLang = useAdminLang()
  const files = useHomeFiles()
  const [activeTab, setActiveTab] = useState('personal')
  const [activeKey, setActiveKey] = useState('index.zh')
  const [saving, setSaving] = useState(false)
  const [report, setReport] = useState(null)

  const personalDirty = configDirtyFor(draft.dirtyPaths, 'site:personal')
  const contactDirty = configDirtyFor(draft.dirtyPaths, 'site:contact')
  const homeDirty = files.dirty
  const dirty = draft.dirty || homeDirty
  const dirtyByTab = { personal: personalDirty, contact: contactDirty, home: homeDirty }

  useEffect(() => {
    onDirtyChange?.(dirty)
  }, [dirty, onDirtyChange])

  useEffect(() => {
    if (open) return
    setReport(null)
  }, [open])

  const homeItems = files.items.map((file) => ({
    ...file,
    label: pickContent(file.label, uiLang, file.id),
    hint: file.path,
  }))

  function homeLabel(key) {
    const file = files.items.find((item) => item.key === key)
    return pickContent(file?.label, uiLang, key)
  }

  function handleClose() {
    if (saving) return
    if (dirty && !window.confirm(t('有未保存的修改，确定关闭？'))) return
    onClose()
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
    <GlassDialog
      open={open}
      onClose={handleClose}
      label={title}
      kicker={title}
      maxWidth="max-w-[min(94vw,54rem)]"
      footer={
        <div className="admin-profile-actions">
          <div className="admin-profile-status-slot">{status}</div>
          <div className="flex shrink-0 gap-2">
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
        </div>
      }
    >
      <div className="admin-profile-dialog">
        <p className="admin-page-desc">{t('维护头像、名字、角色与联系方式，并编辑首页文案。')}</p>

        <div className="admin-tabs admin-profile-tabs" role="tablist" aria-label={title}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`admin-tab ${activeTab === tab.id ? 'is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {t(tab.label)}
              {dirtyByTab[tab.id] ? (
                <span className="admin-dirty-dot" aria-label={t('未保存')} />
              ) : null}
            </button>
          ))}
        </div>

        {draft.dirty &&
        !personalDirty &&
        !contactDirty ? (
          <p className="admin-help">{t('保存会一并提交其他页面的未保存配置修改。')}</p>
        ) : null}

        {TABS.filter((tab) => tab.section).map((tab) => {
          const section = getContentSection(tab.section)
          if (!section) return null
          const value = getIn(draft.documents[section.doc], section.path)
          return (
            <div key={tab.id} hidden={activeTab !== tab.id} role="tabpanel">
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

        <div hidden={activeTab !== 'home'} role="tabpanel" className="admin-profile-markdown">
          <MarkdownFilePanel
            embedded
            items={homeItems}
            activeKey={activeKey}
            onSelect={setActiveKey}
            dirtyKeys={files.dirtyKeys}
            savingKey={files.savingKey}
            loading={files.loading}
            error={files.error}
            notice={files.notice}
            onUpdate={files.update}
            onSave={files.saveOne}
            onDiscard={files.discard}
            onReload={files.reload}
          />
        </div>
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
    </GlassDialog>
  )
}
