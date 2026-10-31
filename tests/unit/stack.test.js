import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import YAML from 'yaml'

const root = fileURLToPath(new URL('../../', import.meta.url))
const source = YAML.parse(
  readFileSync(path.join(root, 'content/pages/stack.yaml'), 'utf8')
)
const logoDir = path.join(root, 'public/images/stack')

test('stack.yaml 页头按钮、分类与技术项有效', () => {
  assert.ok(source.page?.title?.en && source.page?.title?.zh)
  assert.ok(source.page?.description?.en && source.page?.description?.zh)
  assert.ok(source.page?.intro?.en && source.page?.intro?.zh)
  assert.ok(Array.isArray(source.buttons) && source.buttons.length)

  const buttonNames = new Set()
  for (const button of source.buttons) {
    assert.ok(button.name?.trim(), '官网按钮缺少名称')
    assert.equal(buttonNames.has(button.name), false, `重复官网按钮: ${button.name}`)
    buttonNames.add(button.name)
    assert.equal(new URL(button.link).protocol.startsWith('http'), true)
    assert.ok(button.logo, `官网按钮缺少 logo: ${button.name}`)
    if (button.color) {
      assert.match(button.color, /^#[0-9a-f]{6}$/i, `按钮颜色格式错误: ${button.name}`)
    }
    if (!/^(https?:)?\/\//.test(button.logo) && !button.logo.startsWith('/')) {
      assert.ok(existsSync(path.join(logoDir, button.logo)), `缺少 logo 文件: ${button.logo}`)
    }
  }

  assert.ok(Array.isArray(source.categories))

  const ids = new Set()
  for (const category of source.categories) {
    assert.match(category.id, /^[a-z0-9-]+$/)
    assert.equal(ids.has(category.id), false, `重复 Stack 分类: ${category.id}`)
    ids.add(category.id)
    assert.ok(category.label?.en && category.label?.zh)
    assert.ok(Array.isArray(category.items) && category.items.length)

    const names = new Set()
    for (const item of category.items) {
      assert.ok(item.name?.trim(), `技术项缺少名称: ${category.id}`)
      assert.equal(names.has(item.name), false, `重复技术项: ${item.name}`)
      names.add(item.name)
      assert.equal(item.link, undefined, `链接请配置到 buttons: ${item.name}`)
      assert.equal(item.logo, undefined, `logo 请配置到 buttons: ${item.name}`)
      if (item.description) {
        assert.ok(item.description.en && item.description.zh)
      }
    }
  }
})
