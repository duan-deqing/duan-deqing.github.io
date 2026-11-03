/** 后台展示用：双语字段优先中文，其次英文；纯字符串原样返回。 */
export function displayText(value, fallback = '') {
  if (typeof value === 'string') return value || fallback
  if (value && typeof value === 'object') return value.zh || value.en || fallback
  return fallback
}
