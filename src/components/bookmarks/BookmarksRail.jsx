import { useLocation } from 'react-router-dom'
import bookmarksConfig from '@content/pages/bookmarks.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import { bookmarkCategories } from '../../utils/bookmarks'
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
    <aside className="hidden shrink-0 border-r border-line bg-sidebar lg:flex lg:w-80 lg:flex-col lg:min-h-0 xl:w-96">
      <div className="border-b border-line px-5 py-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold tracking-tight text-heading">
            {t(bookmarksConfig.page.title)}
          </span>
          <span className="text-xs text-muted">
            {t(
              total === 1
                ? { en: '1 bookmark', zh: '1 个书签' }
                : { en: `${total} bookmarks`, zh: `${total} 个书签` }
            )}
          </span>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <BookmarkCategoryList activeSlug={activeSlug} />
      </div>
    </aside>
  )
}
