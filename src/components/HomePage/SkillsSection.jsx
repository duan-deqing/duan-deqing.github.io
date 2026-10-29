import config from '../../content/site.yaml'

export default function SkillsSection({ t }) {
  const groups = (config.skills || []).filter(
    (group) => !/hobbies/i.test(group.category?.en || String(group.category || ''))
  )

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <div key={t(group.category)}>
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.1em] text-accent">
            {t(group.category)}
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {(group.items || []).map((item) => (
              <li key={item} className="tag-chip">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
