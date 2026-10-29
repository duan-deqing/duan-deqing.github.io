import { useLanguage } from '../hooks/useLanguage'
import config from '../content/site.yaml'
import PageTitle from '../components/shared/PageTitle'
import PageHeader from '../components/shared/PageHeader'
import ProjectGrid from '../components/HomePage/ProjectGrid'

export default function ProjectsPage() {
  const { lang, t } = useLanguage()

  return (
    <>
      <PageTitle
        title={t({ en: 'STYLAN · Projects', zh: 'STYLAN · 项目' })}
        description={t(config.site?.description)}
        t={t}
        lang={lang}
      />
      <PageHeader
        kicker="WORK"
        title={t(config.projectsSection?.title) || t({ en: 'Featured Projects', zh: '精选项目' })}
        description={t({
          en: 'Selected work across LLM applications, RAG systems and full-stack delivery.',
          zh: '大模型应用、RAG 系统与全栈交付的精选作品。',
        })}
      />
      <section className="py-10 sm:py-12">
        <ProjectGrid projects={config.projects || []} t={t} />
      </section>
    </>
  )
}
