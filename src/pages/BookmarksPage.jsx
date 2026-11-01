import bookmarksConfig from '@content/bookmarks/bookmarks.yaml'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/ui/PageTitle'
import CenteredPageHeading from '../components/ui/CenteredPageHeading'
import QuoteFooter from '../components/layout/QuoteFooter'
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
      <CenteredPageHeading title={t(page.title)} description={t(page.subtitle)} />
      <BookmarkCategoryList />
      <QuoteFooter />
    </div>
  )
}
