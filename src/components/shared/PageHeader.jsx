/**
 * ============================================================================
 *  PageHeader.jsx - 通用页面导航栏组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 可复用的页面导航栏
 * 2. 支持返回主页链接
 * 3. 支持自定义页面标题
 * 4. 主题切换和语言切换功能
 * 5. 滚动时自动隐藏/显示
 * 6. 响应式设计
 *
 * 【Props】
 * - title: string - 页面标题（显示在左侧）
 * - backToHome: string - 返回主页链接文字
 * - isDark: boolean - 当前是否深色模式
 * - toggleTheme: function - 切换主题函数
 * - lang: string - 当前语言
 * - toggleLang: function - 切换语言函数
 * - t: function - 翻译函数
 * ============================================================================
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function PageHeader({ title, backToHome, isDark, toggleTheme, lang, toggleLang, t }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY <= 10) {
        setIsExpanded(true)
      } else if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 5) {
        setIsExpanded(false)
      } else if (lastScrollY > currentScrollY && lastScrollY - currentScrollY > 5) {
        setIsExpanded(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <header
      style={{
        transform: isExpanded ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 dark:bg-gray-900/90"
    >
      <div className="h-16 px-6 md:px-10 flex items-center justify-between">
        {/* 左侧 - 返回主页和页面标题 */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            [<span className="nav-link-text">{backToHome}</span>]
          </Link>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span
            className="text-lg font-semibold text-gray-900 dark:text-white"
            style={{ fontFamily: '"Geist Pixel", monospace' }}
          >
            {title}
          </span>
        </div>

        {/* 右侧 - 切换按钮组 */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-90 relative"
            aria-label="Toggle theme"
          >
            <svg
              className={`w-5 h-5 text-blue-500 transition-all duration-300 absolute ${
                isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg
              className={`w-5 h-5 text-blue-500 dark:text-blue-400 transition-all duration-300 absolute ${
                isDark ? '-rotate-90 scale-0' : 'rotate-0 scale-100'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>

          <button
            onClick={toggleLang}
            className="h-9 w-12 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95 text-sm font-medium text-gray-600 dark:text-gray-400 relative overflow-hidden"
            aria-label="Toggle language"
          >
            <span
              className={`inline-block transition-all duration-300 absolute ${
                lang === 'en' ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
              }`}
            >
              中文
            </span>
            <span
              className={`inline-block transition-all duration-300 absolute ${
                lang === 'zh' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}
            >
              EN
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
