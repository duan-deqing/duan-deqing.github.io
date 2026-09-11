/**
 * BlogSection — 03 最新文章
 */

import { Link } from 'react-router-dom'
import SectionKicker from '../shared/SectionKicker'
import ArrowIcon from '../shared/ArrowIcon'

function formatDate(dateString, t) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString(t({ en: 'en-CA', zh: 'zh-CN' }), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export default function BlogSection({ posts, t }) {
  const display = (posts || []).slice(0, 3)
  if (display.length === 0) return null

  return (
    <section className="py-14 sm:py-16 border-t border-line">
      <div className="section-inner">
        <SectionKicker num="03" en="WRITING" zh="文章" t={t} id="writing" />

        <div className="mb-8 sm:mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] font-semibold text-ink tracking-[-0.02em] leading-[1.15]">
            {t({ en: 'Latest writing', zh: '最新文章' })}
          </h2>
          <Link
            to="/blog"
            className="font-mono-ui text-[11px] tracking-[0.1em] uppercase text-muted hover:text-accent transition-colors inline-flex items-center gap-1.5"
          >
            {t({ en: 'All posts', zh: '全部文章' })}
            <ArrowIcon direction="right" size={12} />
          </Link>
        </div>

        <div className="border-t border-line row-link-list">
          {display.map((post, index) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="row-link">
              <span className="row-num">{String(index + 1).padStart(2, '0')}</span>
              <span>
                <span className="row-title block">{t(post.title)}</span>
                <span className="block mt-2.5 text-sm text-muted line-clamp-2 max-w-3xl leading-[1.7]">
                  {t(post.excerpt)}
                </span>
              </span>
              <span className="row-meta whitespace-nowrap">
                {formatDate(post.date, t)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
