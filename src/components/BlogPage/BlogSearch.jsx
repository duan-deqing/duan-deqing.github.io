/**
 * BlogSearch — 弹出窗口：顶部输入 + 下方结果（覆盖在博客页之上）
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import blogConfig from '../../blogConfig'
import ArrowIcon from '../shared/ArrowIcon'

function categoryLabel(id, t) {
  const cat = blogConfig.categories.find((c) => c.id === id)
  return cat ? t(cat.label) : id
}

function formatDate(dateString, t) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString(t({ en: 'en-CA', zh: 'zh-CN' }), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export default function BlogSearch({ isOpen, onClose, posts, t }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults([])
      setActiveIndex(0)
      return
    }
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults(posts || [])
      setActiveIndex(0)
      return
    }
    const term = query.trim().toLowerCase()
    const filtered = (posts || []).filter((post) => {
      const title = String(t(post.title) || '').toLowerCase()
      const excerpt = String(t(post.excerpt) || '').toLowerCase()
      const tags = (post.tags || []).join(' ').toLowerCase()
      const category = String(post.category || '').toLowerCase()
      return (
        title.includes(term) ||
        excerpt.includes(term) ||
        tags.includes(term) ||
        category.includes(term)
      )
    })
    setResults(filtered)
    setActiveIndex(0)
  }, [query, posts, t])

  const openPost = useCallback(
    (post) => {
      if (!post) return
      onClose()
      navigate(`/blog/${post.slug}`)
    },
    [navigate, onClose]
  )

  useEffect(() => {
    if (!isOpen) return
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, isOpen])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[8vh] sm:pt-[12vh] pb-8"
      role="dialog"
      aria-modal="true"
      aria-label={t({ en: 'Search posts', zh: '搜索文章' })}
    >
      {/* 遮罩 */}
      <button
        type="button"
        className="absolute inset-0 cursor-default search-backdrop"
        aria-label={t({ en: 'Close search', zh: '关闭搜索' })}
        onClick={onClose}
      />

      {/* 弹窗本体：上下结构 */}
      <div className="search-modal">
        {/* 上：输入区 */}
        <div className="search-modal-top">
          <div className="search-input-bar">
            <svg
              className="w-4 h-4 shrink-0 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault()
                  onClose()
                  return
                }
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setActiveIndex((i) => Math.min(i + 1, results.length - 1))
                  return
                }
                if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setActiveIndex((i) => Math.max(i - 1, 0))
                  return
                }
                if (e.key === 'Enter') {
                  e.preventDefault()
                  openPost(results[activeIndex])
                }
              }}
              placeholder={t({ en: 'Search title, tag, category…', zh: '搜索标题、标签、分类…' })}
              className="flex-1 min-w-0 bg-transparent outline-none text-[15px] sm:text-base text-ink placeholder:text-muted"
              autoComplete="off"
              spellCheck="false"
            />
            <kbd className="hidden sm:inline-flex font-mono-ui text-[10px] tracking-wider text-muted border border-line rounded px-1.5 py-0.5">
              ESC
            </kbd>
          </div>
          <p className="mt-2.5 font-mono-ui text-[10px] tracking-wider text-muted">
            {results.length}{' '}
            {t({ en: results.length === 1 ? 'result' : 'results', zh: '条结果' })}
            <span className="mx-2 opacity-40">·</span>
            {t({ en: '↑↓ · ↵ open', zh: '↑↓ 选择 · ↵ 打开' })}
          </p>
        </div>

        {/* 下：结果列表 */}
        <div ref={listRef} className="search-modal-body">
          {results.length === 0 && (
            <div className="px-5 py-12 text-center">
              <p className="font-display text-lg text-ink mb-1.5">
                {t({ en: 'No results', zh: '没有找到文章' })}
              </p>
              <p className="text-sm text-muted">
                {t({
                  en: 'Try another keyword or category.',
                  zh: '换个关键词，或试试分类名。',
                })}
              </p>
            </div>
          )}

          {results.map((post, index) => {
            const active = index === activeIndex
            return (
              <button
                key={post.slug}
                type="button"
                data-index={index}
                onClick={() => openPost(post)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`search-result-row ${active ? 'is-active' : ''}`}
              >
                <span className="search-result-num">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="search-result-title">{t(post.title)}</span>
                  <span className="search-result-meta">
                    <span>{categoryLabel(post.category, t)}</span>
                    <span aria-hidden>·</span>
                    <span>{formatDate(post.date, t)}</span>
                    {post.featured && (
                      <>
                        <span aria-hidden>·</span>
                        <span style={{ color: 'var(--accent)' }}>
                          {t({ en: 'Featured', zh: '精选' })}
                        </span>
                      </>
                    )}
                  </span>
                  {t(post.excerpt) ? (
                    <span className="search-result-excerpt">{t(post.excerpt)}</span>
                  ) : null}
                </span>
                <span className={`search-result-arrow ${active ? 'is-active' : ''}`}>
                  <ArrowIcon direction="right" size={16} />
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
