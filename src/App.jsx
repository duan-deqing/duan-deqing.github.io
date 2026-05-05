/**
 * ============================================================================
 *  App.jsx - 应用主入口组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 管理路由配置
 * 2. 组合所有页面
 * 3. 加载时显示进度条，完成后显示页面
 *
 * 【路由结构】
 * - / : 主页
 * - /skills : 技能与技术页面
 * - /projects : 项目页面
 * - /blog : 博客列表页面
 * - /blog/:slug : 博客文章详情页面
 * - /contact : 联系页面
 * - * : 404页面（未匹配的路径）
 * ============================================================================
 */

import { lazy, Suspense, useState, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import Loading from './components/shared/Loading'

const HomePage = lazy(() => import('./pages/HomePage'))
const SkillsPage = lazy(() => import('./pages/SkillsPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  const [loadingComplete, setLoadingComplete] = useState(false)

  const handleLoadingComplete = useCallback(() => {
    setLoadingComplete(true)
  }, [])

  if (!loadingComplete) {
    return <Loading onComplete={handleLoadingComplete} />
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/skills" element={<SkillsPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
