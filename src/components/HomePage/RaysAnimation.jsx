/**
 * ============================================================================
 *  RaysAnimation.jsx - 光线动画组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 使用渐变背景和 clip-path 实现光线效果
 * 2. 光线向右移动
 * 3. 自适应容器大小
 *
 * 【Props】
 * - colors: array - 渐变颜色数组
 * - opacity: number - 透明度（默认 0.1）
 * - angle: number - 渐变角度（默认 50）
 * - speed: number - 动画速度（默认 1）
 * ============================================================================
 */

import { useEffect, useRef } from 'react'

export default function RaysAnimation({ 
  colors = ['#00F8F1', '#FFBD1E', '#FE848F', '#FFBD1E', '#00F8F1'],
  opacity = 0.1,
  angle = 50,
  speed = 1
}) {
  const containerRef = useRef(null)
  const stateRef = useRef({
    width: 0,
    height: 0,
    rays: [],
    rafId: null,
    offset: 0,
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const state = stateRef.current

    // Ray 对象
    class Ray {
      constructor(width, height) {
        this.x = Math.random() * width
        this.y = Math.floor(Math.random() * ((height / 12) + 1)) * 12
        this.width = 50 * Math.random()
        this.velocity = (0.25 + this.width / 50) * speed
        this.d = ''
        this.maxWidth = width
      }

      update() {
        this.x += this.velocity
        if (this.x > this.maxWidth) {
          this.x = -this.width
        }
      }

      draw() {
        this.d = `M ${this.x},${this.y} h ${this.width} v 1 h -${this.width} z `
      }

      tick() {
        this.update()
        this.draw()
      }
    }

    // 生成光线
    const emit = () => {
      state.rays = []
      const totalRays = Math.floor(state.height * 0.75)

      for (let i = 0; i < totalRays; i++) {
        const ray = new Ray(state.width, state.height)
        state.rays.push(ray)
      }
    }

    // 更新大小
    const updateSize = () => {
      state.width = container.clientWidth
      state.height = container.clientHeight
      emit()
    }

    // 动画循环
    const tick = () => {
      let path = ''

      state.rays.forEach(ray => {
        ray.tick()
        path += ray.d
      })

      container.style.clipPath = `path("${path}")`
      state.rafId = requestAnimationFrame(tick)
    }

    // 初始化
    updateSize()
    tick()

    // 监听窗口大小变化
    const handleResize = () => {
      updateSize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(state.rafId)
      window.removeEventListener('resize', handleResize)
    }
  }, [speed])

  // 生成渐变颜色字符串
  const gradientColors = colors.map((color, index) => {
    const position = index * 20
    return `${color} ${position}px`
  }).join(', ')

  return (
    <div
      className="absolute overflow-hidden"
      style={{
        top: '50%',
        left: '50%',
        width: '200vh',
        height: '200vw',
        transform: 'translate3d(-50%, -50%, 0) rotate(-70deg)',
      }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(${angle}deg, ${gradientColors})`,
          opacity,
        }}
      />
    </div>
  )
}
