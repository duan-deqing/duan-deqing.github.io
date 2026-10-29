import { cloneElement } from 'react'
import { headingId, getTextContent } from '../../utils/markdownHeading'

const heading = (level) => {
  const Tag = `h${level}`
  const className =
    level === 2
      ? 'mt-10 mb-4 scroll-mt-24 text-2xl font-semibold tracking-[-0.02em] text-ink'
      : level === 3
        ? 'mt-8 mb-3 scroll-mt-24 text-xl font-semibold tracking-[-0.01em] text-ink'
        : 'mt-6 mb-2 scroll-mt-24 text-lg font-semibold text-ink'

  return function Heading({ children }) {
    return (
      <Tag id={headingId(getTextContent(children))} className={className}>
        {children}
      </Tag>
    )
  }
}

export const markdownComponents = {
  h1: heading(2),
  h2: heading(2),
  h3: heading(3),
  h4: heading(4),

  p: ({ children }) => (
    <p className="mb-4 text-[1.0625rem] leading-[1.85] text-ink/90">{children}</p>
  ),

  a: ({ href, children }) => (
    <a
      href={href}
      className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),

  ul: ({ children }) => (
    <ul className="mb-4 list-disc space-y-2 pl-5 text-[1.0625rem] leading-[1.85] text-ink/90">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="mb-4 list-decimal space-y-2 pl-5 text-[1.0625rem] leading-[1.85] text-ink/90">
      {children}
    </ol>
  ),

  li: ({ children }) => <li className="pl-0.5">{children}</li>,

  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-2 border-accent bg-subtle py-1 pl-4 text-ink/75">
      {children}
    </blockquote>
  ),

  code({ block, node, className, children, ...props }) {
    if (block) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }

    return (
      <code
        className="rounded bg-subtle px-1.5 py-0.5 font-mono text-[0.875em] text-ink"
        {...props}
      >
        {children}
      </code>
    )
  },

  pre({ children, node, ...props }) {
    const codeChild = children?.props
    const className = codeChild?.className || ''
    const match = /language-([\w+#-]+)/.exec(className)
    const language = match ? match[1] : 'code'

    return (
      <div className="my-6 overflow-hidden rounded-lg border border-line">
        <div className="border-b border-line bg-subtle px-4 py-2 font-mono-ui text-[10px] uppercase tracking-[0.08em] text-ink/75">
          {language}
        </div>
        <pre
          {...props}
          className="overflow-x-auto bg-elevated px-4 py-5 font-mono text-[0.875rem] leading-[1.7]"
        >
          {cloneElement(children, { block: true })}
        </pre>
      </div>
    )
  },

  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      decoding="async"
      className="my-6 h-auto w-full rounded-lg border border-line"
    />
  ),

  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-line">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  ),

  th: ({ children }) => (
    <th className="border-b border-line bg-subtle px-4 py-2 text-left font-medium text-ink">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="border-b border-line px-4 py-2 text-ink/85 last:border-0">{children}</td>
  ),

  hr: () => <hr className="my-10 border-line" />,
}
