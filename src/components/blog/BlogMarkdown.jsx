import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import { useLanguage } from '../../hooks/useLanguage'
import { remarkGithubAlerts } from '../../utils/remarkGithubAlerts'
import { remarkGithubRefs } from '../../utils/remarkGithubRefs'
import { markdownSanitizeSchema } from '../../utils/markdownSanitizeSchema'
import rehypeCodeLanguage from '../../utils/rehypeCodeLanguage'
import rehypeCodeLines from '../../utils/rehypeCodeLines'
import { markdownComponents } from '../BlogPage/markdownComponents'

export default function BlogMarkdown({ content }) {
  const { t } = useLanguage()
  const [math, setMath] = useState(null)
  const [mathFailed, setMathFailed] = useState(false)
  const hasMath = useMemo(
    () => Boolean(content && /\$[^$\n]+\$|\$\$[\s\S]*?\$\$/.test(content)),
    [content]
  )
  const mathPending = hasMath && !math && !mathFailed

  useEffect(() => {
    if (!hasMath || math) return undefined
    let cancelled = false
    setMathFailed(false)
    Promise.all([
      import('remark-math'),
      import('rehype-katex'),
      import('katex/dist/katex.min.css'),
    ])
      .then(([remarkMathModule, rehypeKatexModule]) => {
        if (cancelled) return
        setMath({
          remarkMath: remarkMathModule.default,
          rehypeKatex: rehypeKatexModule.default,
        })
      })
      .catch((err) => {
        console.error('Failed to load math renderer:', err)
        if (!cancelled) setMathFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [content, hasMath, math])

  if (mathPending) {
    return (
      <p className="py-8 text-sm text-muted">
        {t({ en: 'Rendering formulas…', zh: '正在渲染公式…' })}
      </p>
    )
  }

  return (
    <ReactMarkdown
      remarkPlugins={
        math
          ? [remarkGfm, remarkGithubAlerts, remarkGithubRefs, math.remarkMath]
          : [remarkGfm, remarkGithubAlerts, remarkGithubRefs]
      }
      rehypePlugins={
        math
          ? [
              rehypeRaw,
              [rehypeSanitize, markdownSanitizeSchema],
              rehypeCodeLanguage,
              rehypeHighlight,
              math.rehypeKatex,
              rehypeCodeLines,
            ]
          : [
              rehypeRaw,
              [rehypeSanitize, markdownSanitizeSchema],
              rehypeCodeLanguage,
              rehypeHighlight,
              rehypeCodeLines,
            ]
      }
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  )
}
