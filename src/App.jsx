import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppSettingsProvider } from './hooks/AppSettings'
import ScrollToTop from './components/shared/ScrollToTop'
import PageFallback from './components/site/PageFallback'
import PageTransition from './components/site/PageTransition'
import HomeLayout from './layouts/HomeLayout'
import SubpageLayout from './layouts/SubpageLayout'
import HomePage from './pages/HomePage'

const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const SkillsPage = lazy(() => import('./pages/SkillsPage'))
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'))
const BookmarkCategoryPage = lazy(() => import('./pages/BookmarkCategoryPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const SubpageHomePage = lazy(() => import('./pages/SubpageHomePage'))
const BlogLayout = lazy(() => import('./layouts/BlogLayout'))
const BookmarksLayout = lazy(() => import('./layouts/BookmarksLayout'))

function prefetchSubpages() {
  const loaders = [
    () => import('./layouts/BlogLayout'),
    () => import('./layouts/BookmarksLayout'),
    () => import('./pages/SubpageHomePage'),
    () => import('./pages/ProjectsPage'),
    () => import('./pages/BlogPage'),
    () => import('./pages/SkillsPage'),
    () => import('./pages/BookmarksPage'),
    () => import('./pages/BookmarkCategoryPage'),
  ]
  loaders.forEach((load) => {
    load().catch(() => {})
  })
}

function page(element) {
  return (
    <Suspense fallback={<PageFallback />}>
      <PageTransition>{element}</PageTransition>
    </Suspense>
  )
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
        <Route
          element={
            <Suspense fallback={<PageFallback />}>
              <BlogLayout />
            </Suspense>
          }
        >
          <Route path="/blog" element={page(<BlogPage />)} />
          <Route path="/blog/:slug" element={page(<BlogPostPage />)} />
        </Route>
        <Route
          element={
            <Suspense fallback={<PageFallback />}>
              <BookmarksLayout />
            </Suspense>
          }
        >
          <Route path="/bookmarks" element={page(<BookmarksPage />)} />
          <Route path="/bookmarks/:slug" element={page(<BookmarkCategoryPage />)} />
        </Route>
        <Route element={<SubpageLayout />}>
          <Route path="/home" element={page(<SubpageHomePage />)} />
          <Route path="/projects" element={page(<ProjectsPage />)} />
          <Route path="/skills" element={page(<SkillsPage />)} />
          <Route path="*" element={page(<NotFoundPage />)} />
        </Route>
      </Routes>
    </AppSettingsProvider>
  )
}
