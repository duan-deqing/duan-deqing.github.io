import { Link, useLocation } from 'react-router-dom'
import config from '../../content/site.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import NavItem from './NavItem'
import {
  BilibiliIcon,
  FolderIcon,
  GitHubIcon,
  HomeIcon,
  MailIcon,
  PenIcon,
  RssIcon,
  SparklesIcon,
} from './icons'

export const NAV_ITEMS = [
  { href: '/', label: { en: 'Home', zh: '首页' }, Icon: HomeIcon },
  { href: '/projects', label: { en: 'Projects', zh: '项目' }, Icon: FolderIcon },
  { href: '/blog', label: { en: 'Blog', zh: '博客' }, Icon: PenIcon },
  { href: '/skills', label: { en: 'Skills', zh: '技能' }, Icon: SparklesIcon },
  { href: '/contact', label: { en: 'Contact', zh: '联系' }, Icon: MailIcon },
]

const SECTIONS_LABEL = { en: 'Sections', zh: '分区' }
const ONLINE_LABEL = { en: 'Online', zh: '在线' }

export function isNavActive(pathname, href) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function MenuContent({ onNavigate }) {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const name = t(config.personal.name)
  const role = t(config.personal.tags?.[0] || '')
  const email = config.contact?.email
  const socials = config.socialLinks || []
  const avatar = config.personal.avatar

  const online = [
    ...socials.map((social) => ({
      href: social.url,
      label: social.platform,
      Icon: social.platform.toLowerCase().includes('github') ? GitHubIcon : BilibiliIcon,
    })),
    ...(email ? [{ href: `mailto:${email}`, label: 'Email', Icon: MailIcon }] : []),
    { href: '/rss.xml', label: 'RSS', Icon: RssIcon },
  ]

  return (
    <div className="flex w-full flex-col gap-4 text-sm">
      <Link
        to="/"
        className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-hover"
        onClick={onNavigate}
      >
        {typeof avatar === 'string' && avatar.startsWith('/') ? (
          <img
            src={avatar}
            alt={name}
            width={40}
            height={40}
            loading="lazy"
            className="size-10 rounded-full border border-line object-cover"
          />
        ) : (
          <span className="grid size-10 place-items-center rounded-full border border-line bg-page text-lg">
            {avatar || name.slice(0, 1)}
          </span>
        )}
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-semibold tracking-tight text-heading">{name}</span>
          <span className="truncate text-muted-strong">{role}</span>
        </span>
      </Link>

      <nav aria-label={t(SECTIONS_LABEL)} className="flex flex-col gap-1">
        {NAV_ITEMS.map((item, index) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={t(item.label)}
            Icon={item.Icon}
            active={isNavActive(pathname, item.href)}
            shortcut={index + 1}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <hr className="border-line" />

      <div className="flex flex-col gap-2">
        <span className="px-2 text-xs font-medium text-muted">{t(ONLINE_LABEL)}</span>
        <div className="flex flex-col gap-1">
          {online.map((item) => (
            <NavItem
              key={item.href + item.label}
              href={item.href}
              label={item.label}
              Icon={item.Icon}
              external
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
