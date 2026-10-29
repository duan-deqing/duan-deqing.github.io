import { useEffect, useRef } from 'react'

const R90 = Math.PI / 2
const R180 = Math.PI
const R15 = Math.PI / 12
const MIN_BRANCH = 30
const FRAME_INTERVAL = 25

function polar2cart(x, y, radius, theta) {
  return [x + radius * Math.cos(theta), y + radius * Math.sin(theta)]
}

/**
 * Canvas port of antfu.me's ArtPlum: branching lines grow in from the edges.
 * The animation stops once the branches die out, so it does not run forever.
 */
export default function PlumBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let ctx
    let width = 0
    let height = 0
    let steps = []
    let previousSteps = []
    let frameId = 0
    let lastFrame = 0
    let resizeTimer = 0
    let stopped = false

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
      ctx.clearRect(0, 0, width, height)
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(136, 136, 136, 0.16)'
    }

    const step = (x, y, rad, counter = { value: 0 }) => {
      const length = Math.random() * 6
      counter.value += 1
      const [nx, ny] = polar2cart(x, y, length, rad)

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(nx, ny)
      ctx.stroke()

      if (nx < -100 || nx > width + 100 || ny < -100 || ny > height + 100) return

      const rate = counter.value <= MIN_BRANCH ? 0.8 : 0.5
      if (Math.random() < rate) steps.push(() => step(nx, ny, rad + Math.random() * R15, counter))
      if (Math.random() < rate) steps.push(() => step(nx, ny, rad - Math.random() * R15, counter))
    }

    const frame = (now) => {
      if (stopped) return
      if (now - lastFrame < FRAME_INTERVAL) {
        frameId = requestAnimationFrame(frame)
        return
      }
      lastFrame = now
      previousSteps = steps
      steps = []
      if (previousSteps.length === 0) {
        stopped = true
        return
      }
      for (const next of previousSteps) {
        if (Math.random() < 0.5) steps.push(next)
        else next()
      }
      frameId = requestAnimationFrame(frame)
    }

    const start = () => {
      cancelAnimationFrame(frameId)
      setup()
      stopped = false
      const randomMiddle = () => Math.random() * 0.6 + 0.2
      steps = [
        () => step(randomMiddle() * width, -5, R90),
        () => step(randomMiddle() * width, height + 5, -R90),
        () => step(-5, randomMiddle() * height, 0),
        () => step(width + 5, randomMiddle() * height, R180),
      ]
      if (width < 500) steps = steps.slice(0, 2)
      lastFrame = performance.now()
      frameId = requestAnimationFrame(frame)
    }

    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(start, 150)
    }

    start()
    window.addEventListener('resize', onResize)

    return () => {
      stopped = true
      cancelAnimationFrame(frameId)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{
        maskImage: 'radial-gradient(circle, transparent, black)',
        WebkitMaskImage: 'radial-gradient(circle, transparent, black)',
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
