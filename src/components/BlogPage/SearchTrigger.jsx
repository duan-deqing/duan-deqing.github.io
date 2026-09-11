/**
 * SearchTrigger — 博客页搜索入口按钮
 */

export default function SearchTrigger({ onClick, t, isMac }) {
  const kbd = isMac ? '⌘' : 'Ctrl'

  return (
    <button
      type="button"
      onClick={onClick}
      className="search-trigger"
      aria-label={t({ en: 'Search posts', zh: '搜索文章' })}
    >
      <svg
        className="w-3.5 h-3.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
        />
      </svg>
      <span className="search-trigger-label">
        {t({ en: 'Search posts', zh: '搜索文章' })}
      </span>
      <kbd className="search-trigger-kbd">{kbd} K</kbd>
    </button>
  )
}
