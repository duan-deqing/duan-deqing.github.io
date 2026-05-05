/**
 * ============================================================================
 *  BlogSearch.jsx - 博客搜索组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 全屏搜索界面
 * 2. 搜索框在屏幕中间偏上位置
 * 3. 前面有 ">" 符号提示输入位置
 * 4. 输入框只保留底部边界
 * 5. 根据输入内容显示搜索结果
 * 6. 点击结果跳转到对应博客
 *
 * 【Props】
 * - isOpen: boolean - 是否显示搜索界面
 * - onClose: function - 关闭搜索界面
 * - posts: array - 文章列表
 * - t: function - 翻译函数
 * - isDark: boolean - 是否深色模式
 * ============================================================================
 */

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import theme from '../../theme'

export default function BlogSearch({ isOpen, onClose, posts, t, isDark }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // 打开时自动聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
    // 关闭时清空搜索
    if (!isOpen) {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  // 搜索逻辑
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchTerm = query.toLowerCase()
    const filtered = posts.filter(post => {
      const title = t(post.title).toLowerCase()
      const excerpt = t(post.excerpt).toLowerCase()
      const tags = post.tags.join(' ').toLowerCase()
      const category = post.category.toLowerCase()

      return (
        title.includes(searchTerm) ||
        excerpt.includes(searchTerm) ||
        tags.includes(searchTerm) ||
        category.includes(searchTerm)
      )
    })

    setResults(filtered)
  }, [query, posts, t])

  // 处理键盘事件
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  // 点击结果跳转
  const handleResultClick = (slug) => {
    onClose()
    navigate(`/blog/${slug}`)
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 ${theme.background.page} transition-colors`}
      onKeyDown={handleKeyDown}
    >
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className={`absolute top-6 right-6 p-2 ${theme.body.muted.light} ${theme.body.muted.dark} ${theme.link.default.hoverLight} ${theme.link.default.hoverDark} transition-colors`}
        aria-label="Close search"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 搜索区域 - 屏幕中间偏上 */}
      <div className="flex flex-col items-center" style={{ marginTop: '20vh' }}>
        {/* 搜索输入框 */}
        <div className="w-full max-w-2xl px-6">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t({ en: 'Search posts...', zh: '搜索文章...' })}
            className={`w-full text-2xl py-3 bg-transparent outline-none transition-colors ${theme.body.primary.light} ${theme.body.primary.dark} placeholder-gray-400 dark:placeholder-gray-500`}
            style={{ fontFamily: '"Fira Code", "Noto Sans SC", sans-serif' }}
          />
        </div>

        {/* 搜索结果 */}
        <div className="w-full max-w-2xl px-6 mt-8 max-h-[50vh] overflow-y-auto">
          {query && results.length === 0 && (
            <p className={`${theme.body.muted.light} ${theme.body.muted.dark} text-center py-4`}>
              {t({ en: 'No results found', zh: '未找到相关文章' })}
            </p>
          )}

          {results.length > 0 && (
            <div className="space-y-1">
              {results.map((post, index) => (
                <button
                  key={post.slug}
                  onClick={() => handleResultClick(post.slug)}
                  className={`w-full text-left p-4 rounded-lg ${theme.background.card} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${theme.background.code} ${theme.body.secondary.light} ${theme.body.secondary.dark}`}>
                          {post.category}
                        </span>
                        <span className={`text-xs ${theme.body.muted.light} ${theme.body.muted.dark}`}>
                          {post.date}
                        </span>
                      </div>
                      <h3 className={`text-lg font-medium ${theme.body.primary.light} ${theme.body.primary.dark} group-hover:${theme.link.default.light} dark:group-hover:${theme.link.default.dark} transition-colors truncate`}>
                        {t(post.title)}
                      </h3>
                      <p className={`text-sm ${theme.body.muted.light} ${theme.body.muted.dark} mt-1 line-clamp-1`}>
                        {t(post.excerpt)}
                      </p>
                    </div>
                    <svg className={`w-5 h-5 ${theme.body.muted.light} ${theme.body.muted.dark} ml-4 flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!query && (
            <div className="text-center py-8">
              <p className={`${theme.body.muted.light} ${theme.body.muted.dark}`}>
                {t({ en: 'Type to search...', zh: '输入关键词开始搜索...' })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
