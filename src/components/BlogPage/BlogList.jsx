import PostRow from '../HomePage/PostRow'

export default function BlogList({ posts, t }) {
  if (!posts?.length) {
    return (
      <p className="py-12 font-mono-ui text-sm text-muted">
        {t({ en: 'No posts found. Try another filter.', zh: '没有匹配的文章，试试其他筛选。' })}
      </p>
    )
  }

  return (
    <div className="border-t border-line">
      {posts.map((post) => (
        <PostRow key={post.slug} post={post} t={t} />
      ))}
    </div>
  )
}
