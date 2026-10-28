import { useState } from 'react'
import { adminApi } from '../api'
import { validateValue } from '../lib/validate'

function FieldLabel({ field, error }) {
  return (
    <div className="mb-1.5">
      <span className="admin-label-text">
        {field.label}
        {field.required ? ' *' : ''}
      </span>
      {error && <span className="admin-error ml-2">{error}</span>}
    </div>
  )
}

function Help({ text }) {
  return text ? <p className="admin-help">{text}</p> : null
}

export default function Field({ field, value, onChange }) {
  if (field.type === 'object') {
    return (
      <div className="soft-card p-4 space-y-4">
        <p className="admin-label-text">{field.label}</p>
        <Fields fields={field.fields} value={value || {}} onChange={onChange} />
      </div>
    )
  }
  if (field.type === 'objectList') {
    return <ObjectList field={field} value={value} onChange={onChange} />
  }
  if (field.type === 'stringList') {
    return <StringList field={field} value={value} onChange={onChange} />
  }
  if (field.type === 'i18nList') {
    return <I18nList field={field} value={value} onChange={onChange} />
  }
  if (field.type === 'toggle') {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />
        {field.label}
      </label>
    )
  }
  if (field.type === 'i18nText' || field.type === 'i18nTextarea') {
    return <I18nInput field={field} value={value} onChange={onChange} />
  }
  return <TextInput field={field} value={value} onChange={onChange} />
}

export function Fields({ fields, value, onChange }) {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <Field
          key={field.key}
          field={field}
          value={value?.[field.key]}
          onChange={(next) => onChange({ ...(value || {}), [field.key]: next })}
        />
      ))}
    </div>
  )
}

function TextInput({ field, value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const error = validateValue(field, value)
  const multiline = field.type === 'textarea'
  const Input = multiline ? 'textarea' : 'input'

  async function handleFile(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const result = await adminApi.upload('site', file)
      onChange(result.path)
    } catch (err) {
      window.alert(err.message)
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div>
      <FieldLabel field={field} error={error} />
      <div className="flex gap-2">
        <Input
          className="admin-input"
          rows={multiline ? 3 : undefined}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
        />
        {(field.upload || field.type === 'imagePath') && (
          <label className="admin-btn cursor-pointer whitespace-nowrap">
            {uploading ? '上传中…' : '上传'}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
        )}
      </div>
      <Help text={field.help} />
    </div>
  )
}

function I18nInput({ field, value, onChange }) {
  const safe = value && typeof value === 'object' && !Array.isArray(value) ? value : { en: '', zh: '' }
  const error = validateValue(field, safe)
  const multiline = field.type === 'i18nTextarea'
  const Input = multiline ? 'textarea' : 'input'

  return (
    <div>
      <FieldLabel field={field} error={error} />
      <div className="grid sm:grid-cols-2 gap-3">
        {['en', 'zh'].map((lang) => (
          <label key={lang} className="block">
            <span className="admin-sub">{lang.toUpperCase()}</span>
            <Input
              className="admin-input"
              rows={multiline ? 3 : undefined}
              value={safe[lang] || ''}
              onChange={(event) => onChange({ ...safe, [lang]: event.target.value })}
            />
          </label>
        ))}
      </div>
      <Help text={field.help} />
    </div>
  )
}

function StringList({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : []
  return (
    <div>
      <FieldLabel field={field} error={validateValue(field, items)} />
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              className="admin-input"
              value={item}
              onChange={(event) => onChange(items.map((v, i) => (i === index ? event.target.value : v)))}
            />
            <button type="button" className="admin-btn" onClick={() => onChange(items.filter((_, i) => i !== index))}>
              删除
            </button>
          </div>
        ))}
        <button type="button" className="admin-btn" onClick={() => onChange([...items, ''])}>
          添加一项
        </button>
      </div>
      <Help text={field.help} />
    </div>
  )
}

function I18nList({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : []
  return (
    <div>
      <FieldLabel field={field} />
      <div className="space-y-2">
        {items.map((item, index) => {
          const safe = item && typeof item === 'object' ? item : { en: '', zh: '' }
          return (
            <div key={index} className="flex gap-2 items-start">
              {['en', 'zh'].map((lang) => (
                <input
                  key={lang}
                  className="admin-input"
                  placeholder={lang.toUpperCase()}
                  value={safe[lang] || ''}
                  onChange={(event) =>
                    onChange(items.map((v, i) => (i === index ? { ...safe, [lang]: event.target.value } : v)))
                  }
                />
              ))}
              <button type="button" className="admin-btn" onClick={() => onChange(items.filter((_, i) => i !== index))}>
                删除
              </button>
            </div>
          )
        })}
        <button type="button" className="admin-btn" onClick={() => onChange([...items, { en: '', zh: '' }])}>
          添加一项
        </button>
      </div>
      <Help text={field.help} />
    </div>
  )
}

function ObjectList({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : []
  const move = (index, delta) => {
    const target = index + delta
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }
  return (
    <div>
      <FieldLabel field={field} />
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="soft-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="admin-sub">#{index + 1}</span>
              <div className="flex gap-2">
                <button type="button" className="admin-btn" onClick={() => move(index, -1)}>↑</button>
                <button type="button" className="admin-btn" onClick={() => move(index, 1)}>↓</button>
                <button type="button" className="admin-btn admin-btn-danger" onClick={() => onChange(items.filter((_, i) => i !== index))}>
                  删除
                </button>
              </div>
            </div>
            <Fields
              fields={field.fields || []}
              value={item || {}}
              onChange={(next) => onChange(items.map((v, i) => (i === index ? next : v)))}
            />
          </div>
        ))}
        <button type="button" className="admin-btn" onClick={() => onChange([...items, {}])}>
          添加一项
        </button>
      </div>
      <Help text={field.help} />
    </div>
  )
}
