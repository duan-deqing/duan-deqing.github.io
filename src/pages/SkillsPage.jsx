import stackConfig from '@content/stack/stack.yaml'
import { useLanguage } from '../hooks/useLanguage'
import CategoryHeading from '../components/site/CategoryHeading'
import CenteredPageHeading from '../components/site/CenteredPageHeading'
import StackButtonGroup from '../components/site/StackButtonGroup'
import QuoteFooter from '../components/site/QuoteFooter'
import PageTitle from '../components/shared/PageTitle'
import { ArrowUpRightIcon } from '../components/site/icons'
import { resolveIconEntry } from '../utils/icons'

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
  const categories = stackConfig.categories || []

  return (
    <div className="slide-enter-content mx-auto w-full max-w-5xl">
      <PageTitle
        title={`STYLAN · ${t(page.title || FALLBACK_TITLE)}`}
        description={t(page.description || FALLBACK_DESCRIPTION)}
        t={t}
        lang={lang}
      />
      <CenteredPageHeading
        title={t(page.title || FALLBACK_TITLE)}
        description={t(page.intro || FALLBACK_INTRO)}
        actions={<StackButtonGroup className="mx-auto max-w-3xl justify-center" />}
      />

      {categories.map((category, index) => (
        <section
          key={category.id}
          aria-labelledby={`stack-category-${category.id}`}
        >
          <CategoryHeading
            id={`stack-category-${category.id}`}
            label={t(category.label)}
            index={index}
          />
          <ul className="stack-list">
            {(category.items || []).map((item) => {
              const entry = resolveIconEntry(item.link)
              return (
                <li key={item.name}>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5">
                    {entry?.link ? (
                      <a
                        href={entry.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="stack-link"
                        style={entry.color ? { '--stack-link-color': entry.color } : undefined}
                      >
                        {item.name}
                        <ArrowUpRightIcon
                          size={14}
                          className="ml-1 inline-block align-text-bottom"
                        />
                      </a>
                    ) : (
                      <span className="stack-item-name">{item.name}</span>
                    )}
                    {item.description ? (
                      <span className="stack-item-description">
                        — {t(item.description)}
                      </span>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <QuoteFooter />
    </div>
  )
}
