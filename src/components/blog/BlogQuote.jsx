import { useState } from 'react'
import quotesConfig from '../../content/quotes.yaml'
import { useLanguage } from '../../hooks/useLanguage'

export default function BlogQuote() {
  const { t } = useLanguage()
  const quotes = quotesConfig.quotes || []
  const [index] = useState(() =>
    quotes.length ? Math.floor(Math.random() * quotes.length) : 0
  )
  const quote = quotes[index]

  if (!quote) return null

  return (
    <figure className="pointer-events-none absolute inset-0 hidden flex-col items-center justify-center px-10 lg:flex">
      <div className="quote-enter flex flex-col items-center text-center">
        <span aria-hidden="true" className="select-none text-5xl leading-none text-line-strong">
          “
        </span>
        <blockquote className="mt-4 max-w-md text-lg leading-[1.8] text-muted-strong">
          {t(quote)}
        </blockquote>
        <figcaption className="mt-4 text-xs text-muted">
          {t({ en: 'A thought for today', zh: '今日一句' })}
        </figcaption>
      </div>
    </figure>
  )
}
