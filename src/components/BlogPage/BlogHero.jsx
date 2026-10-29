import PageHeader from '../shared/PageHeader'
import ArrowIcon from '../shared/ArrowIcon'
import blogConfig from '../../content/blog.yaml'

export default function BlogHero({ t }) {
  return (
    <PageHeader
      kicker="WRITING"
      title={t(blogConfig.page.title)}
      description={t(blogConfig.page.subtitle)}
      actions={
        <a
          href="/rss.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-mono-ui text-[11px] uppercase tracking-[0.08em] text-muted transition-colors hover:border-ink/25 hover:text-ink"
        >
          RSS
          <ArrowIcon direction="up-right" size={12} />
        </a>
      }
    />
  )
}
