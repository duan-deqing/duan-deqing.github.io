import test from 'node:test'
import assert from 'node:assert/strict'
import { cn } from '../../src/utils/cn.js'

test('cn joins truthy class names and flattens arrays', () => {
  assert.equal(cn('a', false, 'b', null, undefined, ['c', ''], [['d']]), 'a b c d')
})

test('cn returns an empty string when nothing is truthy', () => {
  assert.equal(cn(false, null, undefined, ''), '')
})
