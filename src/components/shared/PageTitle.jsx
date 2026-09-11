/**
 * ============================================================================
 *  PageTitle.jsx - 浏览器标签页与 SEO Meta 组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 动态设置 document.title
 * 2. 同步 meta description / keywords
 * 3. 同步 Open Graph / Twitter 标签
 *
 * 【Props】
 * - title: string - 页面标题（可选，默认 config.site.pageTitle，统一 “STYLAN · ” 前缀）
 * - description: string|{en,zh} - 页面描述（可选，默认站点描述）
 * - favicon: string - 图标路径（可选，默认 config.site.favicon）
 * - t / lang: 建议由页面传入，保证与导航栏语言切换同步
 * ============================================================================
 */

import { useEffect } from 'react'
import config from '../../config'
import { useLanguage } from '../../hooks/useLanguage'

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export default function PageTitle({
  title,
  description,
  favicon,
  t: tProp,
  lang: langProp,
}) {
  const { lang: langHook, t: tHook } = useLanguage()
  const t = tProp || tHook
  const lang = langProp || langHook

  useEffect(() => {
    const pageTitle = title || config.site.pageTitle
    if (pageTitle) {
      document.title = pageTitle
    }

    const desc = description
      ? t(description)
      : t(config.site.description)
    const siteName = config.site.title || 'STYLAN'
    const url = config.site.url || ''
    const ogImage = config.site.ogImage
      ? config.site.ogImage.startsWith('http')
        ? config.site.ogImage
        : `${config.site.url || ''}${config.site.ogImage}`
      : ''

    upsertMeta('name', 'description', desc)
    upsertMeta('name', 'keywords', config.site.keywords)
    upsertMeta('name', 'author', siteName)

    upsertMeta('property', 'og:title', pageTitle)
    upsertMeta('property', 'og:description', desc)
    upsertMeta('property', 'og:site_name', siteName)
    if (url) upsertMeta('property', 'og:url', url)
    if (ogImage) upsertMeta('property', 'og:image', ogImage)

    upsertMeta('name', 'twitter:title', pageTitle)
    upsertMeta('name', 'twitter:description', desc)
    if (ogImage) upsertMeta('name', 'twitter:image', ogImage)

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
  }, [title, description, favicon, t, lang])

  return null
}
