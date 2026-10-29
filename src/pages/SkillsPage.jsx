import { useLanguage } from '../hooks/useLanguage'
import config from '../content/site.yaml'
import PageTitle from '../components/shared/PageTitle'
import PageHeader from '../components/shared/PageHeader'
import SkillGroups from '../components/shared/SkillGroups'

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
      <section className="py-10 sm:py-12">
        <SkillGroups groups={config.skills || []} t={t} columns="page" headingLevel={2} />
      </section>
    </>
  )
}
