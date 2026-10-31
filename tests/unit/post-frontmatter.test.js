import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import fm from 'front-matter'
import { parsePostFilename } from '../../src/utils/postFilename.js'

const POSTS_DIR = fileURLToPath(new URL('../../content/pages/posts/', import.meta.url))
const FIELDS = new Set(['title', 'date', 'category', 'duration', 'tags', 'excerpt'])

for (const lang of ['zh', 'en']) {
  for (const file of readdirSync(`${POSTS_DIR}/${lang}`).filter((name) => name.endsWith('.md'))) {
    test(`${lang}/${file} 使用精简 frontmatter`, () => {
      const { attributes } = fm(readFileSync(`${POSTS_DIR}/${lang}/${file}`, 'utf8'))
      assert.deepEqual(
        Object.keys(attributes).filter((key) => !FIELDS.has(key)),
        []
      )
      assert.equal(attributes.date, parsePostFilename(file).date)
      assert.equal(typeof attributes.title, 'string')
      assert.ok(attributes.title.trim())
      assert.ok(attributes.category)
      if (attributes.duration != null) {
        assert.match(String(attributes.duration), /^\d+min$/)
      }
    })
  }
}
