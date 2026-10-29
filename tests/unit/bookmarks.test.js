import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import YAML from 'yaml'
import { getBookmarkDomain } from '../../src/utils/bookmarkFormat.js'

const source = YAML.parse(
  readFileSync(fileURLToPath(new URL('../../src/content/bookmarks.yaml', import.meta.url)), 'utf8')
)

test('getBookmarkDomain 去掉 www 并容错', () => {
  assert.equal(getBookmarkDomain('https://www.example.com/path'), 'example.com')
  assert.equal(getBookmarkDomain('https://developer.mozilla.org'), 'developer.mozilla.org')
  assert.equal(getBookmarkDomain('not a url'), 'not a url')
  assert.equal(getBookmarkDomain(''), '')
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
