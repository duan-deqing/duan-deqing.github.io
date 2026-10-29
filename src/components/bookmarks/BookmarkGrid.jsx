import { useLanguage } from '../../hooks/useLanguage'
import BookmarkCard from './BookmarkCard'

export default function BookmarkGrid({ bookmarks = [] }) {
  const { t } = useLanguage()

  if (!bookmarks.length) {
    return (
      <p className="bookmarks-empty">
        {t({ en: 'No bookmarks in this collection yet.', zh: '这个分类还没有书签。' })}
      </p>
    )
  }

  return (
    <div className="bookmarks-grid">
      {bookmarks.map((bookmark, index) => (
        <BookmarkCard key={`${bookmark.url}-${index}`} bookmark={bookmark} index={index} />
      ))}
    </div>
  )
}
