import test from 'node:test'
import assert from 'node:assert/strict'
import { groupPostsByYear } from '../../src/utils/postGroups.js'

test('groups consecutive posts by year', () => {
  const posts = [
    { slug: 'a', date: '2026-05-01' },
    { slug: 'b', date: '2026-01-01' },
    { slug: 'c', date: '2023-07-23' },
  ]
  assert.deepEqual(
    groupPostsByYear(posts).map((group) => [group.year, group.posts.map((post) => post.slug)]),
    [[2026, ['a', 'b']], [2023, ['c']]]
  )
})

test('returns an empty array for empty input', () => {
  assert.deepEqual(groupPostsByYear([]), [])
})
