import { useTheme } from '../../hooks/useTheme'
import { useLanguage } from '../../hooks/useLanguage'

export default function ThemeLangControls() {
  const { isDark, toggle: toggleTheme } = useTheme()
  const { lang, toggle: toggleLang } = useLanguage()

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-subtle hover:text-ink"
      >
        <span className="font-mono-ui text-xs">{isDark ? '☾' : '☀'}</span>
      </button>
      <button
        type="button"
        onClick={toggleLang}
        aria-label="Toggle language"
        className="h-8 rounded-md px-2 font-mono-ui text-[11px] tracking-wider text-muted transition-colors hover:bg-subtle hover:text-ink"
      >
        {lang === 'en' ? '中文' : 'EN'}
      </button>
    </div>
  )
}
