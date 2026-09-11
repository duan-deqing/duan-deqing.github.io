/**
 * useLanguage.js — 基于全局 AppSettingsProvider
 */

import { useLanguageShared } from './AppSettings'

const fallback = {
  lang: 'en',
  toggle: () => {},
  t: (value) => (value && typeof value === 'object' && 'en' in value ? value.en : value),
}

export function useLanguage() {
  return useLanguageShared() || fallback
}
