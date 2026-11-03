import { useCallback, useEffect, useRef, useState } from 'react'
import { adminPages, adminPageIds } from './schema'
import { displayText } from './lib/display'
import { useAdminTheme } from './hooks/useAdminTheme'
import { useConfigDraft } from './hooks/useConfigDraft'
import { useHashRoute } from './hooks/useHashRoute'
import AdminSidebar from './components/AdminSidebar'
import AdminTopbar from './components/AdminTopbar'
import PreviewDrawer from './components/PreviewDrawer'
import PostsPanel from './components/PostsPanel'
import ConfigView from './views/ConfigView'
import DashboardView from './views/DashboardView'

const FALLBACK_ID = 'dashboard'
const SIDE_ITEMS = adminPages.filter(({ id }) => id !== 'profile')

function profileFrom(documents) {
  const personal = documents?.site?.personal || {}
  return {
    avatar: typeof personal.avatar === 'string' ? personal.avatar : '',
    name: displayText(personal.name, 'STYLAN'),
    role: displayText(personal.role, '内容后台'),
  }
}

export default function AdminApp() {
  const { activeId, navigate } = useHashRoute(adminPageIds, FALLBACK_ID)
  const draft = useConfigDraft()
  const { dark, toggleTheme } = useAdminTheme()
  const [postDirty, setPostDirty] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewPath, setPreviewPath] = useState('/')
  const [previewDevice, setPreviewDevice] = useState('desktop')
  const iframeRef = useRef(null)

  const activePage = adminPages.find((page) => page.id === activeId) || adminPages[0]
  const profile = profileFrom(draft.documents)

  const reloadPreview = useCallback(() => {
    iframeRef.current?.contentWindow?.location.reload()
  }, [])

  useEffect(() => {
    if (!draft.dirty) return undefined
    const handler = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [draft.dirty])

  const handleSave = useCallback(async () => {
    if (!draft.dirty || draft.saving) return
    const ok = await draft.save()
    if (ok) reloadPreview()
  }, [draft, reloadPreview])

  const handleDiscard = useCallback(() => {
    if (!draft.dirty) return
    if (!window.confirm('撤销所有未保存的更改？')) return
    draft.discard()
    reloadPreview()
  }, [draft, reloadPreview])

  useEffect(() => {
    const handler = (event) => {
      if (postDirty) return
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSave, postDirty])

  const goTo = useCallback(
    (id) => {
      if (id === activeId) return
      if (postDirty && !window.confirm('文章有未保存的更改，确定离开？')) return
      setPostDirty(false)
      navigate(id)
    },
    [activeId, navigate, postDirty]
  )

  const closePreview = useCallback(() => setPreviewOpen(false), [])

  if (!draft.documents) {
    const loading = draft.status === 'loading'
    return (
      <div className="admin-shell">
        <AdminSidebar
          items={SIDE_ITEMS}
          activeId={activeId}
          onSelect={goTo}
          profile={{ avatar: '', name: 'STYLAN', role: '内容后台' }}
        />
        <div className="admin-workspace">
          <header className="admin-topbar">
            <div className="admin-topbar-left">
              <span className="admin-breadcrumb">内容管理 / {activePage.label}</span>
            </div>
            <div className="admin-topbar-actions">
              {!loading && (
                <button className="admin-btn" onClick={draft.load}>
                  重试
                </button>
              )}
            </div>
          </header>
          <main className="admin-main">
            <div className="admin-page">
              <p className="text-sm text-muted">
                {loading ? '正在加载配置…' : draft.error}
              </p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <AdminSidebar
        items={SIDE_ITEMS}
        activeId={activeId}
        onSelect={goTo}
        profile={profile}
      />

      <div className="admin-workspace">
        <AdminTopbar
          label={activePage.label}
          dark={dark}
          onToggleTheme={toggleTheme}
          dirty={draft.dirty}
          saving={draft.saving}
          onDiscard={handleDiscard}
          onSave={handleSave}
          previewOpen={previewOpen}
          onTogglePreview={() => setPreviewOpen((value) => !value)}
        />

        <main className="admin-main">
          {activeId === 'dashboard' ? (
            <DashboardView draft={draft} onNavigate={goTo} />
          ) : (
            <ConfigView
              page={activePage}
              draft={draft}
              extra={
                activePage.posts ? <PostsPanel onDirtyChange={setPostDirty} /> : null
              }
            />
          )}
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
