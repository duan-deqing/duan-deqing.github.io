/**
 * PixelBlastBg — 深色模式像素爆发背景（参考 reactbits Pixel Blast）
 * patternDensity 控制网格密度；仅深色挂载
 */

import { useEffect, useRef } from 'react'
import { useTheme } from '../../hooks/useTheme'

export default function PixelBlastBg({ patternDensity = 1.3 }) {
  const { isDark } = useTheme()
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!isDark) return
    const canvas = canvasRef.current
    if (!canvas) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d', { alpha: true })
    let raf = 0
    let w = 0
    let h = 0
    let cols = 0
    let rows = 0
    let cell = 0
    const start = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // density 1.3 → 更密的格子
      cell = Math.max(10, Math.round(22 / patternDensity))
      cols = Math.ceil(w / cell) + 1
      rows = Math.ceil(h / cell) + 1
    }

    const drawFrame = (time) => {
      const t = (time - start) / 1000
      ctx.clearRect(0, 0, w, h)

      const cx = w * 0.5
      const cy = h * 0.42
      const maxDist = Math.hypot(w, h) * 0.55

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * cell
          const py = y * cell
          const dx = px - cx
          const dy = py - cy
          const dist = Math.hypot(dx, dy) / maxDist

          // 多层波：中心向外的脉冲 + 轻微噪声
          const wave =
            Math.sin(dist * 9 - t * 1.6) * 0.5 +
            Math.sin(dist * 17 + t * 0.9 + x * 0.08) * 0.25 +
            Math.cos(y * 0.11 + t * 0.5) * 0.15

          const alpha = Math.max(0, wave) * (1 - dist * 0.65)
          if (alpha < 0.03) continue

          const size = cell * (0.35 + alpha * 0.55)
          const offset = (cell - size) / 2

          // 冷蓝 → 亮蓝
          const r = Math.floor(40 + alpha * 120)
          const g = Math.floor(100 + alpha * 120)
          const b = 255
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.55})`
          ctx.fillRect(px + offset, py + offset, size, size)
        }
      }

      raf = requestAnimationFrame(drawFrame)
    }

    const drawStatic = () => {
      // 减少动效：只画一层静态密度
      ctx.clearRect(0, 0, w, h)
      const cx = w * 0.5
      const cy = h * 0.42
      const maxDist = Math.hypot(w, h) * 0.55
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * cell
          const py = y * cell
          const dist = Math.hypot(px - cx, py - cy) / maxDist
          const alpha = Math.max(0, (1 - dist) * 0.35)
          if (alpha < 0.02) continue
          const size = cell * 0.45
          const offset = (cell - size) / 2
          ctx.fillStyle = `rgba(91,156,255,${alpha * 0.5})`
          ctx.fillRect(px + offset, py + offset, size, size)
        }
      }
    }

    resize()
    if (reduce) {
      drawStatic()
    } else {
      raf = requestAnimationFrame(drawFrame)
    }

    const onResize = () => {
      resize()
      if (reduce) drawStatic()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [isDark, patternDensity])

  if (!isDark) return null

  return (
    <canvas
      ref={canvasRef}
      className="pixel-blast-bg"
      aria-hidden="true"
    />
  )
}
