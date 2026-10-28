import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { adminApi } from './api'
import { contentSchema } from './schema'
import ConfigSection from './sections/ConfigSection'
import { getIn, setIn } from './lib/objectPath'
import { validateDoc } from './lib/validate'

const PREVIEW_PAGES = [
  ['/', '首页'],
  ['/skills', '技能'],
  ['/projects', '项目'],
  ['/blog', '博客'],
  ['/contact', '联系'],
]

const NAV = [...contentSchema.map(({ id, label }) => ({ id, label })), { id: 'posts', label: '文章管理' }]

export default function AdminApp() {
  const [docs, setDocs] = useState(null)
  const [revision, setRevision] = useState(null)
  const [baseline, setBaseline] = useState(null)
  const [activeId, setActiveId] = useState(
    () => sessionStorage.getItem('stylan-admin-section') || 'site'
  )
  const [previewPath, setPreviewPath] = useState('/')
  const [status, setStatus] = useState({ kind: '', text: '' })
  const [saving, setSaving] = useState(false)
  const iframeRef = useRef(null)

  const dirty = useMemo(
    () => Boolean(docs && baseline && JSON.stringify(docs) !== JSON.stringify(baseline)),
    [docs, baseline]
  )

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
    if (!docs) return
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
  }, [docs, revision])

  useEffect(() => {
    const handler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        save()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [save])

  if (!docs) {
    return (
      <div className="admin-shell">
        <div className="admin-topbar">
          <strong>STYLAN · 内容后台</strong>
          <button className="admin-btn" onClick={load}>重试</button>
        </div>
        <div className="admin-main">
          <p className="text-sm text-muted">
            {status.text || '正在加载配置…'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="flex items-center gap-3">
          <strong className="font-display">STYLAN · 内容后台</strong>
          {dirty && <span className="admin-badge">未保存</span>}
        </div>
        <div className="flex items-center gap-3">
          {status.text && (
            <span className={status.kind === 'error' ? 'admin-error' : 'text-[12px] text-muted'}>
              {status.text}
            </span>
          )}
          <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving || !dirty}>
            {saving ? '保存中…' : '保存更改'}
          </button>
        </div>
      </header>

      <div className="admin-body">
        <nav className="admin-nav">
          {NAV.map(({ id, label }) => (
            <button
              key={id}
              className={`admin-nav-btn ${activeId === id ? 'is-active' : ''}`}
              onClick={() => setActiveId(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <main className="admin-main">
          <h2 className="font-display text-xl mb-4">
            {NAV.find((item) => item.id === activeId)?.label}
          </h2>
          {activeId === 'posts' ? (
            <p className="text-sm text-muted">文章管理将在后续任务接入。</p>
          ) : (
            (() => {
              const section = contentSchema.find((item) => item.id === activeId)
              if (!section) return null
              return (
                <ConfigSection
                  section={section}
                  value={getIn(docs[section.doc], section.path)}
                  onChange={(next) =>
                    setDocs((prev) => ({
                      ...prev,
                      [section.doc]: setIn(prev[section.doc], section.path, next),
                    }))
                  }
                />
              )
            })()
          )}
        </main>

        <aside className="admin-preview">
          <div className="flex items-center gap-2 p-2 border-b" style={{ borderColor: 'var(--line)' }}>
            <select
              className="admin-input"
              value={previewPath}
              onChange={(event) => setPreviewPath(event.target.value)}
            >
              {PREVIEW_PAGES.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <button
              className="admin-btn"
              onClick={() => iframeRef.current?.contentWindow?.location.reload()}
            >
              刷新
            </button>
          </div>
          <iframe ref={iframeRef} src={previewPath} title="站点预览" />
        </aside>
      </div>
    </div>
  )
}
