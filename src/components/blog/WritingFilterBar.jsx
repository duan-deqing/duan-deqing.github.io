import { cn } from '../../utils/cn'

const BASE = 'rounded-md px-2.5 py-1 text-sm transition-colors'

export default function WritingFilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  tags,
  activeTag,
  onTagChange,
  t,
}) {
  return (
    <div className="mb-6 space-y-3">
      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label={t({ en: 'Filter by category', zh: '按分类筛选' })}
      >
        {categories.map((category) => {
          const active = activeCategory === category.id
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={active}
              className={cn(
                BASE,
                active
                  ? 'bg-active text-active-fg'
                  : 'text-muted-strong hover:bg-hover hover:text-ink'
              )}
              onClick={() => onCategoryChange(category.id)}
            >
              {t(category.label)}
            </button>
          )
        })}
      </div>

      {tags.length ? (
        <div
          className="flex flex-wrap gap-x-3 gap-y-1"
          role="group"
          aria-label={t({ en: 'Filter by tag', zh: '按标签筛选' })}
        >
          {tags.map((tag) => {
            const active = activeTag === tag
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                className={cn(
                  'inline-flex min-h-6 items-center text-xs transition-colors',
                  active ? 'text-ink underline underline-offset-4' : 'text-muted hover:text-ink'
                )}
                onClick={() => onTagChange(active ? null : tag)}
              >
                {tag}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
