/**
 * ============================================================================
 *  BlogPost.jsx - 博客文章卡片组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 显示单篇文章的卡片
 * 2. 包含标题、摘要、日期、分类标签
 * 3. 悬停效果和动画
 * 4. 精选文章特殊标记
 * 5. 点击跳转到文章详情页面
 *
 * 【Props】
 * - post: object - 文章数据
 * - t: function - 翻译函数
 * ============================================================================
 */

import { Link } from 'react-router-dom'

export default function BlogPost({ post, t }) {
  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString(t({ en: 'en-US', zh: 'zh-CN' }), options)
  }

  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group relative bg-white dark:bg-gray-800 rounded-xl border transition-all duration-300 hover:shadow-[0_0_15px_rgba(234,88,12,0.3)] dark:hover:shadow-[0_0_15px_rgba(234,88,12,0.2)] block ${
        post.featured
          ? 'border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600'
          : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
      }`}
    >
      {/* 精选文章标记 */}
      {post.featured && (
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
            {t({ en: 'Featured', zh: '精选' })}
          </span>
        </div>
      )}

      {/* 文章内容 */}
      <div className="p-6">
        {/* 分类、日期和阅读时间 */}
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
            {post.category}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(post.date)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t(post.readTime)}
          </span>
        </div>

        {/* 标题 */}
        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {t(post.title)}
        </h2>

        {/* 摘要 */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {t(post.excerpt)}
        </p>

        {/* 底部信息 */}
        <div className="flex items-center justify-between">
          {/* 标签 */}
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}