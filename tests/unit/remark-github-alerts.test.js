import test from 'node:test'
import assert from 'node:assert/strict'
import { remarkGithubAlerts } from '../../src/utils/remarkGithubAlerts.js'

test('把 GitHub alert 转为带图标的 markdown-alert，并输出标题大小写', () => {
  const tree = {
    type: 'root',
    children: [
      {
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: '[!NOTE]' },
              { type: 'break' },
              { type: 'text', value: '正文' },
            ],
          },
        ],
      },
    ],
  }

  remarkGithubAlerts()(tree)
  const alert = tree.children[0]
  assert.equal(alert.data.hName, 'div')
  assert.deepEqual(alert.data.hProperties.className, ['markdown-alert', 'markdown-alert-note'])

  const title = alert.children[0]
  assert.equal(title.data.hProperties.className, 'markdown-alert-title')
  assert.equal(title.children[0].data.hName, 'svg')
  assert.equal(title.children[1].value, 'Note')
})
