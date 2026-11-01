import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import YAML from 'yaml'

const root = fileURLToPath(new URL('../../', import.meta.url))
const source = YAML.parse(
  readFileSync(path.join(root, 'content/projects/projects.yaml'), 'utf8')
)

test('projects.yaml 分类、项目与页头按钮结构有效', () => {
  assert.ok(source.page?.title?.en && source.page?.title?.zh)
  assert.ok(Array.isArray(source.buttons) && source.buttons.length)

  for (const button of source.buttons) {
    assert.ok(button.name?.trim(), '页头按钮缺少名称')
    assert.equal(new URL(button.link).protocol.startsWith('http'), true)
    assert.ok(button.logo, `页头按钮缺少图标名称: ${button.name}`)
    if (button.color) {
      assert.match(button.color, /^#[0-9a-f]{6}$/i, `按钮颜色格式错误: ${button.name}`)
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

test('项目 slug 有效且中英文详情正文齐备', () => {
  const slugs = new Set()

  for (const project of source.projects) {
    if (!project.slug) continue

    assert.match(
      project.slug,
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      `slug 格式错误: ${project.slug}`
    )
    assert.equal(slugs.has(project.slug), false, `重复项目 slug: ${project.slug}`)
    slugs.add(project.slug)

    for (const lang of ['zh', 'en']) {
      const file = path.join(root, `content/projects/${lang}/${project.slug}.md`)
      assert.ok(existsSync(file), `缺少项目详情正文: ${lang}/${project.slug}.md`)
      assert.ok(readFileSync(file, 'utf8').trim(), `项目详情正文为空: ${lang}/${project.slug}.md`)
    }
  }
})
