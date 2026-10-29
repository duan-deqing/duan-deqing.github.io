import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useLanguage } from '../hooks/useLanguage'
import { getPostBySlug } from '../utils/markdown'
import PageTitle from '../components/shared/PageTitle'
import TagChip from '../components/shared/TagChip'
import ArrowIcon from '../components/shared/ArrowIcon'
import TableOfContents from '../components/BlogPage/TableOfContents'
import { markdownComponents } from '../components/BlogPage/markdownComponents'
import { categoryLabel, formatDate } from '../utils/postFormat'
import '../styles/blog-post.css'

export default function BlogPostPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { lang, t } = useLanguage()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

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

  if (loading) {
    return (
      <div className="container-page flex min-h-[50vh] items-center justify-center">
        <p className="font-mono-ui text-sm text-muted">
          {t({ en: 'Loading…', zh: '加载中…' })}
        </p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink">
          {t({ en: 'Post not found', zh: '文章未找到' })}
        </h1>
        <p className="mt-3 text-muted">
          {t({ en: 'The post you are looking for does not exist.', zh: '您查找的文章不存在。' })}
        </p>
        <button
          type="button"
          onClick={() => navigate('/blog')}
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-page transition-colors hover:bg-accent"
        >
          {t({ en: 'Back to blog', zh: '返回博客' })}
          <ArrowIcon direction="right" size={14} />
        </button>
      </div>
    )
  }

  return (
    <>
      <PageTitle
        title={`STYLAN · ${t(post.title)}`}
        description={t(post.excerpt)}
        t={t}
        lang={lang}
        type="article"
      />

      <div className="py-10 sm:py-12 xl:grid xl:grid-cols-[minmax(0,68ch)_12rem] xl:justify-center xl:gap-12">
        <article className="mx-auto w-full min-w-0 max-w-[68ch] xl:max-w-none">
          <Link
            to="/blog"
            className="mb-8 inline-flex items-center gap-2 font-mono-ui text-[11px] uppercase tracking-[0.08em] text-muted transition-colors hover:text-accent"
          >
            <ArrowIcon direction="left" size={13} />
            {t({ en: 'All posts', zh: '全部文章' })}
          </Link>

          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            <TagChip>{categoryLabel(post.category, t)}</TagChip>
            {post.featured ? (
              <TagChip active>{t({ en: 'Featured', zh: '精选' })}</TagChip>
            ) : null}
          </div>

          <h1 className="text-[clamp(2rem,5vw,2.75rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-ink">
            {t(post.title)}
          </h1>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-b border-line pb-6 font-mono-ui text-[11px] uppercase tracking-[0.06em] text-muted">
            <span>{formatDate(post.date, t)}</span>
            {post.readTime ? <span>{t(post.readTime)}</span> : null}
          </div>

          {post.excerpt ? (
            <p className="mt-6 border-l-2 border-accent pl-4 text-[15px] leading-[1.8] text-muted">
              {t(post.excerpt)}
            </p>
          ) : null}

          <details className="mt-8 border-y border-line py-3 xl:hidden">
            <summary className="cursor-pointer font-mono-ui text-[11px] uppercase tracking-[0.08em] text-muted">
              {t({ en: 'Table of contents', zh: '目录' })}
            </summary>
            <div className="mt-3">
              <TableOfContents content={post.content} />
            </div>
          </details>

          <div className="mt-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              urlTransform={(url) => url}
              components={markdownComponents}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {post.tags?.length ? (
            <div className="mt-12 border-t border-line pt-6">
              <p className="mb-3 font-mono-ui text-[10px] uppercase tracking-[0.1em] text-muted">
                {t({ en: 'Tags', zh: '标签' })}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <TagChip key={tag}>{tag}</TagChip>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-10 border-t border-line pt-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-mono-ui text-[11px] uppercase tracking-[0.08em] text-muted transition-colors hover:text-accent"
            >
              <ArrowIcon direction="left" size={13} />
              {t({ en: 'All posts', zh: '全部文章' })}
            </Link>
          </div>
        </article>

        <aside className="hidden xl:block">
          <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <TableOfContents content={post.content} />
          </div>
        </aside>
      </div>
    </>
  )
}
