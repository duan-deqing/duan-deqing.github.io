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

// 标题可能带行内链接/强调/行内代码，取其纯文本，才能与 ReactMarkdown 渲染出的 id 对齐。
// 注意不要剥离单个下划线，snake_case 需原样保留。
export function headingTextFromMarkdown(text) {
  return String(text)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
}

export function extractHeadings(content) {
  if (!content) return []

  const seen = new Set()
  const headings = []
  let inFence = false

  for (const line of String(content).replace(/\r\n?/g, '\n').split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const match = line.trim().match(/^(#{2,4})\s+(.+)$/)
    if (!match) continue

    const level = match[1].length
    const text = headingTextFromMarkdown(match[2].trim())
    let id = headingId(text)
    if (seen.has(id)) {
      let counter = 2
      while (seen.has(`${id}-${counter}`)) counter += 1
      id = `${id}-${counter}`
    }
    seen.add(id)
    headings.push({ level, text, id })
  }

  return headings
}
