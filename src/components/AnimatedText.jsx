/**
 * AnimatedText.jsx - 带动画的文本组件
 * 
 * 效果：逐字出现
 * 每个字符依次淡入显示，保留空格，支持自动换行
 */

import { useState, useEffect, useRef } from 'react'

export default function AnimatedText({ children, as: Tag = 'span', className = '', style = {}, ...props }) {
  const [text, setText] = useState(children)
  const [isAnimating, setIsAnimating] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const prevChildrenRef = useRef(children)
  const timerRef = useRef(null)
  const totalCharsRef = useRef(0)

  useEffect(() => {
    if (prevChildrenRef.current === children) return
    
    prevChildrenRef.current = children
    
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    
    const textStr = typeof children === 'string' ? children : String(children)
    totalCharsRef.current = textStr.length
    
    setIsAnimating(true)
    setCharCount(0)
    setText(children)
    
    let count = 0
    const showNextChar = () => {
      count++
      setCharCount(count)
      if (count < totalCharsRef.current) {
        timerRef.current = setTimeout(showNextChar, 15)
      } else {
        setIsAnimating(false)
      }
    }
    
    timerRef.current = setTimeout(showNextChar, 20)
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [children])

  // 使用 pre-wrap 保留空格但允许换行
  const mergedStyle = { ...style, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }

  // 首次渲染直接显示
  if (!isAnimating && charCount === 0) {
    return (
      <Tag className={className} style={mergedStyle} {...props}>
        {children}
      </Tag>
    )
  }

  const textStr = typeof text === 'string' ? text : String(text)
  const visibleText = textStr.slice(0, charCount)

  return (
    <Tag className={className} style={mergedStyle} {...props}>
      <span className="char-appear">{visibleText}</span>
    </Tag>
  )
}
