import test from 'node:test'
import assert from 'node:assert/strict'
import rehypeCodeLanguage from '../../src/utils/rehypeCodeLanguage.js'

function codeTree(className) {
  const code = {
    type: 'element',
    tagName: 'code',
    properties: { className: [className] },
    children: [{ type: 'text', value: 'const a = 1' }],
  }
  return {
    tree: {
      type: 'root',
      children: [{ type: 'element', tagName: 'pre', properties: {}, children: [code] }],
    },
    code,
  }
}

test('路径语言按最后一个扩展名映射，并保留原标签', () => {
  const { tree, code } = codeTree('language-src/main.js')
  rehypeCodeLanguage()(tree)
  assert.deepEqual(code.properties.className, ['language-javascript'])
  assert.equal(code.properties['data-code-label'], 'src/main.js')
})

test('常见扩展名支持大小写与多级文件名', () => {
  for (const [raw, expected] of [
    ['src/components/App.tsx', 'tsx'],
    ['styles/site.SCSS', 'scss'],
    ['content/posts/demo.md', 'markdown'],
  ]) {
    const { tree, code } = codeTree(`language-${raw}`)
    rehypeCodeLanguage()(tree)
    assert.deepEqual(code.properties.className, [`language-${expected}`])
    assert.equal(code.properties['data-code-label'], raw)
  }
})

test('直接语言标识与自定义块保持不变', () => {
  for (const raw of ['js', 'JavaScript', 'python', 'mermaid', 'video']) {
    const { tree, code } = codeTree(`language-${raw}`)
    rehypeCodeLanguage()(tree)
    assert.deepEqual(code.properties.className, [`language-${raw}`])
    assert.equal(code.properties['data-code-label'], undefined)
  }
})
