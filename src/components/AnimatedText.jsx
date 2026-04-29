/**
 * ============================================================================
 *  AnimatedText.jsx - 带动画的文本组件
 * ============================================================================
 * 
 * 【功能说明】
 * 当文本内容变化时（如语言切换），自动播放逐字出现动画
 * 
 * 【动画效果】
 * - 文字从下方滑入并淡入
 * - 每个字符依次出现，间隔 15ms
 * - 首次渲染直接显示，不执行动画
 * 
 * 【Props】
 * - children: 要显示的文本内容
 * - as: 渲染的 HTML 标签（默认 'span'）
 * - className: CSS 类名
 * - style: 内联样式
 * 
 * 【使用示例】
 * <AnimatedText as="h1" className="title">
 *   {t(config.personal.title)}
 * </AnimatedText>
 * 
 * 【自定义提示】
 * - 修改动画效果: 更改 index.css 中的 charAppear 动画
 * - 修改字符间隔: 更改 showNextChar 中的 setTimeout 值
 * ============================================================================
 */

import { useState, useEffect, useRef } from 'react'

export default function AnimatedText({ children, as: Tag = 'span', className = '', style = {}, ...props }) {
  // 当前显示的文本
  const [text, setText] = useState(children)
  // 是否正在执行动画
  const [isAnimating, setIsAnimating] = useState(false)
  // 当前显示的字符数
  const [charCount, setCharCount] = useState(0)
  // 上一次的 children 引用，用于判断是否变化
  const prevChildrenRef = useRef(children)
  // 定时器引用，用于清理
  const timerRef = useRef(null)
  // 总字符数
  const totalCharsRef = useRef(0)

  useEffect(() => {
    // 内容没有变化，不执行动画
    if (prevChildrenRef.current === children) return
    
    prevChildrenRef.current = children
    
    // 清除之前的动画定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    
    // 获取新文本的字符数
    const textStr = typeof children === 'string' ? children : String(children)
    totalCharsRef.current = textStr.length
    
    // 开始逐字显示动画
    setIsAnimating(true)
    setCharCount(0)
    setText(children)
    
    // 逐字显示函数
    let count = 0
    const showNextChar = () => {
      count++
      setCharCount(count)
      if (count < totalCharsRef.current) {
        timerRef.current = setTimeout(showNextChar, 15) // 每个字符间隔 15ms
      } else {
        setIsAnimating(false)
      }
    }
    
    // 延迟开始动画
    timerRef.current = setTimeout(showNextChar, 20)
    
    // 清理函数
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [children])

  // 合并样式：保留原有样式，添加自动换行支持
  const mergedStyle = { ...style, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }

  // 首次渲染直接显示完整文本（不执行动画）
  if (!isAnimating && charCount === 0) {
    return (
      <Tag className={className} style={mergedStyle} {...props}>
        {children}
      </Tag>
    )
  }

  // 动画中：显示部分文本
  const textStr = typeof text === 'string' ? text : String(text)
  const visibleText = textStr.slice(0, charCount)

  return (
    <Tag className={className} style={mergedStyle} {...props}>
      <span className="char-appear">{visibleText}</span>
    </Tag>
  )
}
