import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { getAllPosts, getPostCount } from '../utils/markdown'
import { collectTags, filterPosts } from '../utils/blogFilters'
import blogConfig from '../content/blog.yaml'
import PageTitle from '../components/shared/PageTitle'
import BlogHero from '../components/BlogPage/BlogHero'
import CategoryFilter from '../components/BlogPage/CategoryFilter'
import TagFilter from '../components/BlogPage/TagFilter'
import BlogList from '../components/BlogPage/BlogList'
import PostRowSkeleton from '../components/HomePage/PostRowSkeleton'
import BlogSearch from '../components/BlogPage/BlogSearch'
import SearchTrigger from '../components/BlogPage/SearchTrigger'

export default function BlogPage() {
  const { lang, t } = useLanguage()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTag, setActiveTag] = useState(null)
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
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const tags = useMemo(() => collectTags(posts), [posts])
  const filteredPosts = useMemo(
    () => filterPosts(posts, { category: activeCategory, tag: activeTag }),
    [posts, activeCategory, activeTag]
  )

  return (
    <>
      <PageTitle
        title={`STYLAN · ${t(blogConfig.page.title)}`}
        description={t(blogConfig.page.subtitle)}
        t={t}
        lang={lang}
      />
      <BlogHero t={t} />

      <section className="flex flex-col gap-4 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CategoryFilter
            categories={blogConfig.categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            t={t}
          />
          <SearchTrigger
            onClick={() => setIsSearchOpen(true)}
            t={t}
            isMac={
              typeof navigator !== 'undefined' &&
              /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
            }
          />
        </div>
        {loading && !tags.length ? (
          // Reserve the tag row height so inserting it after posts resolve does not shift the list.
          <div className="h-[1.4375rem]" aria-hidden />
        ) : (
          <TagFilter
            tags={tags}
            activeTag={activeTag}
            onTagChange={setActiveTag}
            t={t}
          />
        )}
      </section>

      <section className="pb-12">
        {loading ? (
          <div className="border-t border-line">
            {Array.from({ length: getPostCount(lang) }).map((_, index) => (
              <PostRowSkeleton key={index} />
            ))}
          </div>
        ) : (
          <BlogList posts={filteredPosts} t={t} />
        )}
      </section>

      <BlogSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={posts}
        t={t}
      />
    </>
  )
}
