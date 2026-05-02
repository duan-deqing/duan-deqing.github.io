import { useState, useEffect, useCallback } from 'react'

/**
 * 从 markdown 内容中提取 h2-h4 标题
 */
function extractHeadings(content) {
  if (!content) return []
  const headings = []
  // 统一换行符为 \n
  const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = normalizedContent.split('\n')
  const seenIds = new Set()

  lines.forEach(line => {
    const trimmedLine = line.trim()
    const match = trimmedLine.match(/^(#{2,4})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      let id = generateId(text)
      if (seenIds.has(id)) {
        let counter = 2
        while (seenIds.has(`${id}-${counter}`)) counter++
        id = `${id}-${counter}`
      }
      seenIds.add(id)
      headings.push({ level, text, id })
    }
  })
  return headings
}

/**
 * 生成标题 ID (slug 化)
 */
function generateId(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * TableOfContents 组件 - 文章目录导航
 * 桌面端固定在左侧，移动端隐藏
 */
export default function TableOfContents({ content, onItemClick }) {
  const [headings] = useState(() => extractHeadings(content))
  const [activeId, setActiveId] = useState('')

  // 使用 IntersectionObserver 监听标题元素
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0
      }
    )

    // 延迟等待 DOM 渲染完成
    const timer = setTimeout(() => {
      headings.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 200)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [headings])

  // 点击标题滚动到对应位置
  const handleClick = useCallback((e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
    // 调用外部回调
    if (onItemClick) onItemClick()
  }, [onItemClick])

  if (headings.length === 0) return null

  return (
    <nav className="toc-container">
      <ul className="toc-list">
        {headings.map(({ level, text, id }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className={`toc-link toc-level-${level} ${activeId === id ? 'toc-active' : ''}`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}