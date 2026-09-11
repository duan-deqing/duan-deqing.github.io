/**
 * BlogList — 编辑列表（分类切换时错落入场）
 */

import BlogPost from './BlogPost'

export default function BlogList({ posts, t }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="py-16 text-muted font-mono-ui text-sm">
        {t({ en: 'No posts found in this category', zh: '该分类下暂无文章' })}
      </div>
    )
  }

  return (
    <div className="border-t border-line row-link-list">
      {posts.map((post, index) => (
        <div
          key={post.slug}
          className="blog-list-item"
          style={{ animationDelay: `${Math.min(index * 45, 360)}ms` }}
        >
          <BlogPost post={post} t={t} index={index} />
        </div>
      ))}
    </div>
  )
}
