import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { getAllPosts } from '../../utils/markdown'
import { collectTags, filterPosts } from '../../utils/blogFilters'
import SearchDialog from './SearchDialog'

const BlogContext = createContext(null)

export function BlogProvider({ children }) {
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
        console.error('[BlogProvider] Failed to load posts:', error)
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

  useEffect(() => {
    if (tag && !tags.includes(tag)) setTag(null)
  }, [tag, tags])

  const value = {
    posts,
    filtered,
    tags,
    loading,
    failed,
    category,
    setCategory,
    tag,
    setTag,
    openSearch: () => setSearchOpen(true),
  }

  return (
    <BlogContext.Provider value={value}>
      {children}
      <SearchDialog open={searchOpen} posts={posts} onClose={() => setSearchOpen(false)} t={t} />
    </BlogContext.Provider>
  )
}

export function useBlog() {
  const value = useContext(BlogContext)
  if (!value) throw new Error('useBlog must be used within BlogProvider')
  return value
}
