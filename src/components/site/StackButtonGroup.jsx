import stackConfig from '@content/stack/stack.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import { resolveIconEntry } from '../../utils/icons'
import { cn } from '../../utils/cn'
import QuietActionLink from './QuietActionLink'

const BUTTONS = (stackConfig.buttons || [])
  .map((button) => ({ ...button, entry: resolveIconEntry(button.logo) }))
  .filter((button) => button.entry?.link)

export default function StackButtonGroup({ className }) {
  const { t } = useLanguage()

  if (!BUTTONS.length) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {BUTTONS.map((button) => (
        <QuietActionLink
          key={button.name}
          href={button.entry.link}
          logo={button.entry.src}
          color={button.entry.color}
          aria-label={t({
            en: `${button.name} official site`,
            zh: `${button.name} 官网`,
          })}
        >
          {button.name}
        </QuietActionLink>
      ))}
    </div>
  )
}
