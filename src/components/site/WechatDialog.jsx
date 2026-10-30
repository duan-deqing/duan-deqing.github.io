import Modal from './Modal'
import { useLanguage } from '../../hooks/useLanguage'
import { CloseIcon } from './icons'

export default function WechatDialog({ open, onClose, qrcode, wechatId, alt }) {
  const { t } = useLanguage()

  return (
    <Modal
      open={open}
      onClose={onClose}
      label={alt || 'WeChat QR code'}
      maxWidth="max-w-xs"
      panelClassName="relative"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t({ en: 'Close', zh: '关闭' })}
        className="absolute right-3 top-3 z-10 grid size-7 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-ink"
      >
        <CloseIcon size={15} />
      </button>

      <div className="flex flex-col items-center">
        <img
          src={qrcode}
          alt={alt || 'WeChat QR code'}
          width={240}
          height={240}
          loading="lazy"
          decoding="async"
          className="mt-6 size-60 rounded-lg border border-line bg-white object-contain"
        />
        {wechatId ? (
          <>
            <p className="mt-4 text-[11px] text-muted">
              {t({ en: 'WeChat ID', zh: '微信号' })}
            </p>
            <p className="mt-1 font-mono text-sm font-medium tracking-tight text-heading">
              {wechatId}
            </p>
          </>
        ) : null}
      </div>
    </Modal>
  )
}
