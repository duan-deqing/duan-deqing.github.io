export default function SkillGroups({
  groups,
  t,
  columns = 'home',
  headingLevel = 3,
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  const gridClass =
    columns === 'page'
      ? 'grid gap-8 sm:grid-cols-2 xl:grid-cols-3'
      : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={gridClass}>
      {(groups || []).map((group) => {
        const key = group.category?.en || String(t(group.category))
        const labelId = `skills-${key.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

        return (
          <div key={key}>
            <Heading
              id={labelId}
              className="font-mono-ui text-[11px] uppercase tracking-[0.1em] text-accent"
            >
              {t(group.category)}
            </Heading>
            <ul aria-labelledby={labelId} className="mt-3 flex flex-wrap gap-1.5">
              {(group.items || []).map((item) => (
                <li key={item} className="tag-chip">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
