/**
 * blogFilters — 博客列表的纯函数筛选工具
 */

export function collectTags(posts, limit = 8) {
  const counts = new Map()
  const order = new Map()

  for (const post of posts || []) {
    for (const tag of post.tags || []) {
      counts.set(tag, (counts.get(tag) || 0) + 1)
      if (!order.has(tag)) order.set(tag, order.size)
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || order.get(a[0]) - order.get(b[0]))
    .slice(0, limit)
    .map(([tag]) => tag)
}

export function filterPosts(posts, { category = 'all', tag = null } = {}) {
  return (posts || []).filter((post) => {
    const matchCategory = category === 'all' || post.category === category
    const matchTag = !tag || (post.tags || []).includes(tag)
    return matchCategory && matchTag
  })
}
