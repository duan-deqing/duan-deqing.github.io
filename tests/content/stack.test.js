import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import YAML from 'yaml'

const root = fileURLToPath(new URL('../..', import.meta.url))
const readYaml = (file) => YAML.parse(readFileSync(path.join(root, file), 'utf8'))

const source = readYaml('content/stack/stack.yaml')
const icons = readYaml('content/icons.yaml').icons || {}

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
    assert.ok(button.logo, `官网按钮缺少图标名称: ${button.name}`)
    assert.equal(button.link, undefined, `链接请配置到 icons.yaml: ${button.name}`)
    assert.equal(button.color, undefined, `颜色请配置到 icons.yaml: ${button.name}`)
    assert.ok(icons[button.logo]?.link, `图标登记缺少链接: ${button.logo}`)
  }

  assert.ok(Array.isArray(source.tags))
  for (const tag of source.tags) {
    assert.ok(tag.name?.trim(), '标签缺少名称')
    assert.ok(tag.logo, `标签缺少图标名称: ${tag.name}`)
    assert.equal(tag.link, undefined, `链接请配置到 icons.yaml: ${tag.name}`)
    assert.ok(icons[tag.logo]?.link, `图标登记缺少链接: ${tag.logo}`)
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
      assert.equal(item.logo, undefined, `logo 请配置到 icons.yaml: ${item.name}`)
      assert.match(item.link, /^[a-z0-9-]+$/, `技术项链接需引用 icons.yaml 登记名: ${item.name}`)
      assert.ok(icons[item.link]?.link, `图标登记缺少链接: ${item.link}`)
      if (item.description) {
        assert.ok(item.description.en && item.description.zh)
      }
    }
  }
})
