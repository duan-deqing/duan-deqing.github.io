import { useEffect, useState } from 'react'
import AdminPanel from '../components/AdminPanel'
import MarkdownFilePanel from '../components/MarkdownFilePanel'
import { useProjectDetailFiles } from '../hooks/contentFiles'
import { pickContent, useAdminLang, useAdminT } from '../i18n'

export default function ProjectDetailsPanel({ projects = [], selected = '', onDirtyChange }) {
  const t = useAdminT()
  const lang = useAdminLang()
  const files = useProjectDetailFiles()
  const [activeSlug, setActiveSlug] = useState(selected)
  const [activeLang, setActiveLang] = useState('zh')

  useEffect(() => {
    if (!selected) return
    setActiveSlug(selected)
    // 从项目列表点击“详情正文”后把编辑区带回视野
    document
      .getElementById('panel-project-details')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [selected])

  useEffect(() => {
    if (!activeSlug) return
    const available = files.items.filter((file) => file.slug === activeSlug)
    if (!available.some((file) => file.lang === activeLang)) {
      setActiveLang(available[0]?.lang || 'zh')
    }
  }, [activeLang, activeSlug, files.items])

  useEffect(() => {
    onDirtyChange?.(files.dirty)
  }, [files.dirty, onDirtyChange])

  const rows = projects.map((project) => ({
    slug: typeof project.slug === 'string' ? project.slug : '',
    title: pickContent(project.title, lang, project.slug || ''),
  }))

  const currentFiles = files.items
    .filter((file) => file.slug === activeSlug)
    .sort((a, b) => (a.lang === 'zh' ? -1 : 1) - (b.lang === 'zh' ? -1 : 1))

  const items = currentFiles.map((file) => ({
    ...file,
    key: `${file.lang}:${file.slug}`,
    label: file.lang === 'zh' ? t('中文') : 'English',
    hint: `content/projects/${file.lang}/${file.slug}.md`,
  }))

  function choose(slug, nextLang) {
    if (files.dirty && !window.confirm(t('当前项目正文有未保存的修改，确定切换？'))) return
    setActiveSlug(slug)
    setActiveLang(nextLang)
  }

  return (
    <AdminPanel
      id="panel-project-details"
      title={t('项目详情正文')}
      note={t('项目详情按项目维护')}
      collapsible
    >
      {activeSlug && items.length > 0 ? null : errorHint(files.error, t)}
      <div className="admin-project-detail-list">
        {rows.map((row) => {
          const hasZh = files.items.some((file) => file.slug === row.slug && file.lang === 'zh')
          const hasEn = files.items.some((file) => file.slug === row.slug && file.lang === 'en')
          return (
            <div
              key={row.slug || row.title}
              className={`admin-project-detail-row ${activeSlug === row.slug ? 'is-active' : ''}`}
            >
              <span className="min-w-0">
                <span className="admin-project-detail-title">{row.title || t('未命名')}</span>
                <span className="admin-project-detail-slug">{row.slug || t('没有 slug，无法关联详情页')}</span>
              </span>
              <span className="flex gap-1">
                {hasZh ? (
                  <button type="button" className="admin-text-btn" onClick={() => choose(row.slug, 'zh')}>
                    {t('编辑')} {t('中文')}
                  </button>
                ) : null}
                {hasEn ? (
                  <button type="button" className="admin-text-btn" onClick={() => choose(row.slug, 'en')}>
                    {t('编辑')} English
                  </button>
                ) : null}
                {!hasZh && !hasEn && row.slug ? (
                  <span className="admin-panel-note">{t('无详情文件')}</span>
                ) : null}
              </span>
            </div>
          )
        })}
      </div>

      {activeSlug && items.length > 0 ? (
        <div className="mt-4">
          <MarkdownFilePanel
            embedded
            items={items}
            activeKey={`${activeLang}:${activeSlug}`}
            onSelect={(key) => {
              const [nextLang] = key.split(':')
              setActiveLang(nextLang)
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
        </div>
      ) : null}
    </AdminPanel>
  )
}

function errorHint(error, t) {
  if (!error) return null
  return <p className="mb-3 admin-error">{error}</p>
}
