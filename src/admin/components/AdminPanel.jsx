import { useState } from 'react'
import { cn } from '../../utils/cn'
import { ChevronDownIcon } from '../../components/ui/icons'

export default function AdminPanel({
  id,
  title,
  note,
  collapsible = false,
  defaultOpen = true,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className={cn('admin-panel', collapsible && !open && 'is-collapsed')} id={id}>
      <header className="admin-panel-head">
        {collapsible ? (
          <button
            type="button"
            className="admin-panel-toggle"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <ChevronDownIcon
              size={14}
              className={cn('admin-panel-chevron', open && 'is-open')}
            />
            <span className="admin-panel-title">{title}</span>
          </button>
        ) : (
          <span className="admin-panel-title">{title}</span>
        )}
        {note ? <span className="admin-panel-note">{note}</span> : null}
      </header>
      {open ? <div className="admin-panel-body">{children}</div> : null}
    </section>
  )
}
