/**
 * 共享主题 / 语言 Context — 保证多组件实例同步
 * 对外仍暴露 useTheme() / useLanguage()，API 不变
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const ThemeCtx = createContext(null)
const LangCtx = createContext(null)

function readTheme() {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') return saved === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function readLang() {
  return localStorage.getItem('lang') || 'en'
}

export function AppSettingsProvider({ children }) {
  const [isDark, setIsDark] = useState(readTheme)
  const [lang, setLang] = useState(readLang)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }, [lang])

  const toggleTheme = useCallback(() => setIsDark((v) => !v), [])
  const toggleLang = useCallback(() => setLang((v) => (v === 'en' ? 'zh' : 'en')), [])

  const t = useCallback(
    (value) => {
      if (value && typeof value === 'object' && 'en' in value && 'zh' in value) {
        return value[lang]
      }
      return value
    },
    [lang]
  )

  const themeValue = useMemo(() => ({ isDark, toggle: toggleTheme }), [isDark, toggleTheme])
  const langValue = useMemo(() => ({ lang, toggle: toggleLang, t }), [lang, toggleLang, t])

  return (
    <ThemeCtx.Provider value={themeValue}>
      <LangCtx.Provider value={langValue}>{children}</LangCtx.Provider>
    </ThemeCtx.Provider>
  )
}

export function useThemeShared() {
  return useContext(ThemeCtx)
}

export function useLanguageShared() {
  return useContext(LangCtx)
}
