import bookmarksConfig from '@content/pages/bookmarks.yaml'

export const bookmarkCategories = bookmarksConfig.categories || []

export function getBookmarkCategory(slug) {
  return bookmarkCategories.find((category) => category.slug === slug) || null
}
