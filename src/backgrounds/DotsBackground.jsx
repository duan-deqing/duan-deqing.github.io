import { useEffect, useRef } from 'react'

const DESKTOP_SPACING = 18
const MOBILE_SPACING = 20
const FRAME_INTERVAL = 33
const DOT_RADIUS = 1
const MAX_ALPHA = 0.4

/**
 * Lightweight Canvas take on antfu.me's ArtDots:
 * each dot has its own opacity and drifts through a smooth pseudo-noise field.
 */
export default function DotsBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let ctx
    let width = 0
    let height = 0
    let points = []
    let frameId = 0
    let lastFrame = 0
    let resizeTimer = 0

    const setup = () => {
      const dpr = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx = canvas.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = 'rgba(136, 136, 136, 1)'

      const spacing = width < 600 ? MOBILE_SPACING : DESKTOP_SPACING
      points = []
      for (let x = -spacing / 2; x < width + spacing; x += spacing) {
        for (let y = -spacing / 2; y < height + spacing; y += spacing) {
          points.push({
            x,
            y,
            opacity: 0.45 + Math.random() * 0.55,
            seed: Math.random() * Math.PI * 2,
          })
        }
      }
    }

    const draw = (time = 0) => {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      const t = reduceMotion ? 0 : time / 9000

      for (const point of points) {
        const wave =
          Math.sin(point.x * 0.008 + t + point.seed * 0.15) +
          Math.cos(point.y * 0.011 - t * 0.75 + point.seed * 0.2)
        const drift = 2.5 + (Math.sin(point.x * 0.005 + point.y * 0.007 + t * 0.3) * 0.5 + 0.5) * 3
        const x = point.x + Math.cos(wave) * drift
        const y = point.y + Math.sin(wave) * drift
        const alpha =
          MAX_ALPHA * point.opacity * (0.22 + Math.abs(Math.cos(wave)) * 0.78)

        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
    }

    const frame = (now) => {
      if (now - lastFrame < FRAME_INTERVAL) {
        frameId = requestAnimationFrame(frame)
        return
      }
      lastFrame = now
      draw(now)
      frameId = requestAnimationFrame(frame)
    }

    const start = () => {
      cancelAnimationFrame(frameId)
      setup()
      draw()
      if (!reduceMotion) frameId = requestAnimationFrame(frame)
    }

    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(start, 150)
    }

    start()
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full dark:invert" />
    </div>
  )
}
