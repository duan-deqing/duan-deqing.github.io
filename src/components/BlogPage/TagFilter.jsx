import TagChip from '../shared/TagChip'

export default function TagFilter({ tags, activeTag, onTagChange, t }) {
  if (!tags?.length) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 font-mono-ui text-[10px] uppercase tracking-[0.1em] text-muted">
        {t({ en: 'Tags', zh: '标签' })}
      </span>
      {tags.map((tag) => {
        const active = activeTag === tag
        return (
          <TagChip
            key={tag}
            as="button"
            type="button"
            active={active}
            aria-pressed={active}
            onClick={() => onTagChange(active ? null : tag)}
          >
            {tag}
          </TagChip>
        )
      })}
    </div>
  )
}
