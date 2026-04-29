/**
 * ============================================================================
 *  PageTitle.jsx - 浏览器标签页设置组件
 * ============================================================================
 *
 * 【功能说明】
 * 动态设置浏览器标签页的标题和图标
 *
 * 【配置来源】
 * - 标题: config.site.pageTitle
 * - 图标: config.site.favicon
 * ============================================================================
 */

import { useEffect } from 'react'
import config from '../config'

function PageTitle() {
  useEffect(() => {
    // 设置浏览器标签页标题
    if (config.site.pageTitle) {
      document.title = config.site.pageTitle
    }

    // 设置浏览器标签页图标
    if (config.site.favicon) {
      let link = document.querySelector("link[rel~='icon']")
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = config.site.favicon
    }
  }, [])

  return null
}

export default PageTitle