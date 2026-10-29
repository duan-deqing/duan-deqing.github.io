import config from '../../content/site.yaml'
import SocialIcon from '../shared/SocialIcon'

export default function Hero({ t }) {
  const personal = config.personal || {}
  const socials = config.socialLinks || []

  return (
    <section className="py-14 sm:py-20">
      {personal.avatar ? (
        <div
          aria-hidden="true"
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-subtle text-2xl"
        >
          {personal.avatar}
        </div>
      ) : null}
      <p className="font-mono-ui text-[11px] uppercase tracking-[0.12em] text-accent">
        {t(personal.titlePrefix) ||
          t({ en: 'AI Application Developer', zh: 'AI 应用开发' })}
      </p>
      <h1 className="mt-4 text-[clamp(2.25rem,7vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
        {t(personal.titleName) || 'STYLAN'}
      </h1>
      <p className="mt-5 max-w-[42rem] text-[15px] leading-[1.8] text-muted sm:text-base">
        {t(personal.bio)}
      </p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {(personal.tags || []).map((tag) => (
          <li key={t(tag)} className="tag-chip">
            {t(tag)}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-1">
        {socials.map((social) => (
          <SocialIcon key={social.platform} platform={social.platform} href={social.url} />
        ))}
      </div>
    </section>
  )
}
