import Field from '../components/Field'
import { useAdminT } from '../i18n'

// 短字段两两并排，长字段独占整行；顺序不变，避免网格出现空洞
const SIMPLE_TYPES = new Set(['text', 'url', 'imagePath', 'number', 'date', 'toggle'])

function rowsOf(fields) {
  const rows = []
  let pair = []
  for (const field of fields) {
    if (SIMPLE_TYPES.has(field.type)) {
      pair.push(field)
      if (pair.length === 2) {
        rows.push({ kind: 'pair', fields: pair })
        pair = []
      }
    } else {
      if (pair.length > 0) {
        rows.push({ kind: 'pair', fields: pair })
        pair = []
      }
      rows.push({ kind: 'wide', field })
    }
  }
  if (pair.length > 0) rows.push({ kind: 'pair', fields: pair })
  return rows
}

/**
 * 按 schema 渲染一个配置分区。
 * 字段级回写由上层按 docId + path 派发，这里只负责 UI。
 */
export default function ConfigSection({
  section,
  value,
  onFieldChange,
  onListChange,
  itemActions = null,
}) {
  const t = useAdminT()
  if (section.list) {
    return (
      <div className="space-y-4">
        <Field
          field={{ ...section.list, key: 'items' }}
          value={Array.isArray(value) ? value : []}
          onChange={onListChange}
          itemActions={itemActions}
          hideLabel
        />
      </div>
    )
  }

  const rows = rowsOf(section.fields)

  return (
    <div className="space-y-4">
      {section.description && <p className="text-sm text-muted">{t(section.description)}</p>}
      {rows.map((row, index) =>
        row.kind === 'pair' ? (
          <div className="admin-field-row" key={`pair-${index}`}>
            {row.fields.map((field) => (
              <Field
                key={field.key}
                field={field}
                value={value?.[field.key]}
                itemActions={itemActions}
                onChange={(next) => onFieldChange(field.key, next)}
              />
            ))}
          </div>
        ) : (
          <Field
            key={row.field.key}
            field={row.field}
            value={value?.[row.field.key]}
            itemActions={itemActions}
            onChange={(next) => onFieldChange(row.field.key, next)}
          />
        )
      )}
    </div>
  )
}
