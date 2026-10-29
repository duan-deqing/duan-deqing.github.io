import Modal from '../site/Modal'
import Button from '../site/Button'
import { CloseIcon } from '../site/icons'

export default function WechatDialog({ open, onClose, qrcode, alt }) {
  return (
    <Modal open={open} onClose={onClose} label={alt || 'WeChat QR code'} maxWidth="max-w-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight text-heading">{alt || 'WeChat'}</h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
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
