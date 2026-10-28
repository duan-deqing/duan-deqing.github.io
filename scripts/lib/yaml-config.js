import fs from 'node:fs'
import YAML from 'yaml'
import { writeFileAtomic } from './fs-atomic.js'

export const YAML_HEADER =
  '# 此文件由本地管理后台维护；字段说明见 src/admin/schema.js 与 README。\n'

export function stringifyYamlDoc(data) {
  return YAML_HEADER + YAML.stringify(data, { lineWidth: 0 })
}

export function parseYamlDoc(text) {
  return YAML.parse(text)
}

export function writeYamlFile(file, data) {
  writeFileAtomic(file, stringifyYamlDoc(data))
}

export function readYamlFile(file) {
  return parseYamlDoc(fs.readFileSync(file, 'utf8'))
}

export function fileRevision(file) {
  return fs.statSync(file).mtimeMs
}
