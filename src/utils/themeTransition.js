const TRANSITION_DURATION = 400

/**
 * Matches antfu.me: a circular View Transition from the click point.
 * Falls back to an instant toggle when the API or motion is unavailable.
 */
export function animateThemeChange(event, apply) {
  const root = document.documentElement
  const nextDark = !root.classList.contains('dark')

  const applyChange = () => {
    root.classList.toggle('dark', nextDark)
    apply?.(nextDark)
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduceMotion) {
    applyChange()
    return
  }

  const x = event?.clientX ?? window.innerWidth / 2
  const y = event?.clientY ?? window.innerHeight / 2
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )
  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${endRadius}px at ${x}px ${y}px)`,
  ]

  const transition = document.startViewTransition(applyChange)
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: nextDark ? [...clipPath].reverse() : clipPath },
        {
          duration: TRANSITION_DURATION,
          easing: 'ease-out',
          fill: 'forwards',
          pseudoElement: nextDark
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        }
      )
    })
    .catch(() => {})
}
