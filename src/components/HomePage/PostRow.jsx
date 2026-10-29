import { Link } from 'react-router-dom'
import { categoryLabel, formatDate } from '../../utils/postFormat'

export default function PostRow({ post, t, showTags = true }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group grid gap-1 border-b border-line py-5 sm:grid-cols-[6rem_1fr_auto] sm:gap-6"
    >
      <time className="font-mono-ui text-[11px] uppercase tracking-[0.08em] text-muted sm:pt-1">
        {formatDate(post.date, t)}
      </time>

      <div className="min-w-0">
        <h3 className="text-[1.125rem] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
          {t(post.title)}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.7] text-muted">
          {t(post.excerpt)}
        </p>
        {showTags && post.tags?.length ? (
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 4).map((tag) => (
              <li key={tag} className="tag-chip">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <span className="hidden pt-1 font-mono-ui text-[10px] uppercase tracking-[0.06em] text-muted sm:block">
        {categoryLabel(post.category, t)}
      </span>
    </Link>
  )
}
