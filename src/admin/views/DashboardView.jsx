import { useGitLog } from '../hooks/useGitLog'
import { usePosts } from '../hooks/usePosts'

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value || ''
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function DashboardView({ draft, onNavigate }) {
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

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-desc">
          网站项目、博客、技术栈与最近提交记录的总览；修改请进入对应页面。
        </p>
      </div>

      <div className="mb-4">
        <span className="admin-panel-note">
          {draft.dirty ? `${draft.dirtyCount} 处未保存修改` : '当前配置已同步'}
        </span>
      </div>

      <div className="admin-stat-grid">
        <button type="button" className="admin-stat" onClick={() => onNavigate('projects')}>
          <span className="admin-stat-label">项目</span>
          <span className="admin-stat-value">{projects.length}</span>
          <span className="admin-stat-meta">{projectCategories.length} 个分类</span>
        </button>
        <button type="button" className="admin-stat" onClick={() => onNavigate('blog')}>
          <span className="admin-stat-label">博客文章</span>
          <span className="admin-stat-value">{postsLoading ? '…' : posts.length}</span>
          <span className="admin-stat-meta">
            {postsError ? '文章列表读取失败' : `中文 ${zhPosts} / 英文 ${enPosts} · ${blogCategories.length} 个分类`}
          </span>
        </button>
        <button type="button" className="admin-stat" onClick={() => onNavigate('stack')}>
          <span className="admin-stat-label">技术栈</span>
          <span className="admin-stat-value">{stackCategories.length}</span>
          <span className="admin-stat-meta">{stackItems} 个技术条目</span>
        </button>
        <button type="button" className="admin-stat" onClick={() => onNavigate('profile')}>
          <span className="admin-stat-label">联系方式</span>
          <span className="admin-stat-value">{contacts.length}</span>
          <span className="admin-stat-meta">个人资料与联系方式</span>
        </button>
      </div>

      <section className="admin-panel">
        <header className="admin-panel-head">
          <span className="admin-panel-title">提交记录</span>
          <span className="admin-panel-note">
            {git.loading
              ? '正在读取本地 git…'
              : git.data?.available
                ? `${git.data.branch || 'detached'} · 共 ${git.data.total} 次提交`
                : '本地 git 不可用'}
          </span>
        </header>
        <div className="admin-panel-body">
          {git.loading ? (
            <p className="text-sm text-muted">正在读取…</p>
          ) : git.error ? (
            <p className="admin-error">{git.error}</p>
          ) : !git.data?.available ? (
            <p className="text-sm text-muted">
              {git.data?.reason || '当前环境无法读取 git 日志'}；不会使用推测数据代替真实提交。
            </p>
          ) : git.data.commits.length === 0 ? (
            <p className="text-sm text-muted">还没有提交记录</p>
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
                      {formatDate(commit.date)} · {commit.author} · {commit.fileCount} 个文件
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
        </div>
      </section>
    </div>
  )
}
