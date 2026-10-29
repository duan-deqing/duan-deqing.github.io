import { useCallback, useEffect, useMemo, useState } from 'react'
import { extractHeadings } from '../../utils/markdownHeading'
import { useLanguage } from '../../hooks/useLanguage'

export default function TableOfContents({ content, onItemClick, showTitle = true }) {
  const { t } = useLanguage()
  const headings = useMemo(() => extractHeadings(content), [content])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -75% 0px', threshold: 0 }
    )

    const timer = setTimeout(() => {
      headings.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [headings])

  const handleClick = useCallback(
    (event, id) => {
      event.preventDefault()
      const el = document.getElementById(id)
      // 标题自带 scroll-mt-24；scrollIntoView 在 onur 壳的内层滚动容器中也能生效。
      if (el) el.scrollIntoView({ block: 'start' })
      onItemClick?.()
    },
    [onItemClick]
  )

  if (headings.length === 0) return null

  return (
    <nav aria-label={t({ en: 'Table of contents', zh: '目录' })}>
      {showTitle ? (
        <p className="mb-3 text-xs font-medium text-muted">
          {t({ en: 'On this page', zh: '本页目录' })}
        </p>
      ) : null}
      <ul className="border-l border-line">
        {headings.map(({ level, text, id }) => {
          const active = activeId === id
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(event) => handleClick(event, id)}
                style={{ paddingLeft: `${0.75 + (level - 2) * 0.75}rem` }}
                className={`-ml-px block border-l-2 py-1 pr-2 text-sm leading-snug transition-colors ${
                  active
                    ? 'border-ink text-ink'
                    : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                {text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
