import { useCallback, useEffect, useState } from 'react'
import { animateThemeChange } from '../../utils/themeTransition.js'

function initialDark() {
  return (
    document.documentElement.classList.contains('dark') ||
    localStorage.getItem('theme') === 'dark'
  )
}

export function useAdminTheme() {
  const [dark, setDark] = useState(initialDark)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const toggleTheme = useCallback((event) => {
    animateThemeChange(event, (next) => {
      setDark(next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
    })
  }, [])

  return { dark, toggleTheme }
}
