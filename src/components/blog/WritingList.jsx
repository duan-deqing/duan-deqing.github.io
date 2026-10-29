import { Link } from 'react-router-dom'
import { categoryLabel, formatDate } from '../../utils/postFormat'

export default function WritingList({ posts, t }) {
  if (!posts?.length) {
    return (
      <p className="py-8 text-sm text-muted">
        {t({ en: '{ nothing here yet }', zh: '{ 暂无匹配文章 }' })}
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-1 text-sm">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            to={`/blog/${post.slug}`}
            className="writing-row flex flex-col gap-1 rounded-lg p-2 transition-colors duration-300 hover:bg-hover"
          >
            <span className="font-medium text-heading">{t(post.title)}</span>
            <span className="text-muted">
              <time dateTime={post.date}>{formatDate(post.date, t)}</time>
              <span aria-hidden="true"> · </span>
              {categoryLabel(post.category, t)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
