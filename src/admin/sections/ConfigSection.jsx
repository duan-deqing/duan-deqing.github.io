import Field from '../components/Field'
import { useAdminT } from '../i18n'

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
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {section.description && <p className="text-sm text-muted">{t(section.description)}</p>}
      {section.fields.map((field) => (
        <Field
          key={field.key}
          field={field}
          value={value?.[field.key]}
          itemActions={itemActions}
          onChange={(next) => onFieldChange(field.key, next)}
        />
      ))}
    </div>
  )
}
