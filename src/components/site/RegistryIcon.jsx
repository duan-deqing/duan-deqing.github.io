import { cn } from '../../utils/cn'
import { resolveIcon } from '../../utils/icons'

export default function RegistryIcon({ name, size = 16, className = '' }) {
  const src = resolveIcon(name)
  if (!src) return null

  return (
    <span
      className={cn('registry-icon', className)}
      style={{ width: size, height: size, '--registry-icon': `url("${src}")` }}
      aria-hidden="true"
    />
  )
}
