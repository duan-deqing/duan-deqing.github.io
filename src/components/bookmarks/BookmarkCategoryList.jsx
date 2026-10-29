import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { bookmarkCategories } from '../../utils/bookmarks'
import { cn } from '../../utils/cn'

function countLabel(count, t) {
  return t(
    count === 1
      ? { en: '1 bookmark', zh: '1 个书签' }
      : { en: `${count} bookmarks`, zh: `${count} 个书签` }
  )
}

export default function BookmarkCategoryList({ activeSlug = null, onNavigate }) {
  const { t } = useLanguage()

  if (!bookmarkCategories.length) {
    return (
      <p className="px-2 py-6 text-sm text-muted">
        {t({ en: 'No collections yet.', zh: '还没有书签分类。' })}
      </p>
    )
  }

  return (
    <ul className="bookmarks-nav">
      {bookmarkCategories.map((category) => {
        const active = activeSlug === category.slug
        const count = category.bookmarks?.length || 0
        return (
          <li key={category.slug}>
            <Link
              to={`/bookmarks/${category.slug}`}
              aria-current={active ? 'page' : undefined}
              onClick={onNavigate}
              className={cn('bookmark-category', active && 'is-active')}
            >
              <span className="bookmark-category-title">{t(category.title)}</span>
              <span className="bookmark-category-count">{countLabel(count, t)}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
