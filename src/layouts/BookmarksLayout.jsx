import { Outlet, useLocation } from 'react-router-dom'
import BlogQuote from '../components/blog/BlogQuote'
import BookmarksRail from '../components/bookmarks/BookmarksRail'
import WorkspaceShell from '../components/layout/WorkspaceShell'
import { useLanguage } from '../hooks/useLanguage'
import '../styles/bookmarks.css'

export default function BookmarksLayout() {
  const { lang } = useLanguage()
  const { pathname } = useLocation()

  return (
    <WorkspaceShell
      rail={<BookmarksRail key={lang} />}
      landing={<BlogQuote />}
      isLanding={pathname === '/bookmarks'}
      maxWidth="max-w-5xl"
      surfaceClassName="bookmarks-surface"
    >
      <Outlet key={lang} />
    </WorkspaceShell>
  )
}
