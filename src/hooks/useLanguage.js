/**
 * useLanguage.js - 语言管理 Hook
 * 
 * 功能：
 * 1. 管理中英文切换状态
 * 2. 自动保存用户偏好到 localStorage
 * 3. 首次访问时默认使用英文
 * 
 * 返回值：
 * - lang: string - 当前语言 ('en' 或 'zh')
 * - toggle: function - 切换语言的函数
 * - t: function - 获取翻译文本的函数
 */

import { useState, useEffect } from 'react'
import config from '../config'

export function useLanguage() {
  /**
   * 初始化语言状态
   * 从 localStorage 读取保存的语言偏好，默认为英文
   */
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('lang')
    return saved || 'en'
  })

  /**
   * 副作用：当语言改变时保存到 localStorage
   */
  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  /**
   * 切换语言函数
   * 在中英文之间切换
   */
  const toggle = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en')
  }

  /**
   * 获取翻译文本
   * 
   * 使用方法：
   * const { t } = useLanguage()
   * t(config.personal.name)  // 如果是对象，返回对应语言的值
   * t('直接返回的文本')       // 如果是字符串，直接返回
   */
  const t = (value) => {
    // 如果是对象且包含 en/zh 键，返回对应语言的值
    if (value && typeof value === 'object' && 'en' in value && 'zh' in value) {
      return value[lang]
    }
    // 否则直接返回值
    return value
  }

  return { lang, toggle, t }
}
