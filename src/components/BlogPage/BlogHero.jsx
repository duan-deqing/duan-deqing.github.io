/**
 * ============================================================================
 *  BlogHero.jsx - 博客页面标题区域组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 显示博客页面的标题和副标题
 * 2. 与主站Hero风格一致
 * 3. 简洁的设计风格
 * 4. 包含RSS订阅链接
 *
 * 【Props】
 * - t: function - 翻译函数
 * ============================================================================
 */

import blogConfig from '../../blogConfig'

export default function BlogHero({ t }) {
  return (
    <section className="px-6 pt-24 pb-12 md:pt-32 md:pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between">
          <div>
            {/* 页面标题 */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white"
              style={{ fontFamily: '"Geist Pixel", monospace' }}
            >
              {t(blogConfig.page.title)}
            </h1>

            {/* 页面副标题 */}
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400">
              {t(blogConfig.page.subtitle)}
            </p>
          </div>

          {/* RSS 订阅链接 */}
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all group mt-2"
            title="RSS Feed"
          >
            <svg
              className="w-5 h-5 text-orange-500 dark:text-orange-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.37 20 6.18 20C5 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z"/>
            </svg>
            <span className="text-sm font-medium hidden sm:inline">
              {t({ en: 'RSS', zh: 'RSS' })}
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}