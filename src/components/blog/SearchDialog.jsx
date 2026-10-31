import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../site/Modal'
import { categoryLabel, formatDate } from '../../utils/postFormat'
import { searchPosts } from '../../utils/blogSearch'
import { SearchIcon } from '../site/icons'
import { cn } from '../../utils/cn'

function Kbd({ children }) {
  return (
    <kbd className="rounded border border-line bg-subtle px-1 py-0.5 font-mono text-[10px] font-medium text-muted-strong">
      {children}
    </kbd>
  )
}

export default function SearchDialog({ open, posts, onClose, t }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()
  const results = searchPosts(posts, query, t)

  useEffect(() => {
    if (!open) return undefined
    setQuery('')
    setActiveIndex(0)
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
    <Modal
      open={open}
      onClose={onClose}
      label={t({ en: 'Search posts', zh: '搜索文章' })}
      maxWidth="max-w-xl"
      flush
    >
      <div className="flex h-14 items-center gap-3 border-b border-line px-4">
        <SearchIcon size={18} className="shrink-0 text-muted" />
        <input
          ref={inputRef}
          type="search"
          id="blog-search-input"
          name="search"
          autoComplete="off"
          spellCheck="false"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            // 输入法组合期间（中文/日文候选）方向键与 Enter 属于 IME，不触发列表导航
            if (event.nativeEvent?.isComposing || event.keyCode === 229) return
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
          className="h-full min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-muted focus-visible:outline-none"
          aria-label={t({ en: 'Search posts', zh: '搜索文章' })}
        />
        <Kbd>ESC</Kbd>
      </div>

      <div className="px-2 py-2">
        {results.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-medium text-heading">
              {t({ en: 'No results', zh: '没有结果' })}
            </p>
            <p className="mt-1 text-xs text-muted">
              {t({ en: 'Try a different keyword.', zh: '试试其他关键词。' })}
            </p>
          </div>
        ) : (
          <>
            <p className="px-2 pb-1 pt-1 text-xs font-medium text-muted">
              {t({ en: 'Posts', zh: '文章' })}
            </p>
            <ul ref={listRef} className="max-h-[min(54vh,360px)] space-y-0.5 overflow-y-auto">
              {results.map((post, index) => {
                const active = index === activeIndex
                return (
                  <li key={post.slug}>
                    <button
                      type="button"
                      data-index={index}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => openPost(post)}
                      className={cn(
                        'flex w-full flex-col gap-1 rounded-md px-3 py-2.5 text-left transition-colors',
                        active ? 'bg-hover' : 'hover:bg-subtle'
                      )}
                    >
                      <span
                        className={cn(
                          'min-w-0 truncate text-sm font-medium',
                          active ? 'text-heading' : 'text-muted-strong'
                        )}
                      >
                        {t(post.title)}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted">
                        <time dateTime={post.date}>{formatDate(post.date, t)}</time>
                        <span aria-hidden="true">·</span>
                        <span>{categoryLabel(post.category, t)}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 text-[11px] text-muted">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            {t({ en: 'Navigate', zh: '选择' })}
          </span>
          <span className="flex items-center gap-1">
            <Kbd>↵</Kbd>
            {t({ en: 'Open', zh: '打开' })}
          </span>
          <span className="flex items-center gap-1">
            <Kbd>esc</Kbd>
            {t({ en: 'Close', zh: '关闭' })}
          </span>
        </div>
        <span className="hidden shrink-0 sm:inline">
          {t({
            en: results.length === 1 ? '1 result' : `${results.length} results`,
            zh: `${results.length} 篇`,
          })}
        </span>
      </div>
    </Modal>
  )
}
