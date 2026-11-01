import { Outlet, useLocation } from 'react-router-dom'
import { pageBackgroundForPath } from '../backgrounds'
import WorkspaceShell from '../components/layout/WorkspaceShell'
import { useLanguage } from '../hooks/useLanguage'

export default function SubpageLayout() {
  const { pathname } = useLocation()
  const { lang } = useLanguage()

  return (
    <WorkspaceShell background={pageBackgroundForPath(pathname)}>
      <Outlet key={lang} />
    </WorkspaceShell>
  )
}
