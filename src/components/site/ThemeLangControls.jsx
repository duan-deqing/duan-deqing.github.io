import { useLanguage } from '../../hooks/useLanguage'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../utils/cn'
import { MoonIcon, SunIcon } from './icons'

const BUTTON =
  'inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-strong transition-colors hover:bg-hover hover:text-ink'

export default function ThemeLangControls({ variant = 'icon', className }) {
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
      <button
        type="button"
        className={BUTTON}
        onClick={toggleTheme}
        aria-label={showLabels ? undefined : themeLabel}
        title={themeLabel}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
        {showLabels ? <span>{themeAction}</span> : null}
      </button>
      <button
        type="button"
        className={BUTTON}
        onClick={toggleLang}
        aria-label={showLabels ? undefined : langLabel}
        title={langLabel}
      >
        <span>{showLabels ? langAction : langGlyph}</span>
      </button>
    </div>
  )
}
