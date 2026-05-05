/**
 * ============================================================================
 *  BlogPage.jsx - 博客主页面组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 博客页面的主入口组件
 * 2. 从 markdown 文件读取文章列表
 * 3. 管理分类筛选状态
 * 4. 组合博客页面的各个区块
 *
 * 【组件结构】
 * ┌─────────────────────────────────────┐
 * │  BlogHeader (博客导航栏)              │
 * ├─────────────────────────────────────┤
 * │  Hero Section (博客标题区域)          │
 * ├─────────────────────────────────────┤
 * │  Category Filter (分类筛选)          │
 * ├─────────────────────────────────────┤
 * │  BlogList (文章列表)                 │
 * ├─────────────────────────────────────┤
 * │  Footer (页脚)                       │
 * └─────────────────────────────────────┘
 *
 * 【自定义提示】
 * - 修改博客内容: 在 src/posts/ 文件夹中添加 markdown 文件
 * - 修改样式: 使用 Tailwind CSS 类名
 * ============================================================================
 */

import { useState, useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useLanguage } from '../hooks/useLanguage'
import { getAllPosts } from '../utils/markdown'
import blogConfig from '../blogConfig'
import config from '../config'
import PageHeader from '../components/shared/PageHeader'
import BlogHero from '../components/BlogPage/BlogHero'
import CategoryFilter from '../components/BlogPage/CategoryFilter'
import BlogList from '../components/BlogPage/BlogList'
import BlogSearch from '../components/BlogPage/BlogSearch'
import PageFooter from '../components/shared/PageFooter'

function BlogPage() {
  // 主题和语言状态
  const { isDark, toggle: toggleTheme } = useTheme()
  const { lang, toggle: toggleLang, t } = useLanguage()

  // 文章列表状态
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // 当前选中的分类
  const [activeCategory, setActiveCategory] = useState('all')

  // 搜索状态
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // 加载文章列表
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        const allPosts = await getAllPosts(lang)
        setPosts(allPosts)
      } catch (error) {
        console.error('[BlogPage] Failed to load posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [lang]) // 当语言变化时重新加载

  // 根据分类筛选文章
  const filteredPosts = activeCategory === 'all'
    ? posts
    : posts.filter(post => post.category === activeCategory)

  // 处理键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K 打开搜索
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    // 最外层容器：最小屏幕高度、背景色、主题切换过渡、flex布局
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors w-full flex flex-col">
      {/* 设置浏览器标签页标题 */}
      <title>{t(blogConfig.page.title)} | STYLAN</title>

      {/* 博客导航栏 */}
      <PageHeader
        title={t(blogConfig.page.title)}
        backToHome={t(blogConfig.page.backToHome)}
        navLinks={config.navLinks}
        showSearch={true}
        onSearchClick={() => setIsSearchOpen(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
        lang={lang}
        toggleLang={toggleLang}
        t={t}
      />

      {/* 搜索界面 */}
      <BlogSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={posts}
        t={t}
        isDark={isDark}
      />

      {/* 主要内容区域 - 使用flex-grow填充剩余空间 */}
      <main className="w-full pt-16 flex-grow">
        {/* 博客标题区域 */}
        <BlogHero t={t} isDark={isDark} />

        {/* 分类筛选 */}
        <section className="px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <CategoryFilter
              categories={blogConfig.categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              t={t}
            />
          </div>
        </section>

        {/* 文章列表 */}
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">
                  {t({ en: 'Loading posts...', zh: '加载文章中...' })}
                </p>
              </div>
            ) : (
              <BlogList posts={filteredPosts} t={t} />
            )}
          </div>
        </section>
      </main>

      {/* 页脚 - 紧贴屏幕下方 */}
      <PageFooter t={t} />
    </div>
  )
}

export default BlogPage