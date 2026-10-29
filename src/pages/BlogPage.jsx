import blogConfig from '../content/blog.yaml'
import { useLanguage } from '../hooks/useLanguage'
import { useBlog } from '../components/blog/BlogProvider'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'
import WritingFilterBar from '../components/blog/WritingFilterBar'
import WritingList from '../components/blog/WritingList'
import WritingRowSkeleton from '../components/blog/WritingRowSkeleton'
import Button from '../components/site/Button'
import { RssIcon, SearchIcon } from '../components/site/icons'

export default function BlogPage() {
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

  return (
    <div className="slide-enter-content mx-auto w-full max-w-3xl lg:hidden">
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
            <Button variant="outline" onClick={openSearch}>
              <SearchIcon size={15} />
              {t({ en: 'Search', zh: '搜索' })}
              <kbd
                aria-hidden="true"
                className="rounded border border-line bg-subtle px-1 text-[10px] text-muted-strong"
              >
                ⌘K
              </kbd>
            </Button>
          </>
        }
      />

      <WritingFilterBar
        className="mb-4"
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
        <WritingList
          posts={filtered}
          resetKey={`${lang}:${category}:${tag ?? 'all'}`}
          t={t}
        />
      )}
    </div>
  )
}
