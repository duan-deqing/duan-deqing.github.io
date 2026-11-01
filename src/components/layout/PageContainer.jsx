import { cn } from '../../utils/cn'

const WIDTHS = {
  narrow: 'max-w-3xl',
  wide: 'max-w-5xl',
  full: '',
}

/**
 * 子页内容容器：统一居中宽度与阶梯入场；宽度只保留三档。
 */
export default function PageContainer({
  width = 'narrow',
  reveal = true,
  className = '',
  children,
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        reveal && 'slide-enter-content',
        WIDTHS[width],
        className
      )}
    >
      {children}
    </div>
  )
}
