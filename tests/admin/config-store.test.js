import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createConfigStore } from '../../scripts/admin/config-store.js'
import { stringifyYamlDoc } from '../../scripts/lib/yaml-config.js'

function createFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'stylan-admin-config-'))
  const files = {
    'content/site.yaml': {
      site: { title: '旧标题' },
      personal: { name: { en: 'Duan', zh: '段' } },
      navLinks: [],
      contacts: [],
      footer: { copyright: '2026' },
    },
    'content/stack/stack.yaml': {
      categories: [{ id: 'frontend', label: { en: 'Frontend', zh: '前端' }, items: [] }],
      page: { title: { en: 'Stack' } },
    },
    'content/projects/projects.yaml': {
      categories: [{ id: 'web', label: { en: 'Web', zh: '网页' } }],
      projects: [],
      page: { title: { en: 'Work' } },
    },
    'content/blog/blog.yaml': {
      page: { title: { en: 'Blog', zh: '博客' }, subtitle: { en: '', zh: '' } },
      categories: [{ id: 'tech', label: { en: 'Tech', zh: '技术' } }],
    },
  }
  for (const [relative, value] of Object.entries(files)) {
    const file = path.join(root, relative)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, stringifyYamlDoc(value))
  }
  return { root, store: createConfigStore(root) }
}

test('readConfig 组合三份 YAML 并返回逐文件 revision', () => {
  const { root, store } = createFixture()
  const config = store.readConfig()
  assert.equal(config.documents.site.site.title, '旧标题')
  assert.equal(config.documents.site.skills[0].id, 'frontend')
  assert.equal(config.documents.blog.categories[0].id, 'tech')
  assert.deepEqual(Object.keys(config.revision.site).sort(), ['projects', 'site', 'stack'])
  assert.equal(typeof config.revision.site.site, 'string')
  fs.rmSync(root, { recursive: true, force: true })
})

test('保存只改动变化的文件，并保留未受管字段', () => {
  const { root, store } = createFixture()
  const before = store.readConfig()
  const stackBefore = fs.readFileSync(path.join(root, 'content/stack/stack.yaml'), 'utf8')

  const documents = {
    ...before.documents,
    site: { ...before.documents.site, site: { title: '新标题' } },
  }
  const saved = store.saveConfig({ documents, revision: before.revision })

  assert.equal(saved.documents.site.site.title, '新标题')
  assert.equal(saved.documents.site.skills[0].id, 'frontend')
  assert.equal(
    fs.readFileSync(path.join(root, 'content/stack/stack.yaml'), 'utf8'),
    stackBefore
  )
  const siteText = fs.readFileSync(path.join(root, 'content/site.yaml'), 'utf8')
  assert.match(siteText, /新标题/)
  fs.rmSync(root, { recursive: true, force: true })
})

test('revision 不匹配时返回 409 且不写文件', () => {
  const { root, store } = createFixture()
  const before = store.readConfig()
  const siteBefore = fs.readFileSync(path.join(root, 'content/site.yaml'), 'utf8')

  const documents = {
    ...before.documents,
    site: { ...before.documents.site, site: { title: '被拒绝的标题' } },
  }
  const staleRevision = {
    ...before.revision,
    site: { ...before.revision.site, site: 'stale' },
  }

  assert.throws(
    () => store.saveConfig({ documents, revision: staleRevision }),
    (err) => {
      assert.equal(err.status, 409)
      assert.equal(err.code, 'REVISION_CONFLICT')
      assert.ok(err.current.documents.site)
      assert.equal(err.revision.site.site, before.revision.site.site)
      return true
    }
  )
  assert.equal(fs.readFileSync(path.join(root, 'content/site.yaml'), 'utf8'), siteBefore)
  fs.rmSync(root, { recursive: true, force: true })
})

test('顶层字段缺失时拒绝保存且文件保持原样', () => {
  const { root, store } = createFixture()
  const before = store.readConfig()
  const siteBefore = fs.readFileSync(path.join(root, 'content/site.yaml'), 'utf8')
  const incomplete = { ...before.documents.site }
  delete incomplete.projects

  assert.throws(
    () =>
      store.saveConfig({
        documents: { ...before.documents, site: incomplete },
        revision: before.revision,
      }),
    (err) => {
      assert.equal(err.status, 400)
      assert.equal(err.code, 'INVALID_DOCUMENT')
      return true
    }
  )
  assert.equal(fs.readFileSync(path.join(root, 'content/site.yaml'), 'utf8'), siteBefore)
  fs.rmSync(root, { recursive: true, force: true })
})

test('内容非法时返回 VALIDATION_FAILED，不产生半成品配置', () => {
  const { root, store } = createFixture()
  const before = store.readConfig()
  const documents = {
    ...before.documents,
    site: { ...before.documents.site, site: { title: '' } },
  }
  const siteBefore = fs.readFileSync(path.join(root, 'content/site.yaml'), 'utf8')

  assert.throws(
    () => store.saveConfig({ documents, revision: before.revision }),
    (err) => {
      assert.equal(err.status, 400)
      assert.equal(err.code, 'VALIDATION_FAILED')
      return true
    }
  )
  assert.equal(fs.readFileSync(path.join(root, 'content/site.yaml'), 'utf8'), siteBefore)
  fs.rmSync(root, { recursive: true, force: true })
})
