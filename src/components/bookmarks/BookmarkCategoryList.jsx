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
    <ul className="flex flex-col gap-1 text-sm">
      {bookmarkCategories.map((category, index) => {
        const active = activeSlug === category.slug
        const count = category.bookmarks?.length || 0
        return (
          <li
            key={category.slug}
            className="writing-card-enter"
            style={{ '--card-index': Math.min(index, 12) }}
          >
            <Link
              to={`/bookmarks/${category.slug}`}
              aria-current={active ? 'page' : undefined}
              onClick={onNavigate}
              className={cn(
                'flex flex-col gap-1 rounded-lg p-2 transition-colors duration-300',
                active ? 'bg-active text-active-fg' : 'hover:bg-hover'
              )}
            >
              <span className={cn('font-medium', active ? 'text-active-fg' : 'text-heading')}>
                {t(category.title)}
              </span>
              <span className={cn(active ? 'text-active-fg opacity-70' : 'text-muted')}>
                {countLabel(count, t)}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
