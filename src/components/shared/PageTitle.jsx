/**
 * ============================================================================
 *  PageTitle.jsx - 浏览器标签页设置组件
 * ============================================================================
 *
 * 【功能说明】
 * 动态设置浏览器标签页的标题和图标
 *
 * 【Props】
 * - title: string - 页面标题（可选，默认使用 config.site.pageTitle）
 * - favicon: string - 图标路径（可选，默认使用 config.site.favicon）
 * ============================================================================
 */

import { useEffect } from 'react'
import config from '../../config'

export default function PageTitle({ title, favicon }) {
  useEffect(() => {
    // 设置浏览器标签页标题
    const pageTitle = title || config.site.pageTitle
    if (pageTitle) {
      document.title = pageTitle
    }

    // 设置浏览器标签页图标
    const faviconPath = favicon || config.site.favicon
    if (faviconPath) {
      let link = document.querySelector("link[rel~='icon']")
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = faviconPath
    }
  }, [title, favicon])

  return null
}
