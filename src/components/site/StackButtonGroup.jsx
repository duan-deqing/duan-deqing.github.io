import stackConfig from '@content/pages/stack.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import { resolveStackIcon } from '../../utils/projectIcon'
import { cn } from '../../utils/cn'
import QuietActionLink from './QuietActionLink'

const BUTTONS = (stackConfig.buttons || []).filter((button) => button.link)

export default function StackButtonGroup({ className }) {
  const { t } = useLanguage()

  if (!BUTTONS.length) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {BUTTONS.map((button) => (
        <QuietActionLink
          key={button.name}
          href={button.link}
          logo={resolveStackIcon(button.logo)}
          color={button.color}
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
