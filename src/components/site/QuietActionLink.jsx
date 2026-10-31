import { cn } from '../../utils/cn'

const BASE =
  'inline-flex items-center gap-1 rounded border border-[#8884] px-2.5 py-1 text-base leading-6 text-ink font-normal no-underline opacity-50 transition-all duration-200 ease-out hover:opacity-100 focus-visible:opacity-100'

export default function QuietActionLink({
  href,
  icon: Icon,
  logo,
  iconSize = 19,
  color,
  external,
  className,
  style,
  children,
  ...props
}) {
  const isExternal = external ?? /^https?:\/\//.test(href)
  const mask = logo ? `url("${logo}")` : null

  return (
    <a
      href={href}
      className={cn(BASE, 'quiet-action-link', className)}
      style={color ? { ...style, '--quiet-action-color': color } : style}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {logo ? (
        <span
          aria-hidden="true"
          className="size-[1.2em] shrink-0 bg-current"
          style={{
            WebkitMaskImage: mask,
            maskImage: mask,
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
        />
      ) : Icon ? (
        <Icon size={iconSize} />
      ) : null}
      {children}
    </a>
  )
}
