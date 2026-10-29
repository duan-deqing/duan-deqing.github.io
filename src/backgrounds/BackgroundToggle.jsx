import { useLanguage } from '../hooks/useLanguage'
import { SparklesIcon } from '../components/site/icons'

const LABELS = {
  plum: { en: 'Plum', zh: '枝条' },
  dots: { en: 'Dots', zh: '点阵' },
  none: { en: 'None', zh: '无' },
}

const BUTTON =
  'inline-flex h-8 items-center justify-center rounded-none px-1 text-ink opacity-60 transition-opacity hover:opacity-100'

export default function BackgroundToggle({ variant, onCycle }) {
  const { t } = useLanguage()
  const label = LABELS[variant] || LABELS.plum
  const title = t({ en: `Background: ${label.en}`, zh: `背景：${label.zh}` })

  return (
    <button
      type="button"
      className={BUTTON}
      onClick={onCycle}
      aria-label={title}
      title={title}
    >
      <SparklesIcon size={16} />
    </button>
  )
}
