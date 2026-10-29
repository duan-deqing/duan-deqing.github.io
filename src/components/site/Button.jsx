import { cn } from '../../utils/cn'

const VARIANTS = {
  primary: 'bg-active text-active-fg hover:opacity-90',
  outline: 'border border-line bg-page text-ink shadow-xs hover:bg-subtle dark:shadow-none',
  ghost: 'text-ink hover:bg-subtle',
  link: 'text-ink underline-offset-4 hover:underline',
}

const SIZES = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-9 px-4 text-sm',
  icon: 'size-9',
}

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  className,
  type,
  ...props
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.primary
  const sizeClass = SIZES[size] || SIZES.md

  return (
    <Comp
      type={Comp === 'button' ? type || 'button' : type}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        variantClass,
        sizeClass,
        className
      )}
      {...props}
    />
  )
}
