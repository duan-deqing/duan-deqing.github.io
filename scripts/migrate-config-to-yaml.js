import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import config from '../src/config.js'
import blogConfig from '../src/blogConfig.js'
import { writeYamlFile, readYamlFile } from './lib/yaml-config.js'

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const force = process.argv.includes('--force')

const EXPECTED = {
  'src/content/site.yaml': {
    data: config,
    keys: [
      'site', 'personal', 'navLinks', 'homeSections', 'about', 'buttons',
      'skillsSection', 'skills', 'projectsSection', 'projects', 'contact',
      'contactPage', 'socialLinks', 'footer',
    ],
  },
  'src/content/blog.yaml': {
    data: blogConfig,
    keys: ['page', 'categories'],
  },
}

for (const [rel, { data, keys }] of Object.entries(EXPECTED)) {
  const actual = Object.keys(data).sort()
  const expected = [...keys].sort()
  if (!isDeepStrictEqual(actual, expected)) {
    console.error(`顶层键不一致: ${rel}`)
    console.error('实际:', actual)
    console.error('预期:', expected)
    process.exit(1)
  }

  const file = path.join(ROOT, rel)
  if (fs.existsSync(file) && !force) {
    console.error(`目标已存在，未覆盖: ${rel}（需要覆盖请加 --force）`)
    process.exit(1)
  }
  fs.mkdirSync(path.dirname(file), { recursive: true })
  writeYamlFile(file, data)

  const roundTrip = readYamlFile(file)
  if (!isDeepStrictEqual(roundTrip, data)) {
    console.error(`回读校验失败: ${rel}`)
    process.exit(1)
  }
  console.log(`已写入并校验: ${rel}`)
}
