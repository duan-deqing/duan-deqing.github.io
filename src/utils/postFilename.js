/**
 * ============================================================================
 *  postFilename.js - 文章文件名工具
 * ============================================================================
 *
 * 【命名约定】
 * 文件名格式: yyyy-mm-dd-slug.md，英文文章追加 -en 后缀
 * 例如: 2026-04-20-building-modern-portfolio.md
 *       2023-07-23-markdown-tutorial-en.md
 *
 * 【使用方式】
 * 站点 (src/utils/markdown.js) 与后台共用，纯函数、无副作用。
 * ============================================================================
 */

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function parsePostFilename(filename) {
  const base = String(filename).replace(/\.md$/, '')
  const isEnglish = base.endsWith('-en')
  const clean = isEnglish ? base.slice(0, -3) : base
  const match = clean.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/)
  return match
    ? { date: match[1], slug: match[2], isEnglish }
    : { date: '', slug: clean, isEnglish }
}

export function buildPostFilename({ date, slug, lang }) {
  return `${date}-${slug}${lang === 'en' ? '-en' : ''}.md`
}

export function postImageDirName(filename) {
  return String(filename).replace(/\.md$/, '').replace(/-en$/, '')
}

export function isValidPostSlug(slug) {
  return SLUG_RE.test(String(slug))
}

export function isValidPostDate(date) {
  if (!DATE_RE.test(String(date))) return false
  const parsed = new Date(`${date}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date
}
