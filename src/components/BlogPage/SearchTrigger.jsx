export default function SearchTrigger({ onClick, t, isMac }) {
  const kbd = isMac ? '⌘' : 'Ctrl'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t({ en: 'Search posts', zh: '搜索文章' })}
      className="inline-flex h-8 items-center gap-2 rounded-md border border-line px-2.5 text-[11px] text-muted transition-colors hover:border-ink/25 hover:text-ink"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
      </svg>
      <span className="hidden sm:inline">{t({ en: 'Search posts', zh: '搜索文章' })}</span>
      <kbd className="font-mono-ui text-[10px] tracking-wider">{kbd} K</kbd>
    </button>
  )
}
