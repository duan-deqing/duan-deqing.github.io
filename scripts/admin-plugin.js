import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  writeYamlFile,
  readYamlFile,
  fileRevision,
} from './lib/yaml-config.js'
import { isLoopback, isSameOrigin } from './lib/admin-validation.js'

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const SITE_FILE = path.join(ROOT, 'src/content/site.yaml')
const BLOG_FILE = path.join(ROOT, 'src/content/blog.yaml')
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
