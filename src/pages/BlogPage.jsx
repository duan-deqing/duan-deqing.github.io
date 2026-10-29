import { useEffect, useMemo, useState } from 'react'
import blogConfig from '../content/blog.yaml'
import { useLanguage } from '../hooks/useLanguage'
import { getAllPosts } from '../utils/markdown'
import { collectTags, filterPosts } from '../utils/blogFilters'
import { groupPostsByYear } from '../utils/postGroups'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'
import WritingFilterBar from '../components/blog/WritingFilterBar'
import WritingList from '../components/blog/WritingList'
import WritingRowSkeleton from '../components/blog/WritingRowSkeleton'
import SearchDialog from '../components/blog/SearchDialog'
import Button from '../components/site/Button'
import { RssIcon, SearchIcon } from '../components/site/icons'

export default function BlogPage() {
  const { lang, t } = useLanguage()
  const [posts, setPosts] = useState([])
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [tag, setTag] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    setFailed(false)
    setLoading(true)
    getAllPosts(lang)
      .then((value) => {
        if (!cancelled) setPosts(value)
      })
      .catch((error) => {
        console.error('[BlogPage] Failed to load posts:', error)
        if (!cancelled) setFailed(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [lang])

  useEffect(() => {
    function onKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const tags = useMemo(() => collectTags(posts), [posts])
  const filtered = useMemo(() => filterPosts(posts, { category, tag }), [posts, category, tag])
  const groups = useMemo(() => groupPostsByYear(filtered), [filtered])

  useEffect(() => {
    if (tag && !tags.includes(tag)) setTag(null)
  }, [tag, tags])

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageTitle
        title={`STYLAN · ${t(blogConfig.page.title)}`}
        description={t(blogConfig.page.subtitle)}
        t={t}
        lang={lang}
      />
      <PageHeading
        title={t(blogConfig.page.title)}
        description={t(blogConfig.page.subtitle)}
        actions={
          <>
            <Button
              as="a"
              variant="outline"
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RssIcon size={15} />
              RSS
            </Button>
            <Button variant="outline" onClick={() => setSearchOpen(true)}>
              <SearchIcon size={15} />
              {t({ en: 'Search', zh: '搜索' })}
              <kbd
                aria-hidden="true"
                className="rounded border border-line bg-subtle px-1 text-[10px] text-muted"
              >
                ⌘K
              </kbd>
            </Button>
          </>
        }
      />

      <WritingFilterBar
        categories={blogConfig.categories}
        activeCategory={category}
        onCategoryChange={setCategory}
        tags={tags}
        activeTag={tag}
        onTagChange={setTag}
        t={t}
      />

      {loading ? (
        <WritingRowSkeleton />
      ) : failed ? (
        <p className="py-8 text-sm text-muted">
          {t({ en: 'Unable to load posts.', zh: '文章加载失败。' })}
        </p>
      ) : (
        <WritingList groups={groups} t={t} />
      )}

      <SearchDialog open={searchOpen} posts={posts} onClose={() => setSearchOpen(false)} t={t} />
    </div>
  )
}
