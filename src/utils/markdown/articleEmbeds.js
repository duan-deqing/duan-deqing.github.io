function stripQuotes(value) {
  const trimmed = String(value).trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

export function parseVideoBlock(source = '') {
  const data = {}

  for (const rawLine of String(source).replace(/\r\n?/g, '\n').split('\n')) {
    const line = rawLine.trim()
    if (!line) continue

    if (/^(https?:\/\/|\/)/.test(line)) {
      if (!data.url) data.url = line
      continue
    }

    const match = line.match(/^([a-z][\w-]*)\s*:\s*(.+)$/i)
    if (match) {
      data[match[1].toLowerCase()] = stripQuotes(match[2])
    }
  }

  return {
    url: data.url || '',
    title: data.title || '',
    caption: data.caption || '',
  }
}

export function getVideoEmbed(url = '') {
  const raw = String(url).trim()
  if (!raw) return null

  let parsed
  try {
    parsed = new URL(raw, 'https://local.invalid')
  } catch {
    return null
  }

  const host = parsed.hostname.replace(/^www\./, '').toLowerCase()
  const path = parsed.pathname

  if (host === 'youtu.be') {
    const id = path.split('/').filter(Boolean)[0]
    if (id) {
      return {
        type: 'iframe',
        src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=0`,
      }
    }
  }

  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const isPathId = /^\/(embed|shorts|live|v)\//.test(path)
    const id = isPathId ? path.split('/')[2] : parsed.searchParams.get('v')
    if (id) {
      return {
        type: 'iframe',
        src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=0`,
      }
    }
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const match = path.match(/(?:video\/)?(\d+)/)
    if (match) {
      return {
        type: 'iframe',
        src: `https://player.vimeo.com/video/${match[1]}?autoplay=0`,
      }
    }
  }

  if (host === 'bilibili.com' || host === 'player.bilibili.com') {
    const bvid =
      parsed.searchParams.get('bvid') || path.match(/\/video\/(BV[\w]+)/i)?.[1]
    if (bvid) {
      return {
        type: 'iframe',
        src: `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&autoplay=0`,
      }
    }
    const aid =
      parsed.searchParams.get('aid') || path.match(/\/video\/av(\d+)/i)?.[1]
    if (aid) {
      return {
        type: 'iframe',
        src: `https://player.bilibili.com/player.html?aid=${aid}&page=1&autoplay=0`,
      }
    }
  }

  if (/\.(mp4|webm|ogg|ogv|m4v)$/i.test(path)) {
    if (/^https?:/i.test(raw) || raw.startsWith('/')) {
      return { type: 'video', src: raw }
    }
  }

  return { type: 'link', src: raw }
}

const IMAGE_LINE =
  /^\s*!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+["']([^"']*)["'])?\s*\)\s*$/

export function parseCarouselBlock(source = '') {
  const images = []

  for (const line of String(source).replace(/\r\n?/g, '\n').split('\n')) {
    const match = line.match(IMAGE_LINE)
    if (!match) continue
    images.push({
      src: match[2],
      alt: match[1],
      caption: match[3] || '',
    })
  }

  return images
}
