/**
 * BlogPage — 列表 + 分类 + Ctrl+K 搜索（功能保留）
 */

import { useState, useEffect } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { getAllPosts } from '../utils/markdown'
import blogConfig from '../blogConfig'
import SubPageShell from '../components/shared/SubPageShell'
import BlogHero from '../components/BlogPage/BlogHero'
import CategoryFilter from '../components/BlogPage/CategoryFilter'
import BlogList from '../components/BlogPage/BlogList'
import BlogSearch from '../components/BlogPage/BlogSearch'
import SearchTrigger from '../components/BlogPage/SearchTrigger'
import config from '../config'

function BlogPage() {
  const { lang, t } = useLanguage()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const allPosts = await getAllPosts(lang)
        if (!cancelled) setPosts(allPosts)
      } catch (error) {
        console.error('[BlogPage] Failed to load posts:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [lang])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredPosts =
    activeCategory === 'all'
      ? posts
      : posts.filter((post) => post.category === activeCategory)

  return (
    <SubPageShell title={`STYLAN · ${t(blogConfig.page.title)}`} t={t} lang={lang}>
      <BlogHero t={t} />
      <BlogSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={posts}
        t={t}
      />

      <section className="py-6 border-b border-line flex flex-wrap items-center justify-between gap-4">
        <CategoryFilter
          categories={blogConfig.categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          t={t}
        />
        <SearchTrigger
          onClick={() => setIsSearchOpen(true)}
          t={t}
          isMac={typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)}
        />
      </section>

      <section className="py-6 flex-grow">
        {loading ? (
          <div className="py-16 text-muted font-mono-ui text-sm">
            {t({ en: 'Loading…', zh: '加载中…' })}
          </div>
        ) : (
          <BlogList
            key={`${lang}-${activeCategory}`}
            posts={filteredPosts}
            t={t}
          />
        )}
      </section>

    </SubPageShell>
  )
}

export default BlogPage
