const BADGE_HOSTS = [
  'shields.io',
  'badgen.net',
  'badge.fury.io',
  'badgesize.io',
  'gitter.im',
  'codecov.io',
]

export function isBadgeImage(src) {
  if (!src) return false

  let url
  try {
    url = new URL(src, 'https://local.invalid')
  } catch {
    return false
  }

  if (url.hostname === 'local.invalid') return false

  const host = url.hostname.toLowerCase()
  if (BADGE_HOSTS.some((name) => host === name || host.endsWith(`.${name}`))) {
    return true
  }

  return host === 'github.com' && /\/badge\.svg$/i.test(url.pathname)
}
