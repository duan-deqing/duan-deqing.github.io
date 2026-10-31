export function getBookmarkDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return String(url || '')
  }
}

// 参考 onur.dev：封面由 Raindrop 维护；静态站点没有该字段时，
// 用 Raindrop 的截图服务生成 1200×800 预览图，cover 仍可在 YAML 中覆盖。
export function getBookmarkCover(bookmark) {
  if (bookmark?.cover) return bookmark.cover
  if (!bookmark?.url) return ''
  return `https://rdl.ink/render/${encodeURIComponent(bookmark.url)}`
}
