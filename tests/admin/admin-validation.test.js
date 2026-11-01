import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import {
  isLoopback,
  isSameOrigin,
  isSafeFileName,
  isPostFileName,
  assertInside,
  isAllowedImage,
} from '../../scripts/lib/admin-validation.js'

test('只接受回环地址', () => {
  assert.equal(isLoopback('127.0.0.1'), true)
  assert.equal(isLoopback('::1'), true)
  assert.equal(isLoopback('::ffff:127.0.0.1'), true)
  assert.equal(isLoopback('192.168.1.10'), false)
  assert.equal(isLoopback(undefined), false)
})

test('Origin 必须与 Host 同源，缺省允许', () => {
  assert.equal(isSameOrigin(undefined, 'localhost:5173'), true)
  assert.equal(isSameOrigin('http://localhost:5173', 'localhost:5173'), true)
  assert.equal(isSameOrigin('http://evil.test', 'localhost:5173'), false)
  assert.equal(isSameOrigin('not a url', 'localhost:5173'), false)
})

test('文件名白名单拒绝路径穿越与隐藏文件', () => {
  assert.equal(isSafeFileName('avatar.png'), true)
  assert.equal(isSafeFileName('../secret.txt'), false)
  assert.equal(isSafeFileName('.env'), false)
  assert.equal(isSafeFileName('a/b.png'), false)
  assert.equal(isSafeFileName(''), false)
})

test('文章文件名必须符合约定', () => {
  assert.equal(isPostFileName('2026-04-20-building-modern-portfolio.md'), true)
  assert.equal(isPostFileName('2023-07-23-markdown-tutorial-en.md'), true)
  assert.equal(isPostFileName('2026-04-20-BadSlug.md'), false)
  assert.equal(isPostFileName('../posts/x.md'), false)
  assert.equal(isPostFileName('2026-04-20-ok.txt'), false)
})

test('assertInside 拒绝越界路径', () => {
  const base = path.resolve('/tmp/base')
  assert.equal(assertInside(base, path.join(base, 'a.png')), path.join(base, 'a.png'))
  assert.throws(() => assertInside(base, path.resolve('/tmp/base/../x')), /非法路径/)
})

test('图片扩展名按目标目录区分', () => {
  assert.equal(isAllowedImage('a.PNG', 'site'), true)
  assert.equal(isAllowedImage('favicon.ico', 'site'), true)
  assert.equal(isAllowedImage('favicon.ico', 'post'), false)
  assert.equal(isAllowedImage('a.pdf', 'site'), false)
  assert.equal(isAllowedImage('../a.png', 'site'), false)
})
