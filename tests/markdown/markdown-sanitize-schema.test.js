import test from 'node:test'
import assert from 'node:assert/strict'
import rehypeSanitize from 'rehype-sanitize'
import { markdownSanitizeSchema } from '../../src/utils/markdownSanitizeSchema.js'

function element(tagName, properties, children = []) {
  return { type: 'element', tagName, properties, children }
}

test('保留折叠块、自定义锚点、警示块图标与脚注属性', () => {
  const tree = {
    type: 'root',
    children: [
      element('details', { open: true }, [
        element('summary', { className: ['summary'] }, [
          { type: 'text', value: '展开' },
        ]),
        element('a', { name: 'my-anchor', id: 'my-anchor' }, []),
      ]),
      element('div', { className: ['markdown-alert', 'markdown-alert-note'] }, [
        element('svg', { className: ['octicon'], viewBox: '0 0 16 16' }, [
          element('path', { d: 'M0 0h16v16H0z' }, []),
        ]),
      ]),
      element('a', { href: '#my-anchor', className: ['markdown-github-ref'] }, []),
      element('code', { className: ['language-javascript'] }, []),
      element('section', { dataFootnotes: true, className: ['footnotes'] }, [
        element('a', { dataFootnoteRef: true, className: ['footnote-ref'] }, []),
      ]),
      element('h2', { id: 'footnote-label', className: ['sr-only'] }, []),
    ],
  }

  const result = rehypeSanitize(markdownSanitizeSchema)(tree)
  const [details, alert, ref, code, footnotes, heading] = result.children

  assert.equal(details.tagName, 'details')
  assert.equal(details.properties.open, true)
  assert.equal(details.children[1].properties.id, 'my-anchor')
  assert.equal(details.children[1].properties.name, 'my-anchor')
  assert.equal(alert.properties.className[0], 'markdown-alert')
  assert.equal(alert.children[0].tagName, 'svg')
  assert.equal(alert.children[0].children[0].tagName, 'path')
  assert.equal(ref.properties.className[0], 'markdown-github-ref')
  assert.equal(code.properties.className[0], 'language-javascript')
  assert.equal(footnotes.properties.dataFootnotes, true)
  assert.equal(footnotes.children[0].properties.dataFootnoteRef, true)
  assert.equal(heading.properties.id, 'footnote-label')
  assert.deepEqual(heading.properties.className, ['sr-only'])
})

test('移除脚本等危险内容', () => {
  const tree = {
    type: 'root',
    children: [
      element('script', {}, [{ type: 'text', value: 'alert(1)' }]),
      element('a', { href: 'javascript:alert(1)' }, [{ type: 'text', value: 'x' }]),
    ],
  }

  const result = rehypeSanitize(markdownSanitizeSchema)(tree)
  assert.equal(result.children.length, 1)
  assert.equal(result.children[0].properties.href, undefined)
})
