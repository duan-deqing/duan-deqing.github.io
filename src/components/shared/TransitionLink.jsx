/**
 * TransitionLink — 支持 View Transitions 的路由链接
 */

import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { withViewTransition } from './PageTransition'

export default function TransitionLink({ to, onClick, children, ...props }) {
  const navigate = useNavigate()

  const handleClick = useCallback(
    (e) => {
      onClick?.(e)
      if (e.defaultPrevented) return
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      e.preventDefault()
      withViewTransition(() => {
        navigate(to)
      })
    },
    [navigate, to, onClick]
  )

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
