import { cloneElement, isValidElement } from 'react'
import { headingId, getTextContent } from '../../utils/markdownHeading'

const heading = (level) => {
  const Tag = `h${level}`
  const className =
    level === 2
      ? 'mt-10 mb-4 scroll-mt-24 text-xl font-semibold tracking-tight text-heading md:text-2xl'
      : level === 3
        ? 'mt-8 mb-3 scroll-mt-24 text-lg font-semibold tracking-tight text-heading'
        : 'mt-6 mb-2 scroll-mt-24 text-base font-semibold text-heading'

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

  p: ({ children }) => <p className="mb-5 text-base leading-[1.75] text-ink">{children}</p>,

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
    <ul className="mb-5 list-disc space-y-1.5 pl-5 text-base leading-[1.75] text-ink">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="mb-5 list-decimal space-y-1.5 pl-5 text-base leading-[1.75] text-ink">
      {children}
    </ol>
  ),

  li: ({ children }) => <li className="pl-0.5">{children}</li>,

  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l border-line-strong pl-4 text-muted-strong">
      {children}
    </blockquote>
  ),

  // react-markdown 会把 hast 的 node 传给自定义组件；不透传给 DOM。
  // `block` 由 pre 注入：没有 info string 的围栏不会被 rehype-highlight
  // 加上 hljs / language- 类名，只能靠 pre 的上下文判断为块级代码。
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
    // 把 pre 内的 code 标记为块级；children 不是单个合法元素时保持原样。
    const content = isValidElement(children) ? cloneElement(children, { block: true }) : children
    return <pre className="code-block">{content}</pre>
  },

  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      decoding="async"
      className="my-6 h-auto w-full rounded-xl border border-line"
    />
  ),

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
    <td className="border-b border-line px-4 py-2 text-ink last:border-0">{children}</td>
  ),

  hr: () => <hr className="my-10 border-line" />,
}
