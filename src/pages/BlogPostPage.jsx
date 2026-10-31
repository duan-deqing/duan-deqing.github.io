import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { getPostBySlug } from '../utils/markdown'
import { extractHeadings } from '../utils/markdownHeading'
import { categoryLabel, formatDate } from '../utils/postFormat'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'
import ParentLink from '../components/site/ParentLink'
import FooterInfo from '../components/site/FooterInfo'
import TableOfContents from '../components/BlogPage/TableOfContents'
import BlogMarkdown from '../components/blog/BlogMarkdown'
import '../styles/math.css'
import '../styles/markdown-extras.css'
import '../styles/blog-post.css'

export default function BlogPostPage() {
  const { slug } = useParams()
  const { lang, t } = useLanguage()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const headings = useMemo(
    () => (post ? extractHeadings(post.content) : []),
    [post]
  )

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
    if (!post) return undefined

    let frame = 0
    const scrollToHash = () => {
      const raw = window.location.hash.slice(1)
      if (!raw) return

      let id = raw
      try {
        id = decodeURIComponent(raw)
      } catch {
        // 保持原始 hash
      }

      const target = document.getElementById(id)
      if (!target) return

      let details = target.closest('details')
      while (details) {
        details.open = true
        details = details.parentElement?.closest('details') || null
      }

      frame = requestAnimationFrame(() => {
        target.scrollIntoView({ block: 'start' })
      })
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', scrollToHash)
    }
  }, [post])

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
        <ParentLink
          to="/blog"
          label={t({ en: 'Back to blog', zh: '返回博客' })}
          className="mt-6"
        />
      </div>
    )
  }

  return (
    <div className="article-page relative mx-auto w-full">
      <div className="article-glow hidden xl:block" aria-hidden="true" />
      <PageTitle
        title={`STYLAN · ${t(post.title)}`}
        description={t(post.excerpt)}
        t={t}
        lang={lang}
        type="article"
      />

      <div className={`article-layout${headings.length ? ' has-toc hover-reveal' : ''}`}>
        {headings.length ? (
          <aside className="article-toc">
            <TableOfContents content={post.content} />
          </aside>
        ) : null}

        <div className="article-main slide-enter-content relative">
          <ParentLink
            to="/blog"
            label={t({ en: 'Back to blog', zh: '返回博客' })}
            className="lg:hidden"
          />

          <div className="mt-6 lg:mt-0">
            <PageHeading title={t(post.title)} />
            <div className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
              <time dateTime={post.date}>{formatDate(post.date, t)}</time>
              {post.duration ? <span aria-hidden="true">·</span> : null}
              {post.duration ? <span>{post.duration}</span> : null}
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

          <article className="article-content min-w-0">
            <BlogMarkdown content={post.content} />
          </article>
          <div className="mt-14 lg:hidden">
            <FooterInfo
              showReference={false}
              className="text-sm opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
