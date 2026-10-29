import { useLocation } from 'react-router-dom'
import blogConfig from '../../content/blog.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import { useBlog } from './BlogProvider'
import RssButton from './RssButton'
import SearchTrigger from './SearchTrigger'
import WritingFilterBar from './WritingFilterBar'
import WritingList from './WritingList'
import WritingRowSkeleton from './WritingRowSkeleton'

export default function WritingRail() {
  const { pathname } = useLocation()
  const { lang, t } = useLanguage()
  const {
    filtered,
    tags,
    loading,
    failed,
    category,
    setCategory,
    tag,
    setTag,
    openSearch,
  } = useBlog()
  const activeSlug = pathname.startsWith('/blog/')
    ? decodeURIComponent(pathname.slice('/blog/'.length))
    : null

  return (
    <aside className="hidden shrink-0 border-r border-line bg-sidebar lg:flex lg:w-80 lg:flex-col lg:min-h-0 xl:w-96">
      <div className="border-b border-line px-5 py-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold tracking-tight text-heading">
            {t(blogConfig.page.title)}
          </span>
          <RssButton />
        </div>
        <SearchTrigger className="mt-2" onClick={openSearch} />
        <WritingFilterBar
          className="mt-2"
          categories={blogConfig.categories}
          activeCategory={category}
          onCategoryChange={setCategory}
          tags={tags}
          activeTag={tag}
          onTagChange={setTag}
          t={t}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {loading ? (
          <WritingRowSkeleton rows={8} />
        ) : failed ? (
          <p className="px-2 py-6 text-sm text-muted">
            {t({ en: 'Unable to load posts.', zh: '文章加载失败。' })}
          </p>
        ) : (
          <WritingList
            posts={filtered}
            activeSlug={activeSlug}
            resetKey={`${lang}:${category}:${tag ?? 'all'}`}
            t={t}
          />
        )}
      </div>
    </aside>
  )
}
