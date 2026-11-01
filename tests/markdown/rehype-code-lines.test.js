import test from 'node:test'
import assert from 'node:assert/strict'
import rehypeCodeLines from '../../src/utils/rehypeCodeLines.js'

test('wraps code children into numbered lines and keeps nested spans', () => {
  const tree = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'pre',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'code',
            properties: { className: ['hljs', 'language-js'] },
            children: [
              {
                type: 'element',
                tagName: 'span',
                properties: { className: ['hljs-keyword'] },
                children: [{ type: 'text', value: 'const' }],
              },
              { type: 'text', value: ' a = 1\n' },
              { type: 'text', value: 'console.log(a)\n' },
            ],
          },
        ],
      },
    ],
  }

  rehypeCodeLines()(tree)
  const code = tree.children[0].children[0]
  assert.equal(code.children.length, 2)
  assert.equal(code.children[0].tagName, 'span')
  assert.deepEqual(code.children[0].properties.className, ['code-line'])
  assert.equal(code.children[0].properties['data-line'], '1')
  assert.equal(code.children[0].children[0].tagName, 'span')
  assert.equal(code.children[1].properties['data-line'], '2')
})

test('skips custom fenced blocks and preserves their newlines', () => {
  for (const lang of ['mermaid', 'video', 'carousel']) {
    const code = {
      type: 'element',
      tagName: 'code',
      properties: { className: [`language-${lang}`] },
      children: [{ type: 'text', value: 'graph TD\nA --> B' }],
    }
    const tree = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          properties: {},
          children: [code],
        },
      ],
    }

    rehypeCodeLines()(tree)
    assert.deepEqual(code.children, [{ type: 'text', value: 'graph TD\nA --> B' }])
  }
})

test('leaves non-pre trees unchanged', () => {
  const tree = { type: 'root', children: [{ type: 'element', tagName: 'p', properties: {}, children: [] }] }
  rehypeCodeLines()(tree)
  assert.equal(tree.children[0].tagName, 'p')
})

test('splits a highlighted span that spans multiple lines', () => {
  const tree = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'pre',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'code',
            properties: { className: ['hljs', 'language-js'] },
            children: [
              {
                type: 'element',
                tagName: 'span',
                properties: { className: ['hljs-string'] },
                children: [{ type: 'text', value: 'alpha\nbeta' }],
              },
            ],
          },
        ],
      },
    ],
  }

  rehypeCodeLines()(tree)
  const code = tree.children[0].children[0]
  assert.equal(code.children.length, 2)
  assert.deepEqual(code.children[0].properties, {
    className: ['code-line'],
    'data-line': '1',
  })
  assert.equal(code.children[0].children[0].tagName, 'span')
  assert.deepEqual(code.children[0].children[0].properties, {
    className: ['hljs-string'],
  })
  assert.deepEqual(code.children[0].children[0].children, [{ type: 'text', value: 'alpha' }])
  assert.deepEqual(code.children[1].children[0].children, [{ type: 'text', value: 'beta' }])
  assert.equal(code.children[1].properties['data-line'], '2')
})

test('keeps empty lines as empty numbered lines', () => {
  const tree = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'pre',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'code',
            properties: { className: ['hljs', 'language-text'] },
            children: [{ type: 'text', value: 'a\n\nb' }],
          },
        ],
      },
    ],
  }

  rehypeCodeLines()(tree)
  const code = tree.children[0].children[0]
  assert.equal(code.children.length, 3)
  assert.equal(code.children[1].properties['data-line'], '2')
  assert.deepEqual(code.children[1].children, [])
  assert.deepEqual(code.children[2].children, [{ type: 'text', value: 'b' }])
})

test('normalizes CRLF line endings without leaving carriage returns', () => {
  const tree = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'pre',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'code',
            properties: {},
            children: [{ type: 'text', value: 'one\r\ntwo\r\n' }],
          },
        ],
      },
    ],
  }

  rehypeCodeLines()(tree)
  const code = tree.children[0].children[0]
  assert.equal(code.children.length, 2)
  assert.deepEqual(code.children[0].children, [{ type: 'text', value: 'one' }])
  assert.deepEqual(code.children[1].children, [{ type: 'text', value: 'two' }])
})

test('去掉代码块末尾由换行产生的空行', () => {
  const tree = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'pre',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'code',
            properties: {},
            children: [{ type: 'text', value: 'a\n\nb\n\n\n' }],
          },
        ],
      },
    ],
  }

  rehypeCodeLines()(tree)
  const code = tree.children[0].children[0]
  assert.equal(code.children.length, 3)
  assert.deepEqual(code.children[2].children, [{ type: 'text', value: 'b' }])
})

test('wraps every pre in a document and ignores pre without code', () => {
  const tree = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'pre',
            properties: {},
            children: [
              {
                type: 'element',
                tagName: 'code',
                properties: {},
                children: [{ type: 'text', value: 'x' }],
              },
            ],
          },
          {
            type: 'element',
            tagName: 'pre',
            properties: {},
            children: [{ type: 'text', value: 'raw' }],
          },
        ],
      },
    ],
  }

  rehypeCodeLines()(tree)
  const [withCode, withoutCode] = tree.children[0].children
  assert.equal(withCode.children[0].children.length, 1)
  assert.equal(withCode.children[0].children[0].properties['data-line'], '1')
  assert.deepEqual(withoutCode.children, [{ type: 'text', value: 'raw' }])
})
