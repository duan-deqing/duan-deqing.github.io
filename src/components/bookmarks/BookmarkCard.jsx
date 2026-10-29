import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { getBookmarkDomain } from '../../utils/bookmarkFormat'
import { LinkIcon } from '../site/icons'

export default function BookmarkCard({ bookmark, index }) {
  const { t } = useLanguage()
  const [coverFailed, setCoverFailed] = useState(false)
  const domain = getBookmarkDomain(bookmark.url)
  const showCover = Boolean(bookmark.cover) && !coverFailed
  const initial = (domain[0] || '?').toUpperCase()

  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bookmark-card bookmark-card-enter"
      style={{ '--bookmark-index': Math.min(index, 12) }}
    >
      <span className="bookmark-media">
        {showCover ? (
          <img
            src={bookmark.cover}
            alt=""
            width={1200}
            height={630}
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <span className="bookmark-media-fallback" aria-hidden="true">
            <span className="bookmark-media-mark">{initial}</span>
          </span>
        )}
      </span>

      <span className="bookmark-body">
        <span className="bookmark-title">{bookmark.title}</span>
        <span className="bookmark-domain">
          <LinkIcon size={15} />
          <span className="bookmark-domain-text">{domain}</span>
        </span>
        {bookmark.description ? (
          <span className="bookmark-description">{t(bookmark.description)}</span>
        ) : null}
      </span>
    </a>
  )
}
