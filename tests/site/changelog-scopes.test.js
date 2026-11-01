import test from 'node:test'
import assert from 'node:assert/strict'
import {
  changelogScopeForPath,
  normalizeChangelogScope,
} from '../../src/utils/changelog/changelogScopes.js'

test('将当前页面映射到更新日志范围', () => {
  assert.equal(changelogScopeForPath('/home'), 'home')
  assert.equal(changelogScopeForPath('/projects'), 'projects')
  assert.equal(changelogScopeForPath('/projects/'), 'projects')
  assert.equal(changelogScopeForPath('/stack'), 'stack')
  assert.equal(changelogScopeForPath('/changelog'), 'all')
  assert.equal(changelogScopeForPath('/changelog/projects'), 'projects')
  assert.equal(changelogScopeForPath('/blog'), 'all')
})

test('未知范围回退到 all', () => {
  assert.equal(normalizeChangelogScope('nope'), 'all')
  assert.equal(normalizeChangelogScope('stack'), 'stack')
})
