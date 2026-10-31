import GlassDialog from './GlassDialog'
import CopyButton from './CopyButton'
import { useLanguage } from '../../hooks/useLanguage'
import '../../styles/wechat-glass.css'

export default function WechatDialog({ open, onClose, qrcode, wechatId, alt }) {
  const { t } = useLanguage()
  const label = alt || 'WeChat QR code'

  return (
    <GlassDialog
      open={open}
      onClose={onClose}
      label={label}
      footer={
        wechatId ? (
          <span className="wechat-id-pill">
            <span className="wechat-id-label">
              {t({ en: 'WeChat ID', zh: '微信号' })}
            </span>
            <span className="wechat-id-divider" aria-hidden="true" />
            <span className="wechat-id-value">{wechatId}</span>
            <CopyButton
              value={wechatId}
              label={{ en: 'Copy WeChat ID', zh: '复制微信号' }}
              copiedLabel={{ en: 'WeChat ID copied', zh: '微信号已复制' }}
              className="wechat-id-copy"
              iconSize={14}
            />
          </span>
        ) : null
      }
    >
      <div className="wechat-qr-tray">
        <img
          src={qrcode}
          alt={label}
          width={240}
          height={240}
          decoding="async"
          draggable={false}
          className="wechat-qr"
        />
      </div>
    </GlassDialog>
  )
}
