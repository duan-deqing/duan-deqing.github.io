import { useLanguage } from '../../hooks/useLanguage'
import { ArrowUpRightIcon } from '../site/icons'

function projectUrl(project) {
  return project.link || project.repo || null
}

function projectKey(project, t) {
  return project.link || project.repo || project.icon || t(project.title)
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
              <th scope="col" className="px-4 py-3 font-normal">
                Project
              </th>
              <th scope="col" className="px-4 py-3 font-normal">
                Stack
              </th>
              <th scope="col" className="w-24 px-4 py-3 text-right font-normal">
                Link
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const url = projectUrl(project)
              const title = t(project.title)
              return (
                <tr
                  key={projectKey(project, t)}
                  className="border-b border-line transition-colors last:border-0 hover:bg-subtle/50"
                >
                  <th scope="row" className="px-4 py-3 text-left font-medium text-heading">
                    <span className="flex items-center gap-2">
                      <ProjectIcon project={project} />
                      <span>{title}</span>
                    </span>
                  </th>
                  <td className="px-4 py-3 text-muted">{(project.tags || []).join(' · ')}</td>
                  <td className="px-4 py-3 text-right">
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-accent hover:underline"
                        aria-label={t({ en: `Visit ${title}`, zh: `访问 ${title}` })}
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
          const title = t(project.title)
          return (
            <article
              key={projectKey(project, t)}
              className="rounded-lg border border-line p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="flex items-center gap-2 font-medium text-heading">
                  <ProjectIcon project={project} />
                  {title}
                </h2>
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-m-1 rounded p-1 text-accent"
                    aria-label={t({ en: `Visit ${title}`, zh: `访问 ${title}` })}
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
