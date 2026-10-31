import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

export default function ParentLink({ to, label, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-sm text-ink',
        className
      )}
    >
      <span aria-hidden="true" className="opacity-50">
        &gt;
      </span>
      <Link
        to={to}
        aria-label={label}
        className="link opacity-50 hover:opacity-75 focus-visible:opacity-75"
      >
        cd ..
      </Link>
    </span>
  )
}
