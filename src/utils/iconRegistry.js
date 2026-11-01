function isAbsoluteAsset(value) {
  return (
    /^(?:https?:)?\/\//.test(value) ||
    value.startsWith('/') ||
    value.startsWith('data:image/')
  )
}

/**
 * 按图标名称从登记表解析出 public 下的资源路径。
 * 找不到名称时兼容旧的站内路径、http(s) 与 data:image 写法。
 */
export function resolveIconName(value, icons = {}) {
  if (typeof value !== 'string') return null
  const key = value.trim()
  if (!key) return null

  const file = icons[key]?.file
  if (typeof file === 'string' && file.trim()) {
    const path = file.trim()
    if (isAbsoluteAsset(path)) return path
    return `/${path.replace(/^\.?\//, '')}`
  }

  return isAbsoluteAsset(key) ? key : null
}

export function resolveIconEntry(value, icons = {}) {
  if (typeof value !== 'string') return null
  const key = value.trim()
  if (!key) return null

  const entry = icons[key]
  if (!entry || typeof entry !== 'object') return null

  const link = typeof entry.link === 'string' ? entry.link.trim() : ''
  const color = typeof entry.color === 'string' ? entry.color.trim() : ''

  return {
    src: resolveIconName(key, icons),
    link: link || null,
    color: color || null,
  }
}

export function getProjectInitial(title) {
  const name = typeof title === 'string' ? title : title?.en || title?.zh || ''
  return (name.trim()[0] || '?').toUpperCase()
}
