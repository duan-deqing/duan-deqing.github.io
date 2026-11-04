import { useState } from 'react'
import { adminApi } from '../api'
import { useAdminLang, useAdminT } from '../i18n'
import { validateValue } from '../lib/validate'

const LANG_LABEL = { zh: '中文', en: 'English' }

// 双语字段按当前界面语言排序，减少在两种语言间来回跳
function orderedLangs(uiLang) {
  return uiLang === 'en' ? ['en', 'zh'] : ['zh', 'en']
}

function FieldLabel({ field, error, t }) {
  return (
    <div className="mb-1.5">
      <span className="admin-label-text">
        {t(field.label)}
        {field.required ? ' *' : ''}
      </span>
      {error && <span className="admin-error ml-2">{error}</span>}
    </div>
  )
}

function Help({ text, t }) {
  return text ? <p className="admin-help">{t(text)}</p> : null
}

export default function Field({ field, value, onChange, itemActions = null, hideLabel = false }) {
  const t = useAdminT()
  if (field.type === 'object') {
    return (
      <div className="admin-subpanel space-y-4">
        <p className="admin-label-text">{t(field.label)}</p>
        <Fields fields={field.fields} value={value || {}} onChange={onChange} />
      </div>
    )
  }
  if (field.type === 'objectList') {
    return (
      <ObjectList
        field={field}
        value={value}
        onChange={onChange}
        itemActions={itemActions}
        hideLabel={hideLabel}
      />
    )
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
        <input type="checkbox" className="admin-checkbox" checked={field.defaultTrue ? value !== false : Boolean(value)} onChange={(event) => onChange(event.target.checked)} />
        {t(field.label)}
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
  const t = useAdminT()
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
      <FieldLabel field={field} error={error} t={t} />
      <div className="flex gap-2">
        <Input
          aria-label={t(field.label)}
          className="admin-input"
          rows={multiline ? 3 : undefined}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
        />
        {(field.upload || field.type === 'imagePath') && (
          <label className="admin-btn cursor-pointer whitespace-nowrap">
            {uploading ? t('上传中…') : t('上传')}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
        )}
      </div>
      <Help text={field.help} t={t} />
    </div>
  )
}

function I18nInput({ field, value, onChange }) {
  const t = useAdminT()
  const uiLang = useAdminLang()
  const safe = value && typeof value === 'object' && !Array.isArray(value) ? value : { en: '', zh: '' }
  const error = validateValue(field, safe)
  const multiline = field.type === 'i18nTextarea'
  const Input = multiline ? 'textarea' : 'input'

  return (
    <div>
      <FieldLabel field={field} error={error} t={t} />
      <div className="grid sm:grid-cols-2 gap-3">
        {orderedLangs(uiLang).map((lang) => (
          <label key={lang} className="block">
            <span className="admin-sub">{LANG_LABEL[lang]}</span>
            <Input
              className="admin-input"
              rows={multiline ? 3 : undefined}
              value={safe[lang] || ''}
              onChange={(event) => onChange({ ...safe, [lang]: event.target.value })}
            />
          </label>
        ))}
      </div>
      <Help text={field.help} t={t} />
    </div>
  )
}

function StringList({ field, value, onChange }) {
  const t = useAdminT()
  const items = Array.isArray(value) ? value : []
  return (
    <div>
      <FieldLabel field={field} error={validateValue(field, items)} t={t} />
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              aria-label={`${t(field.label)} ${index + 1}`}
              className="admin-input"
              value={item}
              onChange={(event) => onChange(items.map((v, i) => (i === index ? event.target.value : v)))}
            />
            <button
              type="button"
              className="admin-icon-btn is-danger"
              aria-label={`${t('删除')} ${index + 1}`}
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              ×
            </button>
          </div>
        ))}
        <button type="button" className="admin-btn" onClick={() => onChange([...items, ''])}>
          {t('添加一项')}
        </button>
      </div>
      <Help text={field.help} t={t} />
    </div>
  )
}

function I18nList({ field, value, onChange }) {
  const t = useAdminT()
  const uiLang = useAdminLang()
  const items = Array.isArray(value) ? value : []
  return (
    <div>
      <FieldLabel field={field} t={t} />
      <div className="space-y-2">
        {items.map((item, index) => {
          const safe = item && typeof item === 'object' ? item : { en: '', zh: '' }
          return (
            <div key={index} className="flex gap-2 items-start">
              {orderedLangs(uiLang).map((lang) => (
                <input
                  key={lang}
                  aria-label={`${t(field.label)} ${LANG_LABEL[lang]} ${index + 1}`}
                  className="admin-input"
                  placeholder={LANG_LABEL[lang]}
                  value={safe[lang] || ''}
                  onChange={(event) =>
                    onChange(items.map((v, i) => (i === index ? { ...safe, [lang]: event.target.value } : v)))
                  }
                />
              ))}
              <button
                type="button"
                className="admin-icon-btn is-danger"
                aria-label={`${t('删除')} ${index + 1}`}
                onClick={() => onChange(items.filter((_, i) => i !== index))}
              >
                ×
              </button>
            </div>
          )
        })}
        <button type="button" className="admin-btn" onClick={() => onChange([...items, { en: '', zh: '' }])}>
          {t('添加一项')}
        </button>
      </div>
      <Help text={field.help} t={t} />
    </div>
  )
}

function ObjectList({ field, value, onChange, itemActions = null, hideLabel = false }) {
  const t = useAdminT()
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
      {hideLabel ? null : <FieldLabel field={field} t={t} />}
      <div className="admin-list">
        {items.map((item, index) => (
          <div key={index} className="admin-subpanel">
            <div className="admin-subpanel-head">
              <span className="admin-sub">#{index + 1}</span>
              <div className="admin-row-actions">
                {itemActions ? itemActions(item, index) : null}
                <button
                  type="button"
                  className="admin-icon-btn"
                  title={t('上一项')}
                  aria-label={`${t('上一项')} ${index + 1}`}
                  onClick={() => move(index, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="admin-icon-btn"
                  title={t('下一项')}
                  aria-label={`${t('下一项')} ${index + 1}`}
                  onClick={() => move(index, 1)}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="admin-text-btn is-danger"
                  aria-label={`${t('删除')} ${index + 1}`}
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                >
                  {t('删除')}
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
      </div>
      <button
        type="button"
        className="admin-btn mt-3"
        onClick={() => onChange([...items, {}])}
      >
        {t('添加一项')}
      </button>
      <Help text={field.help} t={t} />
    </div>
  )
}
