import { useCallback, useId, useMemo, useState } from 'react'
import { extractHeadings } from '../../utils/markdownHeading'
import { useLanguage } from '../../hooks/useLanguage'
import { MenuIcon } from '../site/icons'

export default function TableOfContents({ content, onItemClick }) {
  const { t } = useLanguage()
  const headings = useMemo(() => extractHeadings(content), [content])
  const [open, setOpen] = useState(false)
  const listId = useId()

  const handleClick = useCallback(
    (event, id) => {
      event.preventDefault()
      const el = document.getElementById(id)
      // 标题自带 scroll-mt-24；scrollIntoView 在 onur 壳的内层滚动容器中也能生效。
      if (el) el.scrollIntoView({ block: 'start' })
      setOpen(false)
      onItemClick?.()
    },
    [onItemClick]
  )

  if (headings.length === 0) return null

  return (
    <div className="article-toc-inner">
      <button
        type="button"
        className="article-toc-anchor hover-reveal-anchor"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={t({ en: 'Table of contents', zh: '目录' })}
        title={t({ en: 'Table of contents', zh: '目录' })}
        onClick={() => setOpen((value) => !value)}
      >
        <MenuIcon size={18} />
      </button>
      <nav
        id={listId}
        aria-label={t({ en: 'Table of contents', zh: '目录' })}
        className={`article-toc-nav hover-reveal-panel${open ? ' is-open' : ''}`}
      >
        <ul>
          {headings.map(({ level, text, id }) => (
            <li key={id} style={{ paddingLeft: `${0.8 + (level - 2) * 0.8}rem` }}>
              <a
                href={`#${id}`}
                className="underline-link"
                onClick={(event) => handleClick(event, id)}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
