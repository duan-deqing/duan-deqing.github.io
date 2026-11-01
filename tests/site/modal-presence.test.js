import assert from 'node:assert/strict'
import test from 'node:test'
import {
  isExiting,
  isMounted,
  isVisible,
  presenceReducer,
} from '../../src/utils/modalPresence.js'

test('Modal presence 从关闭进入、显示、退出并卸载', () => {
  let state = 'closed'
  assert.equal(isMounted(state), false)

  state = presenceReducer(state, { type: 'open' })
  assert.equal(state, 'entering')
  assert.equal(isMounted(state), true)
  assert.equal(isVisible(state), false)

  state = presenceReducer(state, { type: 'shown' })
  assert.equal(state, 'open')
  assert.equal(isVisible(state), true)
  assert.equal(isExiting(state), false)

  state = presenceReducer(state, { type: 'close' })
  assert.equal(state, 'exiting')
  assert.equal(isMounted(state), true)
  assert.equal(isVisible(state), false)
  assert.equal(isExiting(state), true)

  state = presenceReducer(state, { type: 'closed' })
  assert.equal(state, 'closed')
  assert.equal(isMounted(state), false)
})

test('Modal presence 退出过程中重新打开会再次进入', () => {
  let state = 'closed'
  state = presenceReducer(state, { type: 'open' })
  state = presenceReducer(state, { type: 'shown' })
  state = presenceReducer(state, { type: 'close' })
  assert.equal(state, 'exiting')

  state = presenceReducer(state, { type: 'open' })
  assert.equal(state, 'entering')
  assert.equal(isMounted(state), true)

  state = presenceReducer(state, { type: 'shown' })
  assert.equal(state, 'open')
  assert.equal(isVisible(state), true)
})
