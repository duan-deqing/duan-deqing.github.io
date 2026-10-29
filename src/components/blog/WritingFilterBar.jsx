import { ChevronDownIcon } from '../site/icons'

const SELECT_CLASS =
  'h-9 appearance-none rounded-md border border-line bg-page pl-3 pr-9 text-sm text-ink transition-colors hover:border-line-strong'

function FilterSelect({ id, name, label, value, onChange, options }) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-muted">
      <span>{label}</span>
      <span className="relative inline-flex items-center">
        <select
          id={id}
          name={name}
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
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
        />
      </span>
    </label>
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
}) {
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
    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
      <FilterSelect
        id="blog-category-filter"
        name="category"
        label={t({ en: 'Category', zh: '分类' })}
        value={activeCategory}
        onChange={onCategoryChange}
        options={categoryOptions}
      />
      <FilterSelect
        id="blog-tag-filter"
        name="tag"
        label={t({ en: 'Tag', zh: '标签' })}
        value={activeTag ?? 'all'}
        onChange={(value) => onTagChange(value === 'all' ? null : value)}
        options={tagOptions}
      />
    </div>
  )
}
