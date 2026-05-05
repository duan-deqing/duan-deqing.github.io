/**
 * ============================================================================
 *  TypewriterText.jsx - 打字机效果组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 文字逐字显示
 * 2. 末尾有闪烁的光标
 * 3. 支持循环播放
 *
 * 【Props】
 * - text: string - 要显示的文字
 * - speed: number - 打字速度（毫秒，默认 100）
 * - loop: boolean - 是否循环（默认 false）
 * - loopDelay: number - 循环间隔（毫秒，默认 5000）
 * - className: string - CSS 类名
 * - style: object - 内联样式
 * ============================================================================
 */

import { useState, useEffect, useRef } from 'react'

export default function TypewriterText({ 
  text, 
  speed = 100,
  loop = false,
  loopDelay = 5000,
  className = '',
  style = {}
}) {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [isComplete, setIsComplete] = useState(false)
  const timeoutRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    let currentIndex = 0
    let isUnmounted = false

    const typeText = () => {
      currentIndex = 0
      setDisplayText('')
      setIsComplete(false)

      intervalRef.current = setInterval(() => {
        if (isUnmounted) return
        
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(intervalRef.current)
          setIsComplete(true)
          
          if (loop && !isUnmounted) {
            timeoutRef.current = setTimeout(() => {
              typeText()
            }, loopDelay)
          }
        }
      }, speed)
    }

    typeText()

    return () => {
      isUnmounted = true
      clearInterval(intervalRef.current)
      clearTimeout(timeoutRef.current)
    }
  }, [text, speed, loop, loopDelay])

  // 光标闪烁效果
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)

    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <span className={className} style={style}>
      {displayText}
      <span 
        className={`inline-block w-[0.8em] h-[3px] bg-current ml-0.5 align-middle transition-opacity duration-100 ${
          showCursor ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          animation: 'blink 1.06s step-end infinite',
          verticalAlign: 'baseline',
          marginBottom: '2px',
        }}
      />
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  )
}
