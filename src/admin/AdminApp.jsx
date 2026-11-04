import { useCallback, useEffect, useRef, useState } from 'react'
import { adminPages, adminPageIds } from './schema'
import { displayText } from './lib/display'
import { useConfigDraft } from './hooks/useConfigDraft'
import { useHashRoute } from './hooks/useHashRoute'
import AdminSidebar from './components/AdminSidebar'
import AdminTopbar from './components/AdminTopbar'
import PreviewDrawer from './components/PreviewDrawer'
import PostsPanel from './components/PostsPanel'
import AdminProfileDialog from './components/AdminProfileDialog'
import ConfigView from './views/ConfigView'
import DashboardView from './views/DashboardView'
import ChangelogView from './views/ChangelogView'
import ProjectDetailsPanel from './views/ProjectDetailsPanel'
import { useAdminT } from './i18n'

const FALLBACK_ID = 'dashboard'
const SIDE_ITEMS = adminPages

function profileFrom(documents, fallbackRole) {
  const personal = documents?.site?.personal || {}
  return {
    avatar: typeof personal.avatar === 'string' ? personal.avatar : '',
    name: displayText(personal.name, 'STYLAN'),
    role: displayText(personal.role, fallbackRole),
  }
}

export default function AdminApp() {
  const t = useAdminT()
  const { activeId, navigate } = useHashRoute(adminPageIds, FALLBACK_ID)
  const draft = useConfigDraft()
  const [postDirty, setPostDirty] = useState(false)
  const [markdownDirty, setMarkdownDirty] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileDirty, setProfileDirty] = useState(false)
  const [projectDetail, setProjectDetail] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewPath, setPreviewPath] = useState('/')
  const [previewDevice, setPreviewDevice] = useState('desktop')
  const iframeRef = useRef(null)

  const activePage = adminPages.find((page) => page.id === activeId) || adminPages[0]
  const profile = profileFrom(draft.documents, t('内容后台'))

  const reloadPreview = useCallback(() => {
    iframeRef.current?.contentWindow?.location.reload()
  }, [])

  const openProfile = useCallback(() => setProfileOpen(true), [])

  // 兼容旧深链：#/profile 打开弹窗后回到 Dashboard，避免留下空白页
  useEffect(() => {
    function syncProfileHash() {
      const raw = window.location.hash.replace(/^#\/?/, '')
      if (raw !== 'profile') return
      setProfileOpen(true)
      navigate(FALLBACK_ID)
    }
    syncProfileHash()
    window.addEventListener('hashchange', syncProfileHash)
    return () => window.removeEventListener('hashchange', syncProfileHash)
  }, [navigate])

  useEffect(() => {
    if (!draft.dirty && !postDirty && !markdownDirty && !profileDirty) return undefined
    const handler = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [draft.dirty, markdownDirty, postDirty, profileDirty])

  const handleSave = useCallback(async () => {
    if (!draft.dirty || draft.saving) return
    const ok = await draft.save()
    if (ok) reloadPreview()
  }, [draft, reloadPreview])

  const handleDiscard = useCallback(() => {
    if (!draft.dirty) return
    if (!window.confirm(t('撤销所有未保存的更改？'))) return
    draft.discard()
    reloadPreview()
  }, [draft, reloadPreview, t])

  useEffect(() => {
    const handler = (event) => {
      if (postDirty || markdownDirty || profileOpen) return
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSave, markdownDirty, postDirty, profileOpen])

  const goTo = useCallback(
    (id) => {
      if (id === activeId) return
      const hasTextDirty = postDirty || markdownDirty
      if (hasTextDirty && !window.confirm(t('有未保存的修改，确定离开？'))) return
      setPostDirty(false)
      setMarkdownDirty(false)
      setProjectDetail('')
      navigate(id)
    },
    [activeId, markdownDirty, navigate, postDirty, t]
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
          onOpenProfile={openProfile}
          profile={{ avatar: '', name: 'STYLAN', role: t('内容后台') }}
        />
        <div className="admin-workspace">
          <AdminTopbar
            pageLabel={t(activePage.label)}
            dirty={false}
            dirtyCount={0}
            saving={false}
            previewOpen={false}
            onTogglePreview={() => {}}
          />
          <main className="admin-main">
            <div className="admin-page">
              <p className="text-sm text-muted">
                {loading ? t('正在加载配置…') : draft.error}
              </p>
              {!loading ? (
                <button className="admin-btn mt-3" onClick={draft.load}>
                  {t('重试')}
                </button>
              ) : null}
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
        onOpenProfile={openProfile}
        profileOpen={profileOpen}
        profile={profile}
      />

      <div className="admin-workspace">
        <AdminTopbar
          pageLabel={t(activePage.label)}
          dirty={draft.dirty}
          dirtyCount={draft.dirtyCount}
          saving={draft.saving}
          onDiscard={handleDiscard}
          onSave={handleSave}
          previewOpen={previewOpen}
          onTogglePreview={() => setPreviewOpen((value) => !value)}
        />

        <main className="admin-main">
          {activeId === 'dashboard' ? (
            <DashboardView draft={draft} onNavigate={goTo} onOpenProfile={openProfile} />
          ) : activeId === 'changelog' ? (
            <ChangelogView onDirtyChange={setMarkdownDirty} />
          ) : (
            <ConfigView
              page={activePage}
              draft={draft}
              extra={
                activePage.posts ? (
                  <PostsPanel onDirtyChange={setPostDirty} />
                ) : activePage.projectDetails ? (
                  <ProjectDetailsPanel
                    projects={draft.documents.site?.projects || []}
                    selected={projectDetail}
                    onDirtyChange={setMarkdownDirty}
                  />
                ) : null
              }
              extraTitle={activePage.posts ? '文章' : '项目详情正文'}
              itemActions={
                activePage.projectDetails
                  ? (item) =>
                      item?.slug ? (
                        <button
                          type="button"
                          className="admin-text-btn"
                          onClick={() => setProjectDetail(item.slug)}
                        >
                          {t('详情正文')}
                        </button>
                      ) : null
                  : null
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

      <AdminProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        draft={draft}
        onDirtyChange={setProfileDirty}
        onSaved={reloadPreview}
      />
    </div>
  )
}
