/**
 * ============================================================================
 *  markdown.js - Markdown 文件读取工具
 * ============================================================================
 *
 * 【文件命名规范】
 * 文件名格式: yyyy-mm-dd-post-title.md
 * 例如: 2026-04-25-getting-started-with-react-hooks.md
 *
 * 【文件夹结构】
 * - src/posts/ (中文文章)
 * - src/posts/en/ (英文文章)
 *
 * 【功能说明】
 * 1. 使用 Vite 的 import.meta.glob 动态导入 markdown 文件
 * 2. 从文件名中提取日期和 slug
 * 3. 解析 frontmatter 和正文内容
 * 4. 根据语言参数返回对应语言的文章
 *
 * 【使用方式】
 * - getAllPosts(lang): 获取所有文章列表（不含正文）
 * - getPostBySlug(slug, lang): 根据 slug 获取单篇文章（含正文）
 * ============================================================================
 */

import fm from 'front-matter'

// 使用 Vite 的 import.meta.glob 动态导入所有 markdown 文件
const allMarkdownFiles = import.meta.glob('../**/*.md', { query: '?raw', import: 'default', eager: false })

// 分离中文和英文文章
const zhMarkdownFiles = {}
const enMarkdownFiles = {}

for (const path in allMarkdownFiles) {
  if (path.endsWith('.md')) {
    if (path.includes('/posts/en/')) {
      // 英文文章
      enMarkdownFiles[path] = allMarkdownFiles[path]
    } else if (path.includes('/posts/')) {
      // 中文文章
      zhMarkdownFiles[path] = allMarkdownFiles[path]
    }
  }
}

/**
 * 根据语言获取对应的文件列表
 * @param {string} lang - 语言代码 ('zh' 或 'en')
 * @returns {Object} 文件列表
 */
function getFilesByLang(lang) {
  return lang === 'en' ? enMarkdownFiles : zhMarkdownFiles
}

/**
 * 从文件名中解析日期和 slug
 * @param {string} filename - 文件名（不含路径和扩展名）
 * @returns {{ date: string, slug: string }} 解析结果
 */
function parseFilename(filename) {
  // 移除 -en 后缀（如果存在）
  const cleanFilename = filename.replace(/-en$/, '')
  
  // 文件名格式: yyyy-mm-dd-post-title
  const match = cleanFilename.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/)
  if (match) {
    return {
      date: match[1],
      slug: match[2]
    }
  }
  // 如果不符合格式，整个文件名作为 slug
  return {
    date: '',
    slug: cleanFilename
  }
}

/**
 * 获取所有文章列表（不含正文内容）
 * @param {string} lang - 语言代码 ('zh' 或 'en')
 * @returns {Promise<Array>} 文章列表
 */
export async function getAllPosts(lang = 'zh') {
  const posts = []
  const markdownFiles = getFilesByLang(lang)

  for (const path in markdownFiles) {
    try {
      const content = await markdownFiles[path]()
      const { attributes: data } = fm(content)

      // 从文件名提取信息
      const pathParts = path.split('/')
      const filenameWithExt = pathParts[pathParts.length - 1]
      const filename = filenameWithExt.replace('.md', '')
      const { date: fileDate, slug } = parseFilename(filename)

      // 优先使用 frontmatter 中的日期，否则使用文件名中的日期
      const date = data.date || fileDate

      posts.push({
        ...data,
        date,
        slug,
        filename
      })
    } catch (error) {
      console.error(`Error loading ${path}:`, error)
    }
  }

  // 按日期降序排序
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}

/**
 * 根据 slug 获取单篇文章（含正文内容）
 * @param {string} slug - 文章 slug（文件名中日期后的部分）
 * @param {string} lang - 语言代码 ('zh' 或 'en')
 * @returns {Promise<Object|null>} 文章数据
 */
export async function getPostBySlug(slug, lang = 'zh') {
  const markdownFiles = getFilesByLang(lang)

  for (const path in markdownFiles) {
    try {
      const pathParts = path.split('/')
      const filenameWithExt = pathParts[pathParts.length - 1]
      const filename = filenameWithExt.replace('.md', '')
      const { date: fileDate, slug: fileSlug } = parseFilename(filename)

      if (fileSlug === slug) {
        const content = await markdownFiles[path]()
        const { attributes: data, body: markdownContent } = fm(content)

        // 移除第一个 h1 标题（避免与页面标题重复）
        const contentWithoutFirstH1 = markdownContent.replace(/^#\s+.*$/m, '').trim()

        return {
          ...data,
          date: data.date || fileDate,
          content: contentWithoutFirstH1,
          slug,
          filename
        }
      }
    } catch (error) {
      console.error(`Error loading ${path}:`, error)
    }
  }

  return null
}

/**
 * 根据完整文件名获取单篇文章
 * @param {string} filename - 完整文件名（不含扩展名）
 * @param {string} lang - 语言代码 ('zh' 或 'en')
 * @returns {Promise<Object|null>} 文章数据
 */
export async function getPostByFilename(filename, lang = 'zh') {
  const markdownFiles = getFilesByLang(lang)
  
  const targetPath = Object.keys(markdownFiles).find(path => {
    const pathParts = path.split('/')
    const name = pathParts[pathParts.length - 1].replace('.md', '')
    return name === filename
  })

  if (targetPath) {
    try {
      const content = await markdownFiles[targetPath]()
      const { attributes: data, body: markdownContent } = fm(content)
      const { date: fileDate, slug } = parseFilename(filename)

      return {
        ...data,
        date: data.date || fileDate,
        content: markdownContent,
        slug,
        filename
      }
    } catch (error) {
      console.error(`Error loading ${targetPath}:`, error)
    }
  }

  return null
}

/**
 * 获取所有文章的 slug 列表（用于生成路由）
 * @param {string} lang - 语言代码 ('zh' 或 'en')
 * @returns {Promise<Array<string>>} slug 列表
 */
export async function getAllSlugs(lang = 'zh') {
  const slugs = []
  const markdownFiles = getFilesByLang(lang)

  for (const path in markdownFiles) {
    const pathParts = path.split('/')
    const filename = pathParts[pathParts.length - 1].replace('.md', '')
    const { slug } = parseFilename(filename)
    slugs.push(slug)
  }

  return slugs
}

/**
 * 获取所有文章的文件名列表
 * @param {string} lang - 语言代码 ('zh' 或 'en')
 * @returns {Promise<Array<string>>} 文件名列表
 */
export async function getAllFilenames(lang = 'zh') {
  const filenames = []
  const markdownFiles = getFilesByLang(lang)

  for (const path in markdownFiles) {
    const pathParts = path.split('/')
    const filename = pathParts[pathParts.length - 1].replace('.md', '')
    filenames.push(filename)
  }

  return filenames
}