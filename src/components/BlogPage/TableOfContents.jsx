import { useCallback, useEffect, useMemo, useState } from 'react'
import { headingId } from '../../utils/markdownHeading'

// 标题可能带行内链接/强调/行内代码，取其纯文本，才能与 ReactMarkdown 渲染出的 id 对齐
function plainHeadingText(text) {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .trim()
}

function extractHeadings(content) {
  if (!content) return []

  const seen = new Set()
  return content
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trim().match(/^(#{2,4})\s+(.+)$/))
    .filter(Boolean)
    .map((match) => {
      const level = match[1].length
      const text = plainHeadingText(match[2].trim())
      let id = headingId(text)
      if (seen.has(id)) {
        let counter = 2
        while (seen.has(`${id}-${counter}`)) counter += 1
        id = `${id}-${counter}`
      }
      seen.add(id)
      return { level, text, id }
    })
}

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
