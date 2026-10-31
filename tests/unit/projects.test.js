import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import YAML from 'yaml'

const root = fileURLToPath(new URL('../../', import.meta.url))
const source = YAML.parse(
  readFileSync(path.join(root, 'content/pages/projects.yaml'), 'utf8')
)

test('projects.yaml 分类、项目与页头按钮结构有效', () => {
  assert.ok(source.page?.title?.en && source.page?.title?.zh)
  assert.ok(Array.isArray(source.buttons) && source.buttons.length)

  for (const button of source.buttons) {
    assert.ok(button.name?.trim(), '页头按钮缺少名称')
    assert.equal(new URL(button.link).protocol.startsWith('http'), true)
    assert.ok(button.logo, `页头按钮缺少 logo: ${button.name}`)
    if (button.color) {
      assert.match(button.color, /^#[0-9a-f]{6}$/i, `按钮颜色格式错误: ${button.name}`)
    }
    if (!/^(https?:)?\/\//.test(button.logo) && !button.logo.startsWith('/')) {
      assert.ok(
        existsSync(path.join(root, 'public/images/buttons', button.logo)),
        `缺少按钮图标: ${button.logo}`
      )
    }
  }

  assert.ok(Array.isArray(source.categories))

  const ids = new Set()
  for (const category of source.categories) {
    assert.match(category.id, /^[a-z0-9-]+$/)
    assert.equal(ids.has(category.id), false, `重复项目分类: ${category.id}`)
    ids.add(category.id)
    assert.ok(category.label?.en && category.label?.zh)
  }

  assert.ok(Array.isArray(source.projects))
  for (const project of source.projects) {
    assert.ok(project.title?.en && project.title?.zh)
    assert.ok(ids.has(project.category), `未知项目分类: ${project.category}`)
    assert.equal(new URL(project.link || project.repo).protocol.startsWith('http'), true)
  }
})
