import test from 'node:test'
import assert from 'node:assert/strict'
import { validateValue, validateDoc } from '../../src/admin/lib/validate.js'

test('必填与格式校验', () => {
  assert.equal(validateValue({ type: 'text', required: true }, ''), '必填')
  assert.equal(validateValue({ type: 'text', required: true }, 'A'), '')
  assert.equal(validateValue({ type: 'i18nText', required: true }, { en: 'A', zh: '甲' }), '')
  assert.match(validateValue({ type: 'url' }, 'not-a-url'), /http/)
  assert.equal(validateValue({ type: 'url' }, '/contact'), '')
  assert.equal(validateValue({ type: 'url' }, 'mailto:duan-deqing@foxmail.com'), '')
  assert.equal(validateValue({ type: 'url' }, '#projects'), '')
  assert.match(validateValue({ type: 'imagePath' }, 'avatar.png'), /路径/)
  assert.equal(validateValue({ type: 'imagePath' }, '/images/a.png'), '')
})

test('validateDoc 覆盖嵌套对象与列表', () => {
  const sections = [
    {
      id: 'site', label: '站点', doc: 'site', path: [],
      fields: [
        { key: 'title', label: '标题', type: 'text', required: true },
        { key: 'contact', label: '联系', type: 'object', fields: [
          { key: 'email', label: '邮箱', type: 'text', required: true },
        ] },
      ],
    },
    {
      id: 'skills', label: '技能', doc: 'site', path: ['skills'],
      list: { label: '技能项', fields: [{ key: 'name', label: '名称', type: 'text', required: true }] },
    },
  ]
  const errors = validateDoc(sections, {
    site: { title: '', contact: { email: '' }, skills: [{ name: '' }] },
    blog: {},
  })
  assert.ok(errors.some((message) => message.includes('标题')))
  assert.ok(errors.some((message) => message.includes('邮箱')))
  assert.ok(errors.some((message) => message.includes('技能')))
})
