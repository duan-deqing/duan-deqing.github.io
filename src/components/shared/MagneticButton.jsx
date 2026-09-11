/**
 * MagneticButton — 磁吸 CTA
 * variant: 'primary' | 'secondary' | 'ghost'
 */

import { useRef, useCallback } from 'react'

const variantClass = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
}

export default function MagneticButton({
  as: Component = 'button',
  variant = 'primary',
  className = '',
  strength = 12,
  children,
  ...props
}) {
  const ref = useRef(null)

  const onMove = useCallback(
    (e) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      el.style.transform = `translate(${x / strength}px, ${y / strength}px)`
    },
    [strength]
  )

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate(0, 0)'
  }, [])

  return (
    <Component
      ref={ref}
      className={`btn ${variantClass[variant] || variantClass.primary} magnetic-btn ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...props}
    >
      {children}
    </Component>
  )
}
