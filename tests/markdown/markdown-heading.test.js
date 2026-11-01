import test from 'node:test'
import assert from 'node:assert/strict'
import {
  headingId,
  headingTextFromMarkdown,
  extractHeadings,
} from '../../src/utils/markdownHeading.js'

test('headingId 处理英文标题', () => {
  assert.equal(headingId('Getting Started With React'), 'getting-started-with-react')
})

test('headingId 保留中文', () => {
  assert.equal(headingId('安装 与 配置'), '安装-与-配置')
})

test('headingId 去掉标点并压缩连字符', () => {
  assert.equal(headingId('Hello, World! -- Again'), 'hello-world-again')
})

test('headingTextFromMarkdown 去掉链接地址保留文字', () => {
  assert.equal(headingTextFromMarkdown('[Title](https://x.dev)'), 'Title')
})

test('headingTextFromMarkdown 去掉强调与行内代码标记', () => {
  assert.equal(headingTextFromMarkdown('**bold** and `code`'), 'bold and code')
})

test('headingTextFromMarkdown 保留下划线', () => {
  assert.equal(headingTextFromMarkdown('snake_case 命名'), 'snake_case 命名')
})

test('headingTextFromMarkdown 去掉图片', () => {
  assert.equal(headingTextFromMarkdown('![alt](img.png) title'), ' title')
})

test('extractHeadings 跳过围栏代码块中的标题', () => {
  const content = '## Real\n```md\n## Fake\n```\n### Deep'
  assert.deepEqual(
    extractHeadings(content).map((h) => h.text),
    ['Real', 'Deep']
  )
})
