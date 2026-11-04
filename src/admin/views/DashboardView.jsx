import { useGitLog } from '../hooks/useGitLog'
import { usePosts } from '../hooks/usePosts'
import AdminPanel from '../components/AdminPanel'
import { useAdminLang, useAdminT } from '../i18n'

function formatDate(value, lang) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value || ''
  return date.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function DashboardView({ draft, onNavigate, onOpenProfile }) {
  const t = useAdminT()
  const lang = useAdminLang()
  const { posts, loading: postsLoading, error: postsError } = usePosts()
  const git = useGitLog(20)

  const site = draft.documents.site
  const projects = site.projects || []
  const projectCategories = site.projectCategories || []
  const stackCategories = site.skills || []
  const stackItems = stackCategories.reduce(
    (total, category) => total + (category.items?.length || 0),
    0
  )
  const contacts = site.contacts || []
  const blogCategories = draft.documents.blog?.categories || []
  const zhPosts = posts.filter((post) => post.lang === 'zh').length
  const enPosts = posts.filter((post) => post.lang === 'en').length

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-desc">
          {t('网站项目、博客、技术栈与最近提交记录的总览，修改请进入对应页面。')}
        </p>
      </div>

      <nav className="admin-subnav" aria-label={t('本页分区')}>
        <button type="button" className="admin-subnav-btn" onClick={() => scrollTo('panel-overview')}>
          {t('总览')}
        </button>
        <button type="button" className="admin-subnav-btn" onClick={() => scrollTo('panel-commits')}>
          {t('提交记录')}
        </button>
      </nav>

      <div className="mb-4 min-h-[18px]">
        <span className="admin-panel-note">
          {draft.dirty
            ? `${draft.dirtyCount} ${t('处未保存修改')}`
            : t('当前配置已同步')}
        </span>
      </div>

      <div className="space-y-4">
        <AdminPanel id="panel-overview" title={t('总览')}>
          <div className="admin-stat-grid">
            <button type="button" className="admin-stat" onClick={() => onNavigate('projects')}>
              <span className="admin-stat-label">{t('项目')}</span>
              <span className="admin-stat-value">{projects.length}</span>
              <span className="admin-stat-meta">
                {projectCategories.length} {t('个分类')}
              </span>
            </button>
            <button type="button" className="admin-stat" onClick={() => onNavigate('blog')}>
              <span className="admin-stat-label">{t('博客文章')}</span>
              <span className="admin-stat-value">{postsLoading ? '…' : posts.length}</span>
              <span className="admin-stat-meta">
                {postsError
                  ? t('文章列表读取失败')
                  : `${t('中文')} ${zhPosts} / ${t('英文')} ${enPosts} · ${blogCategories.length} ${t('个分类')}`}
              </span>
            </button>
            <button type="button" className="admin-stat" onClick={() => onNavigate('stack')}>
              <span className="admin-stat-label">{t('技术栈')}</span>
              <span className="admin-stat-value">{stackCategories.length}</span>
              <span className="admin-stat-meta">
                {stackItems} {t('个技术条目')}
              </span>
            </button>
            <button type="button" className="admin-stat" onClick={onOpenProfile}>
              <span className="admin-stat-label">{t('联系方式')}</span>
              <span className="admin-stat-value">{contacts.length}</span>
              <span className="admin-stat-meta">{t('个人资料与联系方式')}</span>
            </button>
          </div>
        </AdminPanel>

        <AdminPanel
          id="panel-commits"
          title={t('提交记录')}
          note={
            git.loading
              ? t('正在读取本地 git…')
              : git.data?.available
                ? `${git.data.branch || 'detached'} · ${git.data.total} ${t('次提交')}`
                : t('本地 git 不可用')
          }
        >
          {git.loading ? (
            <p className="text-sm text-muted">{t('正在读取')}</p>
          ) : git.error ? (
            <p className="admin-error">{git.error}</p>
          ) : !git.data?.available ? (
            <p className="text-sm text-muted">
              {git.data?.reason || t('当前环境无法读取 git 日志')}
              {lang === 'zh'
                ? '；不会使用推测数据代替真实提交。'
                : '; inferred data is never substituted for real commits.'}
            </p>
          ) : git.data.commits.length === 0 ? (
            <p className="text-sm text-muted">{t('还没有提交记录')}</p>
          ) : (
            <ol className="admin-commit-list">
              {git.data.commits.map((commit) => (
                <li className="admin-commit" key={commit.hash}>
                  <span className="admin-commit-dot" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <code className="admin-commit-hash">{commit.short}</code>
                      <span className="text-sm font-medium text-heading">{commit.subject}</span>
                    </div>
                    <div className="admin-commit-meta">
                      {formatDate(commit.date, lang)} · {commit.author} · {commit.fileCount}{' '}
                      {t('个文件')}
                    </div>
                    {commit.files.length > 0 ? (
                      <div className="admin-commit-files">
                        {commit.files.slice(0, 4).map((file) => (
                          <span key={file}>{file}</span>
                        ))}
                        {commit.fileCount > 4 ? <span>…</span> : null}
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </AdminPanel>
      </div>
    </div>
  )
}
