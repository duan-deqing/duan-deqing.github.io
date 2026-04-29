/**
 * ============================================================================
 *  useLanguage.js - 语言管理 Hook
 * ============================================================================
 * 
 * 【功能说明】
 * 1. 管理中英文切换状态
 * 2. 自动保存用户偏好到 localStorage
 * 3. 首次访问时默认使用英文
 * 
 * 【返回值】
 * - lang: string - 当前语言 ('en' 或 'zh')
 * - toggle: function - 切换语言的函数
 * - t: function - 获取翻译文本的函数
 * 
 * 【使用示例】
 * const { lang, toggle, t } = useLanguage()
 * 
 * // 翻译对象格式的内容
 * t({ en: 'Hello', zh: '你好' })  // 根据当前语言返回对应文本
 * 
 * // 直接返回字符串
 * t('Hello')  // 直接返回 'Hello'
 * 
 * 【自定义提示】
 * - 修改默认语言: 更改 useState 中的初始值
 * - 添加更多语言: 修改 t 函数支持更多语言代码
 * ============================================================================
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
   * 【逻辑】
   * - 如果是对象且包含 en/zh 键，返回对应语言的值
   * - 如果是字符串，直接返回
   * 
   * @param {string|object} value - 要翻译的内容
   * @returns {string} 翻译后的文本
   */
  const t = (value) => {
    if (value && typeof value === 'object' && 'en' in value && 'zh' in value) {
      return value[lang]
    }
    return value
  }

  return { lang, toggle, t }
}
