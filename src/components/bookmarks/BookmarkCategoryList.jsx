import { useLanguage } from '../../hooks/useLanguage'
import { bookmarkCategories } from '../../utils/bookmarks'
import { getProjectInitial, resolveBookmarkCategoryIcon } from '../../utils/projectIcon'
import ProjectLinkCard from '../shared/ProjectLinkCard'

function countLabel(count, t) {
  return t(
    count === 1
      ? { en: '1 bookmark', zh: '1 个书签' }
      : { en: `${count} bookmarks`, zh: `${count} 个书签` }
  )
}

export default function BookmarkCategoryList({ activeSlug = null }) {
  const { t } = useLanguage()

  if (!bookmarkCategories.length) {
    return (
      <p className="px-2 py-6 text-sm text-muted">
        {t({ en: 'No collections yet.', zh: '还没有书签分类。' })}
      </p>
    )
  }

  return (
    <div className="project-cards-grid bookmark-category-grid">
      {bookmarkCategories.map((category, index) => (
        <div
          key={category.slug}
          className="writing-card-enter"
          style={{ '--card-index': Math.min(index, 12) }}
        >
          <ProjectLinkCard
            to={`/bookmarks/${category.slug}`}
            title={t(category.title)}
            description={countLabel(category.bookmarks?.length || 0, t)}
            icon={resolveBookmarkCategoryIcon(category.icon)}
            iconFallback={getProjectInitial(category.title)}
            active={activeSlug === category.slug}
            compact
          />
        </div>
      ))}
    </div>
  )
}
