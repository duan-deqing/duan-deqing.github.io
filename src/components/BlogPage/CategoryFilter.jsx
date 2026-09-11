/**
 * CategoryFilter — 分类胶囊筛选
 */

export default function CategoryFilter({ categories, activeCategory, onCategoryChange, t }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const active = activeCategory === category.id
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.id)}
            className={`tag-chip tag-chip-lg ${active ? 'is-active' : ''}`}
            aria-pressed={active}
          >
            {t(category.label)}
          </button>
        )
      })}
    </div>
  )
}
