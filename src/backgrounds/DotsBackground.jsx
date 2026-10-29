import { useEffect, useRef } from 'react'

const SPACING = 22
const DOT_RADIUS = 1
const FRAME_INTERVAL = 33

/**
 * Lightweight flow-field take on antfu.me's ArtDots, drawn with Canvas 2D
 * instead of adding a Pixi.js runtime dependency.
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
    }

    const draw = (time = 0) => {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = 'rgba(136, 136, 136, 0.22)'
      const t = reduceMotion ? 0 : time / 9000

      for (let x = -SPACING / 2; x < width + SPACING; x += SPACING) {
        for (let y = -SPACING / 2; y < height + SPACING; y += SPACING) {
          const angle = Math.sin(x * 0.01 + t) + Math.cos(y * 0.012 - t * 0.7)
          ctx.beginPath()
          ctx.arc(x + Math.cos(angle) * 3, y + Math.sin(angle) * 3, DOT_RADIUS, 0, Math.PI * 2)
          ctx.fill()
        }
      }
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
