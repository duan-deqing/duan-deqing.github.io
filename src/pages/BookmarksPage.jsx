import bookmarksConfig from '../content/bookmarks.yaml'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'
import BookmarkCategoryList from '../components/bookmarks/BookmarkCategoryList'

export default function BookmarksPage() {
  const { lang, t } = useLanguage()
  const page = bookmarksConfig.page || {}

  return (
    <div className="slide-enter-content mx-auto w-full max-w-3xl lg:hidden">
      <PageTitle
        title={`STYLAN · ${t(page.title)}`}
        description={t(page.subtitle)}
        t={t}
        lang={lang}
      />
      <PageHeading title={t(page.title)} description={t(page.subtitle)} />
      <div className="bookmarks-mobile-list">
        <BookmarkCategoryList />
      </div>
    </div>
  )
}
