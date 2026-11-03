import test from 'node:test'
import assert from 'node:assert/strict'
import { deepEqual } from '../../src/admin/lib/deepEqual.js'

test('deepEqual 比较原始值与数组', () => {
  assert.equal(deepEqual(1, 1), true)
  assert.equal(deepEqual('a', 'b'), false)
  assert.equal(deepEqual([1, { a: 2 }], [1, { a: 2 }]), true)
  assert.equal(deepEqual([1, 2], [2, 1]), false)
})

test('deepEqual 比较对象并区分 null 与缺失键', () => {
  assert.equal(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }), true)
  assert.equal(deepEqual({ a: 1 }, { a: 1, b: undefined }), false)
  assert.equal(deepEqual(null, {}), false)
  assert.equal(deepEqual({ a: null }, { a: null }), true)
})
