import path from 'node:path'

const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1'])

export function isLoopback(address) {
  return typeof address === 'string' && LOOPBACK.has(address)
}

export function isSameOrigin(origin, host) {
  if (!origin) return true
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export function isSafeFileName(name) {
  return (
    typeof name === 'string' &&
    name.length > 0 &&
    name.length <= 120 &&
    /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(name) &&
    !name.includes('..')
  )
}

export function isPostFileName(name) {
  return (
    typeof name === 'string' &&
    /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*(?:-en)?\.md$/.test(name)
  )
}

export function assertInside(baseDir, targetPath) {
  const rel = path.relative(baseDir, targetPath)
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) {
    throw Object.assign(new Error('非法路径'), { status: 400 })
  }
  return targetPath
}

export const SITE_IMAGE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.ico',
])

export const POST_IMAGE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg',
])

export function isAllowedImage(name, target) {
  if (!isSafeFileName(name)) return false
  const ext = path.extname(name).toLowerCase()
  const allowed = target === 'post' ? POST_IMAGE_EXTENSIONS : SITE_IMAGE_EXTENSIONS
  return allowed.has(ext)
}
