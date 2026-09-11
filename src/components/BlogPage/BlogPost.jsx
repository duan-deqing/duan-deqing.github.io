/**
 * BlogPost — 单行文章（编号列表）
 * 标签：分类 / 精选 / 技术 — mono 元信息，与编辑部线框风格一致
 */

import { Link } from 'react-router-dom'
import blogConfig from '../../blogConfig'

function formatDate(dateString, t) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString(t({ en: 'en-CA', zh: 'zh-CN' }), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function categoryLabel(id, t) {
  const cat = blogConfig.categories.find((c) => c.id === id)
  return cat ? t(cat.label) : id
}

export default function BlogPost({ post, t, index = 0 }) {
  const tags = (post.tags || []).slice(0, 3)

  return (
    <Link to={`/blog/${post.slug}`} className="row-link">
      <span className="row-num">{String(index + 1).padStart(2, '0')}</span>
      <span>
        <span className="blog-card-meta">
          <span className="blog-card-category">
            {categoryLabel(post.category, t)}
          </span>
          {post.featured && (
            <>
              <span className="blog-card-dot" aria-hidden>
                ·
              </span>
              <span className="blog-card-featured">
                {t({ en: 'Featured', zh: '精选' })}
              </span>
            </>
          )}
          {tags.map((tag) => (
            <span key={tag} className="blog-card-tag">
              {tag}
            </span>
          ))}
        </span>
        <span className="row-title block">{t(post.title)}</span>
        <span className="block mt-2 text-sm text-muted line-clamp-2 max-w-2xl">
          {t(post.excerpt)}
        </span>
      </span>
      <span className="row-meta whitespace-nowrap">
        {formatDate(post.date, t)}
        {post.readTime ? (
          <span className="block mt-1 opacity-70">{t(post.readTime)}</span>
        ) : null}
      </span>
    </Link>
  )
}
