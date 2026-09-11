/**
 * PageTransition + ScrollToTop — 路由切换
 */

import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function canViewTransition() {
  return (
    typeof document !== 'undefined' &&
    typeof document.startViewTransition === 'function' &&
    !prefersReducedMotion()
  )
}

export function withViewTransition(run) {
  if (canViewTransition()) {
    return document.startViewTransition(run)
  }
  return run()
}

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

/** 带 View Transitions 的编程式跳转 */
export function useTransitionNavigate() {
  const navigate = useNavigate()
  return (to, options) => {
    withViewTransition(() => {
      navigate(to, options)
    })
  }
}

/** 给 <a>/<Link> 用的点击包装：支持 VT 时优雅过渡 */
export function handleTransitionClick(event, href, navigate) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return
  }
  event.preventDefault()
  withViewTransition(() => {
    navigate(href)
  })
}
