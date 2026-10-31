import { useLanguage } from '../hooks/useLanguage'
import {
  AuroraIcon,
  BackgroundOffIcon,
  DotsIcon,
  GridIcon,
  PlumBranchIcon,
  WavesIcon,
} from '../components/site/icons'

const LABELS = {
  plum: { en: 'Plum', zh: '枝条' },
  dots: { en: 'Dots', zh: '点阵' },
  grid: { en: 'Grid', zh: '网格' },
  waves: { en: 'Waves', zh: '波纹' },
  aurora: { en: 'Aurora', zh: '极光' },
  none: { en: 'None', zh: '无' },
}

const ICONS = {
  plum: PlumBranchIcon,
  dots: DotsIcon,
  grid: GridIcon,
  waves: WavesIcon,
  aurora: AuroraIcon,
  none: BackgroundOffIcon,
}

const BUTTON =
  'inline-flex h-8 items-center justify-center rounded-none px-1 text-ink opacity-60 transition-opacity hover:opacity-100'

export default function BackgroundToggle({ variant, onCycle, suppressTitle = false }) {
  const { t } = useLanguage()
  const label = LABELS[variant] || LABELS.plum
  const title = t({ en: `Background: ${label.en}`, zh: `背景：${label.zh}` })
  const Icon = ICONS[variant] || BackgroundOffIcon

  return (
    <button
      type="button"
      className={BUTTON}
      onClick={onCycle}
      aria-label={title}
      title={suppressTitle ? undefined : title}
    >
      <span key={variant} className="bg-toggle-icon">
        <Icon size={16} />
      </span>
    </button>
  )
}
