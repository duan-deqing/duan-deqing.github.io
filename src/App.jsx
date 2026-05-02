/**
 * ============================================================================
 *  App.jsx - 应用主入口组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 管理路由配置
 * 2. 组合所有页面
 *
 * 【路由结构】
 * - / : 主页
 * - /blog : 博客列表页面
 * - /blog/:slug : 博客文章详情页面
 * - * : 404页面（未匹配的路径）
 * ============================================================================
 */

import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App