import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fm from 'front-matter'
import { writeYamlFile, readYamlFile, fileRevision } from './lib/yaml-config.js'
import { isLoopback, isSameOrigin, isPostFileName, assertInside } from './lib/admin-validation.js'
import { parsePost, serializePost, validateFrontmatter, normalizePostDate } from './lib/post-content.js'
import { parsePostFilename } from '../src/utils/postFilename.js'

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const SITE_FILE = path.join(ROOT, 'src/content/site.yaml')
const BLOG_FILE = path.join(ROOT, 'src/content/blog.yaml')
const POSTS_ZH = path.join(ROOT, 'src/posts')
const POSTS_EN = path.join(ROOT, 'src/posts/en')
const MAX_BODY = 5 * 1024 * 1024
const API_PREFIX = '/__admin/api'

function sendJson(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

function readBody(req, limit = MAX_BODY) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    let tooLarge = false
    req.on('data', (chunk) => {
      if (tooLarge) return
      size += chunk.length
      if (size > limit) {
        tooLarge = true
        reject(Object.assign(new Error('请求体超过 5MB'), { status: 413 }))
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (!tooLarge) resolve(Buffer.concat(chunks))
    })
    req.on('error', reject)
  })
}

async function readJson(req) {
  const buf = await readBody(req)
  try {
    return JSON.parse(buf.toString('utf8') || '{}')
  } catch {
    throw Object.assign(new Error('JSON 格式错误'), { status: 400 })
  }
}

function guard(req) {
  if (!isLoopback(req.socket.remoteAddress)) {
    throw Object.assign(new Error('仅允许本机访问'), { status: 403 })
  }
  if (!isSameOrigin(req.headers.origin, req.headers.host)) {
    throw Object.assign(new Error('跨源请求已拒绝'), { status: 403 })
  }
  if (req.method !== 'GET' && req.headers['x-admin-request'] !== '1') {
    throw Object.assign(new Error('缺少管理请求头'), { status: 403 })
  }
}

function readConfig() {
  return {
    site: readYamlFile(SITE_FILE),
    blog: readYamlFile(BLOG_FILE),
    revision: { site: fileRevision(SITE_FILE), blog: fileRevision(BLOG_FILE) },
  }
}

const SITE_TOP_KEYS = [
  'site', 'personal', 'navLinks', 'homeSections', 'about', 'buttons',
  'skillsSection', 'skills', 'projectsSection', 'projects', 'contact',
  'contactPage', 'socialLinks', 'footer',
]

const BLOG_TOP_KEYS = ['page', 'categories']

function assertShape(doc, allowedKeys, label) {
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    throw Object.assign(new Error(`${label} 必须是对象`), { status: 400 })
  }
  const actual = Object.keys(doc).sort()
  const expected = [...allowedKeys].sort()
  if (actual.join('|') !== expected.join('|')) {
    throw Object.assign(new Error(`${label} 的顶层字段不合法`), { status: 400 })
  }
}

function saveConfig(body) {
  const { site, blog, revision } = body || {}
  if (!site || typeof site !== 'object' || !blog || typeof blog !== 'object') {
    throw Object.assign(new Error('site 与 blog 必须是对象'), { status: 400 })
  }
  assertShape(site, SITE_TOP_KEYS, 'site')
  assertShape(blog, BLOG_TOP_KEYS, 'blog')
  if (typeof site.site?.title !== 'string' || !site.site.title.trim()) {
    throw Object.assign(new Error('site.title 必须是非空字符串'), { status: 400 })
  }
  if (!Array.isArray(site.navLinks) || !Array.isArray(site.skills) || !Array.isArray(site.projects)) {
    throw Object.assign(new Error('导航、技能、项目必须是数组'), { status: 400 })
  }
  if (!Array.isArray(blog.categories)) {
    throw Object.assign(new Error('博客分类必须是数组'), { status: 400 })
  }
  const current = { site: fileRevision(SITE_FILE), blog: fileRevision(BLOG_FILE) }
  if (
    !revision ||
    Math.round(revision.site) !== Math.round(current.site) ||
    Math.round(revision.blog) !== Math.round(current.blog)
  ) {
    throw Object.assign(new Error('文件已被外部修改，请刷新后再保存'), { status: 409 })
  }
  writeYamlFile(SITE_FILE, site)
  writeYamlFile(BLOG_FILE, blog)
  return { revision: { site: fileRevision(SITE_FILE), blog: fileRevision(BLOG_FILE) } }
}

function postsDir(lang) {
  if (lang !== 'zh' && lang !== 'en') {
    throw Object.assign(new Error('未知语言'), { status: 400 })
  }
  return lang === 'en' ? POSTS_EN : POSTS_ZH
}

async function listPosts() {
  const out = []
  for (const [lang, dir] of [['zh', POSTS_ZH], ['en', POSTS_EN]]) {
    const entries = await fsp.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue
      const file = path.join(dir, entry.name)
      const text = await fsp.readFile(file, 'utf8')
      const { attributes } = fm(text)
      const meta = parsePostFilename(entry.name)
      const stat = await fsp.stat(file)
      out.push({
        lang,
        filename: entry.name,
        slug: meta.slug,
        date: normalizePostDate(attributes.date) || meta.date,
        title: attributes.title ?? '',
        excerpt: attributes.excerpt ?? '',
        category: attributes.category ?? '',
        tags: attributes.tags ?? [],
        featured: Boolean(attributes.featured),
        mtime: stat.mtimeMs,
      })
    }
  }
  return out.sort((a, b) => new Date(b.date) - new Date(a.date))
}

async function getPost(lang, filename) {
  const dir = postsDir(lang)
  if (!isPostFileName(filename)) {
    throw Object.assign(new Error('非法文章文件名'), { status: 400 })
  }
  const file = assertInside(dir, path.join(dir, filename))
  let text
  let stat
  try {
    text = await fsp.readFile(file, 'utf8')
    stat = await fsp.stat(file)
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw Object.assign(new Error('文章不存在'), { status: 404 })
    }
    throw err
  }
  const { frontmatter, body } = parsePost(text)
  return { frontmatter, body, revision: stat.mtimeMs }
}

async function savePost(lang, filename, payload) {
  const dir = postsDir(lang)
  if (!isPostFileName(filename)) {
    throw Object.assign(new Error('非法文章文件名'), { status: 400 })
  }
  const { frontmatter, body, revision } = payload || {}
  const blog = readYamlFile(BLOG_FILE)
  const errors = validateFrontmatter(frontmatter, blog?.categories || [])
  if (errors.length) {
    throw Object.assign(new Error(errors.join('；')), { status: 400 })
  }
  const file = assertInside(dir, path.join(dir, filename))
  const exists = fs.existsSync(file)
  if (exists) {
    if (revision === null || revision === undefined) {
      throw Object.assign(new Error('同名文章已存在'), { status: 409 })
    }
    if (typeof revision !== 'number' || Math.round(fs.statSync(file).mtimeMs) !== Math.round(revision)) {
      throw Object.assign(new Error('文件已被外部修改，请刷新后再保存'), { status: 409 })
    }
  } else if (typeof revision === 'number') {
    throw Object.assign(new Error('文章已被删除，请刷新列表'), { status: 409 })
  }
  await fsp.writeFile(file, serializePost(frontmatter, body), 'utf8')
  return { revision: fs.statSync(file).mtimeMs }
}

async function deletePost(lang, filename) {
  const dir = postsDir(lang)
  if (!isPostFileName(filename)) {
    throw Object.assign(new Error('非法文章文件名'), { status: 400 })
  }
  const file = assertInside(dir, path.join(dir, filename))
  try {
    await fsp.unlink(file)
    return { ok: true }
  } catch (err) {
    if (err.code === 'ENOENT') throw Object.assign(new Error('文章不存在'), { status: 404 })
    throw err
  }
}

async function handle(req, res) {
  guard(req)
  const url = new URL(req.url, 'http://localhost')
  const route = url.pathname
  const method = req.method

  if (route === '/config' && method === 'GET') {
    return sendJson(res, 200, readConfig())
  }
  if (route === '/config' && method === 'PUT') {
    return sendJson(res, 200, saveConfig(await readJson(req)))
  }

  if (route === '/posts' && method === 'GET') {
    return sendJson(res, 200, await listPosts())
  }

  const postMatch = route.match(/^\/posts\/(zh|en)\/([^/]+)$/)
  if (postMatch) {
    const [, lang, rawName] = postMatch
    let filename
    try {
      filename = decodeURIComponent(rawName)
    } catch {
      throw Object.assign(new Error('非法文章文件名'), { status: 400 })
    }
    if (method === 'GET') return sendJson(res, 200, await getPost(lang, filename))
    if (method === 'PUT') return sendJson(res, 200, await savePost(lang, filename, await readJson(req)))
    if (method === 'DELETE') return sendJson(res, 200, await deletePost(lang, filename))
  }

  return sendJson(res, 404, { error: '未知接口' })
}

export default function adminPlugin() {
  return {
    name: 'stylan-admin',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/admin' || req.url === '/admin/') req.url = '/admin.html'
        next()
      })
      server.middlewares.use(API_PREFIX, (req, res) => {
        handle(req, res).catch((err) => {
          sendJson(res, err.status || 500, { error: err.message || '服务器错误' })
        })
      })
    },
  }
}
