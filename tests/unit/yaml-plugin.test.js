import test from 'node:test'
import assert from 'node:assert/strict'
import yamlPlugin from '../../scripts/vite-yaml-plugin.js'

test('transform 把 YAML 转成 ES 默认导出', () => {
  const plugin = yamlPlugin()
  const out = plugin.transform('site:\n  title: STYLAN\n', '/abs/src/content/site.yaml')
  assert.equal(out.code, 'export default {"site":{"title":"STYLAN"}}')
  assert.equal(out.map, null)
})

test('非 yaml 文件不处理', () => {
  const plugin = yamlPlugin()
  assert.equal(plugin.transform('const a = 1', '/abs/src/a.js'), null)
})

test('yaml 解析失败时抛出错误', () => {
  const plugin = yamlPlugin()
  assert.throws(() => plugin.transform('site: [', '/abs/src/content/site.yaml'), /YAML 解析失败/)
})
