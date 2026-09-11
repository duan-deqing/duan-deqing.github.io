/**
 * useTheme.js — 基于全局 AppSettingsProvider
 */

import { useThemeShared } from './AppSettings'

const fallback = {
  isDark: false,
  toggle: () => {},
}

export function useTheme() {
  return useThemeShared() || fallback
}
