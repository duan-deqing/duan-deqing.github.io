import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { getBookmarkCover, getBookmarkDomain } from '../../utils/bookmarkFormat'
import ContentCard from '../shared/ContentCard'
import { LinkIcon } from '../site/icons'

export default function BookmarkCard({ bookmark, index }) {
  const { t } = useLanguage()
  const [coverFailed, setCoverFailed] = useState(false)
  const cover = getBookmarkCover(bookmark)
  const domain = getBookmarkDomain(bookmark.url)
  const showCover = Boolean(cover) && !coverFailed
  const initial = (domain[0] || '?').toUpperCase()

  return (
    <ContentCard
      href={bookmark.url}
      index={index}
      title={bookmark.title}
      meta={domain}
      MetaIcon={LinkIcon}
      description={bookmark.description ? t(bookmark.description) : null}
      media={
        showCover ? (
          <img
            src={cover}
            alt=""
            width={1200}
            height={630}
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <span className="content-card-media-fallback" aria-hidden="true">
            <span className="content-card-media-mark">{initial}</span>
          </span>
        )
      }
    />
  )
}
