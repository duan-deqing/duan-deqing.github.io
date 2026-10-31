import fm from 'front-matter'
import YAML from 'yaml'
import { isValidPostDate } from '../../src/utils/postFilename.js'

export function normalizePostDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  return typeof value === 'string' ? value : ''
}

export function parsePost(text) {
  const { attributes, body } = fm(text)
  const frontmatter = attributes || {}
  const date = normalizePostDate(frontmatter.date)
  if (date) frontmatter.date = date
  return { frontmatter, body: String(body || '').replace(/^\n/, '') }
}

export function serializePost(frontmatter, body) {
  const yaml = YAML.stringify(frontmatter, { lineWidth: 0 }).replace(
    /^date: (\d{4}-\d{2}-\d{2})$/m,
    'date: "$1"'
  )
  const cleanBody = String(body ?? '').replace(/\s+$/, '')
  return `---\n${yaml}---\n\n${cleanBody}\n`
}

export function validateFrontmatter(frontmatter, categories = []) {
  const errors = []
  if (!frontmatter || typeof frontmatter !== 'object') return ['frontmatter 必须是对象']
  const title = frontmatter.title
  const titleOk =
    (typeof title === 'string' && title.trim().length > 0) ||
    Boolean(
      title &&
        typeof title === 'object' &&
        String(title.en || '').trim() &&
        String(title.zh || '').trim()
    )
  if (!titleOk) errors.push('标题必填（单语需非空；双语需两种语言都填写）')
  if (!isValidPostDate(frontmatter.date)) errors.push('日期格式应为 YYYY-MM-DD')
  if (!frontmatter.category) errors.push('分类必填')
  if (categories.length && !categories.some((item) => item.id === frontmatter.category)) {
    errors.push('分类不在博客分类列表中')
  }
  if (frontmatter.tags != null && !Array.isArray(frontmatter.tags)) {
    errors.push('tags 必须是数组')
  }
  return errors
}
