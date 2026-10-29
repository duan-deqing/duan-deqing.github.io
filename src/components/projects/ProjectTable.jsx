import { useLanguage } from '../../hooks/useLanguage'
import { ArrowUpRightIcon } from '../site/icons'

function projectUrl(project) {
  return project.link || project.repo || null
}

function ProjectIcon({ project }) {
  return (
    <span className="grid size-6 shrink-0 place-items-center text-base" aria-hidden="true">
      {project.icon || '•'}
    </span>
  )
}

export default function ProjectTable({ projects }) {
  const { t } = useLanguage()

  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border border-line md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="px-4 py-3 font-normal">Project</th>
              <th className="px-4 py-3 font-normal">Stack</th>
              <th className="w-24 px-4 py-3 text-right font-normal">Link</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const url = projectUrl(project)
              return (
                <tr
                  key={t(project.title)}
                  className="border-b border-line transition-colors last:border-0 hover:bg-subtle/50"
                >
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <ProjectIcon project={project} />
                      <span className="font-medium text-heading">{t(project.title)}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{(project.tags || []).join(' · ')}</td>
                  <td className="px-4 py-3 text-right">
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-accent hover:underline"
                      >
                        Visit
                        <ArrowUpRightIcon size={13} />
                      </a>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {projects.map((project) => {
          const url = projectUrl(project)
          return (
            <article key={t(project.title)} className="rounded-lg border border-line p-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="flex items-center gap-2 font-medium text-heading">
                  <ProjectIcon project={project} />
                  {t(project.title)}
                </h2>
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent"
                    aria-label={`${t(project.title)} link`}
                  >
                    <ArrowUpRightIcon size={16} />
                  </a>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t(project.description)}</p>
              <p className="mt-3 text-xs text-muted">{(project.tags || []).join(' · ')}</p>
            </article>
          )
        })}
      </div>
    </>
  )
}
