import { useLocation } from 'react-router-dom'
import bookmarksConfig from '@content/bookmarks/bookmarks.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import { bookmarkCategories } from '../../utils/bookmarks/bookmarks'
import SideRail from '../layout/SideRail'
import BookmarkCategoryList from './BookmarkCategoryList'

export default function BookmarksRail() {
  const { pathname } = useLocation()
  const { t } = useLanguage()
  const activeSlug = pathname.startsWith('/bookmarks/')
    ? decodeURIComponent(pathname.slice('/bookmarks/'.length))
    : null
  const total = bookmarkCategories.reduce(
    (sum, category) => sum + (category.bookmarks?.length || 0),
    0
  )

  return (
    <SideRail
      title={t(bookmarksConfig.page.title)}
      action={
        <span className="text-xs text-muted">
          {t(
            total === 1
              ? { en: '1 bookmark', zh: '1 个书签' }
              : { en: `${total} bookmarks`, zh: `${total} 个书签` }
          )}
        </span>
      }
    >
      <BookmarkCategoryList activeSlug={activeSlug} />
    </SideRail>
  )
}
