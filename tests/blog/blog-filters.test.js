import test from 'node:test'
import assert from 'node:assert/strict'
import { collectTags, filterPosts } from '../../src/utils/blogFilters.js'

const posts = [
  { slug: 'a', category: 'tech', tags: ['React', 'CSS'] },
  { slug: 'b', category: 'tech', tags: ['React'] },
  { slug: 'c', category: 'thoughts', tags: ['CSS', 'AI'] },
]

test('collectTags 按出现次数排序并去重', () => {
  assert.deepEqual(collectTags(posts), ['React', 'CSS', 'AI'])
})

test('collectTags 遵守 limit', () => {
  assert.deepEqual(collectTags(posts, 2), ['React', 'CSS'])
})

test('filterPosts 同时按分类与标签过滤', () => {
  assert.deepEqual(filterPosts(posts, { category: 'tech' }).map((p) => p.slug), ['a', 'b'])
  assert.deepEqual(filterPosts(posts, { category: 'tech', tag: 'CSS' }).map((p) => p.slug), ['a'])
  assert.deepEqual(filterPosts(posts, { tag: 'AI' }).map((p) => p.slug), ['c'])
})

test('filterPosts 空输入返回空数组', () => {
  assert.deepEqual(filterPosts(undefined, {}), [])
})
