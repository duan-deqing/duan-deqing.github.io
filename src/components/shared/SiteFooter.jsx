import config from '../../content/site.yaml'
import SocialIcon from './SocialIcon'

export default function SiteFooter() {
  const socials = config.socialLinks || []

  return (
    <footer className="mt-auto border-t border-line">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-8">
        <p className="font-mono-ui text-[11px] tracking-wider text-muted">
          {config.footer?.copyright || `© ${new Date().getFullYear()} STYLAN`}
        </p>
        <div className="flex items-center gap-1">
          {socials.map((social) => (
            <SocialIcon key={social.platform} platform={social.platform} href={social.url} />
          ))}
        </div>
      </div>
    </footer>
  )
}
