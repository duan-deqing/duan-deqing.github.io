import test from 'node:test'
import assert from 'node:assert/strict'
import { headingId } from '../../src/utils/markdownHeading.js'

test('headingId 处理英文标题', () => {
  assert.equal(headingId('Getting Started With React'), 'getting-started-with-react')
})

test('headingId 保留中文', () => {
  assert.equal(headingId('安装 与 配置'), '安装-与-配置')
})

test('headingId 去掉标点并压缩连字符', () => {
  assert.equal(headingId('Hello, World! -- Again'), 'hello-world-again')
})
