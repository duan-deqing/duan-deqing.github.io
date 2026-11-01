const GITHUB = 'https://github.com'
const REPO = `${GITHUB}/duan-deqing/duan-deqing.github.io`

const SKIP = new Set([
  'link',
  'linkReference',
  'image',
  'imageReference',
  'code',
  'inlineCode',
  'html',
  'definition',
])

const MENTION_RE = /\{@([A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?)(?:\|([^}\n]+))?\}/g

const PATTERNS = [
  {
    type: 'issue',
    regex: /(^|[^\w#])(#\d+)\b/g,
    priority: 1,
  },
  {
    type: 'commit',
    regex:
      /(^|[^\w])((?=[0-9a-f]{7,40}\b)(?=[0-9a-f]*[a-f])(?=[0-9a-f]*\d)[0-9a-f]{7,40})\b/g,
    priority: 2,
  },
]

function refUrl(type, text) {
  if (type === 'issue') return `${REPO}/issues/${text.slice(1)}`
  return `${REPO}/commit/${text}`
}

function refNode(ref) {
  return {
    type: 'link',
    url: ref.url,
    children: [{ type: 'text', value: ref.text }],
    data: {
      hProperties: {
        className: ['markdown-github-ref', `markdown-github-${ref.type}`],
      },
    },
  }
}

function findRefs(value) {
  const refs = []

  for (const match of value.matchAll(MENTION_RE)) {
    const username = match[1]
    refs.push({
      type: 'mention',
      start: match.index,
      end: match.index + match[0].length,
      text: match[2]?.trim() || `@${username}`,
      url: `${GITHUB}/${username}`,
      priority: 0,
    })
  }

  for (const { type, regex, priority } of PATTERNS) {
    for (const match of value.matchAll(regex)) {
      const start = match.index + match[1].length
      const text = match[2]
      refs.push({
        type,
        start,
        end: start + text.length,
        text,
        url: refUrl(type, text),
        priority,
      })
    }
  }

  return refs.sort(
    (a, b) => a.start - b.start || b.end - a.end || a.priority - b.priority
  )
}

function splitText(value) {
  const refs = findRefs(value)
  if (!refs.length) return null

  const nodes = []
  let cursor = 0

  for (const ref of refs) {
    if (ref.start < cursor) continue
    if (ref.start > cursor) {
      nodes.push({ type: 'text', value: value.slice(cursor, ref.start) })
    }
    nodes.push(refNode(ref))
    cursor = ref.end
  }

  if (cursor < value.length) {
    nodes.push({ type: 'text', value: value.slice(cursor) })
  }

  return nodes
}

function walk(node) {
  if (!node?.children || SKIP.has(node.type)) return

  const next = []
  for (const child of node.children) {
    if (child.type === 'text') {
      next.push(...(splitText(child.value) || [child]))
    } else {
      walk(child)
      next.push(child)
    }
  }
  node.children = next
}

export function remarkGithubRefs() {
  return (tree) => walk(tree)
}

export const githubRepoUrl = REPO
