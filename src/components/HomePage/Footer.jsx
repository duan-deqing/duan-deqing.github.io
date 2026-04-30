/**
 * ============================================================================
 *  Footer.jsx - 页脚组件
 * ============================================================================
 * 
 * 【功能说明】
 * 1. 显示版权信息
 * 2. 居中显示
 * 3. 不参与语言切换
 * 
 * 【布局结构】
 * ┌─────────────────────────────────────┐
 * │   © 2024 Developer. All rights...   │
 * └─────────────────────────────────────┘
 * 
 * 【自定义提示】
 * - 修改版权信息: 在 config.js 中修改 footer.copyright
 * ============================================================================
 */

import config from '../../config'

export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-gray-200 dark:border-gray-700">
      <div style={{ maxWidth: '64rem', margin: '0 auto' }} className="flex items-center justify-center">
        {/* 版权信息 - 直接显示，不使用翻译函数 */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {config.footer.copyright}
        </p>
      </div>
    </footer>
  )
}
