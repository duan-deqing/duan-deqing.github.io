/**
 * rehypeCodeLines — 把高亮后的代码块按行包成带行号的 span。
 *
 * 必须在 rehype-highlight 之后运行：高亮会把代码切成多个嵌套 span，
 * 换行符可能落在任意文本节点里，因此需要递归拆分，再按行重组成
 * `<span class="code-line" data-line="n">`，交给 `.code-line::before` 显示行号。
 */

function splitLineNodes(nodes) {
  const lines = [[]]

  for (const node of nodes) {
    if (node.type === 'text') {
      const parts = node.value.replace(/\r\n?/g, '\n').split('\n')
      parts.forEach((part, index) => {
        if (part) lines[lines.length - 1].push({ ...node, value: part })
        if (index < parts.length - 1) lines.push([])
      })
      continue
    }

    if (node.children) {
      const childLines = splitLineNodes(node.children)
      childLines.forEach((childLine, index) => {
        if (index > 0) lines.push([])
        if (childLine.length) {
          lines[lines.length - 1].push({ ...node, children: childLine })
        }
      })
      continue
    }

    lines[lines.length - 1].push(node)
  }

  return lines
}

function isAlreadyWrapped(code) {
  return code.children?.some(
    (child) =>
      child.type === 'element' &&
      child.tagName === 'span' &&
      Array.isArray(child.properties?.className) &&
      child.properties.className.includes('code-line')
  )
}

function isCustomFence(code) {
  return code.properties?.className?.some((name) =>
    /^language-(video|carousel|mermaid)$/i.test(name)
  )
}

function transformPre(pre) {
  const code = pre.children?.find(
    (child) => child.type === 'element' && child.tagName === 'code'
  )
  if (!code?.children || isAlreadyWrapped(code) || isCustomFence(code)) return

  const lines = splitLineNodes(code.children)
  while (lines.length > 1 && lines[lines.length - 1].length === 0) lines.pop()
  code.children = lines.map((line, index) => ({
    type: 'element',
    tagName: 'span',
    properties: {
      className: ['code-line'],
      'data-line': String(index + 1),
    },
    children: line,
  }))
}

function walk(node) {
  if (!node || typeof node !== 'object') return
  if (node.type === 'element' && node.tagName === 'pre') transformPre(node)
  if (node.children) node.children.forEach(walk)
}

export default function rehypeCodeLines() {
  return (tree) => walk(tree)
}
