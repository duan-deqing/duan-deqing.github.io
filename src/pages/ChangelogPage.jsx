import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { getChangelogs } from '../utils/changelog'
import {
  CHANGELOG_SCOPES,
  normalizeChangelogScope,
} from '../utils/changelogScopes'
import { getPostYear } from '../utils/postDate'
import { formatDate } from '../utils/postFormat'
import PageTitle from '../components/shared/PageTitle'
import ParentLink from '../components/site/ParentLink'
import CenteredPageHeading from '../components/site/CenteredPageHeading'
import BlogMarkdown from '../components/blog/BlogMarkdown'
import '../styles/math.css'
import '../styles/markdown-extras.css'
import '../styles/blog-post.css'
import '../styles/changelog.css'

export default function ChangelogPage() {
  const { scope: scopeParam } = useParams()
  const { lang, t } = useLanguage()
  const scope = normalizeChangelogScope(scopeParam)
  const scopeMeta = CHANGELOG_SCOPES[scope]
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  const title = t({ en: 'Changelog', zh: '更新日志' })
  const description = t(scopeMeta.description)

  useEffect(() => {
    let cancelled = false
    setFailed(false)
    setLoading(true)
    getChangelogs(lang, scope)
      .then((value) => {
        if (!cancelled) setLogs(value)
      })
      .catch((error) => {
        console.error('[ChangelogPage] Failed to load changelogs:', error)
        if (!cancelled) setFailed(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [lang, scope])

  const groups = useMemo(() => {
    const byYear = new Map()
    for (const log of logs) {
      const year = getPostYear(log.date) || '—'
      if (!byYear.has(year)) byYear.set(year, [])
      byYear.get(year).push(log)
    }
    return [...byYear.entries()].map(([year, items]) => ({ year, items }))
  }, [logs])

  return (
    <div className="slide-enter-content mx-auto w-full max-w-3xl">
      <PageTitle
        title={`STYLAN · ${title}`}
        description={description}
        t={t}
        lang={lang}
      />

      <ParentLink
        to={scopeMeta.path}
        label={t(scopeMeta.back)}
        className="mb-6"
      />

      <CenteredPageHeading title={title} description={description} />

      {loading ? (
        <p className="py-10 text-sm text-muted">
          {t({ en: 'Loading…', zh: '加载中…' })}
        </p>
      ) : failed ? (
        <p className="py-10 text-sm text-muted">
          {t({ en: 'Unable to load updates.', zh: '更新日志加载失败。' })}
        </p>
      ) : groups.length ? (
        <div className="flex flex-col gap-10">
          {groups.map(({ year, items }) => (
            <section
              key={year}
              aria-labelledby={`changelog-year-${year}`}
              className="flex flex-col gap-4 md:flex-row md:items-start md:gap-12"
            >
              <h2
                id={`changelog-year-${year}`}
                className="shrink-0 font-mono text-lg font-semibold tracking-tight text-heading md:w-16"
              >
                {year}
              </h2>
              <div className="min-w-0 flex-1">
                {items.map((log, index) => (
                  <article
                    key={log.id}
                    className="relative flex pb-8 last:pb-0"
                  >
                    {index !== items.length - 1 ? (
                      <span
                        className="pointer-events-none absolute inset-0 top-0.5 flex w-5 justify-center"
                        aria-hidden="true"
                      >
                        <span className="h-full border-l border-dashed border-line" />
                      </span>
                    ) : null}
                    <span
                      className="z-10 mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-line bg-page shadow-sm"
                      aria-hidden="true"
                    >
                      <span className="size-2 rounded-full bg-accent" />
                    </span>
                    <div className="min-w-0 flex-1 pl-4 lg:pl-8">
                      <header className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-mono text-base font-semibold tracking-tight text-heading">
                          v{log.version}
                        </span>
                        {log.latest ? (
                          <span className="changelog-new">NEW</span>
                        ) : null}
                        <time
                          dateTime={log.date}
                          className="font-mono text-xs text-muted"
                        >
                          {formatDate(log.date, t)}
                        </time>
                      </header>
                      <div className="article-content changelog-markdown mt-2 min-w-0">
                        <BlogMarkdown content={log.content} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="py-10 text-sm text-muted">
          {t({ en: '{ nothing here yet }', zh: '{ 暂无更新记录 }' })}
        </p>
      )}
    </div>
  )
}
