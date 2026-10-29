export function headingId(text) {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function getTextContent(children) {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(getTextContent).join('')
  if (children?.props?.children) return getTextContent(children.props.children)
  return ''
}
