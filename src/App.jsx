import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppSettingsProvider } from './hooks/AppSettings'
import ScrollToTop from './components/shared/ScrollToTop'
import PageFallback from './components/site/PageFallback'
import PageTransition from './components/site/PageTransition'
import HomeLayout from './layouts/HomeLayout'
import SubpageLayout from './layouts/SubpageLayout'
import BlogLayout from './layouts/BlogLayout'
import BookmarksLayout from './layouts/BookmarksLayout'
import HomePage from './pages/HomePage'
import BlogPage from './pages/BlogPage'
import BookmarksPage from './pages/BookmarksPage'
import BookmarkCategoryPage from './pages/BookmarkCategoryPage'
import ProjectsPage from './pages/ProjectsPage'
import SkillsPage from './pages/SkillsPage'
import SubpageHomePage from './pages/SubpageHomePage'
import NotFoundPage from './pages/NotFoundPage'

const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))

function prefetchArticlePage() {
  import('./pages/BlogPostPage').catch(() => {})
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
    const handle = idle(prefetchArticlePage)
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
        <Route element={<BlogLayout />}>
          <Route path="/blog" element={page(<BlogPage />)} />
          <Route path="/blog/:slug" element={page(<BlogPostPage />)} />
        </Route>
        <Route element={<BookmarksLayout />}>
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
