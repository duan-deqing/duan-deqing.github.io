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

test('长句不被折行', () => {
  const long = {
    description: {
      en: "I'd love to hear from you! Whether you have a question, a project idea, or just want to say hello, feel free to reach out.",
    },
  }
  const text = stringifyYamlDoc(long)
  assert.ok(text.startsWith(YAML_HEADER))
  const body = text.slice(YAML_HEADER.length).trimEnd()
  const lines = body.split('\n')
  assert.equal(lines.length, 2)
  assert.equal(
    lines[1],
    "  en: I'd love to hear from you! Whether you have a question, a project idea, or just want to say hello, feel free to reach out."
  )
})

test('writeYamlFile 写入临时目录后可读回，revision 为数字', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stylan-yaml-'))
  const file = path.join(dir, 'site.yaml')
  writeYamlFile(file, sample)
  assert.deepEqual(readYamlFile(file), sample)
  assert.equal(typeof fileRevision(file), 'number')
  fs.rmSync(dir, { recursive: true, force: true })
})
