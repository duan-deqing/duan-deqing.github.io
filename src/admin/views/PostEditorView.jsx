import Field from '../components/Field'
import MarkdownPreview from '../components/MarkdownPreview'
import ConflictDialog from '../components/ConflictDialog'
import { usePostEditor } from '../hooks/usePostEditor'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { resolvePreviewImages } from '../lib/preview'

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
                className={multiline ? 'admin-input admin-textarea' : 'admin-input'}
                rows={multiline ? 3 : undefined}
                value={value?.[lang] || ''}
                onChange={(event) => onChange({ ...value, [lang]: event.target.value })}
              />
            </label>
          ))}
        </div>
      ) : (
        <Input
          aria-label={label}
          className={multiline ? 'admin-input admin-textarea' : 'admin-input'}
          rows={multiline ? 3 : undefined}
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {help && <p className="admin-help">{help}</p>}
    </div>
  )
}

export default function PostEditorView({ state, onClose, onSaved, onDirtyChange }) {
  const editor = usePostEditor({ state, onClose, onSaved, onDirtyChange })
  const {
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
    categories,
    loading,
    error,
    notice,
    saving,
    conflict,
    filename,
    previewDir,
    save,
    close,
    resolveConflict,
    uploadImage,
    setConflict,
  } = editor

  const debouncedBody = useDebouncedValue(body, 350)
  const previewBody = resolvePreviewImages(debouncedBody, previewDir)

  async function handleUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return
    await uploadImage(file)
    event.target.value = ''
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <button className="admin-btn" onClick={close}>← 返回列表</button>
        <div className="flex items-center gap-3">
          {error && <span className="admin-error">{error}</span>}
          {notice && <span className="admin-ok">{notice}</span>}
          <button className="admin-btn admin-btn-primary" disabled={saving} onClick={save}>
            {saving ? '保存中…' : '保存文章'}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted">加载中…</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="admin-label-text">语言</span>
              <select
                className="admin-input"
                value={lang}
                disabled={!isNew}
                onChange={(event) => setLang(event.target.value)}
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </label>
            <label className="block">
              <span className="admin-label-text">日期</span>
              <input
                className="admin-input"
                placeholder="2026-10-28"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>
            {isNew && (
              <label className="block">
                <span className="admin-label-text">slug</span>
                <input
                  className="admin-input"
                  placeholder="my-new-post"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                />
              </label>
            )}
            <label className="block">
              <span className="admin-label-text">分类</span>
              <select
                className="admin-input"
                value={frontmatter.category || ''}
                onChange={(event) =>
                  setFrontmatter({ ...frontmatter, category: event.target.value })
                }
              >
                <option value="">请选择</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label?.zh || item.id}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="font-mono text-[11px] text-muted">文件名：{filename}</p>

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
          <label className="block">
            <span className="admin-label-text">阅读时长</span>
            <input
              className="admin-input"
              placeholder="8min"
              value={frontmatter.duration || ''}
              onChange={(event) =>
                setFrontmatter({ ...frontmatter, duration: event.target.value })
              }
            />
            <p className="admin-help">例如 8min</p>
          </label>

          <Field
            field={{ key: 'tags', label: '标签', type: 'stringList' }}
            value={frontmatter.tags}
            onChange={(next) => setFrontmatter({ ...frontmatter, tags: next })}
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
              aria-label="正文（Markdown）"
              className="admin-input admin-textarea font-mono text-[12px] leading-[1.7]"
              rows={16}
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
          </div>

          <div className="admin-subpanel">
            <p className="admin-label-text mb-3">预览</p>
            <div className="prose-admin">
              <MarkdownPreview source={previewBody} />
            </div>
          </div>
        </>
      )}

      <ConflictDialog
        open={Boolean(conflict)}
        title={conflict?.kind === 'blocked' ? '无法保存' : '文章已被外部修改'}
        message={conflict?.message}
        primaryLabel={conflict?.kind === 'blocked' ? undefined : '用我的版本覆盖'}
        onPrimary={conflict?.kind === 'blocked' ? undefined : () => resolveConflict('local')}
        secondaryLabel={conflict?.kind === 'blocked' ? undefined : '加载磁盘版本'}
        onSecondary={
          conflict?.kind === 'blocked' ? undefined : () => resolveConflict('server')
        }
        onCancel={() => (conflict?.kind === 'blocked' ? setConflict(null) : resolveConflict('cancel'))}
      />
    </div>
  )
}
