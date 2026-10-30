import { Link } from 'react-router-dom'
import stackConfig from '@content/pages/stack.yaml'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'
import { ArrowUpRightIcon } from '../components/site/icons'

const FALLBACK_TITLE = { en: 'Stack', zh: '技术栈' }
const FALLBACK_DESCRIPTION = {
  en: 'The tools and technologies I use to build AI products.',
  zh: '我用来构建 AI 产品的工具与技术。',
}
const FALLBACK_INTRO = {
  en: 'Tools I reach for when building and shipping.',
  zh: '构建与交付时常用的工具。',
}

export default function SkillsPage() {
  const { lang, t } = useLanguage()
  const page = stackConfig.page || {}
  const groups = stackConfig.skills || []

  return (
    <div className="slide-enter-content mx-auto w-full max-w-3xl">
      <PageTitle
        title={`STYLAN · ${t(page.title || FALLBACK_TITLE)}`}
        description={t(page.description || FALLBACK_DESCRIPTION)}
        t={t}
        lang={lang}
      />
      <PageHeading title={t(page.title || FALLBACK_TITLE)} />

      <p className="mb-1 text-base leading-[1.75] text-ink">
        {t(page.intro || FALLBACK_INTRO)}
      </p>

      <ul className="mb-4 flex list-disc flex-col gap-0.5 pl-6">
        {groups.map((group) => (
          <li
            key={t(group.category)}
            className="pl-2 text-base leading-[1.75] marker:text-[var(--code-line)]"
          >
            <Link to="/skills" replace className="stack-link">
              {t(group.category)}
              <ArrowUpRightIcon size={14} className="ml-1 inline-block align-text-bottom" />
            </Link>
            <span> — {(group.items || []).join(' · ')}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
