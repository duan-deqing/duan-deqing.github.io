/**
 * ============================================================================
 *  BlogHero.jsx - 博客页面标题区域组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 显示博客页面的标题和副标题
 * 2. 与主站Hero风格一致
 * 3. 简洁的设计风格
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
    </section>
  )
}