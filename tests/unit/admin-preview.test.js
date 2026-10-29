import test from 'node:test'
import assert from 'node:assert/strict'
import { resolvePreviewImages } from '../../src/admin/lib/preview.js'

test('相对图片解析到文章配图目录', () => {
  assert.equal(
    resolvePreviewImages('![a](cover.png)', '2026-04-20-building-modern-portfolio'),
    '![a](/src/posts/img/2026-04-20-building-modern-portfolio/cover.png)'
  )
  assert.equal(resolvePreviewImages('![a](./cover.png)', 'dir'), '![a](/src/posts/img/dir/cover.png)')
  assert.equal(
    resolvePreviewImages('![a](./img/folder/cover.png)', 'dir'),
    '![a](/src/posts/img/dir/cover.png)'
  )
})

test('带 caption 的图片保留 title', () => {
  assert.equal(
    resolvePreviewImages('![a](./cover.png "Cover")', 'dir'),
    '![a](/src/posts/img/dir/cover.png "Cover")'
  )
})

test('绝对路径与远程图片保持不变', () => {
  assert.equal(resolvePreviewImages('![a](https://x.test/y.png)', 'dir'), '![a](https://x.test/y.png)')
  assert.equal(resolvePreviewImages('![a](/images/y.png)', 'dir'), '![a](/images/y.png)')
  assert.equal(resolvePreviewImages('![a](cover.png)', ''), '![a](cover.png)')
})
