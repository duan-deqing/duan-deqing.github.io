import test from 'node:test'
import assert from 'node:assert/strict'
import { isBadgeImage } from '../../src/utils/articleMedia.js'

test('识别常见徽章图片地址', () => {
  assert.equal(isBadgeImage('https://img.shields.io/badge/license-MIT-blue'), true)
  assert.equal(isBadgeImage('https://badgen.net/npm/v/react'), true)
  assert.equal(isBadgeImage('https://flat.badgen.net/github/stars/foo/bar'), true)
  assert.equal(isBadgeImage('https://github.com/foo/bar/actions/workflows/ci.yml/badge.svg'), true)
})

test('普通图片、相对路径与空值不识别为徽章', () => {
  assert.equal(isBadgeImage('https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'), false)
  assert.equal(isBadgeImage('./img/my-post/cover.jpg'), false)
  assert.equal(isBadgeImage(''), false)
  assert.equal(isBadgeImage(undefined), false)
})
