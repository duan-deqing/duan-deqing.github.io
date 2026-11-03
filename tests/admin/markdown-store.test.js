import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createMarkdownStore } from '../../scripts/admin/markdown-store.js'
import { HOME_FILES } from '../../src/admin/schema/markdown.js'

function createFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'stylan-admin-markdown-'))
  const files = {
    'content/home/index.zh.md': '# 首页\n\n中文正文。\n',
    'content/home/index.en.md': '# Home\n\nEnglish body.\n',
    'content/home/home.zh.md': '子页中文\n',
    'content/home/home.en.md': 'Subpage English\n',
    'content/changelog/v1.0.0-2026-01-01.zh.md':
      '---\nversion: 1.0.0\ndate: 2026-01-01\n---\n\n首个版本。\n',
    'content/changelog/v1.0.0-2026-01-01.en.md':
      '---\nversion: 1.0.0\ndate: 2026-01-01\n---\n\nFirst release.\n',
    'content/changelog/v1.1.0-2026-02-01.zh.md':
      '---\nversion: 1.1.0\ndate: 2026-02-01\nlatest: true\n---\n\n新增内容。\n',
    'content/projects/zh/orbit-desk.md': '# 中文详情\n',
    'content/projects/en/orbit-desk.md': '# English detail\n',
  }
  for (const [relative, text] of Object.entries(files)) {
    const file = path.join(root, relative)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, text)
  }
  return { root, store: createMarkdownStore(root) }
}

test('readHome 只返回白名单文件并附带 revision', () => {
  const { root, store } = createFixture()
  const data = store.readHome()
  assert.deepEqual(
    data.files.map((file) => file.id),
    HOME_FILES.map((file) => file.id)
  )
  const zh = data.files.find((file) => file.id === 'index.zh')
  assert.match(zh.content, /中文正文/)
  assert.equal(typeof zh.revision, 'string')
  fs.rmSync(root, { recursive: true, force: true })
})

test('saveHome 原样写入并拒绝未知文件/过期 revision', () => {
  const { root, store } = createFixture()
  const before = store.readHome().files.find((file) => file.id === 'index.zh')
  const next = '# 首页\n\n更新后的正文。\n'

  const saved = store.saveHome('index.zh', {
    content: next,
    revision: before.revision,
  })
  assert.equal(
    fs.readFileSync(path.join(root, 'content/home/index.zh.md'), 'utf8'),
    next
  )
  assert.notEqual(saved.files.find((file) => file.id === 'index.zh').revision, before.revision)

  assert.throws(
    () => store.saveHome('unknown', { content: 'x', revision: null }),
    (err) => err.status === 400 && err.code === 'INVALID_FILE'
  )
  assert.throws(
    () => store.saveHome('index.zh', { content: next, revision: before.revision }),
    (err) => err.status === 409 && err.code === 'REVISION_CONFLICT'
  )
  fs.rmSync(root, { recursive: true, force: true })
})

test('listChangelog 读取 frontmatter 并按版本倒序排列', () => {
  const { root, store } = createFixture()
  const { entries } = store.listChangelog()
  assert.equal(entries.length, 3)
  assert.equal(entries[0].version, '1.1.0')
  assert.equal(entries[0].date, '2026-02-01')
  assert.equal(entries[0].latest, true)
  assert.deepEqual(
    entries.filter((entry) => entry.version === '1.0.0').map((entry) => entry.lang),
    ['zh', 'en']
  )
  fs.rmSync(root, { recursive: true, force: true })
})

test('saveChangelog 拒绝非法文件名与 revision 冲突', () => {
  const { root, store } = createFixture()
  const entry = store
    .listChangelog()
    .entries.find((item) => item.filename === 'v1.0.0-2026-01-01.zh.md')
  const next = '---\nversion: 1.0.0\ndate: 2026-01-01\n---\n\n修订后的正文。\n'

  store.saveChangelog(entry.filename, { content: next, revision: entry.revision })
  assert.equal(
    fs.readFileSync(path.join(root, 'content/changelog', entry.filename), 'utf8'),
    next
  )

  assert.throws(
    () => store.saveChangelog('../secret.md', { content: 'x', revision: null }),
    (err) => err.status === 400 && err.code === 'INVALID_FILE'
  )
  assert.throws(
    () => store.saveChangelog(entry.filename, { content: next, revision: entry.revision }),
    (err) => err.status === 409 && err.code === 'REVISION_CONFLICT'
  )
  fs.rmSync(root, { recursive: true, force: true })
})

test('项目详情按语言列出，并校验 lang/slug 与 revision', () => {
  const { root, store } = createFixture()
  const { files } = store.listProjectDetails()
  assert.deepEqual(
    files.map((file) => `${file.lang}:${file.slug}`).sort(),
    ['en:orbit-desk', 'zh:orbit-desk']
  )

  const zh = files.find((file) => file.lang === 'zh')
  store.saveProjectDetail('zh', 'orbit-desk', {
    content: '# 更新后的详情\n',
    revision: zh.revision,
  })
  assert.equal(
    fs.readFileSync(path.join(root, 'content/projects/zh/orbit-desk.md'), 'utf8'),
    '# 更新后的详情\n'
  )

  assert.throws(
    () => store.saveProjectDetail('jp', 'orbit-desk', { content: 'x', revision: null }),
    (err) => err.status === 400 && err.code === 'INVALID_FILE'
  )
  assert.throws(
    () => store.saveProjectDetail('zh', '../escape', { content: 'x', revision: null }),
    (err) => err.status === 400 && err.code === 'INVALID_FILE'
  )
  assert.throws(
    () => store.saveProjectDetail('zh', 'missing', { content: 'x', revision: null }),
    (err) => err.status === 404 && err.code === 'NOT_FOUND'
  )
  assert.throws(
    () =>
      store.saveProjectDetail('zh', 'orbit-desk', {
        content: '# 更新后的详情\n',
        revision: zh.revision,
      }),
    (err) => err.status === 409 && err.code === 'REVISION_CONFLICT'
  )
  fs.rmSync(root, { recursive: true, force: true })
})
