import test from 'node:test'
import assert from 'node:assert/strict'
import { remarkGithubRefs, githubRepoUrl } from '../../src/utils/remarkGithubRefs.js'

function paragraph(value) {
  return {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', value }],
      },
    ],
  }
}

test('把 { @username }、Issue 与 commit hash 转为 GitHub 链接', () => {
  const tree = paragraph('感谢 {@octocat}，见 #123 与提交 a1b2c3d。')
  remarkGithubRefs()(tree)

  const links = tree.children[0].children.filter((node) => node.type === 'link')
  assert.deepEqual(
    links.map((link) => link.url),
    [
      'https://github.com/octocat',
      `${githubRepoUrl}/issues/123`,
      `${githubRepoUrl}/commit/a1b2c3d`,
    ]
  )
  assert.deepEqual(links.map((link) => link.children[0].value), [
    '@octocat',
    '#123',
    'a1b2c3d',
  ])
  assert.deepEqual(links[0].data.hProperties.className, [
    'markdown-github-ref',
    'markdown-github-mention',
  ])
})

test('提及支持自定义显示名', () => {
  const tree = paragraph('感谢 {@octocat|Octo Cat}。')
  remarkGithubRefs()(tree)
  const link = tree.children[0].children.find((node) => node.type === 'link')
  assert.equal(link.url, 'https://github.com/octocat')
  assert.equal(link.children[0].value, 'Octo Cat')
})

test('裸 @username 不再自动转换，避免与邮箱或普通 @ 文本冲突', () => {
  const tree = paragraph('@octocat 和 mail@example.com 保持原样。')
  remarkGithubRefs()(tree)
  assert.equal(tree.children[0].children.filter((node) => node.type === 'link').length, 0)
})

test('不转换代码、链接、邮箱、纯数字与纯字母短词', () => {
  const tree = {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          { type: 'text', value: 'mail me at foo@example.com, @someone, color #fff, word deadbeef 1234567 ' },
          {
            type: 'inlineCode',
            value: '@octocat #123 a1b2c3d',
          },
          { type: 'text', value: ' and ' },
          {
            type: 'link',
            url: 'https://example.com/@someone',
            children: [{ type: 'text', value: '@someone' }],
          },
        ],
      },
    ],
  }

  remarkGithubRefs()(tree)
  const children = tree.children[0].children
  assert.equal(children.filter((node) => node.type === 'link').length, 1)
  assert.equal(
    children[0].value,
    'mail me at foo@example.com, @someone, color #fff, word deadbeef 1234567 '
  )
})
