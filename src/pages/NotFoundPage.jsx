/**
 * ============================================================================
 *  NotFoundPage.jsx - 404页面
 * ============================================================================
 *
 * 【功能说明】
 * 1. 显示404错误信息
 * 2. 提供返回首页的链接
 * ============================================================================
 */

import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useTheme } from '../hooks/useTheme'
import WaveAnimation from '../components/HomePage/WaveAnimation'

function NotFoundPage() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { isDark } = useTheme()

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 transition-colors flex items-center justify-center overflow-hidden">
      {/* Wave 动画背景 */}
      <div className="absolute inset-0 opacity-20">
        <WaveAnimation color={isDark ? '#f87171' : '#ef4444'} />
      </div>
      <div className="relative z-10 text-center px-6">
        <h1
          className="text-8xl font-bold text-blue-500 mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          404
        </h1>
        <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">
          {t({ en: 'Page Not Found', zh: '页面未找到' })}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {t({ en: 'The page you are looking for does not exist or has been moved.', zh: '您访问的页面不存在或已被移动' })}
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          {t({ en: 'BACK TO HOME', zh: '返回首页' })}
        </button>
      </div>
    </div>
  )
}

export default NotFoundPage