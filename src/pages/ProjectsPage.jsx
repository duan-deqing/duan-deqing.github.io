import config from '../content/site.yaml'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'
import ProjectTable from '../components/projects/ProjectTable'
import Button from '../components/site/Button'
import { ArrowUpRightIcon } from '../components/site/icons'

export default function ProjectsPage() {
  const { lang, t } = useLanguage()
  const projects = config.projects || []

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageTitle
        title={`STYLAN · ${t({ en: 'Projects', zh: '项目' })}`}
        description={t({
          en: 'Projects I build and maintain — AI agents, writing tools and small products.',
          zh: '我构建与维护的项目：AI Agent、写作工具与小产品。',
        })}
        t={t}
        lang={lang}
      />
      <PageHeading
        title={t({ en: 'Projects', zh: '项目' })}
        description={t({
          en: 'A selection of things I have built or maintained.',
          zh: '我构建或维护过的一部分作品。',
        })}
        actions={
          <Button
            as="a"
            variant="outline"
            href="https://github.com/duan-deqing"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
            <ArrowUpRightIcon size={14} />
          </Button>
        }
      />
      <ProjectTable projects={projects} />
    </div>
  )
}
