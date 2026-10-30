import blogConfig from '@content/pages/blog.yaml'
import { parsePostDate } from './postDate.js'

export function formatDate(dateString, t) {
  const date = parsePostDate(dateString)
  if (!date) return ''
  return date.toLocaleDateString(t({ en: 'en-CA', zh: 'zh-CN' }), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function categoryLabel(id, t) {
  const category = blogConfig.categories.find((item) => item.id === id)
  return category ? t(category.label) : id
}
