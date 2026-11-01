import test from 'node:test'
import assert from 'node:assert/strict'
import { getPostYear, parsePostDate } from '../../src/utils/postDate.js'

test('parses YYYY-MM-DD as a local date, not UTC', () => {
  const date = parsePostDate('2026-01-01')

  assert.ok(date instanceof Date)
  assert.equal(date.getFullYear(), 2026)
  assert.equal(date.getMonth(), 0)
  assert.equal(date.getDate(), 1)
  // 本地零点：UTC 负时区下若按 UTC 解析，这里会退回到 2025-12-31
  assert.equal(date.getTime(), new Date(2026, 0, 1).getTime())
  assert.equal(getPostYear('2026-01-01'), 2026)
})

test('parses a date with a local time suffix', () => {
  const date = parsePostDate('2026-01-01 09:30')

  assert.ok(date instanceof Date)
  assert.equal(date.getTime(), new Date(2026, 0, 1, 9, 30).getTime())
})

test('parses a full ISO timestamp with its own timezone', () => {
  const date = parsePostDate('2026-05-20T12:00:00.000Z')

  assert.ok(date instanceof Date)
  assert.equal(date.getTime(), Date.parse('2026-05-20T12:00:00.000Z'))
  assert.equal(getPostYear('2026-05-20T12:00:00.000Z'), 2026)
})

test('returns null and year 0 for empty or invalid values', () => {
  assert.equal(parsePostDate(''), null)
  assert.equal(parsePostDate('   '), null)
  assert.equal(parsePostDate('not-a-date'), null)
  assert.equal(parsePostDate('2026-13-01'), null)
  assert.equal(parsePostDate(undefined), null)
  assert.equal(parsePostDate(null), null)

  assert.equal(getPostYear(''), 0)
  assert.equal(getPostYear('not-a-date'), 0)
})
