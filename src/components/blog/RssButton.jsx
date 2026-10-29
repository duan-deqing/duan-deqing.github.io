import { useLanguage } from '../../hooks/useLanguage'
import Button from '../site/Button'
import { RadioIcon } from '../site/icons'

export default function RssButton({ className, size = 'sm' }) {
  const { t } = useLanguage()

  return (
    <Button
      as="a"
      variant="outline"
      size={size}
      href="/rss.xml"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <RadioIcon size={15} />
      {t({ en: 'RSS feed', zh: 'RSS 订阅' })}
    </Button>
  )
}
