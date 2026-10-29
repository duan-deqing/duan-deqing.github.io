import { cloneElement, isValidElement, useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { headingId, getTextContent } from '../../utils/markdownHeading'
import { CheckIcon, CopyIcon } from '../site/icons'

const HEADING_SIZE = {
  2: 'text-lg md:text-xl',
  3: 'text-base md:text-lg',
  4: 'text-base',
}

const heading = (level) => {
  const Tag = `h${level}`
  const size = HEADING_SIZE[level] || HEADING_SIZE[4]

  return function Heading({ children }) {
    const id = headingId(getTextContent(children))
    return (
      <Tag
        id={id}
        className={`article-heading mt-6 mb-2 scroll-mt-24 font-semibold tracking-tighter text-heading ${size}`}
      >
        <a href={`#${id}`}>{children}</a>
      </Tag>
    )
  }
}

const LANGUAGE_LABELS = {
  js: 'JS',
  javascript: 'JavaScript',
  ts: 'TS',
  typescript: 'TypeScript',
  jsx: 'JSX',
  tsx: 'TSX',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  python: 'Python',
  css: 'CSS',
  html: 'HTML',
  json: 'JSON',
  md: 'Markdown',
  markdown: 'Markdown',
  yaml: 'YAML',
  yml: 'YAML',
  sql: 'SQL',
  text: 'Text',
}

// 文章配图通常在首屏之外。原生 loading="lazy" 在慢速网络下仍会预取
// 约 3000px 内的图片，文中长图会挤占首屏带宽；这里等到图片接近视口
// （600px）再挂载 src，让 LCP 段落先完成渲染。
function ArticleImage({ src, alt }) {
  const anchorRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = anchorRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '600px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <span ref={anchorRef} className="my-6 block">
      {/* 未进入视口时保留 img 与 alt（屏幕阅读器可读），只推迟 src。 */}
      <img
        src={visible ? src : undefined}
        alt={alt || ''}
        loading="lazy"
        decoding="async"
        className="h-auto w-full rounded-xl border border-line"
      />
    </span>
  )
}

function CodeBlock({ children }) {
  const { t } = useLanguage()
  const frameRef = useRef(null)
  const timerRef = useRef(0)
  const [copied, setCopied] = useState(false)
  const className = isValidElement(children) ? children.props.className || '' : ''
  const languageMatch = className.match(/language-([\w-]+)/)
  const language = languageMatch
    ? LANGUAGE_LABELS[languageMatch[1]] || languageMatch[1]
    : ''

  useEffect(() => () => clearTimeout(timerRef.current), [])

  async function copy() {
    const frame = frameRef.current
    if (!frame || !navigator.clipboard?.writeText) return
    const lines = [...frame.querySelectorAll('.code-line')]
    const code = frame.querySelector('code')
    const text = lines.length
      ? lines.map((line) => line.textContent).join('\n')
      : code?.textContent || ''
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div ref={frameRef} className="my-6 overflow-hidden rounded-lg border border-line">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-subtle px-4 py-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex shrink-0 items-center gap-1" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
            <span className="size-2.5 rounded-full bg-line-strong" />
          </span>
          {language ? (
            <span className="truncate font-mono text-[11px] text-muted-strong">
              {language}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-line bg-page px-2 text-[11px] font-medium text-ink transition-colors hover:bg-subtle"
        >
          {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
          {copied
            ? t({ en: 'Copied', zh: '已复制' })
            : t({ en: 'Copy', zh: '复制' })}
        </button>
      </div>
      <pre className="code-block">{children}</pre>
    </div>
  )
}

export const markdownComponents = {
  h1: heading(2),
  h2: heading(2),
  h3: heading(3),
  h4: heading(4),

  p: ({ children }) => (
    <p className="mb-4 text-base leading-[1.75] text-ink last:mb-0 [&:has(+ul)]:mb-1">
      {children}
    </p>
  ),

  a: ({ href, children }) => (
    <a
      href={href}
      className="link"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),

  ul: ({ children }) => (
    <ul className="mb-4 list-disc space-y-0.5 pl-6 text-base leading-[1.75] text-ink">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="mb-4 list-inside list-[decimal-leading-zero] space-y-2 text-base leading-[1.75] text-ink">
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="pl-2 marker:text-[var(--code-line)]">{children}</li>
  ),

  blockquote: ({ children }) => (
    <blockquote className="mb-4 rounded-r-lg border-l-2 border-line px-4 font-medium text-muted">
      {children}
    </blockquote>
  ),

  code({ className, children, block, node, ...props }) {
    const isBlock =
      block === true ||
      (typeof className === 'string' && /(^|\s)(hljs|language-)/.test(className))
    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }
    return (
      <code className="inline-code" {...props}>
        {children}
      </code>
    )
  },

  pre({ children }) {
    const content = isValidElement(children)
      ? cloneElement(children, { block: true })
      : children
    return <CodeBlock>{content}</CodeBlock>
  },

  img: ArticleImage,

  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-line">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  ),

  th: ({ children }) => (
    <th className="border-b border-line px-4 py-2 text-left font-medium text-muted">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="border-b border-line px-4 py-2 text-ink">{children}</td>
  ),

  hr: () => <hr className="my-12 border-line" />,
}
