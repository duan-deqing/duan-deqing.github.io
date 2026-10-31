import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import YAML from 'yaml'
import { getBookmarkCover, getBookmarkDomain } from '../../src/utils/bookmarkFormat.js'

const root = fileURLToPath(new URL('../../', import.meta.url))
const source = YAML.parse(
  readFileSync(path.join(root, 'content/pages/bookmarks.yaml'), 'utf8')
)

test('getBookmarkDomain 去掉 www 并容错', () => {
  assert.equal(getBookmarkDomain('https://www.example.com/path'), 'example.com')
  assert.equal(getBookmarkDomain('https://developer.mozilla.org'), 'developer.mozilla.org')
  assert.equal(getBookmarkDomain('not a url'), 'not a url')
  assert.equal(getBookmarkDomain(''), '')
})

test('getBookmarkCover 优先自定义封面，否则生成 Raindrop 预览图', () => {
  assert.equal(getBookmarkCover({ cover: '/images/a.jpg', url: 'https://example.com' }), '/images/a.jpg')
  assert.equal(
    getBookmarkCover({ url: 'https://example.com/a?b=1' }),
    'https://rdl.ink/render/https%3A%2F%2Fexample.com%2Fa%3Fb%3D1'
  )
  assert.equal(getBookmarkCover({}), '')
})

function assertLocalized(value, label) {
  if (typeof value === 'string') {
    assert.ok(value.trim(), label)
    return
  }
  assert.ok(value?.en, `${label}.en`)
  assert.ok(value?.zh, `${label}.zh`)
}

test('bookmarks.yaml 分类与书签结构有效', () => {
  assertLocalized(source.page?.title, 'page.title')
  assert.ok(Array.isArray(source.categories))

  const slugs = new Set()
  for (const category of source.categories) {
    assert.match(category.slug, /^[a-z0-9-]+$/)
    assert.equal(slugs.has(category.slug), false, `重复分类 slug: ${category.slug}`)
    slugs.add(category.slug)
    assertLocalized(category.title, `${category.slug}.title`)
    assertLocalized(category.description, `${category.slug}.description`)
    assert.equal(typeof category.icon, 'string')
    assert.ok(category.icon.trim(), `${category.slug}.icon`)
    if (!category.icon.startsWith('/') && !/^(https?:)?\/\//.test(category.icon)) {
      assert.ok(
        existsSync(path.join(root, 'public/images/bookmark-categories', category.icon)),
        `缺少书签分类图标: ${category.icon}`
      )
    }
    assert.ok(Array.isArray(category.bookmarks))

    for (const bookmark of category.bookmarks) {
      assert.ok(bookmark.title)
      assert.equal(new URL(bookmark.url).protocol.startsWith('http'), true)
      if (bookmark.description && typeof bookmark.description === 'object') {
        assertLocalized(bookmark.description, `${category.slug}.bookmark.description`)
      }
      if (bookmark.cover) {
        assert.equal(typeof bookmark.cover, 'string')
      }
    }
  }
})
