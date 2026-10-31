import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import blogConfig from '@content/pages/blog.yaml'
import config from '@content/site.yaml'
import homeIntroEn from '@content/pages/home.en.md?raw'
import homeIntroZh from '@content/pages/home.zh.md?raw'
import { useLanguage } from '../hooks/useLanguage'
import { getAllPosts } from '../utils/markdown'
import PageTitle from '../components/shared/PageTitle'
import RichText from '../components/shared/RichText'
import WritingTable from '../components/blog/WritingTable'
import QuoteFooter from '../components/site/QuoteFooter'

function WritingTableSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse motion-reduce:animate-none">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 border-t border-line py-4">
          <span className="hidden h-4 w-12 rounded bg-subtle md:block" />
          <span className="hidden h-4 w-20 rounded bg-subtle md:block" />
          <span className="h-4 flex-1 rounded bg-subtle" />
          <span className="hidden h-4 w-16 rounded bg-subtle md:block" />
        </div>
      ))}
    </div>
  )
}

export default function SubpageHomePage() {
  const { lang, t } = useLanguage()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    setFailed(false)
    setLoading(true)
    getAllPosts(lang)
      .then((value) => {
        if (!cancelled) setPosts(value)
      })
      .catch((error) => {
        console.error('[SubpageHomePage] Failed to load posts:', error)
        if (!cancelled) setFailed(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [lang])

  return (
    <div className="slide-enter-content mx-auto w-full max-w-3xl">
      <PageTitle
        title={`STYLAN · ${t({ en: 'Home', zh: '首页' })}`}
        description={config.site?.description}
        t={t}
        lang={lang}
      />

      <h1 className="sr-only">{t({ en: 'Home', zh: '首页' })}</h1>

      <RichText content={lang === 'zh' ? homeIntroZh : homeIntroEn} />

      <h2 className="mt-8 mb-4 text-lg font-semibold tracking-tight text-heading">
        <Link to="/blog" className="underline-offset-4 hover:underline">
          {t(blogConfig.page.title)}
        </Link>
      </h2>

      {loading ? (
        <WritingTableSkeleton />
      ) : failed ? (
        <p className="py-8 text-sm text-muted">
          {t({ en: 'Unable to load posts.', zh: '文章加载失败。' })}
        </p>
      ) : (
        <WritingTable posts={posts} t={t} />
      )}

      <QuoteFooter />
    </div>
  )
}
