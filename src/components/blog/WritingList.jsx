import { Link } from 'react-router-dom'
import { categoryLabel, formatDate } from '../../utils/postFormat'

const GRID_COLUMNS = 'md:grid-cols-[4rem_6.25rem_minmax(0,1fr)_7rem]'

export default function WritingList({ groups, t }) {
  if (!groups?.length) {
    return (
      <p className="py-8 text-sm text-muted">
        {t({ en: '{ nothing here yet }', zh: '{ 暂无匹配文章 }' })}
      </p>
    )
  }

  return (
    <div className="writing-list w-full text-sm">
      <div
        className={`hidden gap-x-4 pb-2 text-left text-muted md:grid ${GRID_COLUMNS}`}
      >
        <span>Year</span>
        <span>Date</span>
        <span>Title</span>
        <span className="text-right">Category</span>
      </div>
      {groups.map((group) => (
        <ul key={group.year}>
          {group.posts.map((post, index) => (
            <li key={post.slug} className="border-t border-line">
              <Link
                to={`/blog/${post.slug}`}
                className={`writing-row grid grid-cols-1 gap-x-4 py-4 text-heading transition-colors hover:text-accent md:items-baseline ${GRID_COLUMNS}`}
              >
                <span className="hidden text-muted tabular-nums md:block">
                  {index === 0 ? group.year : ''}
                </span>
                <span className="hidden text-muted tabular-nums md:block">
                  <time dateTime={post.date}>{formatDate(post.date, t)}</time>
                </span>
                <span className="min-w-0">
                  <span className="mb-1 flex justify-between gap-2 md:hidden">
                    <time dateTime={post.date} className="text-xs text-muted">
                      {formatDate(post.date, t)}
                    </time>
                    <span className="text-xs text-muted">{categoryLabel(post.category, t)}</span>
                  </span>
                  <span className="font-medium">{t(post.title)}</span>
                </span>
                <span className="hidden text-right text-muted md:block">
                  {categoryLabel(post.category, t)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}
