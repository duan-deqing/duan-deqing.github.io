/**
 * Footer.jsx - 页脚组件
 * 
 * 页脚信息不参与语言切换
 */

import config from '../config'

export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-gray-200 dark:border-gray-700">
      <div style={{ maxWidth: '64rem', margin: '0 auto' }} className="flex items-center justify-center">
        {/* 版权信息 - 直接显示，不使用 t() */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {config.footer.copyright}
        </p>
      </div>
    </footer>
  )
}
