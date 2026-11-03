import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ADMIN_DOCUMENTS,
  getDocument,
  documentTopKeys,
  composeDocument,
  splitDocument,
  assertDocumentShape,
} from '../../src/admin/schema/documents.js'

const siteDoc = getDocument('site')
const blogDoc = getDocument('blog')

const siteFiles = {
  site: {
    site: { title: 'STYLAN' },
    personal: { name: { en: 'Duan', zh: '段' } },
    navLinks: [],
    contacts: [],
    footer: { copyright: '2026' },
  },
  stack: { categories: [{ id: 'frontend' }], page: { title: { en: 'Stack' } } },
  projects: { categories: [{ id: 'web' }], projects: [], page: { title: { en: 'Work' } } },
}

test('composeDocument 把三份文件合成一个虚拟文档', () => {
  const doc = composeDocument(siteDoc, siteFiles)
  assert.equal(doc.site.title, 'STYLAN')
  assert.deepEqual(doc.skills, siteFiles.stack.categories)
  assert.deepEqual(doc.projectCategories, siteFiles.projects.categories)
  assert.deepEqual(doc.projects, [])
})

test('splitDocument 只写受管字段并保留未知字段', () => {
  const composed = composeDocument(siteDoc, siteFiles)
  const writes = splitDocument(siteDoc, composed, siteFiles)
  assert.equal(writes.stack.categories[0].id, 'frontend')
  assert.deepEqual(writes.stack.page, { title: { en: 'Stack' } })
  assert.deepEqual(writes.projects.page, { title: { en: 'Work' } })

  const next = { ...composed, projects: [{ title: 'A' }] }
  const writes2 = splitDocument(siteDoc, next, siteFiles)
  assert.deepEqual(writes2.projects.projects, [{ title: 'A' }])
  assert.deepEqual(writes2.projects.page, { title: { en: 'Work' } })
})

test('blog 文档只覆盖 page 与 categories', () => {
  const files = { blog: { page: { title: { en: 'Blog' } }, categories: [] } }
  const doc = composeDocument(blogDoc, files)
  assert.deepEqual(Object.keys(doc).sort(), ['categories', 'page'])
  assert.deepEqual(doc.page, files.blog.page)
})

test('assertDocumentShape 拒绝缺字段与多余字段', () => {
  const composed = composeDocument(siteDoc, siteFiles)
  assert.doesNotThrow(() => assertDocumentShape(siteDoc, composed))

  const missing = { ...composed }
  delete missing.projects
  assert.throws(() => assertDocumentShape(siteDoc, missing), /顶层字段不合法/)

  assert.throws(
    () => assertDocumentShape(siteDoc, { ...composed, extra: true }),
    /顶层字段不合法/
  )
  assert.throws(() => assertDocumentShape(blogDoc, null), /必须是对象/)
})

test('文档映射表覆盖全部磁盘文件', () => {
  const paths = ADMIN_DOCUMENTS.flatMap((doc) => doc.files.map((file) => file.path))
  assert.deepEqual(paths.sort(), [
    'content/blog/blog.yaml',
    'content/projects/projects.yaml',
    'content/site.yaml',
    'content/stack/stack.yaml',
  ])
  assert.equal(documentTopKeys(siteDoc).length, 8)
})
