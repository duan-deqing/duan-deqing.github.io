import config from '../../content/site.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import SocialIcon from '../shared/SocialIcon'

export default function HomeFooter() {
  const { t } = useLanguage()
  const socials = config.socialLinks || []
  const copyright = config.footer?.copyright || `© ${new Date().getFullYear()} STYLAN`

  return (
    <footer className="mx-auto w-full max-w-[65ch] px-5 pb-6 pt-10 md:px-7">
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-xs text-muted">{copyright}</p>
        <div className="flex items-center gap-1">
          {socials.map((social) => (
            <SocialIcon key={social.platform} platform={social.platform} href={social.url} />
          ))}
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center rounded-md px-2 text-xs text-muted-strong transition-colors hover:bg-subtle hover:text-ink"
          >
            {t({ en: 'RSS', zh: 'RSS' })}
          </a>
        </div>
      </div>
    </footer>
  )
}
