import bookmarksConfig from '@content/bookmarks/bookmarks.yaml'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/ui/PageTitle'
import PageContainer from '../components/layout/PageContainer'
import CenteredPageHeading from '../components/ui/CenteredPageHeading'
import QuoteFooter from '../components/layout/QuoteFooter'
import BookmarkCategoryList from '../components/bookmarks/BookmarkCategoryList'

export default function BookmarksPage() {
  const { lang, t } = useLanguage()
  const page = bookmarksConfig.page || {}

  return (
    <PageContainer className="lg:hidden">
      <PageTitle
        title={`STYLAN · ${t(page.title)}`}
        description={t(page.subtitle)}
        t={t}
        lang={lang}
      />
      <CenteredPageHeading title={t(page.title)} description={t(page.subtitle)} />
      <BookmarkCategoryList />
      <QuoteFooter />
    </PageContainer>
  )
}
