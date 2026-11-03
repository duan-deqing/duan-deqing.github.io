import { useCallback, useEffect, useRef, useState } from 'react'
import { adminPages, adminPageIds } from './schema'
import { displayText } from './lib/display'
import { useConfigDraft } from './hooks/useConfigDraft'
import { useHashRoute } from './hooks/useHashRoute'
import AdminSidebar from './components/AdminSidebar'
import AdminTopbar from './components/AdminTopbar'
import PreviewDrawer from './components/PreviewDrawer'
import PostsPanel from './components/PostsPanel'
import ConfigView from './views/ConfigView'
import DashboardView from './views/DashboardView'
import ChangelogView from './views/ChangelogView'
import HomeCopyPanel from './views/HomeCopyPanel'
import ProjectDetailsPanel from './views/ProjectDetailsPanel'
import { useAdminT } from './i18n'

const FALLBACK_ID = 'dashboard'
const SIDE_ITEMS = adminPages.filter(({ id }) => id !== 'profile')

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

  useEffect(() => {
    if (!draft.dirty && !postDirty && !markdownDirty) return undefined
    const handler = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [draft.dirty, markdownDirty, postDirty])

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
      if (postDirty || markdownDirty) return
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSave, markdownDirty, postDirty])

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
          profile={{ avatar: '', name: 'STYLAN', role: t('内容后台') }}
        />
        <div className="admin-workspace">
          <AdminTopbar
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
        profile={profile}
      />

      <div className="admin-workspace">
        <AdminTopbar
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
            <DashboardView draft={draft} onNavigate={goTo} />
          ) : activeId === 'changelog' ? (
            <ChangelogView onDirtyChange={setMarkdownDirty} />
          ) : (
            <ConfigView
              page={activePage}
              draft={draft}
              extra={
                activePage.posts ? (
                  <PostsPanel onDirtyChange={setPostDirty} />
                ) : activePage.homeCopy ? (
                  <HomeCopyPanel onDirtyChange={setMarkdownDirty} />
                ) : activePage.projectDetails ? (
                  <ProjectDetailsPanel
                    projects={draft.documents.site?.projects || []}
                    selected={projectDetail}
                    onDirtyChange={setMarkdownDirty}
                  />
                ) : null
              }
              extraTitle={
                activePage.posts ? '文章' : activePage.homeCopy ? '首页文案' : '项目详情正文'
              }
              itemActions={
                activePage.projectDetails
                  ? (item) =>
                      item?.slug ? (
                        <button
                          type="button"
                          className="admin-btn"
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
    </div>
  )
}
