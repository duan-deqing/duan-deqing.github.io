import { useMemo, useState } from 'react'
import { adminApi } from '../api'
import { usePosts } from '../hooks/usePosts'
import PostEditorView from '../views/PostEditorView'
import { useAdminLang, useAdminT } from '../i18n'

function displayTitle(title, lang) {
  if (typeof title === 'string') return title
  return title?.[lang] || title?.zh || title?.en || '（无标题）'
}

export default function PostsPanel({ onDirtyChange }) {
  const t = useAdminT()
  const lang = useAdminLang()
  const { posts, loading, error, reload } = usePosts()
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [actionError, setActionError] = useState('')

  const visible = useMemo(
    () => posts.filter((post) => filter === 'all' || post.lang === filter),
    [posts, filter]
  )

  async function handleDelete(post) {
    if (!window.confirm(`${t('删除')}《${displayTitle(post.title, lang)}》？`)) return
    setActionError('')
    try {
      await adminApi.deletePost(post.lang, post.filename)
      await reload()
    } catch (err) {
      setActionError(err.message)
    }
  }

  return (
    <section className="admin-panel">
      <header className="admin-panel-head">
        <span className="admin-panel-title">
          {editing ? (editing.isNew ? t('新建文章') : t('编辑文章')) : t('文章')}
        </span>
        {actionError || error ? (
          <span className="admin-error">{actionError || error}</span>
        ) : (
          <span className="admin-panel-note">
            {loading ? t('加载中') : `${visible.length} ${t('篇')}`}
          </span>
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
              <div className="admin-segment" role="group" aria-label={t('按语言筛选')}>
                {['all', 'zh', 'en'].map((value) => (
                  <button
                    key={value}
                    className={`admin-segment-btn ${filter === value ? 'is-active' : ''}`}
                    aria-pressed={filter === value}
                    onClick={() => setFilter(value)}
                  >
                    {value === 'all' ? t('全部') : value === 'zh' ? t('中文') : t('英文')}
                  </button>
                ))}
              </div>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => setEditing({ isNew: true, lang: 'zh', filename: '' })}
              >
                {t('新建文章')}
              </button>
            </div>

            {loading ? (
              <p className="admin-empty">{t('加载中')}</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t('标题')}</th>
                      <th className="w-20">{t('语言')}</th>
                      <th className="w-28">{t('日期')}</th>
                      <th className="w-24">{t('分类')}</th>
                      <th className="w-36 text-right">{t('操作')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((post) => (
                      <tr key={`${post.lang}:${post.filename}`}>
                        <td className="admin-table-primary font-medium text-heading">
                          {displayTitle(post.title, lang)}
                        </td>
                        <td data-label={t('语言')}><span className="admin-badge">{post.lang}</span></td>
                        <td data-label={t('日期')} className="text-muted">{post.date}</td>
                        <td data-label={t('分类')} className="text-muted">{post.category}</td>
                        <td data-label={t('操作')}>
                          <div className="admin-table-actions">
                            <button
                              className="admin-text-btn"
                              onClick={() =>
                                setEditing({
                                  isNew: false,
                                  lang: post.lang,
                                  filename: post.filename,
                                })
                              }
                            >
                              {t('编辑')}
                            </button>
                            <button
                              className="admin-text-btn is-danger"
                              onClick={() => handleDelete(post)}
                            >
                              {t('删除')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {visible.length === 0 && (
                  <p className="admin-empty">{t('暂无文章')}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
