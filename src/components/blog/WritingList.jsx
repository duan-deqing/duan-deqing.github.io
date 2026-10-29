import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { categoryLabel, formatDate } from '../../utils/postFormat'

export default function WritingList({ posts, t, activeSlug, resetKey }) {
  if (!posts?.length) {
    return (
      <p className="py-8 text-sm text-muted">
        {t({ en: '{ nothing here yet }', zh: '{ 暂无匹配文章 }' })}
      </p>
    )
  }

  return (
    <ul key={resetKey} className="flex flex-col gap-1 text-sm">
      {posts.map((post, index) => {
        const active = activeSlug === post.slug
        return (
          <li
            key={post.slug}
            className="writing-card-enter"
            style={{ '--card-index': Math.min(index, 12) }}
          >
            <Link
              to={`/blog/${post.slug}`}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex flex-col gap-1 rounded-lg p-2 transition-colors duration-300',
                active ? 'bg-active text-active-fg' : 'hover:bg-hover'
              )}
            >
              <span className={cn('font-medium', active ? 'text-active-fg' : 'text-heading')}>
                {t(post.title)}
              </span>
              <span className={cn(active ? 'text-active-fg opacity-70' : 'text-muted')}>
                <time dateTime={post.date}>{formatDate(post.date, t)}</time>
                <span aria-hidden="true"> · </span>
                {categoryLabel(post.category, t)}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
