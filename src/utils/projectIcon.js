function resolveIconFolder(value, folder) {
  if (typeof value !== 'string') return null
  const icon = value.trim()
  if (!icon) return null
  if (/^(?:https?:)?\/\//.test(icon) || icon.startsWith('/') || icon.startsWith('data:image/')) {
    return icon
  }
  const clean = icon.replace(/^\.?\//, '')
  return clean.startsWith(`${folder}/`) ? `/${clean}` : `/${folder}/${clean}`
}

export function resolveProjectIcon(value) {
  return resolveIconFolder(value, 'images/projects')
}

export function resolveBookmarkCategoryIcon(value) {
  return resolveIconFolder(value, 'images/bookmark-categories')
}

export function resolveButtonIcon(value) {
  return resolveIconFolder(value, 'images/buttons')
}

export function resolveStackIcon(value) {
  return resolveIconFolder(value, 'images/stack')
}

export function getProjectInitial(title) {
  const name = typeof title === 'string' ? title : title?.en || title?.zh || ''
  return (name.trim()[0] || '?').toUpperCase()
}
