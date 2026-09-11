/**
 * SkillsPage — 技能全览
 */

import { useLanguage } from '../hooks/useLanguage'
import SubPageShell from '../components/shared/SubPageShell'
import config from '../config'

function SkillsPage() {
  const { lang, t } = useLanguage()

  return (
    <SubPageShell
      title={t({ en: 'STYLAN · Skills', zh: 'STYLAN · 技能与技术' })}
      t={t}
      lang={lang}
    >
      <section className="pt-8 pb-10 border-b border-line bg-grid -mx-6 lg:-mx-10 px-6 lg:px-10">
        <p className="section-kicker mb-6">
          <span className="num">04</span>
          <span>SKILLS</span>
          <span className="opacity-60">/ {t({ en: '', zh: '技能' })}</span>
        </p>
        <h1
          className="font-display font-semibold text-ink leading-[1.05] tracking-tight"
          style={{ fontSize: 'clamp(2.25rem, 6vw, 4rem)' }}
        >
          {t({ en: 'Skills & Technologies', zh: '技能与技术' })}
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          {t({
            en: 'Technologies and tools I work with.',
            zh: '我使用的技术与工具。',
          })}
        </p>
      </section>

      <section className="py-10 flex-grow">
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {config.skills.map((group) => (
            <div key={t(group.category)} className="soft-card p-6 sm:p-8">
              <p className="font-mono-ui text-[11px] tracking-[0.12em] uppercase mb-5" style={{ color: 'var(--accent)' }}>
                {t(group.category)}
              </p>
              <ul className="space-y-2.5">
                {(group.items || []).map((item) => (
                  <li key={item} className="font-display text-lg text-ink border-b border-line pb-2.5 last:border-0">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

    </SubPageShell>
  )
}

export default SkillsPage
