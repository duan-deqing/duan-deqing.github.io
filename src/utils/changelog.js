import fm from 'front-matter'
import { parsePostDate } from './postDate'

const LANGUAGE_SUFFIX = /\.(zh|en)\.md$/i
const changelogFiles = import.meta.glob('/content/changelog/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: false,
})

const filesByLanguage = { zh: {}, en: {} }

for (const path in changelogFiles) {
  const filename = path.split('/').pop()
  const match = filename.match(LANGUAGE_SUFFIX)
  if (match) filesByLanguage[match[1].toLowerCase()][path] = changelogFiles[path]
}

function parseFilename(filename) {
  const base = filename.replace(LANGUAGE_SUFFIX, '')
  const match = base.match(/^v?(.+)-(\d{4}-\d{2}-\d{2})$/)
  return {
    base,
    version: match?.[1] || '',
    date: match?.[2] || '',
  }
}

function normalizeDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  return typeof value === 'string' ? value : ''
}

function normalizePages(value) {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') {
    return value
      .split(/[,\s]+/)
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

export async function getChangelogs(lang = 'zh', scope = 'all') {
  const files = filesByLanguage[lang] || filesByLanguage.zh
  const entries = await Promise.all(
    Object.keys(files).map(async (path) => {
      try {
        const filename = path.split('/').pop()
        const meta = parseFilename(filename)
        const { attributes: data, body } = fm(await files[path]())
        const pages = normalizePages(data.pages)

        if (
          scope !== 'all' &&
          pages.length > 0 &&
          !pages.includes('all') &&
          !pages.includes(scope)
        ) {
          return null
        }

        return {
          id: `${meta.base}-${lang}`,
          version: String(data.version ?? meta.version).replace(/^v/i, ''),
          date: normalizeDate(data.date) || meta.date,
          latest: data.latest === true || String(data.latest).toLowerCase() === 'true',
          pages,
          content: String(body || '').trim(),
        }
      } catch (error) {
        console.error(`Error loading changelog ${path}:`, error)
        return null
      }
    })
  )

  return entries
    .filter(Boolean)
    .sort(
      (a, b) =>
        (parsePostDate(b.date)?.getTime() || 0) -
          (parsePostDate(a.date)?.getTime() || 0) ||
        b.version.localeCompare(a.version, undefined, { numeric: true })
    )
}
