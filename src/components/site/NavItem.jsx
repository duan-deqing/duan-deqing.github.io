import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { ArrowUpRightIcon } from './icons'

const BASE = 'flex w-full items-center justify-between gap-2 rounded-lg p-2 text-sm transition-colors'

export default function NavItem({
  href,
  label,
  Icon,
  active = false,
  shortcut,
  external = false,
  showArrow = external,
  onNavigate,
  onClick,
  hasPopup,
}) {
  const inner = (
    <>
      <span className="flex min-w-0 items-center gap-2">
        <Icon size={16} className="shrink-0" />
        <span className={cn('truncate font-medium', active && 'text-active-fg')}>{label}</span>
      </span>
      {showArrow ? (
        <ArrowUpRightIcon size={14} className="shrink-0 opacity-70" />
      ) : shortcut ? (
        <span
          className={cn(
            'grid size-5 shrink-0 place-content-center rounded border text-[11px] font-medium',
            active
              ? 'border-transparent bg-active-fg/15 text-active-fg'
              : 'border-line bg-subtle text-muted-strong'
          )}
          aria-hidden="true"
        >
          {shortcut}
        </span>
      ) : null}
    </>
  )

  const className = cn(
    BASE,
    active ? 'bg-active text-active-fg' : 'text-ink hover:bg-hover'
  )

  if (typeof onClick === 'function' && !href) {
    return (
      <button
        type="button"
        className={className}
        onClick={onClick}
        aria-haspopup={hasPopup || undefined}
      >
        {inner}
      </button>
    )
  }

  if (external) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={className}
        onClick={onNavigate}
      >
        {inner}
      </a>
    )
  }

  return (
    <Link to={href} className={className} aria-current={active ? 'page' : undefined} onClick={onNavigate}>
      {inner}
    </Link>
  )
}
