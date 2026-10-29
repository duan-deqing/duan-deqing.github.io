import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppSettingsProvider } from './hooks/AppSettings'
import ScrollToTop from './components/shared/ScrollToTop'
import HomeLayout from './layouts/HomeLayout'
import SubpageLayout from './layouts/SubpageLayout'
import HomePage from './pages/HomePage'

const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const SkillsPage = lazy(() => import('./pages/SkillsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function prefetchSubpages() {
  const loaders = [
    () => import('./pages/ProjectsPage'),
    () => import('./pages/BlogPage'),
    () => import('./pages/SkillsPage'),
    () => import('./pages/ContactPage'),
  ]
  loaders.forEach((load) => {
    load().catch(() => {})
  })
}

function page(element) {
  return <Suspense fallback={<div className="min-h-[60vh]" aria-hidden />}>{element}</Suspense>
}

export default function App() {
  useEffect(() => {
    const idle =
      typeof window !== 'undefined' && 'requestIdleCallback' in window
        ? window.requestIdleCallback
        : (fn) => setTimeout(fn, 200)
    const handle = idle(prefetchSubpages)
    return () => {
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window && handle) {
        window.cancelIdleCallback(handle)
      }
    }
  }, [])

  return (
    <AppSettingsProvider>
      <ScrollToTop />
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route element={<SubpageLayout />}>
          <Route path="/projects" element={page(<ProjectsPage />)} />
          <Route path="/blog" element={page(<BlogPage />)} />
          <Route path="/blog/:slug" element={page(<BlogPostPage />)} />
          <Route path="/skills" element={page(<SkillsPage />)} />
          <Route path="/contact" element={page(<ContactPage />)} />
          <Route path="*" element={page(<NotFoundPage />)} />
        </Route>
      </Routes>
    </AppSettingsProvider>
  )
}
