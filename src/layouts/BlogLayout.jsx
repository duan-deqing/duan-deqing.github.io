import { Outlet, useLocation } from 'react-router-dom'
import { BlogProvider } from '../components/blog/BlogProvider'
import BlogQuote from '../components/blog/BlogQuote'
import WritingRail from '../components/blog/WritingRail'
import WorkspaceShell from '../components/layout/WorkspaceShell'
import { useLanguage } from '../hooks/useLanguage'

export default function BlogLayout() {
  const { lang } = useLanguage()
  const { pathname } = useLocation()
  const isPost = pathname !== '/blog'

  return (
    <BlogProvider>
      <WorkspaceShell
        rail={<WritingRail key={lang} />}
        landing={<BlogQuote />}
        isLanding={!isPost}
        maxWidth="max-w-5xl"
        surfaceClassName={isPost ? 'lg:bg-page' : 'lg:bg-dots'}
      >
        <Outlet key={lang} />
      </WorkspaceShell>
    </BlogProvider>
  )
}
