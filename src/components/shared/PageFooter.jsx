/**
 * ============================================================================
 *  PageFooter.jsx - 通用页面页脚组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 可复用的页面页脚
 * 2. 显示版权信息
 * 3. 返回顶部按钮
 * 4. 支持中英文切换
 *
 * 【Props】
 * - t: function - 翻译函数
 * - copyright: string - 版权信息（可选，默认使用 config 中的值）
 * - showBackToTop: boolean - 是否显示返回顶部按钮（默认：true）
 * ============================================================================
 */

import config from '../../config'
import theme from '../../theme'

export default function PageFooter({ t, copyright, showBackToTop = true }) {
  return (
    <footer className={`py-8 px-6 border-t ${theme.footer.border}`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className={`text-sm ${theme.footer.text.light} ${theme.footer.text.dark}`}>
          {copyright || config.footer.copyright}
        </p>
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`text-sm transition-colors ${theme.footer.link.light} ${theme.footer.link.dark} ${theme.footer.link.hoverLight} ${theme.footer.link.hoverDark}`}
          >
            {t({ en: 'BACK TO TOP ↑', zh: '返回顶部 ↑' })}
          </button>
        )}
      </div>
    </footer>
  )
}
