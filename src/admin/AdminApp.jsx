import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { adminApi } from './api'
import { contentSchema } from './schema'
import ConfigSection from './sections/ConfigSection'
import PostsSection from './sections/PostsSection'
import PreviewDrawer from './components/PreviewDrawer'
import { getIn, setIn } from './lib/objectPath'
import { validateDoc } from './lib/validate'
import { animateThemeChange } from '../utils/themeTransition'

const NAV = [...contentSchema.map(({ id, label }) => ({ id, label })), { id: 'posts', label: '文章管理' }]

export default function AdminApp() {
  const [docs, setDocs] = useState(null)
  const [revision, setRevision] = useState(null)
  const [baseline, setBaseline] = useState(null)
  const [activeId, setActiveId] = useState(
    () => sessionStorage.getItem('stylan-admin-section') || 'site'
  )
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewPath, setPreviewPath] = useState('/')
  const [previewDevice, setPreviewDevice] = useState('desktop')
  const [status, setStatus] = useState({ kind: '', text: '' })
  const [saving, setSaving] = useState(false)
  const [postDirty, setPostDirty] = useState(false)
  const [dark, setDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  )
  const iframeRef = useRef(null)
  const activeNavRef = useRef(null)

  const toggleAdminTheme = useCallback((event) => {
    animateThemeChange(event, (nextDark) => {
      setDark(nextDark)
      localStorage.setItem('theme', nextDark ? 'dark' : 'light')
    })
  }, [])

  const dirty = useMemo(
    () => Boolean(docs && baseline && JSON.stringify(docs) !== JSON.stringify(baseline)),
    [docs, baseline]
  )

  const activeItem = NAV.find((item) => item.id === activeId) || NAV[0]
  const activeSection = contentSchema.find((item) => item.id === activeId)

  const load = useCallback(async () => {
    setStatus({ kind: '', text: '' })
    try {
      const data = await adminApi.getConfig()
      setDocs({ site: data.site, blog: data.blog })
      setBaseline({ site: data.site, blog: data.blog })
      setRevision(data.revision)
    } catch (err) {
      setStatus({ kind: 'error', text: err.message })
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    sessionStorage.setItem('stylan-admin-section', activeId)
  }, [activeId])

  // 窄屏分区条横向滚动时，把当前分区带回可视区域
  useEffect(() => {
    if (!window.matchMedia('(max-width: 1023px)').matches) return
    activeNavRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [activeId])

  useEffect(() => {
    if (!dirty) return undefined
    const handler = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const save = useCallback(async () => {
    if (!docs || saving || !dirty) return
    const errors = validateDoc(contentSchema, docs)
    if (errors.length) {
      setStatus({ kind: 'error', text: errors[0] })
      return
    }
    setSaving(true)
    setStatus({ kind: '', text: '' })
    try {
      const result = await adminApi.saveConfig({ ...docs, revision })
      setRevision(result.revision)
      setBaseline(JSON.parse(JSON.stringify(docs)))
      setStatus({ kind: 'ok', text: '已保存' })
      iframeRef.current?.contentWindow?.location.reload()
    } catch (err) {
      setStatus({ kind: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }, [docs, revision, saving, dirty])

  const discardChanges = useCallback(() => {
    if (!dirty || !baseline) return
    if (!window.confirm('撤销所有未保存的更改？')) return
    setDocs(JSON.parse(JSON.stringify(baseline)))
    setStatus({ kind: '', text: '' })
    iframeRef.current?.contentWindow?.location.reload()
  }, [dirty, baseline])

  const closePreview = useCallback(() => setPreviewOpen(false), [])

  useEffect(() => {
    const handler = (event) => {
      if (activeId === 'posts') return
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        save()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [save, activeId])

  function goTo(id) {
    if (activeId === 'posts' && postDirty && !window.confirm('文章有未保存的更改，确定离开？')) return
    setPostDirty(false)
    setActiveId(id)
  }

  if (!docs) {
    return (
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand-block">
            <span className="admin-brand">STYLAN</span>
            <span className="admin-brand-sub">内容后台</span>
          </div>
        </aside>
        <div className="admin-workspace">
          <header className="admin-topbar">
            <div className="admin-topbar-left">
              <span className="admin-breadcrumb">内容管理 / {activeItem.label}</span>
            </div>
            <div className="admin-topbar-actions">
              <button className="admin-btn" onClick={load}>重试</button>
            </div>
          </header>
          <main className="admin-main">
            <div className="admin-page">
              <p className="text-sm text-muted">{status.text || '正在加载配置…'}</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand-block">
          <span className="admin-brand">STYLAN</span>
          <span className="admin-brand-sub">内容后台</span>
        </div>

        <nav className="admin-nav" aria-label="后台导航">
          {NAV.map(({ id, label }, index) => (
            <Fragment key={id}>
              {id === 'posts' && <div className="admin-nav-divider" />}
              <button
                className={`admin-nav-btn ${activeId === id ? 'is-active' : ''}`}
                ref={activeId === id ? activeNavRef : null}
                onClick={() => goTo(id)}
                aria-current={activeId === id ? 'page' : undefined}
              >
                <span>{label}</span>
                <span className="admin-nav-index" aria-hidden="true">{index + 1}</span>
              </button>
            </Fragment>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button type="button" className="admin-text-btn" onClick={toggleAdminTheme}>
            {dark ? '浅色主题' : '深色主题'}
          </button>
          <a className="admin-text-btn" href="/" target="_blank" rel="noopener noreferrer">
            打开前台 ↗
          </a>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <span className="admin-breadcrumb">内容管理 / {activeItem.label}</span>
          </div>
          <div className="admin-topbar-actions">
            <button
              type="button"
              className="admin-btn admin-theme-toggle"
              onClick={toggleAdminTheme}
              aria-label={dark ? '切换到浅色主题' : '切换到深色主题'}
              title={dark ? '切换到浅色主题' : '切换到深色主题'}
            >
              {dark ? '浅色' : '深色'}
            </button>
            {dirty ? <span className="admin-badge">未保存</span> : null}
            <button className="admin-btn" onClick={discardChanges} disabled={!dirty}>
              撤销
            </button>
            <button
              className="admin-btn admin-btn-primary"
              onClick={save}
              disabled={saving || !dirty}
            >
              {saving ? '保存中…' : '保存'}
            </button>
            <button className="admin-btn" onClick={() => setPreviewOpen((value) => !value)}>
              预览
            </button>
          </div>
        </header>

        <main className="admin-main">
          <div className="admin-page">
            <div className="admin-page-head">
              <h1 className="admin-page-title">{activeItem.label}</h1>
              <p className="admin-page-desc">
                {activeId === 'posts'
                  ? '按语言筛选文章，编辑与新建均写入本地 Markdown 文件。'
                  : '修改后点击右上角「保存」写入本地 YAML 配置。'}
              </p>
            </div>

            <section className="admin-panel">
              <header className="admin-panel-head">
                <span className="admin-panel-title">
                  {activeId === 'posts' ? '文章列表' : '字段设置'}
                </span>
                {status.text ? (
                  <span className={status.kind === 'error' ? 'admin-error' : 'admin-ok'}>
                    {status.text}
                  </span>
                ) : (
                  <span className="admin-panel-note">
                    {activeId === 'posts' ? '本地 Markdown 文件' : '改动需保存后生效'}
                  </span>
                )}
              </header>
              <div className="admin-panel-body">
                {activeId === 'posts' ? (
                  <PostsSection onDirtyChange={setPostDirty} />
                ) : activeSection ? (
                  <ConfigSection
                    section={activeSection}
                    value={getIn(docs[activeSection.doc], activeSection.path)}
                    onChange={(next) =>
                      setDocs((prev) => ({
                        ...prev,
                        [activeSection.doc]: setIn(prev[activeSection.doc], activeSection.path, next),
                      }))
                    }
                  />
                ) : null}
              </div>
            </section>
          </div>
        </main>
      </div>

      <PreviewDrawer
        open={previewOpen}
        onClose={closePreview}
        page={previewPath}
        onPageChange={setPreviewPath}
        device={previewDevice}
        onDeviceChange={setPreviewDevice}
        iframeRef={iframeRef}
      />
    </div>
  )
}
