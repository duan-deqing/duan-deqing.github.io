import { useEffect, useRef } from 'react'

const FRAME_INTERVAL = 33
const WAVE_COUNT = 7
const STEP = 12

/**
 * Slow layered sine waves, drawn with Canvas 2D.
 * The curves fade out toward the edges through CSS mask on the wrapper.
 */
export default function WavesBackground() {
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
      ctx.lineWidth = 1.2
    }

    const draw = (time = 0) => {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      const t = reduceMotion ? 0 : time / 1000

      for (let index = 0; index < WAVE_COUNT; index += 1) {
        const amplitude = height * (0.035 + index * 0.004)
        const baseline = height * (0.5 + (index - 3) * 0.055)
        const phase = index * 0.85

        ctx.beginPath()
        for (let x = -STEP * 2; x <= width + STEP * 2; x += STEP) {
          const y =
            baseline +
            Math.sin(x * 0.0045 + t * 0.45 + phase) * amplitude +
            Math.sin(x * 0.0017 - t * 0.25 + index) * amplitude * 0.35
          if (x <= -STEP * 2) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        const strength = Math.sin(((index + 1) / (WAVE_COUNT + 1)) * Math.PI)
        ctx.strokeStyle = `rgba(136, 136, 136, ${0.07 + strength * 0.09})`
        ctx.stroke()
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
    <div
      className="background-waves pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full opacity-90" />
    </div>
  )
}
