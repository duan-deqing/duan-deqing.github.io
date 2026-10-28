import Field from '../components/Field'

export default function ConfigSection({ section, value, onChange }) {
  if (section.list) {
    return (
      <div className="space-y-4">
        <Field
          field={{ ...section.list, key: 'items' }}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {section.description && <p className="text-sm text-muted">{section.description}</p>}
      {section.fields.map((field) => (
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
