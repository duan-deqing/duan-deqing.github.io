import { useLanguage } from '../../hooks/useLanguage'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../utils/cn'
import { MoonIcon, SunIcon } from './icons'

const BUTTON =
  'inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-strong transition-colors hover:bg-hover hover:text-ink'

export default function ThemeLangControls({ variant = 'icon', className }) {
  const { isDark, toggle: toggleTheme } = useTheme()
  const { lang, toggle: toggleLang } = useLanguage()
  const showLabels = variant === 'sidebar'

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button
        type="button"
        className={BUTTON}
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
        {showLabels ? <span>{isDark ? '浅色' : '深色'}</span> : null}
      </button>
      <button
        type="button"
        className={BUTTON}
        onClick={toggleLang}
        aria-label={lang === 'en' ? '切换为中文' : 'Switch to English'}
        title={lang === 'en' ? '切换为中文' : 'Switch to English'}
      >
        <span>{lang === 'en' ? '中' : 'EN'}</span>
        {showLabels ? <span>{lang === 'en' ? '中文' : 'English'}</span> : null}
      </button>
    </div>
  )
}
