import TagChip from '../shared/TagChip'

export default function CategoryFilter({ categories, activeCategory, onCategoryChange, t }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {categories.map((category) => {
        const active = activeCategory === category.id
        return (
          <TagChip
            key={category.id}
            as="button"
            type="button"
            active={active}
            aria-pressed={active}
            onClick={() => onCategoryChange(category.id)}
          >
            {t(category.label)}
          </TagChip>
        )
      })}
    </div>
  )
}
