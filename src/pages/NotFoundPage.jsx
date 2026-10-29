import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/shared/PageTitle'
import ArrowIcon from '../components/shared/ArrowIcon'

export default function NotFoundPage() {
  const { t, lang } = useLanguage()

  return (
    <>
      <PageTitle title="STYLAN · Not Found" t={t} lang={lang} noindex />
      <section className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.12em] text-accent">ERROR</p>
        <h1 className="mt-4 text-[clamp(4rem,18vw,7rem)] font-semibold leading-none tracking-[-0.04em] text-ink">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-ink">
          {t({ en: 'Page not found', zh: '页面未找到' })}
        </h2>
        <p className="mt-3 max-w-md text-[15px] leading-[1.75] text-muted">
          {t({
            en: 'The page you are looking for does not exist or has been moved.',
            zh: '您访问的页面不存在或已被移动。',
          })}
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-page transition-colors hover:bg-accent"
        >
          {t({ en: 'Back to home', zh: '返回首页' })}
          <ArrowIcon direction="right" size={14} />
        </Link>
      </section>
    </>
  )
}
