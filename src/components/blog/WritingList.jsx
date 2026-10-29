import { Link } from 'react-router-dom'
import { categoryLabel, formatDate } from '../../utils/postFormat'

export default function WritingList({ groups, t }) {
  if (!groups?.length) {
    return (
      <p className="py-8 text-sm text-muted">
        {t({ en: '{ nothing here yet }', zh: '{ 暂无匹配文章 }' })}
      </p>
    )
  }

  return (
    <table className="writing-table w-full text-sm">
      <thead className="hidden md:table-header-group">
        <tr className="text-left text-muted">
          <th scope="col" className="w-16 pb-2 font-normal">
            Year
          </th>
          <th scope="col" className="w-24 pb-2 font-normal">
            Date
          </th>
          <th scope="col" className="pb-2 font-normal">
            Title
          </th>
          <th scope="col" className="w-28 pb-2 text-right font-normal">
            Category
          </th>
        </tr>
      </thead>
      <tbody>
        {groups.flatMap((group) =>
          group.posts.map((post, index) => (
            <tr key={post.slug} className="relative border-t border-line">
              <td className="hidden py-4 pr-4 align-baseline text-muted tabular-nums md:table-cell">
                {index === 0 ? group.year : ''}
              </td>
              <td className="hidden py-4 pr-4 align-baseline text-muted tabular-nums md:table-cell">
                <time dateTime={post.date}>{formatDate(post.date, t)}</time>
              </td>
              <th scope="row" className="py-4 text-left align-baseline font-normal">
                <Link
                  to={`/blog/${post.slug}`}
                  className="font-medium text-heading transition-colors after:absolute after:inset-0 hover:text-accent"
                >
                  {t(post.title)}
                </Link>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted md:hidden">
                  <time dateTime={post.date}>{formatDate(post.date, t)}</time>
                  <span aria-hidden="true">·</span>
                  <span>{categoryLabel(post.category, t)}</span>
                </div>
              </th>
              <td className="hidden py-4 pl-4 text-right align-baseline text-muted md:table-cell">
                {categoryLabel(post.category, t)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
