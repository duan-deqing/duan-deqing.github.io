import config from '../content/site.yaml'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'

export default function SkillsPage() {
  const { lang, t } = useLanguage()
  const groups = config.skills || []

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageTitle
        title={`STYLAN · ${t({ en: 'Skills', zh: '技能' })}`}
        description={t({
          en: 'The tools and technologies I use to build AI products.',
          zh: '我用来构建 AI 产品的工具与技术。',
        })}
        t={t}
        lang={lang}
      />
      <PageHeading
        title={t({ en: 'Skills', zh: '技能' })}
        description={t({
          en: 'Tools I reach for when building and shipping.',
          zh: '构建与交付时常用的工具。',
        })}
      />

      <div className="border-t border-line">
        {groups.map((group) => (
          <section
            key={t(group.category)}
            className="grid gap-2 border-b border-line py-5 md:grid-cols-[160px_1fr] md:gap-6"
          >
            <h2 className="text-sm font-medium text-heading">{t(group.category)}</h2>
            <p className="text-sm leading-relaxed text-muted">
              {(group.items || []).join(' · ')}
            </p>
          </section>
        ))}
      </div>
    </div>
  )
}
