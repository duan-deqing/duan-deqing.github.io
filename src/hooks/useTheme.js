/**
 * useTheme.js - 主题管理 Hook
 * 
 * 功能：
 * 1. 管理深色/浅色主题状态
 * 2. 自动保存用户偏好到 localStorage
 * 3. 跟随系统主题偏好（首次访问时）
 * 4. 切换时自动更新 HTML class
 * 
 * 返回值：
 * - isDark: boolean - 当前是否为深色模式
 * - toggle: function - 切换主题的函数
 * 
 * 自定义提示：
 * - 修改默认主题：更改 useState 中的初始值逻辑
 * - 修改存储 key：更改 localStorage.getItem('theme') 中的 'theme'
 * - 修改 HTML class：更改 document.documentElement.classList.toggle('dark', isDark)
 */

import { useState, useEffect } from 'react'

export function useTheme() {
  /**
   * 初始化主题状态
   * 
   * 逻辑：
   * 1. 首先检查 localStorage 中是否有保存的主题偏好
   * 2. 如果没有，则跟随系统主题（通过 prefers-color-scheme 媒体查询）
   * 3. 默认使用浅色模式
   */
  const [isDark, setIsDark] = useState(() => {
    // 从 localStorage 读取保存的主题
    const saved = localStorage.getItem('theme')
    
    // 如果有保存的偏好，使用保存的值
    // 如果没有，检查系统是否偏好深色模式
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  /**
   * 副作用：当主题状态改变时执行
   * 
   * 功能：
   * 1. 在 HTML 根元素上添加/移除 'dark' class（Tailwind CSS 使用）
   * 2. 将用户偏好保存到 localStorage
   */
  useEffect(() => {
    // 切换 HTML 根元素的 dark class
    document.documentElement.classList.toggle('dark', isDark)
    
    // 保存用户偏好到 localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  /**
   * 切换主题函数
   * 
   * 使用方法：
   * const { isDark, toggle } = useTheme()
   * <button onClick={toggle}>切换主题</button>
   */
  const toggle = () => setIsDark(prev => !prev)

  // 返回当前主题状态和切换函数
  return { isDark, toggle }
}
