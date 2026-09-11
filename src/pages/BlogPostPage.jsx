/**
 * BlogPostPage — 文章详情（Markdown 渲染 + TOC，壳层对齐新设计）
 */

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useTheme } from '../hooks/useTheme'
import { useLanguage } from '../hooks/useLanguage'
import { getPostBySlug } from '../utils/markdown'
import blogConfig from '../blogConfig'
import SubPageShell from '../components/shared/SubPageShell'
import TableOfContents from '../components/BlogPage/TableOfContents'
import ArrowIcon from '../components/shared/ArrowIcon'
import '../styles/blog-post.css'

function generateId(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w一-鿿-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function getTextContent(children) {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(getTextContent).join('')
  if (children?.props?.children) return getTextContent(children.props.children)
  return ''
}

function BlogPostPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { lang, t } = useLanguage()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const articleRef = useRef(null)
  const [tocLeft, setTocLeft] = useState(0)
  const [showToc, setShowToc] = useState(false)

  useEffect(() => {
    const updateTocPosition = () => {
      if (!articleRef.current) return
      const rect = articleRef.current.getBoundingClientRect()
      const leftSpace = rect.left
      if (leftSpace >= 240) {
        setShowToc(true)
        setTocLeft(Math.max(16, leftSpace - 240))
      } else {
        setShowToc(false)
      }
    }
    updateTocPosition()
    window.addEventListener('resize', updateTocPosition)
    return () => window.removeEventListener('resize', updateTocPosition)
  }, [post])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        setError(false)
        const postData = await getPostBySlug(slug, lang)
        if (cancelled) return
        if (postData) setPost(postData)
        else setError(true)
      } catch (err) {
        console.error('Failed to load post:', err)
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug, lang])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(t({ en: 'en-US', zh: 'zh-CN' }), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getCategoryName = (categoryId) => {
    const category = blogConfig.categories.find((c) => c.id === categoryId)
    return category ? t(category.label) : categoryId
  }

  if (loading) {
    return (
      <SubPageShell t={t} lang={lang}>
        <div className="flex-grow flex items-center justify-center px-6 py-24">
          <p className="font-mono-ui text-sm text-muted">
            {t({ en: 'Loading…', zh: '加载中…' })}
          </p>
        </div>
      </SubPageShell>
    )
  }

  if (error || !post) {
    return (
      <SubPageShell t={t} lang={lang}>
        <div className="flex-grow flex flex-col items-center justify-center px-6 py-24 text-center">
          <h1 className="font-display text-4xl font-semibold text-ink mb-3">
            {t({ en: 'Post not found', zh: '文章未找到' })}
          </h1>
          <p className="text-muted mb-8">
            {t({ en: 'The post you are looking for does not exist.', zh: '您查找的文章不存在。' })}
          </p>
          <button onClick={() => navigate('/blog')} className="btn btn-primary">
            <span className="btn-label">{t({ en: 'Back to blog', zh: '返回博客' })}</span>
            <span className="btn-arrow">
              <ArrowIcon direction="right" size={15} />
            </span>
          </button>
        </div>
      </SubPageShell>
    )
  }

  return (
    <SubPageShell
      title={`STYLAN · ${t(post.title)}`}
      description={post.excerpt}
      t={t}
      lang={lang}
    >
      {showToc && (
        <aside
          className="hidden xl:block fixed transition-all duration-200 z-30"
          style={{
            left: `${tocLeft}px`,
            width: '200px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <TableOfContents content={post.content} />
        </aside>
      )}

      <article
        ref={articleRef}
        className="py-10 sm:py-12 w-full flex-grow"
      >
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-mono-ui text-xs tracking-wider text-muted hover:text-accent mb-10"
        >
          <ArrowIcon direction="left" size={14} />
          {t({ en: 'All posts', zh: '全部文章' })}
        </Link>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="tag-chip">{getCategoryName(post.category)}</span>
          {post.featured && (
            <span className="tag-chip tag-chip-accent">
              {t({ en: 'Featured', zh: '精选' })}
            </span>
          )}
        </div>

        <h1
          className="font-display font-semibold text-ink tracking-tight leading-[1.1] mb-6"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
        >
          {t(post.title)}
        </h1>

        <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b border-line font-mono-ui text-xs text-muted">
          <span>{formatDate(post.date)}</span>
          {post.readTime ? <span>{t(post.readTime)}</span> : null}
          {post.author ? <span>{t(post.author)}</span> : null}
        </div>

        {post.excerpt ? (
          <p className="mb-10 text-muted leading-relaxed border-l-2 pl-4" style={{ borderColor: 'var(--accent)' }}>
            {t(post.excerpt)}
          </p>
        ) : null}

        <div className="markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            urlTransform={(url) => url}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold mt-10 mb-6 pb-3 border-b border-line text-ink">
                  {children}
                </h1>
              ),
              h2: ({ children }) => {
                const id = generateId(getTextContent(children))
                return (
                  <h2 id={id} className="text-2xl font-bold mt-10 mb-4 text-ink scroll-mt-24">
                    {children}
                  </h2>
                )
              },
              h3: ({ children }) => {
                const id = generateId(getTextContent(children))
                return (
                  <h3 id={id} className="text-xl font-semibold mt-8 mb-3 text-ink scroll-mt-24">
                    {children}
                  </h3>
                )
              },
              h4: ({ children }) => {
                const id = generateId(getTextContent(children))
                return (
                  <h4 id={id} className="text-lg font-semibold mt-6 mb-2 text-ink scroll-mt-24">
                    {children}
                  </h4>
                )
              },
              p: ({ children }) => (
                <p className="text-ink/85 leading-[1.8] mb-4" style={{ fontFamily: 'var(--font-post)' }}>
                  {children}
                </p>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="underline underline-offset-2"
                  style={{ color: 'var(--accent)' }}
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-outside pl-5 mb-4 space-y-2 text-ink/85">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-outside pl-5 mb-4 space-y-2 text-ink/85">{children}</ol>
              ),
              blockquote: ({ children }) => (
                <blockquote
                  className="border-l-2 pl-4 py-1 my-6 text-ink/75"
                  style={{ borderColor: 'var(--accent)', background: 'var(--accent-soft)' }}
                >
                  {children}
                </blockquote>
              ),
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                if (!inline && match) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
                return (
                  <code
                    className="px-1.5 py-0.5 rounded text-sm"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      background: 'var(--accent-soft)',
                      color: 'var(--accent)',
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                )
              },
              pre({ children, ...props }) {
                const codeChild = children?.props
                const className = codeChild?.className || ''
                const match = /language-(\w+)/.exec(className)
                const language = match ? match[1] : ''
                return (
                  <div className="my-6 rounded-lg overflow-hidden border border-line">
                    <div
                      className="px-4 py-2 flex items-center gap-2 border-b border-line font-mono-ui text-[10px] uppercase tracking-wider text-muted"
                      style={{ background: 'var(--bg-elevated)' }}
                    >
                      {language || 'code'}
                    </div>
                    <pre
                      {...props}
                      className="!m-0 overflow-x-auto"
                      style={{
                        margin: 0,
                        padding: '1.25rem 1rem',
                        fontSize: '0.875rem',
                        lineHeight: '1.7',
                        background: 'var(--bg-elevated)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {children}
                    </pre>
                  </div>
                )
              },
              img: ({ src, alt }) => (
                <img src={src} alt={alt} className="w-full h-auto my-6 rounded-lg border border-line" loading="lazy" />
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-6 border border-line rounded-lg">
                  <table className="min-w-full text-sm">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th className="px-4 py-2 text-left border-b border-line text-ink bg-[var(--bg-elevated)]">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2 border-b border-line text-ink/85 last:border-0">{children}</td>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {post.tags?.length ? (
          <div className="mt-12 pt-8 border-t border-line">
            <p className="font-mono-ui text-[11px] uppercase tracking-wider text-muted mb-3">
              {t({ en: 'Tags', zh: '标签' })}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="tag-chip tag-chip-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-12 pt-8 border-t border-line">
          <button onClick={() => navigate('/blog')} className="btn btn-secondary">
            <span className="btn-label inline-flex items-center gap-2">
              <ArrowIcon direction="left" size={14} />
              {t({ en: 'All posts', zh: '全部文章' })}
            </span>
          </button>
        </div>
      </article>

    </SubPageShell>
  )
}

export default BlogPostPage
