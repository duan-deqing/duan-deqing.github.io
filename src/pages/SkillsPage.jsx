import { useLanguage } from '../hooks/useLanguage'
import config from '../content/site.yaml'
import PageTitle from '../components/shared/PageTitle'
import PageHeader from '../components/shared/PageHeader'

export default function SkillsPage() {
  const { lang, t } = useLanguage()

  return (
    <>
      <PageTitle
        title={t({ en: 'STYLAN · Skills', zh: 'STYLAN · 技能与技术' })}
        description={t({ en: 'Technologies and tools I work with.', zh: '我使用的技术与工具。' })}
        t={t}
        lang={lang}
      />
      <PageHeader
        kicker="SKILLS"
        title={t({ en: 'Skills & Technologies', zh: '技能与技术' })}
        description={t({
          en: 'Technologies and tools I work with.',
          zh: '我使用的技术与工具。',
        })}
      />
      <section className="grid gap-8 py-10 sm:grid-cols-2 sm:py-12 xl:grid-cols-3">
        {(config.skills || []).map((group) => (
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
      </section>
    </>
  )
}
