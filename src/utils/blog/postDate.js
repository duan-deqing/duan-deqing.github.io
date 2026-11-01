/**
 * ============================================================================
 *  postDate.js — 文章日期解析
 * ============================================================================
 *
 * 文章日期通常来自文件名 / frontmatter，形如 `2026-01-01`（日期字符串）。
 * ECMAScript 把纯日期字符串按 UTC 解析，在 UTC 负时区会回退到前一年
 * （例如 UTC-5 下 `2026-01-01` 变成 2025-12-31），导致年份分组与显示错误。
 *
 * 这里的规则：
 * - `YYYY-MM-DD`（可带本地时间后缀，如 `2026-01-01 09:30`）按【本地时间】构造；
 * - 其它格式（含带 Z / 时区偏移的完整 ISO 时间戳）交给 `new Date(value)`；
 * - 空值或非法日期返回 `null`。
 * ============================================================================
 */

// 日期 + 可选的本地时间后缀；带 Z / ±HH:MM 时区信息的时间戳不会命中，走 new Date
const LOCAL_DATE_TIME =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?$/

export function parsePostDate(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value === 'string') {
    const text = value.trim()
    if (!text) return null

    const match = LOCAL_DATE_TIME.exec(text)
    if (match) {
      const year = Number(match[1])
      const month = Number(match[2])
      const day = Number(match[3])
      const hours = match[4] ? Number(match[4]) : 0
      const minutes = match[5] ? Number(match[5]) : 0
      const seconds = match[6] ? Number(match[6]) : 0
      const milliseconds = match[7] ? Number(match[7].padEnd(3, '0')) : 0
      const local = new Date(year, month - 1, day, hours, minutes, seconds, milliseconds)

      // 拒绝溢出日期（如 2026-02-30、2026-13-01），Date 会自动进位
      if (
        local.getFullYear() !== year ||
        local.getMonth() !== month - 1 ||
        local.getDate() !== day
      ) {
        return null
      }
      return local
    }

    const parsed = new Date(text)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  return null
}

export function getPostYear(value) {
  const date = parsePostDate(value)
  return date ? date.getFullYear() : 0
}
