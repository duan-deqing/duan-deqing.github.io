/**
 * Skills — 04 技能摘要（与 /skills 子页卡片一致）
 */

import { Link } from 'react-router-dom'
import config from '../../config'
import SectionKicker from '../shared/SectionKicker'
import ArrowIcon from '../shared/ArrowIcon'

export default function Skills({ t }) {
  const skills = config.skills || []

  return (
    <section className="py-14 sm:py-16 border-t border-line">
      <div className="section-inner">
        <SectionKicker num="04" en="SKILLS" zh="技能" t={t} id="skills" />

        <div className="mb-8 sm:mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] font-semibold text-ink tracking-[-0.02em] leading-[1.15]">
            {t({ en: 'Skills & Technologies', zh: '技能与技术' })}
          </h2>
          <Link
            to="/skills"
            className="font-mono-ui text-[11px] tracking-[0.1em] uppercase text-muted hover:text-accent transition-colors inline-flex items-center gap-1.5"
          >
            {t({ en: 'Details', zh: '详情' })}
            <ArrowIcon direction="right" size={12} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {skills.map((group) => (
            <div key={t(group.category)} className="soft-card p-6 sm:p-7">
              <p
                className="font-mono-ui text-[11px] tracking-[0.12em] uppercase mb-5"
                style={{ color: 'var(--accent)' }}
              >
                {t(group.category)}
              </p>
              <ul className="space-y-2.5">
                {(group.items || []).map((item) => (
                  <li
                    key={item}
                    className="font-display text-[15px] sm:text-base text-ink border-b border-line pb-2.5 last:border-0 last:pb-0 tracking-tight"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
