import { useLanguage } from '../../hooks/useLanguage'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../utils/cn'
import BackgroundToggle from '../../backgrounds/BackgroundToggle'
import { MoonIcon, SunIcon } from './icons'

const BASE = 'inline-flex h-8 items-center justify-center gap-1.5'
const ICON_BUTTON =
  'rounded-none px-1 text-sm text-ink opacity-60 transition-opacity hover:opacity-100'
const SIDEBAR_BUTTON =
  'rounded-md px-2 text-xs font-medium text-muted-strong transition-colors hover:bg-hover hover:text-ink'

export default function ThemeLangControls({
  variant = 'icon',
  className,
  background,
  onCycleBackground,
}) {
  const { isDark, toggle: toggleTheme } = useTheme()
  const { lang, toggle: toggleLang, t } = useLanguage()
  const showLabels = variant === 'sidebar'

  const themeAction = isDark ? t({ en: 'Light', zh: '浅色' }) : t({ en: 'Dark', zh: '深色' })
  const themeLabel = isDark
    ? t({ en: 'Switch to light theme', zh: '切换到浅色主题' })
    : t({ en: 'Switch to dark theme', zh: '切换到深色主题' })
  const langAction = lang === 'en' ? '中文' : 'English'
  const langGlyph = lang === 'en' ? '中' : 'EN'
  const langLabel =
    lang === 'en'
      ? t({ en: 'Switch to Chinese', zh: '切换为中文' })
      : t({ en: 'Switch to English', zh: '切换为英文' })

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {!showLabels && onCycleBackground ? (
        <BackgroundToggle variant={background} onCycle={onCycleBackground} />
      ) : null}
      <button
        type="button"
        className={cn(BASE, showLabels ? SIDEBAR_BUTTON : ICON_BUTTON)}
        onClick={toggleTheme}
        aria-label={showLabels ? undefined : themeLabel}
        title={themeLabel}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
        {showLabels ? <span>{themeAction}</span> : null}
      </button>
      <button
        type="button"
        className={cn(BASE, showLabels ? SIDEBAR_BUTTON : ICON_BUTTON)}
        onClick={toggleLang}
        aria-label={showLabels ? undefined : langLabel}
        title={langLabel}
      >
        <span>{showLabels ? langAction : langGlyph}</span>
      </button>
    </div>
  )
}
