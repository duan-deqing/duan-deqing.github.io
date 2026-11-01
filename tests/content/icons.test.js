import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import YAML from 'yaml'

const root = fileURLToPath(new URL('../../', import.meta.url))
const readYaml = (file) => YAML.parse(readFileSync(path.join(root, file), 'utf8'))

const iconSource = readYaml('content/icons.yaml')
const icons = iconSource.icons || {}
const site = readYaml('content/site.yaml')
const projects = readYaml('content/projects/projects.yaml')
const stack = readYaml('content/stack/stack.yaml')
const bookmarks = readYaml('content/bookmarks/bookmarks.yaml')

function isRemote(file) {
  return /^(https?:)?\/\//.test(file) || file.startsWith('data:image/')
}

test('icons.yaml 图标与技术项登记有效', () => {
  const keys = Object.keys(icons)
  assert.ok(keys.length > 0, 'icons.yaml 不能为空')

  for (const [key, icon] of Object.entries(icons)) {
    assert.match(key, /^[a-z0-9-]+$/, `登记名不合法: ${key}`)
    assert.ok(icon && typeof icon === 'object', `登记项需为对象: ${key}`)

    const file = typeof icon.file === 'string' ? icon.file.trim() : ''
    const link = typeof icon.link === 'string' ? icon.link.trim() : ''
    assert.ok(file || link, `登记项缺少 file 或 link: ${key}`)

    if (file) {
      assert.ok(file.startsWith('/') || isRemote(file), `图标路径需以 / 开头或为图片链接: ${key}`)
      if (!isRemote(file)) {
        assert.ok(
          existsSync(path.join(root, 'public', file)),
          `缺少图标文件: ${key} -> ${file}`
        )
      }
    }
    if (link) {
      assert.match(link, /^https?:\/\//, `链接需为 http(s) 地址: ${key}`)
    }
    if (icon.color) {
      assert.match(icon.color, /^#[0-9a-f]{6}$/i, `颜色格式错误: ${key}`)
    }
  }
})

test('site.yaml / projects.yaml / stack.yaml / bookmarks.yaml 通过名称引用图标与链接', () => {
  const iconRefs = [
    ...((site.navLinks || []).map((link) => ['site.navLinks', link.href, link.icon])),
    ...((site.contacts || []).map((contact) => ['site.contacts', contact.icon, contact.icon])),
    ...((projects.buttons || []).map((button) => ['projects.buttons', button.name, button.logo])),
    ...((projects.projects || []).map((project) => ['projects.projects', project.slug || project.title?.en, project.icon])),
    ...((stack.buttons || []).map((button) => ['stack.buttons', button.name, button.logo])),
    ...((stack.tags || []).map((tag) => ['stack.tags', tag.name, tag.logo])),
    ...((bookmarks.categories || []).map((category) => ['bookmarks.categories', category.slug, category.icon])),
  ]

  for (const [source, name, icon] of iconRefs) {
    assert.equal(typeof icon, 'string', `${source} / ${name} 缺少图标名称`)
    const entry = icons[icon.trim()]
    assert.ok(entry, `${source} / ${name} 引用了未登记的图标: ${icon}`)
    assert.ok(entry.file, `${source} / ${name} 引用的登记项缺少 file: ${icon}`)
  }

  const linkRefs = (stack.categories || []).flatMap((category) =>
    (category.items || []).map((item) => ['stack.categories', item.name, item.link])
  )

  for (const [source, name, ref] of linkRefs) {
    assert.equal(typeof ref, 'string', `${source} / ${name} 缺少链接登记名`)
    const entry = icons[ref.trim()]
    assert.ok(entry, `${source} / ${name} 引用了未登记的链接: ${ref}`)
    assert.ok(entry.link, `${source} / ${name} 引用的登记项缺少 link: ${ref}`)
  }
})
