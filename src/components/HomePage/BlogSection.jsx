/**
 * ============================================================================
 *  BlogSection.jsx - 主页博客区块组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 展示精选博客文章
 * 2. 点击跳转到对应博客文章
 * 3. 支持深色/浅色模式
 *
 * 【Props】
 * - posts: array - 文章列表
 * - t: function - 翻译函数
 * ============================================================================
 */

import { Link } from 'react-router-dom'

export default function BlogSection({ posts, t }) {
  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return date.toLocaleDateString(t({ en: 'en-US', zh: 'zh-CN' }), options)
  }

  // 获取精选文章或最新文章（最多3篇）
  const featuredPosts = posts
    .filter(post => post.featured)
    .slice(0, 3)
  
  const displayPosts = featuredPosts.length >= 3 
    ? featuredPosts 
    : posts.slice(0, 3)

  if (displayPosts.length === 0) return null

  return (
    <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-6xl mx-auto">
        {/* 区块标题 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t({ en: 'Latest Posts', zh: '最新文章' })}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {t({ en: 'Check out my recent articles', zh: '查看我最近的文章' })}
          </p>
        </div>

        {/* 文章卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-[0_0_15px_rgba(234,88,12,0.3)] dark:hover:shadow-[0_0_15px_rgba(234,88,12,0.2)] hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300"
            >
              {/* 分类和日期 */}
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(post.date)}
                </span>
              </div>

              {/* 标题 */}
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {t(post.title)}
              </h3>

              {/* 摘要 */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {t(post.excerpt)}
              </p>

              {/* 阅读更多 */}
              <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                <span>{t({ en: 'Read more', zh: '阅读更多' })}</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* 查看全部按钮 */}
        <div className="text-center mt-10">
          <Link
            to="/blog"
            className="btn btn-secondary"
          >
            {t({ en: 'VIEW ALL POSTS', zh: '查看全部文章' })}
          </Link>
        </div>
      </div>
    </section>
  )
}
