/**
 * ============================================================================
 *  BlogPostPage.jsx - 博客文章详情页面
 * ============================================================================
 *
 * 【功能说明】
 * 1. 所有博客文章统一使用的模板页面
 * 2. 从 markdown 文件读取文章内容
 * 3. 使用 react-markdown 渲染正文
 * 4. 包含文章元信息（日期、分类、标签）
 *
 * 【使用方式】
 * 通过路由 /blog/:id 访问，id 为文章编号
 * ============================================================================
 */

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useTheme } from '../hooks/useTheme'
import { useLanguage } from '../hooks/useLanguage'
import { getPostBySlug } from '../utils/markdown'
import blogConfig from '../blogConfig'
import BlogHeader from '../components/BlogPage/BlogHeader'
import BlogFooter from '../components/BlogPage/BlogFooter'
import TableOfContents from '../components/BlogPage/TableOfContents'
import '../styles/blog-post.css'

/**
 * 生成标题 ID
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
 * 从 children 提取纯文本
 */
function getTextContent(children) {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(getTextContent).join('')
  if (children?.props?.children) return getTextContent(children.props.children)
  return ''
}

function BlogPostPage() {
  // 获取URL参数
  const { slug } = useParams()
  const navigate = useNavigate()

  // 主题和语言状态
  const { isDark, toggle: toggleTheme } = useTheme()
  const { lang, toggle: toggleLang, t } = useLanguage()

  // 文章数据状态
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // 文章内容 ref 和目录位置
  const articleRef = useRef(null)
  const [tocLeft, setTocLeft] = useState(0)
  const [showToc, setShowToc] = useState(false)

  // 计算目录位置和是否显示
  useEffect(() => {
    const updateTocPosition = () => {
      if (articleRef.current) {
        const rect = articleRef.current.getBoundingClientRect()
        const leftSpace = rect.left
        
        // 当左侧宽度足够时显示目录（224px目录宽度 + 16px间距）
        if (leftSpace >= 240) {
          setShowToc(true)
          setTocLeft(Math.max(16, leftSpace - 240))
        } else {
          setShowToc(false)
        }
      }
    }

    updateTocPosition()
    window.addEventListener('resize', updateTocPosition)
    window.addEventListener('scroll', updateTocPosition)
    return () => {
      window.removeEventListener('resize', updateTocPosition)
      window.removeEventListener('scroll', updateTocPosition)
    }
  }, [post])

  // 加载文章数据
  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true)
        setError(false)
        const postData = await getPostBySlug(slug, lang)
        if (postData) {
          setPost(postData)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('Failed to load post:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [slug, lang]) // 当slug或语言变化时重新加载

  // 加载中状态
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors w-full flex flex-col">
        <BlogHeader
          isDark={isDark}
          toggleTheme={toggleTheme}
          lang={lang}
          toggleLang={toggleLang}
          t={t}
        />
        <main className="w-full pt-16 flex-grow">
          <div className="max-w-4xl mx-auto px-6 py-24 text-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">
                {t({ en: 'Loading...', zh: '加载中...' })}
              </p>
            </div>
          </div>
        </main>
        <BlogFooter t={t} />
      </div>
    )
  }

  // 文章不存在或加载失败
  if (error || !post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors w-full flex flex-col">
        <BlogHeader
          isDark={isDark}
          toggleTheme={toggleTheme}
          lang={lang}
          toggleLang={toggleLang}
          t={t}
        />
        <main className="w-full pt-16 flex-grow">
          <div className="max-w-4xl mx-auto px-6 py-24 text-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {t({ en: 'Post Not Found', zh: '文章未找到' })}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                {t({ en: 'The post you are looking for does not exist.', zh: '您查找的文章不存在。' })}
              </p>
              <button
                onClick={() => navigate('/blog')}
                className="btn btn-primary"
              >
                {t({ en: 'BACK TO BLOG', zh: '返回博客' })}
              </button>
            </div>
          </div>
        </main>
        <BlogFooter t={t} />
      </div>
    )
  }

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString(t({ en: 'en-US', zh: 'zh-CN' }), options)
  }

  // 获取分类名称
  const getCategoryName = (categoryId) => {
    const category = blogConfig.categories.find(c => c.id === categoryId)
    return category ? t(category.label) : categoryId
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors w-full flex flex-col">
      {/* 设置浏览器标签页标题 */}
      <title>{t(post.title)} | STYLAN Blog</title>

      {/* 导航栏 */}
      <BlogHeader
        isDark={isDark}
        toggleTheme={toggleTheme}
        lang={lang}
        toggleLang={toggleLang}
        t={t}
      />

      {/* 目录导航 - 桌面端显示，空间不足时自动隐藏 */}
      {showToc && (
        <aside
          className="hidden lg:block fixed transition-all duration-200"
          style={{
            left: `${tocLeft}px`,
            width: '224px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
          <TableOfContents content={post.content} />
        </aside>
      )}

      {/* 主要内容区域 */}
      <main className="w-full pt-16 flex-grow">
        <article ref={articleRef} className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          {/* 返回链接 */}
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t({ en: 'BACK TO BLOG', zh: '返回博客列表' })}
          </button>

          {/* 文章分类 */}
          <div className="mb-4">
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
              {getCategoryName(post.category)}
            </span>
          </div>

          {/* 文章标题 */}
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t(post.title)}
          </h1>

          {/* 文章元信息 */}
          <div className="flex flex-wrap items-center gap-4 mb-10 pb-8 border-b border-gray-200 dark:border-gray-700">
            {/* 发布日期 */}
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(post.date)}</span>
            </div>

            {/* 阅读时间 */}
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t(post.readTime)}</span>
            </div>

            {/* 作者 */}
            {post.author && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{t(post.author)}</span>
              </div>
            )}
          </div>

          {/* 文章摘要 */}
          <div className="mb-10">
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed italic">
              {t(post.excerpt)}
            </p>
          </div>

          {/* 文章正文内容 - Markdown 渲染 */}
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              urlTransform={(url) => url}
              components={{
                // 标题样式
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mt-10 mb-6 pb-3 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => {
                  const text = getTextContent(children)
                  const id = generateId(text)
                  return (
                    <h2 id={id} className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white scroll-mt-20">
                      {children}
                    </h2>
                  )
                },
                h3: ({ children }) => {
                  const text = getTextContent(children)
                  const id = generateId(text)
                  return (
                    <h3 id={id} className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white scroll-mt-20">
                      {children}
                    </h3>
                  )
                },
                h4: ({ children }) => {
                  const text = getTextContent(children)
                  const id = generateId(text)
                  return (
                    <h4 id={id} className="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white scroll-mt-20">
                      {children}
                    </h4>
                  )
                },
                // 段落样式
                p: ({ children }) => (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                // 链接样式
                a: ({ href, children }) => (
                  <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {children}
                  </a>
                ),
                // 列表样式
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="ml-4">{children}</li>
                ),
                // 引用样式
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg">
                    <div className="text-gray-600 dark:text-gray-400 italic">
                      {children}
                    </div>
                  </blockquote>
                ),
                // 代码块样式 - Mac风格
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  if (!inline && match) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                  return (
                    <code className={`px-1.5 py-0.5 rounded text-sm font-mono ${
                      isDark 
                        ? 'bg-[#313244] text-[#f38ba8]' 
                        : 'bg-gray-100 text-pink-600'
                    }`} {...props}>
                      {children}
                    </code>
                  )
                },
                // pre 标签样式 - Mac风格容器
                pre({ children, ...props }) {
                  // 提取语言类型
                  const codeChild = children?.props
                  const className = codeChild?.className || ''
                  const match = /language-(\w+)/.exec(className)
                  const language = match ? match[1] : ''
                  
                  return (
                    <div className="my-6 rounded-xl code-block-wrapper" style={{
                      boxShadow: isDark 
                        ? '0 10px 40px rgba(0, 0, 0, 0.4)' 
                        : '0 10px 40px rgba(0, 0, 0, 0.15)'
                    }}>
                      {/* Mac风格标题栏 */}
                      <div className={`px-4 py-3 flex items-center gap-2 rounded-t-xl ${
                        isDark 
                          ? 'bg-[#343f44]' 
                          : 'bg-[#f0f0f0]'
                      }`}>
                        {/* 红黄绿三个按钮 */}
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                          <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                          <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                        </div>
                        {/* 语言标签 */}
                        {language && (
                          <span className={`ml-2 text-xs font-mono ${
                            isDark ? 'text-[#a6adc8]' : 'text-[#6e6e73]'
                          }`}>
                            {language}
                          </span>
                        )}
                      </div>
                      {/* 代码内容 */}
                      <pre {...props} className="!m-0 !rounded-t-none" style={{
                        margin: 0,
                        borderRadius: '0 0 0.75rem 0.75rem',
                        padding: '1.5rem 1rem',
                        fontSize: '0.875rem',
                        lineHeight: '1.7',
                        background: isDark ? '#2d353b' : '#fafafa',
                        borderTop: `1px solid ${isDark ? '#343f44' : '#e5e5e7'}`,
                      }}>
                        {children}
                      </pre>
                    </div>
                  )
                },
                // 水平线样式
                hr: () => (
                  <hr className="my-8 border-t border-gray-200 dark:border-gray-700" />
                ),
                // 图片样式
                img: ({ src, alt }) => (
                  <div className="my-6 rounded-xl overflow-hidden" style={{
                    boxShadow: isDark 
                      ? '0 10px 40px rgba(0, 0, 0, 0.4)' 
                      : '0 10px 40px rgba(0, 0, 0, 0.15)'
                  }}>
                    <img src={src} alt={alt} className="w-full h-auto block" />
                  </div>
                ),
                // 表格样式
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>
                ),
                tr: ({ children }) => (
                  <tr>{children}</tr>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {children}
                  </td>
                ),
                // 强调样式
                strong: ({ children }) => (
                  <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic">{children}</em>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* 标签列表 */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
              {t({ en: 'Tags', zh: '标签' })}
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 底部返回链接 */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => navigate('/blog')}
              className="btn btn-secondary"
            >
              {t({ en: '← BACK TO ALL POSTS', zh: '← 返回所有文章' })}
            </button>
          </div>
        </article>
      </main>

      {/* 页脚 */}
      <BlogFooter t={t} />
    </div>
  )
}

export default BlogPostPage