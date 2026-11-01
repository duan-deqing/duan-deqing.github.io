/**
 * ============================================================================
 *  projectDetail.js - 项目详情正文读取工具
 * ============================================================================
 *
 * 【文件夹结构】
 * - content/projects/zh/<slug>.md（中文正文）
 * - content/projects/en/<slug>.md（英文正文）
 * - content/projects/img/<slug>/（项目配图）
 *
 * 【功能说明】
 * 1. 用 import.meta.glob 静态登记中英文正文，列表页可同步判断是否存在详情；
 * 2. 按当前语言读取正文，缺失时回退另一侧，并标记实际语言；
 * 3. 去掉正文第一个一级标题（与博客一致），解析 ./img/<slug>/... 配图路径；
 * 4. 不读取 frontmatter：标题、描述、标签等元数据统一来自 projects.yaml。
 * ============================================================================
 */

const detailFiles = import.meta.glob('/content/projects/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: false,
})

const detailImages = import.meta.glob('/content/projects/img/**/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

const FILES_BY_LANG = { zh: {}, en: {} }

for (const path in detailFiles) {
  const match = path.match(/\/projects\/(zh|en)\/([^/]+)\.md$/)
  if (match) FILES_BY_LANG[match[1]][match[2]] = detailFiles[path]
}

function getImageUrl(imagePath, slug) {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  const cleanImagePath = imagePath.replace(/^(?:\.\.?\/)+/, '')
  const exactPath = Object.keys(detailImages).find((path) =>
    path.endsWith(`/projects/${cleanImagePath}`)
  )
  if (exactPath) return detailImages[exactPath]

  const filename = cleanImagePath.split('/').pop()
  const folderPath = Object.keys(detailImages).find((path) => {
    const parts = path.split('/')
    return parts[parts.length - 2] === slug && parts[parts.length - 1] === filename
  })
  return folderPath ? detailImages[folderPath] : imagePath
}

function processImagePaths(content, slug) {
  return content.replace(
    /!\[([^\]]*)\]\(\s*([^)\s]+)(\s+(?:"[^"]*"|'[^']*'))?\s*\)/g,
    (match, alt, path, title = '') => `![${alt}](${getImageUrl(path, slug)}${title})`
  )
}

/**
 * 是否存在某个项目的详情正文（任一语言）。
 * @param {string} slug - 项目 slug
 * @returns {boolean}
 */
export function hasProjectDetail(slug) {
  if (!slug) return false
  return Boolean(FILES_BY_LANG.zh[slug] || FILES_BY_LANG.en[slug])
}

/**
 * 读取项目详情正文。
 * @param {string} slug - 项目 slug
 * @param {string} lang - 当前语言（zh / en）
 * @returns {Promise<{content: string, lang: string, fallback: boolean}|null>}
 */
export async function getProjectDetail(slug, lang = 'zh') {
  if (!hasProjectDetail(slug)) return null

  const preferred = lang === 'en' ? 'en' : 'zh'
  const actual = FILES_BY_LANG[preferred][slug] ? preferred : preferred === 'en' ? 'zh' : 'en'
  const raw = await FILES_BY_LANG[actual][slug]()
  const content = processImagePaths(
    raw.replace(/^#\s+.*$/m, '').trim(),
    slug
  )

  return {
    content,
    lang: actual,
    fallback: actual !== preferred,
  }
}
