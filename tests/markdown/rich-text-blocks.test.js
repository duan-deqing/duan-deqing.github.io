import test from 'node:test'
import assert from 'node:assert/strict'
import { splitRichTextBlocks } from '../../src/utils/richTextBlocks.js'

test('按空行拆分自我介绍段落，并保留段内换行', () => {
  const text = '第一行\n第二行\n\n第二段'
  assert.deepEqual(splitRichTextBlocks(text), ['第一行\n第二行', '第二段'])
})

test('兼容 CRLF 换行', () => {
  const text = '第一行\r\n第二行\r\n\r\n第二段\r\n'
  assert.deepEqual(splitRichTextBlocks(text), ['第一行\n第二行', '第二段'])
})

test('忽略空内容与多余空白', () => {
  assert.deepEqual(splitRichTextBlocks('  \n\n  段落  \n\n'), ['段落'])
  assert.deepEqual(splitRichTextBlocks(''), [])
})
