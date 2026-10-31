import { useRef } from 'react'
import Modal from './Modal'
import LiquidGlassLens from './LiquidGlassLens'
import { useLanguage } from '../../hooks/useLanguage'
import { CloseIcon } from './icons'
import '../../styles/wechat-glass.css'

export default function WechatDialog({ open, onClose, qrcode, wechatId, alt }) {
  const { t } = useLanguage()
  const contentRef = useRef({ qrcode, wechatId, alt })

  if (open) contentRef.current = { qrcode, wechatId, alt }
  const content = contentRef.current
  const label = content.alt || 'WeChat QR code'

  return (
    <Modal
      open={open}
      onClose={onClose}
      label={label}
      maxWidth="max-w-[23rem]"
      panelClassName="wechat-glass"
      backdropClassName="wechat-glass-backdrop"
      flush
    >
      <LiquidGlassLens />

      <div className="wechat-glass-content">
        <div className="wechat-glass-head">
          <span className="wechat-glass-kicker">
            {t({ en: 'WeChat', zh: '微信' })}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t({ en: 'Close', zh: '关闭' })}
            className="wechat-glass-close"
          >
            <CloseIcon size={15} />
          </button>
        </div>

        <div className="wechat-glass-body">
          <div className="wechat-glass-qr-tray">
            <img
              src={content.qrcode}
              alt={label}
              width={240}
              height={240}
              decoding="async"
              className="wechat-glass-qr"
            />
          </div>
          {content.wechatId ? (
            <div className="wechat-glass-id">
              <span className="wechat-glass-id-pill">
                <span className="wechat-glass-id-label">
                  {t({ en: 'WeChat ID', zh: '微信号' })}
                </span>
                <span className="wechat-glass-id-divider" aria-hidden="true" />
                <span className="wechat-glass-id-value">{content.wechatId}</span>
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  )
}
