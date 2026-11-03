import { useMemo, useState } from 'react'
import { adminApi } from '../api'
import { usePosts } from '../hooks/usePosts'
import PostEditorView from './PostEditorView'

function displayTitle(title) {
  if (typeof title === 'string') return title
  return title?.zh || title?.en || '（无标题）'
}

export default function PostsView({ onDirtyChange }) {
  const { posts, loading, error, reload } = usePosts()
  const [lang, setLang] = useState('all')
  const [editing, setEditing] = useState(null)
  const [actionError, setActionError] = useState('')

  const visible = useMemo(
    () => posts.filter((post) => lang === 'all' || post.lang === lang),
    [posts, lang]
  )

  async function handleDelete(post) {
    if (!window.confirm(`删除《${displayTitle(post.title)}》？此操作不会删除配图目录。`)) return
    setActionError('')
    try {
      await adminApi.deletePost(post.lang, post.filename)
      await reload()
    } catch (err) {
      setActionError(err.message)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1 className="admin-page-title">文章管理</h1>
        <p className="admin-page-desc">按语言筛选文章，编辑与新建均写入本地 Markdown 文件。</p>
      </div>

      <section className="admin-panel">
        <header className="admin-panel-head">
          <span className="admin-panel-title">
            {editing ? (editing.isNew ? '新建文章' : '编辑文章') : '文章列表'}
          </span>
          {actionError || error ? (
            <span className="admin-error">{actionError || error}</span>
          ) : (
            <span className="admin-panel-note">本地 Markdown 文件</span>
          )}
        </header>
        <div className="admin-panel-body">
          {editing ? (
            <PostEditorView
              state={editing}
              onDirtyChange={onDirtyChange}
              onClose={() => setEditing(null)}
              onSaved={() => {
                setEditing(null)
                reload()
              }}
            />
          ) : (
            <div className="space-y-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2" role="group" aria-label="按语言筛选">
                  {['all', 'zh', 'en'].map((value) => (
                    <button
                      key={value}
                      className={`admin-tab ${lang === value ? 'is-active' : ''}`}
                      aria-pressed={lang === value}
                      onClick={() => setLang(value)}
                    >
                      {value === 'all' ? '全部' : value.toUpperCase()}
                    </button>
                  ))}
                </div>
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={() => setEditing({ isNew: true, lang: 'zh', filename: '' })}
                >
                  新建文章
                </button>
              </div>

              {loading ? (
                <p className="text-sm text-muted">加载中…</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>标题</th>
                        <th className="w-20">语言</th>
                        <th className="w-28">日期</th>
                        <th className="w-24">分类</th>
                        <th className="w-36 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((post) => (
                        <tr key={`${post.lang}:${post.filename}`}>
                          <td className="font-medium text-heading">{displayTitle(post.title)}</td>
                          <td><span className="admin-badge">{post.lang}</span></td>
                          <td className="text-muted">{post.date}</td>
                          <td className="text-muted">{post.category}</td>
                          <td>
                            <div className="admin-table-actions">
                              <button
                                className="admin-btn"
                                onClick={() =>
                                  setEditing({
                                    isNew: false,
                                    lang: post.lang,
                                    filename: post.filename,
                                  })
                                }
                              >
                                编辑
                              </button>
                              <button
                                className="admin-btn admin-btn-danger"
                                onClick={() => handleDelete(post)}
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {visible.length === 0 && (
                    <p className="p-6 text-sm text-muted">暂无文章</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
