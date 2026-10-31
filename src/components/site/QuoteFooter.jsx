import { useState } from 'react'
import quotesConfig from '@content/pages/quotes.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import { cn } from '../../utils/cn'

export default function QuoteFooter({ action, className }) {
  const { t } = useLanguage()
  const quotes = quotesConfig.quotes || []
  const [quote] = useState(() =>
    quotes.length ? quotes[Math.floor(Math.random() * quotes.length)] : null
  )

  return (
    <footer className={cn('mt-12 pb-2 text-center', className)}>
      {action ? <div>{action}</div> : null}
      <hr className={cn('mx-auto w-[50px] border-line', action ? 'mt-8' : 'mt-0')} />
      {quote ? (
        <figure className="mx-auto mt-8 max-w-xl">
          <blockquote className="text-balance text-base italic leading-[1.75] text-muted-strong">
            {t(quote)}
          </blockquote>
          <figcaption className="mt-3 text-xs text-muted">
            {t({ en: 'A thought for today', zh: '今日一句' })}
          </figcaption>
        </figure>
      ) : null}
    </footer>
  )
}
