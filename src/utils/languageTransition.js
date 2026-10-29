const DURATION = 240

/**
 * Cross-fades a language change using the same View Transition layer as the
 * theme toggle. The apply callback must commit the new language synchronously.
 */
export function startLanguageTransition(apply) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduceMotion) {
    apply()
    return
  }

  const dark = document.documentElement.classList.contains('dark')
  const transition = document.startViewTransition(apply)
  transition.ready
    .then(() => {
      document.documentElement.animate(
        dark ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }],
        {
          duration: DURATION,
          easing: 'ease-out',
          fill: 'forwards',
          pseudoElement: dark
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        }
      )
    })
    .catch(() => {})
}
