import projectsConfig from '@content/pages/projects.yaml'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'
import ProjectTable from '../components/projects/ProjectTable'
import Button from '../components/site/Button'
import { ArrowUpRightIcon } from '../components/site/icons'

const FALLBACK_TITLE = { en: 'Projects', zh: '项目' }
const FALLBACK_DESCRIPTION = {
  en: 'Projects I build and maintain — AI agents, writing tools and small products.',
  zh: '我构建与维护的项目：AI Agent、写作工具与小产品。',
}
const FALLBACK_INTRO = {
  en: 'A selection of things I have built or maintained.',
  zh: '我构建或维护过的一部分作品。',
}

export default function ProjectsPage() {
  const { lang, t } = useLanguage()
  const page = projectsConfig.page || {}
  const projects = projectsConfig.projects || []

  return (
    <div className="slide-enter-content mx-auto w-full max-w-3xl">
      <PageTitle
        title={`STYLAN · ${t(page.title || FALLBACK_TITLE)}`}
        description={t(page.description || FALLBACK_DESCRIPTION)}
        t={t}
        lang={lang}
      />
      <PageHeading
        title={t(page.title || FALLBACK_TITLE)}
        description={t(page.intro || FALLBACK_INTRO)}
        actions={
          <Button
            as="a"
            variant="outline"
            href={page.githubUrl || 'https://github.com/duan-deqing'}
            target="_blank"
            rel="noopener noreferrer"
          >
            {page.githubLabel || 'GitHub'}
            <ArrowUpRightIcon size={14} />
          </Button>
        }
      />
      <ProjectTable projects={projects} />
    </div>
  )
}
