/**
 * blogSearch — 博客列表搜索的纯函数工具
 */

export function searchPosts(posts, query, t) {
  const list = posts || []
  const term = String(query || '').trim().toLowerCase()
  if (!term) return list
  return list.filter((post) => {
    const haystack = [
      t(post.title),
      t(post.excerpt),
      (post.tags || []).join(' '),
      post.category,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(term)
  })
}
