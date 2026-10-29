export function resolvePreviewImages(body, dir) {
  if (!dir) return body
  return String(body).replace(
    /(!\[[^\]]*\]\()(?!https?:\/\/|\/)([^)\s]+)(\s+(?:"[^"]*"|'[^']*'))?\)/g,
    (_, prefix, src, title = '') => {
      const filename = src.split('/').filter(Boolean).pop() || src
      return `${prefix}/src/posts/img/${dir}/${filename}${title})`
    }
  )
}
