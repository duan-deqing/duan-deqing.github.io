import test from 'node:test'
import assert from 'node:assert/strict'
import { getIn, setIn } from '../../src/admin/lib/objectPath.js'

test('getIn 读取嵌套路径与根对象', () => {
  const doc = { site: { title: 'A' }, arr: [] }
  assert.equal(getIn(doc, []), doc)
  assert.equal(getIn(doc, ['site', 'title']), 'A')
  assert.equal(getIn(doc, ['missing', 'x']), undefined)
})

test('setIn 不可变更新并自动补全对象', () => {
  const doc = { site: { title: 'A' } }
  const next = setIn(doc, ['site', 'title'], 'B')
  assert.equal(next.site.title, 'B')
  assert.equal(doc.site.title, 'A')
  assert.deepEqual(setIn({}, ['about', 'focus'], []), { about: { focus: [] } })
  assert.deepEqual(setIn(doc, [], { x: 1 }), { x: 1 })
})
