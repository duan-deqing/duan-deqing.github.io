import { useRef } from 'react'
import Modal from './Modal'
import LiquidGlassLens from './LiquidGlassLens'
import { useLanguage } from '../../hooks/useLanguage'
import { CloseIcon } from './icons'
import '../../styles/glass-dialog.css'

/**
 * 液态玻璃弹窗外壳：折射镜片 + 把手行（kicker + 关闭按钮）+ 内容槽。
 * 关闭过程中沿用最后一次打开的内容快照，避免退场动画里内容先被清空。
 */
export default function GlassDialog({
  open,
  onClose,
  label,
  kicker,
  footer,
  children,
  maxWidth = 'max-w-[23rem]',
  draggable = true,
}) {
  const { t } = useLanguage()
  const snapshotRef = useRef(null)
  const view = { label, kicker, footer, children }

  if (open) snapshotRef.current = view
  const shown = open ? view : snapshotRef.current || view

  return (
    <Modal
      open={open}
      onClose={onClose}
      label={shown.label}
      maxWidth={maxWidth}
      panelClassName="glass-dialog"
      backdropClassName="glass-dialog-backdrop"
      draggable={draggable}
      flush
    >
      <LiquidGlassLens />

      <div className="glass-dialog-content">
        <div className="glass-dialog-head" data-modal-drag-handle>
          {shown.kicker ? (
            <span className="glass-dialog-kicker">{shown.kicker}</span>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            aria-label={t({ en: 'Close', zh: '关闭' })}
            className="glass-dialog-close"
          >
            <CloseIcon size={15} />
          </button>
        </div>

        <div className="glass-dialog-body">{shown.children}</div>

        {shown.footer ? (
          <div className="glass-dialog-footer">{shown.footer}</div>
        ) : null}
      </div>
    </Modal>
  )
}
