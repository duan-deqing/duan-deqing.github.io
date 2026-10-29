import { Link } from 'react-router-dom'
import config from '../../content/site.yaml'
import ArrowIcon from '../shared/ArrowIcon'

export default function ContactCta({ t }) {
  const contact = config.contact || {}

  return (
    <section className="border-t border-line py-14 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink">
            {t(contact.title) || t({ en: 'Get in touch', zh: '联系我' })}
          </h2>
          <p className="mt-3 text-[15px] leading-[1.75] text-muted">
            {t(contact.description)}
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-page transition-colors hover:bg-accent"
        >
          {t(contact.emailButtonText) || t({ en: 'Contact me', zh: '联系我' })}
          <ArrowIcon direction="right" size={14} />
        </Link>
      </div>
    </section>
  )
}
