import test from 'node:test'
import assert from 'node:assert/strict'
import { parsePost, serializePost, validateFrontmatter } from '../../scripts/lib/post-content.js'

test('序列化后再解析，frontmatter 与正文保持一致', () => {
  const frontmatter = {
    title: { en: 'Hello', zh: '你好' },
    excerpt: { en: 'Intro', zh: '简介' },
    category: 'tech',
    duration: '8min',
    tags: ['React', 'YAML'],
    date: '2026-10-28',
  }
  const body = '# 标题\n\n正文内容\n'
  const text = serializePost(frontmatter, body)
  const parsed = parsePost(text)
  assert.deepEqual(parsed.frontmatter, frontmatter)
  assert.equal(parsed.body.trimEnd(), '# 标题\n\n正文内容')
})

test('正文中的空行与代码块原样保留', () => {
  const body = '段落一\n\n```js\nconsole.log(1)\n```\n\n段落二'
  const text = serializePost({ title: 'A', category: 'tech', date: '2026-10-28' }, body)
  assert.equal(parsePost(text).body.trimEnd(), body)
})

test('序列化日期时保留字符串，避免被 YAML 解析为 UTC 时间', () => {
  const text = serializePost(
    { title: 'A', category: 'tech', date: '2026-10-28' },
    '正文'
  )
  assert.match(text, /^date: "2026-10-28"$/m)
})

test('frontmatter 日期被规范化为 YYYY-MM-DD', () => {
  const text = '---\ntitle: A\ndate: 2026-10-28\ncategory: tech\n---\n\n正文\n'
  assert.equal(parsePost(text).frontmatter.date, '2026-10-28')
})

test('校验必填与分类', () => {
  const categories = [{ id: 'tech' }, { id: 'thoughts' }]
  assert.deepEqual(validateFrontmatter({ title: 'A', category: 'tech', date: '2026-10-28' }, categories), [])
  assert.ok(validateFrontmatter({}, categories).length >= 1)
  assert.ok(validateFrontmatter({ title: { en: '', zh: '你好' }, category: 'tech', date: '2026-10-28' }, categories).some((m) => m.includes('标题')))
  assert.ok(validateFrontmatter({ title: 'A', category: 'nope', date: '2026-10-28' }, categories).some((m) => m.includes('分类')))
  assert.ok(validateFrontmatter({ title: 'A', category: 'tech', date: '2026-13-01' }, categories).some((m) => m.includes('日期')))
})
