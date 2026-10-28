import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { adminApi } from '../api'
import {
  buildPostFilename,
  parsePostFilename,
  postImageDirName,
  isValidPostDate,
  isValidPostSlug,
} from '../../utils/postFilename'
import Field from '../components/Field'
import { resolvePreviewImages } from '../lib/preview'

const EMPTY = {
  title: { en: '', zh: '' },
  excerpt: { en: '', zh: '' },
  readTime: '',
  author: 'STYLAN',
  category: '',
  tags: [],
  featured: false,
}

function today() {
  const now = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function BiTextField({ label, value, onChange, multiline = false, help = '' }) {
  const isBi = value && typeof value === 'object' && !Array.isArray(value)
  const Input = multiline ? 'textarea' : 'input'
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="admin-label-text">{label}</span>
        <button
          type="button"
          className="admin-link"
          onClick={() =>
            onChange(isBi ? value.zh || value.en || '' : { en: value || '', zh: value || '' })
          }
        >
          {isBi ? '改为单语' : '改为双语'}
        </button>
      </div>
      {isBi ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {['en', 'zh'].map((lang) => (
            <label key={lang} className="block">
              <span className="admin-sub">{lang.toUpperCase()}</span>
              <Input
                className="admin-input"
                rows={multiline ? 3 : undefined}
                value={value?.[lang] || ''}
                onChange={(event) => onChange({ ...value, [lang]: event.target.value })}
              />
            </label>
          ))}
        </div>
      ) : (
        <Input
          className="admin-input"
          rows={multiline ? 3 : undefined}
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {help && <p className="admin-help">{help}</p>}
    </div>
  )
}

function titleIsValid(title) {
  return typeof title === 'string'
    ? title.trim().length > 0
    : Boolean(title && String(title.en || '').trim() && String(title.zh || '').trim())
}

export default function PostEditor({ state, onClose, onSaved }) {
  const isNew = Boolean(state.isNew)
  const [lang, setLang] = useState(state.lang || 'zh')
  const [date, setDate] = useState(today())
  const [slug, setSlug] = useState('')
  const [frontmatter, setFrontmatter] = useState({ ...EMPTY, date: today() })
  const [body, setBody] = useState('')
  const [revision, setRevision] = useState(null)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    adminApi
      .getConfig()
      .then((config) => {
        if (cancelled) return
        setCategories((config.blog?.categories || []).filter((item) => item.id !== 'all'))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (isNew) return undefined
    let cancelled = false
    adminApi
      .getPost(state.lang, state.filename)
      .then((post) => {
        if (cancelled) return
        const meta = parsePostFilename(state.filename)
        setFrontmatter({ ...EMPTY, ...post.frontmatter, date: post.frontmatter.date || meta.date })
        setDate(String(post.frontmatter.date || meta.date || today()))
        setSlug(meta.slug)
        setBody(post.body)
        setRevision(post.revision)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [isNew, state.lang, state.filename])

  const filename = isNew ? buildPostFilename({ date, slug, lang }) : state.filename
  const previewDir =
    !isNew || (isValidPostDate(date) && isValidPostSlug(slug))
      ? postImageDirName(filename)
      : ''
  const previewBody = resolvePreviewImages(body, previewDir)

  async function handleSave() {
    setError('')
    if (isNew) {
      if (!isValidPostDate(date)) return setError('日期需为 YYYY-MM-DD')
      if (!isValidPostSlug(slug)) return setError('slug 只能包含小写字母、数字和连字符')
    }
    if (!titleIsValid(frontmatter.title)) return setError('标题不能为空')
    setSaving(true)
    try {
      const payload = {
        frontmatter: { ...frontmatter, date },
        body,
        revision,
      }
      const result = await adminApi.savePost(lang, filename, payload)
      setRevision(result.revision)
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const result = await adminApi.upload('post', file, filename)
      setBody((prev) => `${prev}${prev && !prev.endsWith('\n') ? '\n' : ''}\n![${file.name}](${result.path})\n`)
    } catch (err) {
      setError(err.message)
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <button className="admin-btn" onClick={onClose}>← 返回列表</button>
        <div className="flex items-center gap-3">
          {error && <span className="admin-error">{error}</span>}
          <button className="admin-btn admin-btn-primary" disabled={saving} onClick={handleSave}>
            {saving ? '保存中…' : '保存文章'}
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="admin-label-text">语言</span>
          <select className="admin-input" value={lang} disabled={!isNew} onChange={(event) => setLang(event.target.value)}>
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        </label>
        <label className="block">
          <span className="admin-label-text">日期</span>
          <input className="admin-input" placeholder="2026-10-28" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        {isNew && (
          <label className="block">
            <span className="admin-label-text">slug</span>
            <input className="admin-input" placeholder="my-new-post" value={slug} onChange={(event) => setSlug(event.target.value)} />
          </label>
        )}
        <label className="block">
          <span className="admin-label-text">分类</span>
          <select
            className="admin-input"
            value={frontmatter.category || ''}
            onChange={(event) => setFrontmatter({ ...frontmatter, category: event.target.value })}
          >
            <option value="">请选择</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>{item.label?.zh || item.id}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="font-mono-ui text-[11px] text-muted">文件名：{filename}</p>

      <BiTextField
        label="标题"
        value={frontmatter.title}
        onChange={(next) => setFrontmatter({ ...frontmatter, title: next })}
      />
      <BiTextField
        label="摘要"
        multiline
        value={frontmatter.excerpt}
        onChange={(next) => setFrontmatter({ ...frontmatter, excerpt: next })}
      />
      <BiTextField
        label="阅读时长"
        value={frontmatter.readTime}
        help="例如 8 min read / 8 分钟阅读"
        onChange={(next) => setFrontmatter({ ...frontmatter, readTime: next })}
      />
      <BiTextField
        label="作者"
        value={frontmatter.author}
        onChange={(next) => setFrontmatter({ ...frontmatter, author: next })}
      />

      <Field
        field={{ key: 'tags', label: '标签', type: 'stringList' }}
        value={frontmatter.tags}
        onChange={(next) => setFrontmatter({ ...frontmatter, tags: next })}
      />
      <Field
        field={{ key: 'featured', label: '精选', type: 'toggle' }}
        value={Boolean(frontmatter.featured)}
        onChange={(next) => setFrontmatter({ ...frontmatter, featured: next })}
      />

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="admin-label-text">正文（Markdown）</span>
          <label className="admin-btn cursor-pointer">
            上传配图
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
        <textarea
          className="admin-input font-mono-ui text-[12px] leading-[1.7]"
          rows={16}
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
      </div>

      <div className="soft-card p-5">
        <p className="admin-label-text mb-3">预览</p>
        <div className="prose-admin">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {previewBody || '（暂无正文）'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
