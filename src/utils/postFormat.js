import blogConfig from '../content/blog.yaml'

export function formatDate(dateString, t) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString(t({ en: 'en-CA', zh: 'zh-CN' }), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function categoryLabel(id, t) {
  const category = blogConfig.categories.find((item) => item.id === id)
  return category ? t(category.label) : id
}
