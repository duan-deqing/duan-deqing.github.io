const EXTENSION_LANGUAGES = {
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  mts: 'typescript',
  cts: 'typescript',
  tsx: 'tsx',
  json: 'json',
  jsonc: 'json',
  json5: 'json',
  css: 'css',
  scss: 'scss',
  sass: 'scss',
  less: 'less',
  html: 'html',
  htm: 'html',
  xml: 'xml',
  svg: 'xml',
  vue: 'xml',
  md: 'markdown',
  mdx: 'markdown',
  markdown: 'markdown',
  yml: 'yaml',
  yaml: 'yaml',
  toml: 'ini',
  ini: 'ini',
  conf: 'ini',
  properties: 'ini',
  sh: 'bash',
  bash: 'bash',
  zsh: 'bash',
  fish: 'bash',
  shell: 'bash',
  py: 'python',
  rb: 'ruby',
  go: 'go',
  rs: 'rust',
  java: 'java',
  kt: 'kotlin',
  kts: 'kotlin',
  swift: 'swift',
  php: 'php',
  sql: 'sql',
  c: 'c',
  h: 'c',
  cc: 'cpp',
  cpp: 'cpp',
  cxx: 'cpp',
  hpp: 'cpp',
  cs: 'csharp',
  txt: 'text',
  env: 'bash',
}

function resolveLanguage(raw) {
  const file = raw.split(/[\\/]/).pop()
  const dot = file.lastIndexOf('.')
  if (dot < 0) return null
  return EXTENSION_LANGUAGES[file.slice(dot + 1).toLowerCase()] || null
}

function transformCode(node) {
  const classes = node.properties?.className
  if (!Array.isArray(classes)) return

  const index = classes.findIndex(
    (name) => typeof name === 'string' && name.startsWith('language-')
  )
  if (index < 0) return

  const raw = classes[index].slice('language-'.length)
  const language = resolveLanguage(raw)
  if (!language) return

  classes[index] = `language-${language}`
  node.properties['data-code-label'] = raw
}

function walk(node) {
  if (!node || typeof node !== 'object') return
  if (node.type === 'element' && node.tagName === 'code') transformCode(node)
  if (node.children) node.children.forEach(walk)
}

export default function rehypeCodeLanguage() {
  return (tree) => walk(tree)
}
