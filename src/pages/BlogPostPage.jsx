import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useLanguage } from '../hooks/useLanguage'
import { getPostBySlug } from '../utils/markdown'
import { categoryLabel, formatDate } from '../utils/postFormat'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'
import TableOfContents from '../components/BlogPage/TableOfContents'
import { markdownComponents } from '../components/BlogPage/markdownComponents'
import rehypeCodeLines from '../utils/rehypeCodeLines'
import { ArrowUpRightIcon } from '../components/site/icons'
import '../styles/math.css'
import '../styles/blog-post.css'

export default function BlogPostPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { lang, t } = useLanguage()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [math, setMath] = useState(null)
  const [mathFailed, setMathFailed] = useState(false)
  const hasMath = useMemo(
    () => Boolean(post && /\$[^$\n]+\$|\$\$[\s\S]*?\$\$/.test(post.content)),
    [post]
  )
  const mathPending = hasMath && !math && !mathFailed

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    getPostBySlug(slug, lang)
      .then((value) => {
        if (cancelled) return
        if (value) setPost(value)
        else setError(true)
      })
      .catch((err) => {
        console.error('Failed to load post:', err)
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug, lang])

  useEffect(() => {
    if (!post || !hasMath || math) return undefined
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
  }, [post, hasMath, math])

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-3xl items-center justify-center">
        <p className="text-sm text-muted">{t({ en: 'Loading…', zh: '加载中…' })}</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-3xl flex-col items-start justify-center">
        <PageHeading title={t({ en: 'Post not found', zh: '文章未找到' })} />
        <p className="text-sm text-muted">
          {t({ en: 'The post you are looking for does not exist.', zh: '您查找的文章不存在。' })}
        </p>
        <button
          type="button"
          onClick={() => navigate('/blog')}
          className="link mt-6 text-sm"
        >
          {t({ en: 'Back to blog', zh: '返回博客' })}
        </button>
      </div>
    )
  }

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="article-glow hidden xl:block" aria-hidden="true" />
      <PageTitle
        title={`STYLAN · ${t(post.title)}`}
        description={t(post.excerpt)}
        t={t}
        lang={lang}
        type="article"
      />

      <div className="slide-enter-content relative">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-muted-strong transition-colors hover:text-ink lg:hidden"
        >
          <ArrowUpRightIcon size={14} className="rotate-180" />
          {t({ en: 'Writing', zh: '写作' })}
        </Link>

        <div className="mt-6 lg:mt-0">
          <PageHeading title={t(post.title)} />
          <div className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
            <time dateTime={post.date}>{formatDate(post.date, t)}</time>
            {post.readTime ? <span aria-hidden="true">·</span> : null}
            {post.readTime ? <span>{t(post.readTime)}</span> : null}
            <span aria-hidden="true">·</span>
            <span>{categoryLabel(post.category, t)}</span>
          </div>
          {post.tags?.length ? (
            <div className="mb-8 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
              {post.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          ) : null}
        </div>

        <details className="mb-8 rounded-lg border border-line p-4 lg:hidden">
          <summary className="cursor-pointer text-sm font-medium text-heading">
            {t({ en: 'On this page', zh: '本页目录' })}
          </summary>
          <div className="mt-3">
            <TableOfContents content={post.content} showTitle={false} />
          </div>
        </details>

        <article className="article-content min-w-0">
          {mathPending ? (
            <p className="py-8 text-sm text-muted">
              {t({ en: 'Rendering formulas…', zh: '正在渲染公式…' })}
            </p>
          ) : (
            <ReactMarkdown
              remarkPlugins={math ? [remarkGfm, math.remarkMath] : [remarkGfm]}
              rehypePlugins={
                math
                  ? [rehypeHighlight, math.rehypeKatex, rehypeCodeLines]
                  : [rehypeHighlight, rehypeCodeLines]
              }
              components={markdownComponents}
            >
              {post.content}
            </ReactMarkdown>
          )}
        </article>
      </div>
    </div>
  )
}
