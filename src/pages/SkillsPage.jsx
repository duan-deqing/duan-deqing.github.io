import { Link } from 'react-router-dom'
import config from '../content/site.yaml'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'
import { ArrowUpRightIcon } from '../components/site/icons'

export default function SkillsPage() {
  const { lang, t } = useLanguage()
  const groups = config.skills || []

  return (
    <div className="slide-enter-content mx-auto w-full max-w-3xl">
      <PageTitle
        title={`STYLAN · ${t({ en: 'Stack', zh: '技术栈' })}`}
        description={t({
          en: 'The tools and technologies I use to build AI products.',
          zh: '我用来构建 AI 产品的工具与技术。',
        })}
        t={t}
        lang={lang}
      />
      <PageHeading title={t({ en: 'Stack', zh: '技术栈' })} />

      <p className="mb-1 text-base leading-[1.75] text-ink">
        {t({
          en: 'Tools I reach for when building and shipping.',
          zh: '构建与交付时常用的工具。',
        })}
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
