import ArrowIcon from '../shared/ArrowIcon'

export default function ProjectCard({ project, t }) {
  const label = t(project.title)
  const href = project.link || project.repo
  const Tag = href ? 'a' : 'div'
  const external = href?.startsWith('http')

  return (
    <Tag
      href={href || undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group flex h-full flex-col rounded-[10px] border border-line bg-elevated p-5 transition-colors hover:border-ink/25"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-subtle text-lg"
          aria-hidden="true"
        >
          {project.icon || String(label).slice(0, 1)}
        </span>
        <h3 className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
          {label}
        </h3>
      </div>

      <p className="mt-3 line-clamp-3 text-[13px] leading-[1.7] text-muted">
        {t(project.description)}
      </p>

      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
        <ul className="flex flex-wrap gap-1.5">
          {(project.tags || []).map((tag) => (
            <li key={tag} className="tag-chip">
              {tag}
            </li>
          ))}
        </ul>
        {href ? (
          <ArrowIcon
            direction="up-right"
            size={14}
            className="shrink-0 text-muted transition-colors group-hover:text-accent"
          />
        ) : null}
      </div>
    </Tag>
  )
}
