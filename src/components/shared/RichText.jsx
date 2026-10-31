import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { cn } from '../../utils/cn'
import { splitRichTextBlocks } from '../../utils/richTextBlocks'

const REMARK_PLUGINS = [remarkGfm, remarkBreaks]

function IntroLink({ href, children, className, node: _node, ...props }) {
  const isInternal = href?.startsWith('/') && !href.startsWith('//')
  const classes = cn('link', href?.startsWith('mailto:') && 'font-mono', className)

  if (isInternal) {
    return (
      <Link to={href} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  const external = /^https?:\/\//.test(href || '')

  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
    </a>
  )
}

const COMPONENTS = { a: IntroLink }

export default function RichText({ content, className }) {
  const blocks = splitRichTextBlocks(content)

  return blocks.map((block, index) => (
    <div key={index} className={cn('rich-text', className)}>
      <ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={COMPONENTS}>
        {block}
      </ReactMarkdown>
    </div>
  ))
}
