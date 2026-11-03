import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'
import {
  CHANGELOG,
  HOME_FILES,
  PROJECT_DETAIL,
  homeFileById,
} from '../../src/admin/schema/markdown.js'
import { contentHash } from '../lib/yaml-config.js'
import { writeFileAtomic } from '../lib/fs-atomic.js'
import { createError } from './http.js'

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') return null
    throw err
  }
}

function splitFrontmatter(text) {
  const match = String(text).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { meta: {}, body: String(text) }
  let meta = {}
  try {
    meta = YAML.parse(match[1]) || {}
  } catch {
    meta = {}
  }
  return { meta, body: String(text).slice(match[0].length) }
}

function revisionOf(text) {
  return text == null ? null : contentHash(text)
}

function assertRevision(current, provided, label) {
  if ((provided ?? null) !== revisionOf(current)) {
    throw createError(`${label}已被外部修改，请刷新后再保存`, 409, 'REVISION_CONFLICT')
  }
}

function assertContent(body) {
  if (typeof body?.content !== 'string') {
    throw createError('content 必须是字符串', 400, 'INVALID_CONTENT')
  }
}

function writeText(file, text) {
  writeFileAtomic(file, text)
}

function versionParts(filename) {
  const match = filename.match(/^v(\d+)\.(\d+)\.(\d+)-([0-9]{4}-[0-9]{2}-[0-9]{2})\.(zh|en)\.md$/)
  return match
    ? {
        version: `${match[1]}.${match[2]}.${match[3]}`,
        date: match[4],
        lang: match[5],
      }
    : null
}

export function createMarkdownStore(root) {
  const resolve = (relative) => path.join(root, relative)

  function readHome() {
    return {
      files: HOME_FILES.map((file) => {
        const text = readText(resolve(file.path))
        return {
          id: file.id,
          lang: file.lang,
          label: file.label,
          content: text == null ? '' : text,
          revision: revisionOf(text),
        }
      }),
    }
  }

  function saveHome(id, payload) {
    const file = homeFileById(id)
    if (!file) throw createError('未知首页文件', 400, 'INVALID_FILE')
    assertContent(payload)
    const full = resolve(file.path)
    const current = readText(full)
    assertRevision(current, payload.revision, file.path)
    writeText(full, payload.content)
    return readHome()
  }

  function listChangelog() {
    const dir = resolve(CHANGELOG.dir)
    let names = []
    try {
      names = fs.readdirSync(dir).filter((name) => CHANGELOG.file.test(name))
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
    }
    const entries = names.map((filename) => {
      const text = readText(path.join(dir, filename))
      const info = versionParts(filename)
      const { meta } = splitFrontmatter(text || '')
      return {
        filename,
        filenameMeta: info,
        version: String(meta.version || info?.version || ''),
        date: String(meta.date || info?.date || ''),
        latest: meta.latest === true,
        pages: Array.isArray(meta.pages) ? meta.pages : [],
        lang: info?.lang || 'zh',
        content: text == null ? '' : text,
        revision: revisionOf(text),
      }
    })
    entries.sort((a, b) => {
      const byVersion = compareVersion(b.version, a.version)
      if (byVersion) return byVersion
      if (a.date !== b.date) return b.date.localeCompare(a.date)
      return a.lang === b.lang ? 0 : a.lang === 'zh' ? -1 : 1
    })
    return { entries }
  }

  function saveChangelog(filename, payload) {
    if (!CHANGELOG.file.test(filename)) {
      throw createError('非法的更新日志文件名', 400, 'INVALID_FILE')
    }
    assertContent(payload)
    const full = path.join(resolve(CHANGELOG.dir), filename)
    const current = readText(full)
    if (current == null) throw createError('更新日志文件不存在', 404, 'NOT_FOUND')
    assertRevision(current, payload.revision, filename)
    writeText(full, payload.content)
    return listChangelog()
  }

  function listProjectDetails() {
    const files = []
    for (const [lang, dirRelative] of Object.entries(PROJECT_DETAIL.dirs)) {
      const dir = resolve(dirRelative)
      let names = []
      try {
        names = fs.readdirSync(dir).filter((name) => name.endsWith('.md'))
      } catch (err) {
        if (err.code !== 'ENOENT') throw err
      }
      for (const name of names) {
        const slug = name.replace(/\.md$/, '')
        const text = readText(path.join(dir, name))
        files.push({
          lang,
          slug,
          content: text == null ? '' : text,
          revision: revisionOf(text),
        })
      }
    }
    return { files }
  }

  function saveProjectDetail(lang, slug, payload) {
    const dirRelative = PROJECT_DETAIL.dirs[lang]
    if (!dirRelative || !PROJECT_DETAIL.slug.test(slug)) {
      throw createError('非法的项目详情路径', 400, 'INVALID_FILE')
    }
    assertContent(payload)
    const full = path.join(resolve(dirRelative), `${slug}.md`)
    const current = readText(full)
    if (current == null) throw createError('项目详情文件不存在', 404, 'NOT_FOUND')
    assertRevision(current, payload.revision, `${lang}/${slug}.md`)
    writeText(full, payload.content)
    return listProjectDetails()
  }

  return {
    readHome,
    saveHome,
    listChangelog,
    saveChangelog,
    listProjectDetails,
    saveProjectDetail,
  }
}

function compareVersion(a, b) {
  const left = String(a).split('.').map(Number)
  const right = String(b).split('.').map(Number)
  for (let index = 0; index < 3; index += 1) {
    const av = left[index] || 0
    const bv = right[index] || 0
    if (av !== bv) return av - bv
  }
  return 0
}
