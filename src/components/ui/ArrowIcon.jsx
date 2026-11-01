/**
 * ArrowIcon — 统一箭头 SVG
 * direction: 'right' | 'down' | 'left' | 'up-right'
 */

const paths = {
  right: 'M5 12h14M13 6l6 6-6 6',
  left: 'M19 12H5M11 18l-6-6 6-6',
  down: 'M12 5v14M6 13l6 6 6-6',
  'up-right': 'M7 17L17 7M9 7h8v8',
}

export default function ArrowIcon({
  direction = 'right',
  size = 16,
  className = '',
  strokeWidth = 1.75,
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[direction] || paths.right} />
    </svg>
  )
}
