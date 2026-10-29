import { useCallback, useEffect, useMemo, useState } from 'react'
import { extractHeadings } from '../../utils/markdownHeading'

export default function TableOfContents({ content, onItemClick }) {
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
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80
        window.scrollTo({ top, behavior: 'auto' })
      }
      onItemClick?.()
    },
    [onItemClick]
  )

  if (headings.length === 0) return null

  return (
    <nav aria-label="Table of contents">
      <p className="mb-3 font-mono-ui text-[10px] uppercase tracking-[0.1em] text-muted">
        On this page
      </p>
      <ul className="border-l border-line">
        {headings.map(({ level, text, id }) => {
          const active = activeId === id
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(event) => handleClick(event, id)}
                style={{ paddingLeft: `${0.75 + (level - 2) * 0.75}rem` }}
                className={`-ml-px block border-l-2 py-1 pr-2 text-[13px] leading-snug transition-colors ${
                  active
                    ? 'border-accent text-ink'
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
