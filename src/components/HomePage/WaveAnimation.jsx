/**
 * ============================================================================
 *  WaveAnimation.jsx - 波浪动画组件
 * ============================================================================
 *
 * 基于 AWaves Web Component 改写的 React 版本
 * 使用 Perlin 噪声生成自然波浪效果
 * ============================================================================
 */

import { useEffect, useRef, useCallback } from 'react'

// 简化的 Perlin 噪声实现
class Noise {
  constructor(seed = Math.random()) {
    this.p = new Uint8Array(512)
    const p = new Uint8Array(256)
    for (let i = 0; i < 256; i++) p[i] = i
    for (let i = 255; i > 0; i--) {
      seed = (seed * 16807) % 2147483647
      const j = Math.floor((seed / 2147483647) * (i + 1))
      ;[p[i], p[j]] = [p[j], p[i]]
    }
    for (let i = 0; i < 512; i++) this.p[i] = p[i & 255]
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  lerp(t, a, b) {
    return a + t * (b - a)
  }

  grad(hash, x, y) {
    const h = hash & 3
    const u = h < 2 ? x : y
    const v = h < 2 ? y : x
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
  }

  perlin2(x, y) {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    x -= Math.floor(x)
    y -= Math.floor(y)
    const u = this.fade(x)
    const v = this.fade(y)
    const A = this.p[X] + Y
    const B = this.p[X + 1] + Y
    return this.lerp(
      v,
      this.lerp(u, this.grad(this.p[A], x, y), this.grad(this.p[B], x - 1, y)),
      this.lerp(u, this.grad(this.p[A + 1], x, y - 1), this.grad(this.p[B + 1], x - 1, y - 1))
    )
  }
}

export default function WaveAnimation({ width = 500, height = 400, color = '#3b82f6' }) {
  const svgRef = useRef(null)
  const stateRef = useRef({
    mouse: {
      x: -10, y: 0,
      lx: 0, ly: 0,
      sx: 0, sy: 0,
      v: 0, vs: 0,
      a: 0, set: false,
    },
    lines: [],
    paths: [],
    noise: new Noise(Math.random()),
    bounding: { left: 0, top: 0, width, height },
    rafId: null,
  })

  const setLines = useCallback(() => {
    const state = stateRef.current
    const svg = svgRef.current
    if (!svg) return

    const { width: w, height: h } = state.bounding

    // 清除旧路径
    state.paths.forEach(path => path.remove())
    state.paths = []
    state.lines = []

    const xGap = 10
    const yGap = 32
    const oWidth = w + 200
    const oHeight = h + 30
    const totalLines = Math.ceil(oWidth / xGap)
    const totalPoints = Math.ceil(oHeight / yGap)
    const xStart = (w - xGap * totalLines) / 2
    const yStart = (h - yGap * totalPoints) / 2

    for (let i = 0; i <= totalLines; i++) {
      const points = []
      for (let j = 0; j <= totalPoints; j++) {
        points.push({
          x: xStart + xGap * i,
          y: yStart + yGap * j,
          wave: { x: 0, y: 0 },
          cursor: { x: 0, y: 0, vx: 0, vy: 0 },
        })
      }

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke', color)
      path.setAttribute('stroke-width', '1.2')
      path.setAttribute('opacity', String(0.15 + (i / totalLines) * 0.6))
      path.setAttribute('stroke-linecap', 'round')
      svg.appendChild(path)
      state.paths.push(path)
      state.lines.push(points)
    }
  }, [color])

  const movePoints = useCallback((time) => {
    const { lines, mouse, noise } = stateRef.current

    lines.forEach(points => {
      points.forEach(p => {
        const move = noise.perlin2(
          (p.x + time * 0.0125) * 0.002,
          (p.y + time * 0.005) * 0.0015
        ) * 12

        p.wave.x = Math.cos(move) * 32
        p.wave.y = Math.sin(move) * 16

        const dx = p.x - mouse.sx
        const dy = p.y - mouse.sy
        const d = Math.hypot(dx, dy)
        const l = Math.max(175, mouse.vs)

        if (d < l) {
          const s = 1 - d / l
          const f = Math.cos(d * 0.001) * s
          p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065
          p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065
        }

        p.cursor.vx += (0 - p.cursor.x) * 0.005
        p.cursor.vy += (0 - p.cursor.y) * 0.005
        p.cursor.vx *= 0.925
        p.cursor.vy *= 0.925
        p.cursor.x += p.cursor.vx * 2
        p.cursor.y += p.cursor.vy * 2
        p.cursor.x = Math.min(100, Math.max(-100, p.cursor.x))
        p.cursor.y = Math.min(100, Math.max(-100, p.cursor.y))
      })
    })
  }, [])

  const moved = useCallback((point, withCursorForce = true) => {
    return {
      x: Math.round((point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0)) * 10) / 10,
      y: Math.round((point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0)) * 10) / 10,
    }
  }, [])

  const drawLines = useCallback(() => {
    const { lines, paths } = stateRef.current

    lines.forEach((points, lIndex) => {
      let p1 = moved(points[0], false)
      let d = `M ${p1.x} ${p1.y}`

      points.forEach((p, pIndex) => {
        const isLast = pIndex === points.length - 1
        p1 = moved(p, !isLast)
        d += `L ${p1.x} ${p1.y}`
      })

      paths[lIndex].setAttribute('d', d)
    })
  }, [moved])

  const tick = useCallback((time) => {
    const state = stateRef.current
    const { mouse } = state

    mouse.sx += (mouse.x - mouse.sx) * 0.1
    mouse.sy += (mouse.y - mouse.sy) * 0.1

    const dx = mouse.x - mouse.lx
    const dy = mouse.y - mouse.ly
    const d = Math.hypot(dx, dy)

    mouse.v = d
    mouse.vs += (d - mouse.vs) * 0.1
    mouse.vs = Math.min(100, mouse.vs)

    mouse.lx = mouse.x
    mouse.ly = mouse.y
    mouse.a = Math.atan2(dy, dx)

    movePoints(time)
    drawLines()

    state.rafId = requestAnimationFrame(tick)
  }, [movePoints, drawLines])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const state = stateRef.current

    const updateSize = () => {
      const rect = svg.getBoundingClientRect()
      state.bounding = { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
      svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`)
    }

    const handleMouseMove = (e) => {
      const { mouse } = state
      mouse.x = e.clientX - state.bounding.left
      mouse.y = e.clientY - state.bounding.top + window.scrollY

      if (!mouse.set) {
        mouse.sx = mouse.x
        mouse.sy = mouse.y
        mouse.lx = mouse.x
        mouse.ly = mouse.y
        mouse.set = true
      }
    }

    const handleResize = () => {
      updateSize()
      setLines()
    }

    updateSize()
    setLines()

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    state.rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(state.rafId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [setLines, tick])

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      preserveAspectRatio="none"
    />
  )
}
