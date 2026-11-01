import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import projectsConfig from '@content/projects/projects.yaml'
import stackConfig from '@content/stack/stack.yaml'
import { useLanguage } from '../hooks/useLanguage'
import { getProjectDetail, hasProjectDetail } from '../utils/projectDetail'
import { extractHeadings } from '../utils/markdownHeading'
import { getProjectInitial, resolveIcon, resolveIconEntry } from '../utils/icons'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'
import ParentLink from '../components/site/ParentLink'
import QuietActionLink, { QUIET_ACTION_PILL } from '../components/site/QuietActionLink'
import QuoteFooter from '../components/site/QuoteFooter'
import { ProjectIcon } from '../components/shared/ProjectLinkCard'
import TableOfContents from '../components/BlogPage/TableOfContents'
import BlogMarkdown from '../components/blog/BlogMarkdown'
import { ArrowUpRightIcon, GitHubIcon } from '../components/site/icons'
import '../styles/math.css'
import '../styles/markdown-extras.css'
import '../styles/blog-post.css'

const TAG_BUTTONS = new Map(
  [...(stackConfig.buttons || []), ...(stackConfig.tags || [])]
    .map((button) => {
      const entry = resolveIconEntry(button.logo)
      if (!entry?.link) return null
      return [
        button.name.toLowerCase(),
        { name: button.name, link: entry.link, logo: entry.src, color: entry.color },
      ]
    })
    .filter(Boolean)
)

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const { lang, t } = useLanguage()
  const projects = projectsConfig.projects || []
  const project = projects.find((item) => item.slug === slug)
  const detailAvailable = Boolean(project && hasProjectDetail(project.slug))

  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(detailAvailable)
  const [error, setError] = useState(false)
  const headings = useMemo(
    () => (detail ? extractHeadings(detail.content) : []),
    [detail]
  )

  useEffect(() => {
    if (!detailAvailable) {
      setDetail(null)
      setLoading(false)
      return undefined
    }

    let cancelled = false
    setLoading(true)
    setError(false)
    getProjectDetail(slug, lang)
      .then((value) => {
        if (cancelled) return
        if (value) setDetail(value)
        else setError(true)
      })
      .catch((err) => {
        console.error('Failed to load project detail:', err)
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug, lang, detailAvailable])

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-3xl items-center justify-center">
        <p className="text-sm text-muted">{t({ en: 'Loading…', zh: '加载中…' })}</p>
      </div>
    )
  }

  if (!detailAvailable || error || !detail) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-3xl flex-col items-start justify-center">
        <PageTitle
          title={`STYLAN · ${t({ en: 'Project not found', zh: '项目未找到' })}`}
          description={t({ en: 'This project has no detail page yet.', zh: '这个项目还没有详情页。' })}
          t={t}
          lang={lang}
          noindex
        />
        <PageHeading title={t({ en: 'Project not found', zh: '项目未找到' })} />
        <p className="text-sm text-muted">
          {t({
            en: 'This project does not exist, or its detail page is not available.',
            zh: '这个项目不存在，或详情页暂未提供。',
          })}
        </p>
        <ParentLink
          to="/projects"
          label={t({ en: 'Back to projects', zh: '返回项目' })}
          className="mt-6"
        />
      </div>
    )
  }

  const actions = []
  if (project.link) {
    actions.push(
      <a
        key="link"
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="link underline-link break-all"
      >
        {project.link}
        <ArrowUpRightIcon size={14} className="ml-1 inline-block align-text-bottom" />
      </a>
    )
  }
  if (project.repo) {
    const repoName = project.repo.split('/').filter(Boolean).pop()
    actions.push(
      <QuietActionLink
        key="repo"
        href={project.repo}
        icon={GitHubIcon}
        iconSize={18}
        className="!rounded-full"
      >
        {repoName}
      </QuietActionLink>
    )
  }

  return (
    <div className="article-page relative mx-auto w-full">
      <div className="article-glow hidden xl:block" aria-hidden="true" />
      <PageTitle
        title={`STYLAN · ${t(project.title)}`}
        description={t(project.description)}
        t={t}
        lang={lang}
        type="article"
      />

      <div className={`article-layout${headings.length ? ' has-toc hover-reveal' : ''}`}>
        {headings.length ? (
          <aside className="article-toc">
            <TableOfContents content={detail.content} />
          </aside>
        ) : null}

        <div className="article-main slide-enter-content relative">
          <div className="mt-6 lg:mt-0">
            <ParentLink
              to="/projects"
              label={t({ en: 'Back to projects', zh: '返回项目' })}
              className="mb-4"
            />

            <header className="mb-10 text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="project-detail-icon shrink-0">
                  <ProjectIcon
                    src={resolveIcon(project.icon)}
                    fallback={getProjectInitial(project.title)}
                  />
                </span>
                <h1 className="text-4xl font-extrabold leading-[1.11] tracking-tight text-heading">
                  {t(project.title)}
                </h1>
              </div>
              <p className="mx-auto mt-4 max-w-2xl text-base italic leading-[1.75] text-muted md:text-lg">
                {t(project.description)}
              </p>

              {project.tags?.length ? (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  {project.tags.map((tag) => {
                    const button = TAG_BUTTONS.get(tag.toLowerCase())
                    return button ? (
                      <QuietActionLink
                        key={tag}
                        href={button.link}
                        logo={button.logo}
                        color={button.color}
                        aria-label={t({
                          en: `${button.name} official site`,
                          zh: `${button.name} 官网`,
                        })}
                      >
                        {button.name}
                      </QuietActionLink>
                    ) : (
                      <span key={tag} className={`${QUIET_ACTION_PILL} opacity-50`}>
                        {tag}
                      </span>
                    )
                  })}
                </div>
              ) : null}

              {actions.length ? (
                <div className="mt-3 flex flex-col items-center gap-2">
                  {actions}
                </div>
              ) : null}

              {detail.fallback ? (
                <p className="mt-4 text-xs text-muted">
                  {detail.lang === 'en'
                    ? t({
                        en: 'English content is not available yet; showing the Chinese version.',
                        zh: '暂缺英文正文，当前显示中文版本。',
                      })
                    : t({
                        en: 'Chinese content is not available yet; showing the English version.',
                        zh: '暂缺中文正文，当前显示英文版本。',
                      })}
                </p>
              ) : null}

              <hr className="mx-auto mt-8 w-[50px] border-line" />
            </header>

            <article className="article-content min-w-0">
              <BlogMarkdown content={detail.content} />
            </article>
          </div>
        </div>
      </div>

      <QuoteFooter />
    </div>
  )
}
