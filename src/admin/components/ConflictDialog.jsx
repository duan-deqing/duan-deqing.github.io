import Modal from '../../components/ui/dialogs/Modal.jsx'

export default function ConflictDialog({
  open,
  title,
  message,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  cancelLabel = '取消',
  onCancel,
}) {
  return (
    <Modal open={open} onClose={onCancel} label={title} maxWidth="max-w-md">
      <div className="space-y-4">
        <div>
          <h2 className="admin-panel-title">{title}</h2>
          <p className="admin-panel-note mt-2">{message}</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {onCancel && (
            <button type="button" className="admin-btn" onClick={onCancel}>
              {cancelLabel}
            </button>
          )}
          {onSecondary && (
            <button type="button" className="admin-btn" onClick={onSecondary}>
              {secondaryLabel}
            </button>
          )}
          {onPrimary && (
            <button type="button" className="admin-btn admin-btn-primary" onClick={onPrimary}>
              {primaryLabel}
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
