import { useId } from 'react'
import { cn } from '../../utils/cn'
import { ChevronDownIcon } from '../site/icons'

const SELECT_CLASS =
  'h-9 w-full min-w-0 appearance-none rounded-md border border-line bg-page pl-2.5 pr-8 text-xs text-ink transition-colors hover:border-line-strong'

function FilterSelect({ id, name, label, value, onChange, options }) {
  return (
    <span className="relative min-w-0 flex-1">
      <select
        id={id}
        name={name}
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={SELECT_CLASS}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        size={13}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
      />
    </span>
  )
}

export default function WritingFilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  tags,
  activeTag,
  onTagChange,
  t,
  className,
}) {
  const uid = useId()
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label:
      category.id === 'all'
        ? t({ en: 'All categories', zh: '全部分类' })
        : t(category.label),
  }))

  const tagOptions = [
    { value: 'all', label: t({ en: 'All tags', zh: '全部标签' }) },
    ...tags.map((tag) => ({ value: tag, label: tag })),
  ]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <FilterSelect
        id={`${uid}-category`}
        name="category"
        label={t({ en: 'Filter by category', zh: '按分类筛选' })}
        value={activeCategory}
        onChange={onCategoryChange}
        options={categoryOptions}
      />
      <FilterSelect
        id={`${uid}-tag`}
        name="tag"
        label={t({ en: 'Filter by tag', zh: '按标签筛选' })}
        value={activeTag ?? 'all'}
        onChange={(value) => onTagChange(value === 'all' ? null : value)}
        options={tagOptions}
      />
    </div>
  )
}
