import fsp from 'node:fs/promises'
import path from 'node:path'
import fm from 'front-matter'
import { isPostFileName, assertInside } from '../lib/admin-validation.js'
import {
  parsePost,
  serializePost,
  validateFrontmatter,
  normalizePostDate,
} from '../lib/post-content.js'
import { contentHash, readYamlFile } from '../lib/yaml-config.js'
import { writeFileAtomic } from '../lib/fs-atomic.js'
import { parsePostFilename } from '../../src/utils/blog/postFilename.js'
import { createError } from './http.js'

export function createPostStore(root) {
  const contentDir = path.join(root, 'content')
  const blogFile = path.join(contentDir, 'blog', 'blog.yaml')
  const dirs = {
    zh: path.join(contentDir, 'blog', 'posts', 'zh'),
    en: path.join(contentDir, 'blog', 'posts', 'en'),
  }

  function postsDir(lang) {
    if (lang !== 'zh' && lang !== 'en') {
      throw createError('未知语言', 400, 'INVALID_LANGUAGE')
    }
    return dirs[lang]
  }

  function postFile(lang, filename) {
    const dir = postsDir(lang)
    if (!isPostFileName(filename)) {
      throw createError('非法文章文件名', 400, 'INVALID_FILENAME')
    }
    return assertInside(dir, path.join(dir, filename))
  }

  async function readPostFile(file) {
    try {
      return await fsp.readFile(file, 'utf8')
    } catch (err) {
      if (err.code === 'ENOENT') return null
      throw err
    }
  }

  async function readPostMeta(lang, dir, entry) {
    const file = path.join(dir, entry.name)
    const text = await fsp.readFile(file, 'utf8')
    const { attributes } = fm(text)
    const meta = parsePostFilename(entry.name)
    return {
      lang,
      filename: entry.name,
      slug: meta.slug,
      date: normalizePostDate(attributes.date) || meta.date,
      title: attributes.title ?? '',
      excerpt: attributes.excerpt ?? '',
      category: attributes.category ?? '',
      tags: attributes.tags ?? [],
      duration: attributes.duration ?? '',
    }
  }

  async function listPosts() {
    const results = await Promise.all(
      Object.entries(dirs).map(async ([lang, dir]) => {
        let entries
        try {
          entries = await fsp.readdir(dir, { withFileTypes: true })
        } catch (err) {
          if (err.code === 'ENOENT') return []
          throw err
        }
        return Promise.all(
          entries
            .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
            .map((entry) => readPostMeta(lang, dir, entry))
        )
      })
    )
    return results.flat().sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  async function getPost(lang, filename) {
    const file = postFile(lang, filename)
    const text = await readPostFile(file)
    if (text == null) {
      throw createError('文章不存在', 404, 'POST_NOT_FOUND')
    }
    const { frontmatter, body } = parsePost(text)
    return { frontmatter, body, revision: contentHash(text) }
  }

  function currentPost(frontmatter, body, revision) {
    return { frontmatter, body, revision }
  }

  async function savePost(lang, filename, payload) {
    const file = postFile(lang, filename)
    const { frontmatter, body, revision } = payload || {}

    let categories = []
    try {
      categories = readYamlFile(blogFile)?.categories || []
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
    }
    const errors = validateFrontmatter(frontmatter, categories)
    if (errors.length) {
      throw createError(errors.join('；'), 400, 'INVALID_FRONTMATTER')
    }

    const currentText = await readPostFile(file)
    if (currentText != null) {
      const parsed = parsePost(currentText)
      const latestRevision = contentHash(currentText)
      if (revision == null) {
        throw createError('同名文章已存在', 409, 'POST_EXISTS', {
          current: currentPost(parsed.frontmatter, parsed.body, latestRevision),
          revision: latestRevision,
        })
      }
      if (revision !== latestRevision) {
        throw createError('文件已被外部修改，请刷新后再保存', 409, 'REVISION_CONFLICT', {
          current: currentPost(parsed.frontmatter, parsed.body, latestRevision),
          revision: latestRevision,
        })
      }
    } else if (revision != null) {
      throw createError('文章已被删除，请刷新列表', 409, 'POST_DELETED')
    }

    const serialized = serializePost(frontmatter, body)
    writeFileAtomic(file, serialized)
    return { revision: contentHash(serialized) }
  }

  async function deletePost(lang, filename) {
    const file = postFile(lang, filename)
    try {
      await fsp.unlink(file)
      return { ok: true }
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw createError('文章不存在', 404, 'POST_NOT_FOUND')
      }
      throw err
    }
  }

  return { listPosts, getPost, savePost, deletePost }
}
