import { useEffect, useMemo, useState } from 'react'
import { adminApi } from '../api'
import PostEditor from './PostEditor'

function displayTitle(title) {
  if (typeof title === 'string') return title
  return title?.zh || title?.en || '（无标题）'
}

export default function PostsSection({ onDirtyChange }) {
  const [posts, setPosts] = useState([])
  const [lang, setLang] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    adminApi
      .listPosts()
      .then((data) => {
        if (cancelled) return
        setPosts(data)
        setError('')
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [reloadToken])

  const visible = useMemo(
    () => posts.filter((post) => lang === 'all' || post.lang === lang),
    [posts, lang]
  )

  async function handleDelete(post) {
    if (!window.confirm(`删除《${displayTitle(post.title)}》？此操作不会删除配图目录。`)) return
    try {
      await adminApi.deletePost(post.lang, post.filename)
      setReloadToken((value) => value + 1)
    } catch (err) {
      setError(err.message)
    }
  }

  if (editing) {
    return (
      <PostEditor
        state={editing}
        onClose={() => setEditing(null)}
        onDirtyChange={onDirtyChange}
        onSaved={() => {
          setEditing(null)
          setReloadToken((value) => value + 1)
        }}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          {['all', 'zh', 'en'].map((value) => (
            <button
              key={value}
              className={`admin-tab ${lang === value ? 'is-active' : ''}`}
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

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted">加载中…</p>
      ) : (
        <div>
          {visible.map((post) => (
            <div
              key={`${post.lang}:${post.filename}`}
              className="flex items-center gap-3 py-3 border-b"
              style={{ borderColor: 'var(--line)' }}
            >
              <span className="admin-badge">{post.lang}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink">{displayTitle(post.title)}</p>
                <p className="font-mono-ui text-[11px] text-muted">
                  {post.date} · {post.category}{post.featured ? ' · 精选' : ''}
                </p>
              </div>
              <button
                className="admin-btn"
                onClick={() => setEditing({ isNew: false, lang: post.lang, filename: post.filename })}
              >
                编辑
              </button>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(post)}>
                删除
              </button>
            </div>
          ))}
          {visible.length === 0 && <p className="text-sm text-muted py-6">暂无文章</p>}
        </div>
      )}
    </div>
  )
}
