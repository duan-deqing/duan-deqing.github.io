import assert from 'node:assert/strict'
import test from 'node:test'
import { getProjectInitial, resolveIconEntry, resolveIconName } from '../../src/utils/iconRegistry.js'

const icons = {
  react: { file: '/images/icons/stack/react.svg', link: 'https://react.dev', color: '#0891B2' },
  bare: { file: 'images/icons/stack/bare.svg' },
  remote: { file: 'https://example.com/remote.svg' },
  prompt: { link: 'https://www.promptingguide.ai', color: '#8B5CF6' },
}

test('resolveIconName 通过名称解析到登记资源', () => {
  assert.equal(resolveIconName('react', icons), '/images/icons/stack/react.svg')
  assert.equal(resolveIconName('bare', icons), '/images/icons/stack/bare.svg')
  assert.equal(resolveIconName('remote', icons), 'https://example.com/remote.svg')
  assert.equal(resolveIconName('react.svg', icons), null)
  assert.equal(resolveIconName('unknown', icons), null)
})

test('resolveIconName 兼容站内路径与图片链接', () => {
  assert.equal(resolveIconName('/images/icons/stack/a.svg', icons), '/images/icons/stack/a.svg')
  assert.equal(resolveIconName('https://example.com/icon.svg', icons), 'https://example.com/icon.svg')
  assert.equal(resolveIconName('data:image/svg+xml;base64,AAAA', icons), 'data:image/svg+xml;base64,AAAA')
  assert.equal(resolveIconName('', icons), null)
  assert.equal(resolveIconName(null, icons), null)
})

test('resolveIconEntry 读取图标、链接与颜色', () => {
  assert.deepEqual(resolveIconEntry('react', icons), {
    src: '/images/icons/stack/react.svg',
    link: 'https://react.dev',
    color: '#0891B2',
  })
  assert.deepEqual(resolveIconEntry('prompt', icons), {
    src: null,
    link: 'https://www.promptingguide.ai',
    color: '#8B5CF6',
  })
  assert.deepEqual(resolveIconEntry('bare', icons), {
    src: '/images/icons/stack/bare.svg',
    link: null,
    color: null,
  })
  assert.equal(resolveIconEntry('unknown', icons), null)
  assert.equal(resolveIconEntry('', icons), null)
})

test('getProjectInitial 回退英文首字母', () => {
  assert.equal(getProjectInitial('Orbit Desk'), 'O')
  assert.equal(getProjectInitial({ en: 'ZensheetCV', zh: '简历' }), 'Z')
  assert.equal(getProjectInitial({ zh: '微笺' }), '微')
  assert.equal(getProjectInitial(''), '?')
})
