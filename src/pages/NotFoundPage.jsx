/**
 * NotFoundPage
 */

import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/shared/PageTitle'
import ArrowIcon from '../components/shared/ArrowIcon'

function NotFoundPage() {
  const navigate = useNavigate()
  const { t, lang } = useLanguage()

  return (
    <div className="relative min-h-screen bg-page flex items-center justify-center overflow-hidden">
      <PageTitle title="STYLAN · Not Found" t={t} lang={lang} />
      <div className="absolute inset-0 bg-grid" aria-hidden />
      <div className="relative z-10 text-center px-6 max-w-lg">
        <p className="font-mono-ui text-xs tracking-[0.14em] uppercase mb-6" style={{ color: 'var(--accent)' }}>
          ERROR
        </p>
        <h1
          className="font-display font-bold text-ink mb-4 leading-none"
          style={{ fontSize: 'clamp(5rem, 20vw, 8rem)' }}
        >
          404
        </h1>
        <h2 className="font-display text-2xl font-semibold text-ink mb-3">
          {t({ en: 'Page not found', zh: '页面未找到' })}
        </h2>
        <p className="text-muted mb-10">
          {t({
            en: 'The page you are looking for does not exist or has been moved.',
            zh: '您访问的页面不存在或已被移动。',
          })}
        </p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          <span className="btn-label">{t({ en: 'Back to home', zh: '返回首页' })}</span>
          <span className="btn-arrow">
            <ArrowIcon direction="right" size={15} />
          </span>
        </button>
      </div>
    </div>
  )
}

export default NotFoundPage
