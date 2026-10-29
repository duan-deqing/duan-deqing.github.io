import { useLanguage } from '../../hooks/useLanguage'
import { cn } from '../../utils/cn'
import { SearchIcon } from '../site/icons'

export default function SearchTrigger({ onClick, className }) {
  const { t } = useLanguage()

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t({ en: 'Search posts', zh: '搜索文章' })}
      aria-haspopup="dialog"
      className={cn(
        'group flex h-9 w-full items-center gap-2.5 rounded-md border border-line bg-page px-3 text-left text-sm text-muted transition-colors hover:border-line-strong',
        className
      )}
    >
      <SearchIcon
        size={15}
        className="shrink-0 text-muted transition-colors group-hover:text-ink"
      />
      <span className="min-w-0 flex-1 truncate">
        {t({ en: 'Search posts…', zh: '搜索文章…' })}
      </span>
      <kbd className="hidden shrink-0 rounded border border-line bg-subtle px-1.5 py-0.5 text-[10px] font-medium text-muted-strong sm:inline-block">
        ⌘K
      </kbd>
    </button>
  )
}
