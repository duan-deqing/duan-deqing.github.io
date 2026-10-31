import { useParams } from 'react-router-dom'
import bookmarksConfig from '@content/pages/bookmarks.yaml'
import { useLanguage } from '../hooks/useLanguage'
import { getBookmarkCategory } from '../utils/bookmarks'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'
import CenteredPageHeading from '../components/site/CenteredPageHeading'
import ParentLink from '../components/site/ParentLink'
import QuoteFooter from '../components/site/QuoteFooter'
import BookmarkGrid from '../components/bookmarks/BookmarkGrid'

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
        <ParentLink
          to="/bookmarks"
          label={t({ en: 'Back to bookmarks', zh: '返回书签' })}
          className="mt-6"
        />
      </div>
    )
  }

  return (
    <div className="bookmarks-page content-cards-page">
      <PageTitle
        title={`STYLAN · ${t(page.title)} · ${t(category.title)}`}
        description={t(category.description || page.subtitle)}
        t={t}
        lang={lang}
      />

      <ParentLink
        to="/bookmarks"
        label={t({ en: 'Back to bookmarks', zh: '返回书签' })}
        className="mb-4 lg:hidden"
      />

      <CenteredPageHeading
        title={t(category.title)}
        description={t(category.description || page.subtitle)}
      />
      <BookmarkGrid bookmarks={category.bookmarks || []} />
      <QuoteFooter />
    </div>
  )
}
