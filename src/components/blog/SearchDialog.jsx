import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../site/Modal'
import { categoryLabel, formatDate } from '../../utils/postFormat'
import { searchPosts } from '../../utils/blogSearch'
import { SearchIcon } from '../site/icons'
import { cn } from '../../utils/cn'

export default function SearchDialog({ open, posts, onClose, t }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()
  const results = searchPosts(posts, query, t)

  useEffect(() => {
    setQuery('')
    setActiveIndex(0)
    if (!open) return undefined
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  function openPost(post) {
    if (!post) return
    onClose()
    navigate(`/blog/${post.slug}`)
  }

  return (
    <Modal open={open} onClose={onClose} label={t({ en: 'Search posts', zh: '搜索文章' })}>
      <div className="flex items-center gap-2 border-b border-line pb-2">
        <SearchIcon size={16} className="shrink-0 text-muted" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setActiveIndex((value) => Math.min(value + 1, Math.max(results.length - 1, 0)))
            } else if (event.key === 'ArrowUp') {
              event.preventDefault()
              setActiveIndex((value) => Math.max(value - 1, 0))
            } else if (event.key === 'Enter') {
              event.preventDefault()
              openPost(results[activeIndex])
            }
          }}
          placeholder={t({ en: 'Search posts…', zh: '搜索文章…' })}
          className="h-9 w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          aria-label={t({ en: 'Search posts', zh: '搜索文章' })}
        />
        <kbd className="rounded border border-line bg-subtle px-1.5 py-0.5 text-[11px] text-muted">
          ESC
        </kbd>
      </div>

      <div ref={listRef} className="mt-2 max-h-[50vh] overflow-y-auto">
        {results.length === 0 ? (
          <p className="py-6 text-sm text-muted">{t({ en: 'No results.', zh: '没有结果。' })}</p>
        ) : (
          results.map((post, index) => (
            <button
              key={post.slug}
              type="button"
              data-index={index}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => openPost(post)}
              className={cn(
                'flex w-full items-baseline justify-between gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors',
                index === activeIndex ? 'bg-subtle text-ink' : 'text-muted-strong hover:bg-subtle'
              )}
            >
              <span className="min-w-0 truncate font-medium">{t(post.title)}</span>
              <span className="shrink-0 text-xs text-muted">
                {formatDate(post.date, t)} · {categoryLabel(post.category, t)}
              </span>
            </button>
          ))
        )}
      </div>
    </Modal>
  )
}
