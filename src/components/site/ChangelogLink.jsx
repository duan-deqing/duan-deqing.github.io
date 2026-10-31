import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import {
  CHANGELOG_SCOPES,
  changelogScopeForPath,
} from '../../utils/changelogScopes'
import { cn } from '../../utils/cn'
import { HistoryIcon } from './icons'

export default function ChangelogLink({ className, onNavigate }) {
  const { pathname } = useLocation()
  const { t } = useLanguage()
  const scope = changelogScopeForPath(pathname)
  const label = t({ en: 'Changelog', zh: '更新日志' })
  const scopeLabel = t(CHANGELOG_SCOPES[scope].label)
  const isCurrent = pathname === '/changelog' || pathname.startsWith('/changelog/')

  return (
    <Link
      to={`/changelog/${scope}`}
      onClick={onNavigate}
      aria-current={isCurrent ? 'page' : undefined}
      aria-label={t({
        en: `${label}: ${scopeLabel}`,
        zh: `${label}：${scopeLabel}`,
      })}
      className={cn(
        'inline-flex h-7 items-center gap-1.5 rounded border border-[#8884] px-2 text-xs font-medium text-muted-strong opacity-70 transition-all duration-200 hover:bg-subtle hover:text-ink hover:opacity-100 focus-visible:bg-subtle focus-visible:text-ink focus-visible:opacity-100',
        className
      )}
    >
      <HistoryIcon size={13} />
      {label}
    </Link>
  )
}
