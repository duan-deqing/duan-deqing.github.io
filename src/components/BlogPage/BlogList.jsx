/**
 * ============================================================================
 *  BlogList.jsx - 博客文章列表组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 显示博客文章列表
 * 2. 支持响应式网格布局
 * 3. 文章卡片带悬停效果
 * 4. 空状态提示
 *
 * 【Props】
 * - posts: array - 文章列表
 * - t: function - 翻译函数
 * ============================================================================
 */

import BlogPost from './BlogPost'

export default function BlogList({ posts, t }) {
  // 空状态
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {t({ en: 'No posts found in this category', zh: '该分类下暂无文章' })}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogPost key={post.slug} post={post} t={t} />
      ))}
    </div>
  )
}