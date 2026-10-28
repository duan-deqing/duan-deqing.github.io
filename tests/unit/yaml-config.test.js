import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  YAML_HEADER,
  stringifyYamlDoc,
  parseYamlDoc,
  writeYamlFile,
  readYamlFile,
  fileRevision,
} from '../../scripts/lib/yaml-config.js'

const sample = {
  site: { title: 'STYLAN', description: { en: 'EN', zh: '中文' } },
  list: [{ en: 'A', zh: '甲' }, { en: 'B', zh: '乙' }],
}

test('stringify 带文件头且可回读', () => {
  const text = stringifyYamlDoc(sample)
  assert.ok(text.startsWith(YAML_HEADER))
  assert.deepEqual(parseYamlDoc(text), sample)
})

test('中文长句不被折行', () => {
  const long = { text: '这是一段很长很长的中文说明，用来确认 YAML 输出不会在中途自动折行，否则后台保存会不断产生无意义 diff。' }
  const text = stringifyYamlDoc(long)
  const body = text.split('\n').filter((line) => line.includes('text:'))
  assert.equal(body.length, 1)
})

test('writeYamlFile 写入临时目录后可读回，revision 为数字', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stylan-yaml-'))
  const file = path.join(dir, 'site.yaml')
  writeYamlFile(file, sample)
  assert.deepEqual(readYamlFile(file), sample)
  assert.equal(typeof fileRevision(file), 'number')
  fs.rmSync(dir, { recursive: true, force: true })
})
