export function resolvePreviewImages(body, dir) {
  if (!dir) return body
  return String(body).replace(
    /(!\[[^\]]*\]\()(?!https?:\/\/|\/)([^)\s]+)(\s+(?:"[^"]*"|'[^']*'))?\)/g,
    (_, prefix, src, title = '') => {
      const explicit = src.match(/(?:^|\/)img\/(.+)$/)
      if (explicit) {
        return `${prefix}/content/pages/posts/img/${explicit[1]}${title})`
      }
      const filename = src.split('/').filter(Boolean).pop() || src
      return `${prefix}/content/pages/posts/img/${dir}/${filename}${title})`
    }
  )
}
