import { Link, useParams } from 'react-router-dom'
import bookmarksConfig from '../content/bookmarks.yaml'
import { useLanguage } from '../hooks/useLanguage'
import { getBookmarkCategory } from '../utils/bookmarks'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'
import BookmarkGrid from '../components/bookmarks/BookmarkGrid'
import { ArrowUpRightIcon } from '../components/site/icons'

export default function BookmarkCategoryPage() {
  const { slug } = useParams()
  const { lang, t } = useLanguage()
  const page = bookmarksConfig.page || {}
  const category = getBookmarkCategory(slug)

  if (!category) {
    return (
      <div className="bookmarks-page">
        <PageTitle
          title={`STYLAN · ${t(page.title)}`}
          description={t(page.subtitle)}
          t={t}
          lang={lang}
        />
        <PageHeading title={t({ en: 'Collection not found', zh: '未找到书签分类' })} />
        <p className="text-sm text-muted">
          {t({
            en: 'This collection does not exist or has been removed.',
            zh: '这个分类不存在，或已经被移除。',
          })}
        </p>
        <Link to="/bookmarks" className="link mt-6 inline-block text-sm">
          {t({ en: 'Back to bookmarks', zh: '返回书签' })}
        </Link>
      </div>
    )
  }

  return (
    <div className="bookmarks-page">
      <PageTitle
        title={`STYLAN · ${t(page.title)} · ${t(category.title)}`}
        description={t(page.subtitle)}
        t={t}
        lang={lang}
      />

      <Link
        to="/bookmarks"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-strong transition-colors hover:text-ink lg:hidden"
      >
        <ArrowUpRightIcon size={14} className="rotate-180" />
        {t(page.title)}
      </Link>

      <PageHeading title={t(category.title)} />
      <BookmarkGrid bookmarks={category.bookmarks || []} />
    </div>
  )
}
