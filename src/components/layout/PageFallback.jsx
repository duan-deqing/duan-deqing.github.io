import { useLanguage } from '../../hooks/useLanguage'

export default function PageFallback() {
  const { t } = useLanguage()

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50vh] items-center justify-center"
    >
      <span
        className="inline-block size-4 animate-spin rounded-full border-2 border-line border-t-muted-strong motion-reduce:animate-none"
        aria-hidden="true"
      />
      <span className="sr-only">{t({ en: 'Loading…', zh: '加载中…' })}</span>
    </div>
  )
}
