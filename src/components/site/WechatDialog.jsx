import Modal from './Modal'
import Button from './Button'
import { useLanguage } from '../../hooks/useLanguage'
import { CloseIcon, WechatIcon } from './icons'

export default function WechatDialog({ open, onClose, qrcode, wechatId, alt }) {
  const { t } = useLanguage()

  return (
    <Modal
      open={open}
      onClose={onClose}
      label={alt || 'WeChat QR code'}
      maxWidth="max-w-sm"
      flush
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-subtle text-ink">
            <WechatIcon size={16} />
          </span>
          <div className="flex min-w-0 flex-col">
            <h2 className="truncate text-sm font-semibold tracking-tight text-heading">
              {alt || 'WeChat'}
            </h2>
            <p className="text-xs text-muted">
              {t({ en: 'Scan to connect', zh: '扫码添加好友' })}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label={t({ en: 'Close', zh: '关闭' })}
        >
          <CloseIcon size={16} />
        </Button>
      </div>

      <div className="flex flex-col items-center px-5 py-5">
        <div className="rounded-xl border border-line bg-page p-3 shadow-sm dark:shadow-none">
          <img
            src={qrcode}
            alt={alt || 'WeChat QR code'}
            width={240}
            height={240}
            loading="lazy"
            decoding="async"
            className="size-60 rounded-lg bg-white object-contain"
          />
        </div>
        {wechatId ? (
          <div className="mt-4 w-full rounded-lg border border-line bg-subtle/50 px-3 py-2.5 text-center">
            <p className="text-[11px] tracking-wide text-muted">
              {t({ en: 'WeChat ID', zh: '微信号' })}
            </p>
            <p className="mt-0.5 font-mono text-sm font-medium text-heading">{wechatId}</p>
          </div>
        ) : null}
      </div>
    </Modal>
  )
}
