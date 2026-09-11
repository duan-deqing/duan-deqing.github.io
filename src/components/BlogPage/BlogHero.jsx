/**
 * BlogHero — 编辑部风格博客页头
 */

import blogConfig from '../../blogConfig'
import ArrowIcon from '../shared/ArrowIcon'

export default function BlogHero({ t }) {
  return (
    <section className="pt-8 pb-10 border-b border-line bg-grid -mx-6 lg:-mx-10 px-6 lg:px-10">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="section-kicker mb-6">
            <span className="num">03</span>
            <span>WRITING</span>
            <span className="opacity-60">/ {t({ en: '', zh: '文章' })}</span>
          </p>
          <h1
            className="font-display font-semibold text-ink leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(2.25rem, 6vw, 4rem)' }}
          >
            {t(blogConfig.page.title)}
          </h1>
          <p className="mt-4 text-muted max-w-lg">{t(blogConfig.page.subtitle)}</p>
        </div>
        <a
          href="/rss.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono-ui text-xs tracking-wider text-muted hover:text-accent border border-line rounded px-3 py-2 inline-flex items-center gap-1.5"
        >
          RSS
          <ArrowIcon direction="up-right" size={12} />
        </a>
      </div>
    </section>
  )
}
