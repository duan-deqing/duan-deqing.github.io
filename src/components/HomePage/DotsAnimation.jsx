/**
 * ============================================================================
 *  DotsAnimation.jsx - 点阵动画组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 显示均匀分布的点阵
 * 2. 鼠标靠近时点会被推开
 * 3. 点会缓慢恢复原位
 * 4. 自适应容器大小
 *
 * 【Props】
 * - color: string - 点的颜色（默认黑色）
 * - radius: number - 点的半径（默认 3）
 * - margin: number - 点之间的间距（默认 20）
 * ============================================================================
 */

import { useEffect, useRef } from 'react'

export default function DotsAnimation({ 
  color = '#000000',
  radius = 3,
  margin = 20 
}) {
  const svgRef = useRef(null)
  const stateRef = useRef({
    width: 0,
    height: 0,
    dots: [],
    mouse: { x: 0, y: 0, prevX: 0, prevY: 0, speed: 0 },
    rafId: null,
    mouseSpeedId: null,
  })

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const state = stateRef.current
    const dotSize = radius + margin

    // 更新大小
    const resizeHandler = () => {
      const bounding = svg.getBoundingClientRect()
      state.width = bounding.width
      state.height = bounding.height
    }

    // 创建点阵
    const createDots = () => {
      resizeHandler()

      // 清除旧点
      state.dots.forEach(dot => dot.el.remove())
      state.dots = []

      const rows = Math.floor(state.height / dotSize)
      const cols = Math.floor(state.width / dotSize)

      const x = (state.width % dotSize) / 2
      const y = (state.height % dotSize) / 2

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const dot = {
            anchor: {
              x: x + (col * dotSize) + (dotSize / 2),
              y: y + (row * dotSize) + (dotSize / 2)
            },
            position: { x: 0, y: 0 },
            smooth: { x: 0, y: 0 },
            velocity: { x: 0, y: 0 },
            el: null
          }

          dot.position = { x: dot.anchor.x, y: dot.anchor.y }
          dot.smooth = { x: dot.anchor.x, y: dot.anchor.y }

          dot.el = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
          dot.el.setAttribute('cx', dot.anchor.x)
          dot.el.setAttribute('cy', dot.anchor.y)
          dot.el.setAttribute('r', radius / 2)
          dot.el.setAttribute('fill', color)

          svg.appendChild(dot.el)
          state.dots.push(dot)
        }
      }
    }

    // 鼠标移动处理
    const mouseHandler = (e) => {
      const rect = svg.getBoundingClientRect()
      state.mouse.x = e.clientX - rect.left
      state.mouse.y = e.clientY - rect.top
    }

    // 计算鼠标速度
    const mouseSpeed = () => {
      const distX = state.mouse.prevX - state.mouse.x
      const distY = state.mouse.prevY - state.mouse.y
      const dist = Math.hypot(distX, distY)

      state.mouse.speed += (dist - state.mouse.speed) * 0.5
      if (state.mouse.speed < 0.001) {
        state.mouse.speed = 0
      }

      state.mouse.prevX = state.mouse.x
      state.mouse.prevY = state.mouse.y

      state.mouseSpeedId = setTimeout(mouseSpeed, 20)
    }

    // 动画循环
    const tick = () => {
      state.dots.forEach(dot => {
        const distX = state.mouse.x - dot.position.x
        const distY = state.mouse.y - dot.position.y
        const dist = Math.max(Math.hypot(distX, distY), 1)

        const angle = Math.atan2(distY, distX)
        const move = (500 / dist) * (state.mouse.speed * 0.1)

        if (dist < 100) {
          dot.velocity.x += Math.cos(angle) * -move
          dot.velocity.y += Math.sin(angle) * -move
        }

        dot.velocity.x *= 0.9
        dot.velocity.y *= 0.9

        dot.position.x = dot.anchor.x + dot.velocity.x
        dot.position.y = dot.anchor.y + dot.velocity.y

        dot.smooth.x += (dot.position.x - dot.smooth.x) * 0.1
        dot.smooth.y += (dot.position.y - dot.smooth.y) * 0.1

        dot.el.setAttribute('cx', dot.smooth.x)
        dot.el.setAttribute('cy', dot.smooth.y)
      })

      state.rafId = requestAnimationFrame(tick)
    }

    // 初始化
    createDots()
    tick()
    mouseSpeed()

    // 事件监听
    window.addEventListener('resize', createDots)
    svg.addEventListener('mousemove', mouseHandler)

    return () => {
      cancelAnimationFrame(state.rafId)
      clearTimeout(state.mouseSpeedId)
      window.removeEventListener('resize', createDots)
      svg.removeEventListener('mousemove', mouseHandler)
      state.dots.forEach(dot => dot.el.remove())
    }
  }, [color, radius, margin])

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ overflow: 'visible' }}
    />
  )
}
