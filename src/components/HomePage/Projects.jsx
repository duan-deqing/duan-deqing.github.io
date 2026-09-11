/**
 * Projects — 02 精选项目
 */

import config from '../../config'
import SectionKicker from '../shared/SectionKicker'
import ArrowIcon from '../shared/ArrowIcon'
import TransitionLink from '../shared/TransitionLink'

export default function Projects({ t }) {
  const projects = (config.projects || []).filter(
    (project) => !String(project.title?.en || '').includes('<')
  )

  return (
    <section className="py-14 sm:py-16 border-t border-line">
      <div className="section-inner">
        <SectionKicker num="02" en="SELECTED WORK" zh="精选项目" t={t} id="work" />

        <div className="mb-8 sm:mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] font-semibold text-ink tracking-[-0.02em] leading-[1.15]">
            {t(config.projectsSection?.title) ||
              t({ en: 'Featured projects', zh: '精选项目' })}
          </h2>
          <TransitionLink
            to="/projects"
            className="font-mono-ui text-[11px] tracking-[0.1em] uppercase text-muted hover:text-accent transition-colors inline-flex items-center gap-1.5"
          >
            {t({ en: 'All projects', zh: '全部项目' })}
            <ArrowIcon direction="right" size={12} />
          </TransitionLink>
        </div>

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
                <span className="block mt-2.5 text-sm text-muted max-w-3xl leading-[1.7]">
                  {t(project.description)}
                </span>
                <span className="mt-3.5 flex flex-wrap gap-1.5">
                  {(project.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="font-mono-ui text-[10px] uppercase tracking-[0.06em] px-2 py-0.5 rounded-sm border border-line text-muted"
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
      </div>
    </section>
  )
}
