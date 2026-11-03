import { cn } from '../../utils/cn'

export const ICON_BUTTON_CLASS =
  'inline-flex h-8 items-center justify-center gap-1.5 rounded-none px-1 text-sm text-ink opacity-60 transition-opacity hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:opacity-30'

export default function IconButton({
  label,
  title,
  onClick,
  disabled = false,
  active = false,
  className = '',
  children,
}) {
  return (
    <button
      type="button"
      className={cn(ICON_BUTTON_CLASS, active && 'opacity-100', className)}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={title || label}
      aria-pressed={active || undefined}
    >
      {children}
    </button>
  )
}
