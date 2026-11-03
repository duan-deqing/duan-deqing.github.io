import { isValidElement } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import ArticleCarousel from '../../components/markdown/ArticleCarousel'
import ArticleVideo from '../../components/markdown/ArticleVideo'
import MermaidDiagram from '../../components/markdown/MermaidDiagram'
import { remarkGithubAlerts } from '../../utils/markdown/remarkGithubAlerts'
import { remarkGithubRefs } from '../../utils/markdown/remarkGithubRefs'
import { markdownSanitizeSchema } from '../../utils/markdown/markdownSanitizeSchema'
import rehypeCodeLanguage from '../../utils/markdown/rehypeCodeLanguage'
import { getTextContent } from '../../utils/markdown/markdownHeading'

function PreviewPre({ children }) {
  const className = isValidElement(children) ? children.props.className || '' : ''
  const language = (className.match(/language-([\w-]+)/)?.[1] || '').toLowerCase()
  const source = isValidElement(children)
    ? getTextContent(children.props.children)
    : ''

  if (language === 'video') return <ArticleVideo source={source} />
  if (language === 'carousel') return <ArticleCarousel source={source} />
  if (language === 'mermaid') return <MermaidDiagram source={source} />
  return <pre>{children}</pre>
}

export default function MarkdownPreview({ source }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkGithubAlerts, remarkGithubRefs, remarkMath]}
      rehypePlugins={[
        rehypeRaw,
        [rehypeSanitize, markdownSanitizeSchema],
        rehypeCodeLanguage,
        rehypeHighlight,
        rehypeKatex,
      ]}
      components={{ pre: PreviewPre }}
    >
      {source || '（暂无正文）'}
    </ReactMarkdown>
  )
}
