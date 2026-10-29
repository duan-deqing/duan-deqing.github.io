import { cloneElement, isValidElement, useEffect, useRef, useState } from 'react'
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
    <td className="border-b border-line px-4 py-2 text-ink last:border-0">{children}</td>
  ),

  hr: () => <hr className="my-10 border-line" />,
}
