import { useEffect, useMemo, useState } from 'react'
import AdminPanel from '../components/AdminPanel'
import MarkdownFilePanel from '../components/MarkdownFilePanel'
import { useChangelogFiles } from '../hooks/contentFiles'
import { useAdminT } from '../i18n'

export default function ChangelogView({ onDirtyChange }) {
  const t = useAdminT()
  const files = useChangelogFiles()
  const [activeVersion, setActiveVersion] = useState('')
  const [activeLang, setActiveLang] = useState('zh')

  useEffect(() => {
    onDirtyChange?.(files.dirty)
  }, [files.dirty, onDirtyChange])

  const versions = useMemo(() => {
    const map = new Map()
    for (const entry of files.items) {
      if (!map.has(entry.version)) map.set(entry.version, [])
      map.get(entry.version).push(entry)
    }
    return [...map.entries()].map(([version, entries]) => ({
      version,
      date: entries[0]?.date || '',
      latest: entries.some((entry) => entry.latest),
      entries,
    }))
  }, [files.items])

  const current = versions.find((item) => item.version === activeVersion) || versions[0] || null
  const activeEntry =
    current?.entries.find((entry) => entry.lang === activeLang) || current?.entries[0] || null
  const entryKey = activeEntry?.filename || ''
  const items = current
    ? current.entries.map((entry) => ({
        ...entry,
        key: entry.filename,
        label: entry.lang === 'zh' ? t('中文') : 'English',
        hint: entry.filename,
      }))
    : []

  useEffect(() => {
    if (!current) return
    if (!current.entries.some((entry) => entry.lang === activeLang)) {
      setActiveLang(current.entries[0]?.lang || 'zh')
    }
  }, [activeLang, current])

  function switchVersion(version) {
    if (files.dirty && !window.confirm(t('当前版本有未保存的修改，确定切换？'))) return
    setActiveVersion(version)
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1 className="admin-page-title">{t('更新日志')}</h1>
        <p className="admin-page-desc">{t(files.loading ? '正在读取' : '浏览版本记录并编辑对应语言的中英文 Markdown。')}</p>
      </div>

      <AdminPanel
        id="panel-changelog"
        title={t('版本记录')}
        note={current ? current.date : ''}
      >
        {versions.length === 0 && !files.loading ? (
          <p className="text-sm text-muted">{t('暂无内容')}</p>
        ) : (
          <div className="admin-changelog-grid">
            <aside className="admin-version-list" aria-label={t('版本列表')}>
              {versions.map((item) => (
                <button
                  key={item.version}
                  type="button"
                  className={`admin-version-btn ${item.version === current?.version ? 'is-active' : ''}`}
                  onClick={() => switchVersion(item.version)}
                >
                  <span className="admin-version-name">
                    v{item.version}
                    {item.latest ? <span className="admin-badge">{t('最新')}</span> : null}
                  </span>
                  <span className="admin-version-meta">{item.date}</span>
                  {item.entries.some((entry) => files.dirtyKeys.has(entry.filename)) ? (
                    <span className="admin-version-dot" aria-hidden="true" />
                  ) : null}
                </button>
              ))}
            </aside>

            <div className="admin-version-editor">
              {current ? (
                <MarkdownFilePanel
                  embedded
                  items={items}
                  activeKey={entryKey}
                  onSelect={(key) => {
                    const entry = current.entries.find((item) => item.filename === key)
                    if (entry) setActiveLang(entry.lang)
                  }}
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
              ) : null}
            </div>
          </div>
        )}
      </AdminPanel>
    </div>
  )
}
