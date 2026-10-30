import Modal from './Modal'
import Button from './Button'
import { useLanguage } from '../../hooks/useLanguage'
import { CloseIcon } from './icons'

export default function WechatDialog({ open, onClose, qrcode, alt }) {
  const { t } = useLanguage()

  return (
    <Modal open={open} onClose={onClose} label={alt || 'WeChat QR code'} maxWidth="max-w-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight text-heading">{alt || 'WeChat'}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label={t({ en: 'Close', zh: '关闭' })}
        >
          <CloseIcon size={16} />
        </Button>
      </div>
      <img
        src={qrcode}
        alt={alt || 'WeChat QR code'}
        width={240}
        height={240}
        loading="lazy"
        decoding="async"
        className="mx-auto size-60 rounded-lg border border-line bg-page object-contain"
      />
    </Modal>
  )
}
