/**
 * App.jsx
 * - 首页：Brittany 双栏
 * - 子页：顶栏 + 单栏；导航常驻
 * - 启动：只等首页 chunk；子页后台预取
 */

import { lazy, Suspense, useState, useEffect, useCallback } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Loading from './components/shared/Loading'
import { AppSettingsProvider } from './hooks/AppSettings'
import { ScrollToTop } from './components/shared/PageTransition'
import SiteRail from './components/shared/SiteRail'
import SubpageHeader from './components/shared/SubpageHeader'
import PixelBlastBg from './components/shared/PixelBlastBg'
import ShapeGridBg from './components/shared/ShapeGridBg'
import config from './config'

const HomePage = lazy(() => import('./pages/HomePage'))
const SkillsPage = lazy(() => import('./pages/SkillsPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const homeChunk = () => import('./pages/HomePage')

function prefetchSubpages() {
  const loaders = [
    () => import('./pages/SkillsPage'),
    () => import('./pages/ProjectsPage'),
    () => import('./pages/BlogPage'),
    () => import('./pages/ContactPage'),
  ]
  loaders.forEach((load) => {
    load().catch(() => {})
  })
}

function AppRoutes() {
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

function ContentFallback() {
  return (
    <div className="py-16 flex justify-center">
      <div className="w-32 h-px overflow-hidden" style={{ background: 'var(--line)' }}>
        <div className="h-full" style={{ width: '45%', background: 'var(--accent)' }} />
      </div>
    </div>
  )
}

function AppShell() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  const content = (
    <div key={location.pathname} className={`page-shell${isHome ? '' : ' subpage-content'}`}>
      <Suspense fallback={<ContentFallback />}>
        <AppRoutes />
      </Suspense>
    </div>
  )

  if (isHome) {
    return (
      <div className="site-layout text-ink min-h-screen app-enter">
        <SiteRail />
        <main className="site-main">
          <div className="site-main-inner">{content}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="subpage-layout text-ink app-enter">
      <SubpageHeader />
      <main className="subpage-main">{content}</main>
      <footer className="subpage-footer">
        <p className="font-mono-ui text-[11px] text-muted tracking-wider">
          {config.footer?.copyright || `© ${new Date().getFullYear()} STYLAN`}
        </p>
      </footer>
    </div>
  )
}

function Boot() {
  const [progressDone, setProgressDone] = useState(false)
  const [homeReady, setHomeReady] = useState(false)
  const [phase, setPhase] = useState('loading') // loading | leaving | ready

  useEffect(() => {
    let cancelled = false
    homeChunk()
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setHomeReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!progressDone || !homeReady) return
    setPhase((p) => (p === 'loading' ? 'leaving' : p))
    const id = setTimeout(() => setPhase('ready'), 200)
    return () => clearTimeout(id)
    // 依赖不能含 phase：否则 phase→leaving 时 cleanup 会取消定时器，永远到不了 ready
  }, [progressDone, homeReady])

  useEffect(() => {
    if (phase !== 'ready') return
    const idle =
      typeof window !== 'undefined' && 'requestIdleCallback' in window
        ? window.requestIdleCallback
        : (fn) => setTimeout(fn, 200)
    const handle = idle(() => prefetchSubpages())
    return () => {
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window && handle) {
        window.cancelIdleCallback(handle)
      }
    }
  }, [phase])

  const handleProgressDone = useCallback(() => {
    setProgressDone(true)
  }, [])

  if (phase !== 'ready') {
    return <Loading onComplete={handleProgressDone} leaving={phase === 'leaving'} />
  }

  return (
    <>
      {/* 浅色 Shape Grid（官方）/ 深色 Pixel Blast */}
      <ShapeGridBg />
      <PixelBlastBg patternDensity={1.3} />
      <ScrollToTop />
      <AppShell />
    </>
  )
}

function App() {
  return (
    <AppSettingsProvider>
      <Boot />
    </AppSettingsProvider>
  )
}

export default App
