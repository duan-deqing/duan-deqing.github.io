import projectsConfig from '@content/pages/projects.yaml'
import { useLanguage } from '../hooks/useLanguage'
import CenteredPageHeading from '../components/site/CenteredPageHeading'
import CategoryHeading from '../components/site/CategoryHeading'
import PageTitle from '../components/shared/PageTitle'
import ProjectGrid from '../components/projects/ProjectGrid'
import QuietActionLink from '../components/site/QuietActionLink'
import QuoteFooter from '../components/site/QuoteFooter'
import { resolveButtonIcon } from '../utils/projectIcon'

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
  const categories = projectsConfig.categories || []
  const buttons = projectsConfig.buttons || []
  const githubButton = buttons.find((button) => button.name?.toLowerCase() === 'github')
  const githubUrl = githubButton?.link || 'https://github.com/duan-deqing'
  const categoryIds = new Set(categories.map((category) => category.id))
  const groups = categories
    .map((category) => ({
      ...category,
      projects: projects.filter((project) => project.category === category.id),
    }))
    .filter((group) => group.projects.length)
  const uncategorized = projects.filter((project) => !categoryIds.has(project.category))

  if (uncategorized.length) {
    groups.push({
      id: 'other',
      label: { en: 'Other', zh: '其他' },
      projects: uncategorized,
    })
  }

  return (
    <div className="slide-enter-content mx-auto w-full">
      <PageTitle
        title={`STYLAN · ${t(page.title || FALLBACK_TITLE)}`}
        description={t(page.description || FALLBACK_DESCRIPTION)}
        t={t}
        lang={lang}
      />
      <CenteredPageHeading
        title={t(page.title || FALLBACK_TITLE)}
        description={t(page.intro || FALLBACK_INTRO)}
        actions={
          buttons.length
            ? buttons.map((button) => (
                <QuietActionLink
                  key={button.name}
                  href={button.link}
                  logo={resolveButtonIcon(button.logo)}
                  color={button.color}
                >
                  {button.name}
                </QuietActionLink>
              ))
            : null
        }
      />
      {groups.length ? (
        <div>
          {groups.map((group, index) => (
            <section key={group.id} aria-labelledby={`project-category-${group.id}`}>
              <CategoryHeading
                id={`project-category-${group.id}`}
                label={t(group.label)}
                index={index}
              />
              <ProjectGrid projects={group.projects} />
            </section>
          ))}
        </div>
      ) : (
        <ProjectGrid projects={projects} />
      )}
      <QuoteFooter
        action={
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted opacity-60 transition-opacity hover:opacity-100"
          >
            {t({ en: 'All projects on GitHub', zh: '在 GitHub 查看全部项目' })}
          </a>
        }
      />
    </div>
  )
}
