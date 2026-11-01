import { useLocation } from 'react-router-dom'
import blogConfig from '@content/blog/blog.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import SideRail from '../layout/SideRail'
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
    <SideRail
      title={t(blogConfig.page.title)}
      action={<RssButton />}
      header={
        <>
          <SearchTrigger onClick={openSearch} />
          <WritingFilterBar
            categories={blogConfig.categories}
            activeCategory={category}
            onCategoryChange={setCategory}
            tags={tags}
            activeTag={tag}
            onTagChange={setTag}
            t={t}
          />
        </>
      }
    >
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
    </SideRail>
  )
}
