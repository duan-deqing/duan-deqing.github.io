import test from 'node:test'
import assert from 'node:assert/strict'
import {
  parsePostFilename,
  buildPostFilename,
  postImageDirName,
  isValidPostSlug,
  isValidPostDate,
} from '../../src/utils/postFilename.js'

test('解析中文与英文文章文件名', () => {
  assert.deepEqual(parsePostFilename('2026-04-20-building-modern-portfolio.md'), {
    date: '2026-04-20', slug: 'building-modern-portfolio', isEnglish: false,
  })
  assert.deepEqual(parsePostFilename('2023-07-23-markdown-tutorial-en.md'), {
    date: '2023-07-23', slug: 'markdown-tutorial', isEnglish: true,
  })
  assert.deepEqual(parsePostFilename('weird-name.md'), {
    date: '', slug: 'weird-name', isEnglish: false,
  })
})

test('生成文件名', () => {
  assert.equal(buildPostFilename({ date: '2026-10-28', slug: 'hello', lang: 'zh' }), '2026-10-28-hello.md')
  assert.equal(buildPostFilename({ date: '2026-10-28', slug: 'hello', lang: 'en' }), '2026-10-28-hello-en.md')
})

test('配图目录名去掉扩展名与 -en 后缀', () => {
  assert.equal(postImageDirName('2026-04-20-building-modern-portfolio.md'), '2026-04-20-building-modern-portfolio')
  assert.equal(postImageDirName('2023-07-23-markdown-tutorial-en.md'), '2023-07-23-markdown-tutorial')
})

test('slug 与日期校验', () => {
  assert.equal(isValidPostSlug('hello-world-2'), true)
  assert.equal(isValidPostSlug('Hello-World'), false)
  assert.equal(isValidPostSlug('hello_world'), false)
  assert.equal(isValidPostSlug('-hello'), false)
  assert.equal(isValidPostDate('2026-10-28'), true)
  assert.equal(isValidPostDate('2026-02-31'), false)
  assert.equal(isValidPostDate('2026-1-1'), false)
})
