/**
 * ProjectsPage — 编号项目列表
 */

import { useLanguage } from '../hooks/useLanguage'
import SubPageShell from '../components/shared/SubPageShell'
import ArrowIcon from '../components/shared/ArrowIcon'
import config from '../config'

function ProjectsPage() {
  const { lang, t } = useLanguage()
  const projects = (config.projects || []).filter(
    (p) => !String(p.title?.en || '').includes('<')
  )

  return (
    <SubPageShell
      title={t({ en: 'STYLAN · Projects', zh: 'STYLAN · 项目' })}
      t={t}
      lang={lang}
    >
      <section className="pt-8 pb-10 border-b border-line bg-grid -mx-6 lg:-mx-10 px-6 lg:px-10">
        <p className="section-kicker mb-6">
          <span className="num">02</span>
          <span>SELECTED WORK</span>
          <span className="opacity-60">/ {t({ en: '', zh: '精选项目' })}</span>
        </p>
        <h1
          className="font-display font-semibold text-ink leading-[1.05] tracking-tight"
          style={{ fontSize: 'clamp(2.25rem, 6vw, 4rem)' }}
        >
          {t(config.projectsSection?.title) || t({ en: 'Featured Projects', zh: '精选项目' })}
        </h1>
      </section>

      <section className="py-8 flex-grow">
        <div className="border-t border-line row-link-list">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.link}
              target={project.link?.startsWith('http') ? '_blank' : undefined}
              rel={project.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="row-link"
            >
              <span className="row-num">{String(index + 1).padStart(2, '0')}</span>
              <span>
                <span className="row-title block">{t(project.title)}</span>
                <span className="block mt-2 text-sm text-muted max-w-2xl leading-relaxed">
                  {t(project.description)}
                </span>
                <span className="mt-3 flex flex-wrap gap-2">
                  {(project.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="font-mono-ui text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border border-line text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              </span>
              <span className="row-meta inline-flex items-center justify-end">
                <ArrowIcon direction="up-right" size={16} />
              </span>
            </a>
          ))}
        </div>
      </section>

    </SubPageShell>
  )
}

export default ProjectsPage
