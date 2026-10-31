import blogConfig from '@content/pages/blog.yaml'
import { useLanguage } from '../hooks/useLanguage'
import { useBlog } from '../components/blog/BlogProvider'
import PageTitle from '../components/shared/PageTitle'
import CenteredPageHeading from '../components/site/CenteredPageHeading'
import QuietActionLink from '../components/site/QuietActionLink'
import { RssIcon } from '../components/site/icons'
import SearchTrigger from '../components/blog/SearchTrigger'
import WritingFilterBar from '../components/blog/WritingFilterBar'
import WritingTable from '../components/blog/WritingTable'
import WritingRowSkeleton from '../components/blog/WritingRowSkeleton'

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
      <CenteredPageHeading
        title={t(blogConfig.page.title)}
        description={t(blogConfig.page.subtitle)}
        actions={
          <QuietActionLink href="/rss.xml" external icon={RssIcon}>
            {t({ en: 'RSS feed', zh: 'RSS 订阅' })}
          </QuietActionLink>
        }
      />

      <SearchTrigger className="mb-3" onClick={openSearch} />

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
        <WritingTable posts={filtered} t={t} />
      )}
    </div>
  )
}
