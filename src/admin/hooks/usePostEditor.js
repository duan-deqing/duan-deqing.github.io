import { useCallback, useEffect, useRef, useState } from 'react'
import { adminApi } from '../api.js'
import {
  buildPostFilename,
  parsePostFilename,
  postImageDirName,
  isValidPostDate,
  isValidPostSlug,
} from '../../utils/blog/postFilename.js'
import { deepEqual } from '../lib/deepEqual.js'

const EMPTY = {
  title: '',
  excerpt: '',
  category: '',
  duration: '',
  tags: [],
}

function today() {
  const now = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function titleIsValid(title) {
  return typeof title === 'string'
    ? title.trim().length > 0
    : Boolean(title && String(title.en || '').trim() && String(title.zh || '').trim())
}

export function usePostEditor({ state, onClose, onSaved, onDirtyChange }) {
  const isNew = Boolean(state.isNew)
  const [lang, setLang] = useState(state.lang || 'zh')
  const [date, setDate] = useState(today)
  const [slug, setSlug] = useState('')
  const [frontmatter, setFrontmatter] = useState(() => ({ ...EMPTY, date: today() }))
  const [body, setBody] = useState('')
  const [baseline, setBaseline] = useState(null)
  const [revision, setRevision] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const [conflict, setConflict] = useState(null)
  const saveRef = useRef(null)

  const filename = isNew ? buildPostFilename({ date, slug, lang }) : state.filename
  const previewDir =
    !isNew || (isValidPostDate(date) && isValidPostSlug(slug))
      ? postImageDirName(filename)
      : ''

  const dirty =
    baseline !== null &&
    (!deepEqual(frontmatter, baseline.frontmatter) ||
      body !== baseline.body ||
      date !== baseline.date ||
      slug !== baseline.slug)

  useEffect(() => {
    let cancelled = false
    async function init() {
      setLoading(true)
      setError('')
      try {
        const configPromise = adminApi.getConfig().catch(() => null)
        const post = isNew ? null : await adminApi.getPost(state.lang, state.filename)
        const config = await configPromise
        if (cancelled) return
        const list = (config?.documents?.blog?.categories || []).filter(
          (item) => item.id !== 'all'
        )
        setCategories(list)

        if (isNew) {
          const initialDate = today()
          const initialFrontmatter = {
            ...EMPTY,
            date: initialDate,
            category: list[0]?.id || '',
          }
          setDate(initialDate)
          setSlug('')
          setFrontmatter(initialFrontmatter)
          setBody('')
          setRevision(null)
          setBaseline({
            frontmatter: initialFrontmatter,
            body: '',
            date: initialDate,
            slug: '',
          })
        } else {
          const meta = parsePostFilename(state.filename)
          const nextDate = String(post.frontmatter.date || meta.date || today())
          const nextFrontmatter = {
            ...EMPTY,
            ...post.frontmatter,
            date: post.frontmatter.date || meta.date,
          }
          setDate(nextDate)
          setSlug(meta.slug)
          setFrontmatter(nextFrontmatter)
          setBody(post.body)
          setRevision(post.revision)
          setBaseline({
            frontmatter: nextFrontmatter,
            body: post.body,
            date: nextDate,
            slug: meta.slug,
          })
        }
        setLoading(false)
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      }
    }
    init()
    return () => {
      cancelled = true
    }
  }, [isNew, state.lang, state.filename])

  useEffect(() => {
    if (!dirty) return undefined
    const handler = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  useEffect(() => {
    onDirtyChange?.(dirty)
  }, [dirty, onDirtyChange])

  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange])

  const persist = useCallback(
    async (overrideRevision) => {
      setError('')
      setNotice('')
      if (isNew) {
        if (!isValidPostDate(date)) {
          setError('日期需为 YYYY-MM-DD')
          return false
        }
        if (!isValidPostSlug(slug)) {
          setError('slug 只能包含小写字母、数字和连字符')
          return false
        }
      }
      if (!titleIsValid(frontmatter.title)) {
        setError('标题不能为空')
        return false
      }
      if (!frontmatter.category) {
        setError('分类必填')
        return false
      }

      setSaving(true)
      try {
        const payload = {
          frontmatter: { ...frontmatter, date },
          body,
          revision: overrideRevision ?? revision,
        }
        const result = await adminApi.savePost(lang, filename, payload)
        setRevision(result.revision)
        setBaseline({ frontmatter: payload.frontmatter, body, date, slug })
        setNotice('已保存')
        onSaved?.()
        return true
      } catch (err) {
        if (err.code === 'REVISION_CONFLICT') {
          setConflict({
            kind: 'conflict',
            message: err.message,
            current: err.payload.current,
            revision: err.payload.revision,
          })
        } else if (err.code === 'POST_EXISTS' || err.code === 'POST_DELETED') {
          setConflict({ kind: 'blocked', message: err.message })
        } else {
          setError(err.message)
        }
        return false
      } finally {
        setSaving(false)
      }
    },
    [body, date, filename, frontmatter, isNew, lang, onSaved, revision, slug]
  )

  saveRef.current = persist

  useEffect(() => {
    const handler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        saveRef.current?.()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const close = useCallback(() => {
    if (dirty && !window.confirm('文章有未保存的更改，确定返回列表？')) return
    onClose()
  }, [dirty, onClose])

  const resolveConflict = useCallback(
    async (mode) => {
      if (!conflict) return
      if (mode === 'server' && conflict.current) {
        const nextDate = String(conflict.current.frontmatter?.date || date)
        setDate(nextDate)
        setFrontmatter(conflict.current.frontmatter)
        setBody(conflict.current.body)
        setRevision(conflict.current.revision)
        setBaseline({
          frontmatter: conflict.current.frontmatter,
          body: conflict.current.body,
          date: nextDate,
          slug,
        })
        setConflict(null)
        setNotice('已加载磁盘版本')
        return
      }
      if (mode === 'local') {
        const targetRevision = conflict.revision
        setConflict(null)
        await persist(targetRevision)
        return
      }
      setConflict(null)
    },
    [conflict, date, persist, slug]
  )

  const uploadImage = useCallback(
    async (file) => {
      if (!file) return
      try {
        const result = await adminApi.upload('post', file, filename)
        setBody((prev) => `${prev}${prev && !prev.endsWith('\n') ? '\n' : ''}\n![${file.name}](${result.path})\n`)
      } catch (err) {
        setError(err.message)
      }
    },
    [filename]
  )

  return {
    isNew,
    lang,
    setLang,
    date,
    setDate,
    slug,
    setSlug,
    frontmatter,
    setFrontmatter,
    body,
    setBody,
    revision,
    categories,
    loading,
    error,
    setError,
    notice,
    saving,
    conflict,
    dirty,
    filename,
    previewDir,
    save: persist,
    close,
    resolveConflict,
    uploadImage,
    setConflict,
  }
}
