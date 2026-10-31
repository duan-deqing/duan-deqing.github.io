import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import fm from 'front-matter'

const DIR = fileURLToPath(new URL('../../content/changelog/', import.meta.url))
const FIELDS = new Set(['version', 'date', 'latest', 'pages'])
const SCOPES = new Set(['all', 'home', 'projects', 'stack'])
const files = readdirSync(DIR).filter((name) => /\.(zh|en)\.md$/.test(name))

test('更新日志文件按版本号与日期命名，并成对提供中英文', () => {
  assert.ok(files.length >= 2)
  const bases = new Set(files.map((name) => name.replace(/\.(zh|en)\.md$/, '')))
  for (const base of bases) {
    assert.ok(files.includes(`${base}.zh.md`), `${base} 缺少中文版`)
    assert.ok(files.includes(`${base}.en.md`), `${base} 缺少英文版`)
    assert.match(base, /^v.+-\d{4}-\d{2}-\d{2}$/)
  }
})

test('至少有一个最新版本标记', () => {
  const hasLatest = files.some((file) => {
    const { attributes } = fm(readFileSync(`${DIR}/${file}`, 'utf8'))
    return attributes.latest === true
  })
  assert.equal(hasLatest, true)
})

for (const file of files) {
  test(`${file} frontmatter 与文件名一致`, () => {
    const { attributes, body } = fm(readFileSync(`${DIR}/${file}`, 'utf8'))
    assert.deepEqual(
      Object.keys(attributes).filter((key) => !FIELDS.has(key)),
      []
    )

    const base = file.replace(/\.(zh|en)\.md$/, '')
    const match = base.match(/^v(.+)-(\d{4}-\d{2}-\d{2})$/)
    assert.equal(String(attributes.version), match[1])
    assert.equal(attributes.date, match[2])
    assert.equal(typeof attributes.latest, 'boolean')
    assert.ok(Array.isArray(attributes.pages) && attributes.pages.length > 0)
    assert.ok(attributes.pages.every((page) => SCOPES.has(page)))
    assert.ok(body.trim().length > 0)
  })
}
