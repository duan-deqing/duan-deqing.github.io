export function groupPostsByYear(posts = []) {
  const groups = []
  for (const post of posts) {
    const year = new Date(post.date).getFullYear()
    const last = groups[groups.length - 1]
    if (last && last.year === year) last.posts.push(post)
    else groups.push({ year, posts: [post] })
  }
  return groups
}
