import { getIn } from './objectPath.js'

export function validateValue(field, value) {
  const empty =
    value === undefined ||
    value === null ||
    (typeof value === 'string' && !value.trim()) ||
    (Array.isArray(value) && value.length === 0)

  if (field.required && empty) return '必填'
  if (field.required && field.type === 'i18nText') {
    const both = value && typeof value === 'object' && String(value.en || '').trim() && String(value.zh || '').trim()
    if (!both) return '两种语言都需填写'
  }
  if (typeof value === 'string' && value.trim()) {
    if (field.type === 'url' && !/^(https?:\/\/|\/|#|mailto:|tel:)/.test(value.trim())) {
      return '需为 http(s)、mailto、tel 链接、站内路径或锚点'
    }
    if (field.type === 'imagePath' && !/^(https?:\/\/|\/)/.test(value.trim())) {
      return '需为 / 开头的路径或 http(s) 链接'
    }
  }
  return ''
}

function validateFields(fields, value, labelPrefix = '') {
  const errors = []
  for (const field of fields) {
    const fieldValue = value?.[field.key]
    const message = validateValue(field, fieldValue)
    if (message) errors.push(`${labelPrefix}${field.label}：${message}`)
    if (field.type === 'object' && field.fields) {
      errors.push(...validateFields(field.fields, fieldValue, `${labelPrefix}${field.label} / `))
    }
    if (field.type === 'objectList' && Array.isArray(fieldValue)) {
      fieldValue.forEach((item, index) => {
        errors.push(...validateFields(field.fields || [], item, `${labelPrefix}${field.label} #${index + 1} / `))
      })
    }
  }
  return errors
}

export function validateSection(section, value) {
  return validateFields(section.fields || [], value)
}

export function validateDoc(sections, docs) {
  const errors = []
  for (const section of sections) {
    const value = getIn(docs[section.doc], section.path)
    if (section.list) {
      const items = Array.isArray(value) ? value : []
      items.forEach((item, index) => {
        errors.push(...validateFields(section.list.fields || [], item, `${section.label} #${index + 1} / `))
      })
      continue
    }
    errors.push(...validateSection(section, value || {}))
  }
  return errors
}
