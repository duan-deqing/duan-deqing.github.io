export function resolvePreviewImages(body, dir) {
  if (!dir) return body
  return String(body).replace(
    /(!\[[^\]]*\]\()(?!https?:\/\/|\/)([^)]+)\)/g,
    (_, prefix, src) => `${prefix}/src/posts/img/${dir}/${src})`
  )
}
