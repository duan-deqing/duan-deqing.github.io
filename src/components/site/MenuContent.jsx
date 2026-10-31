import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import config from '@content/site.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import { cn } from '../../utils/cn'
import NavItem from './NavItem'
import WechatDialog from './WechatDialog'
import {
  ArrowUpRightIcon,
  BilibiliIcon,
  BookmarkIcon,
  CheckIcon,
  CodeIcon,
  CopyIcon,
  FolderIcon,
  GitHubIcon,
  HomeIcon,
  MailIcon,
  PenIcon,
  WechatIcon,
  platformIcon,
} from './icons'

const NAV_ICONS = {
  '/': HomeIcon,
  '/projects': FolderIcon,
  '/blog': PenIcon,
  '/stack': CodeIcon,
  '/bookmarks': BookmarkIcon,
}

const CONTACT_ICONS = {
  email: MailIcon,
  github: GitHubIcon,
  bilibili: BilibiliIcon,
  wechat: WechatIcon,
}

// 与首页壳共用 config.navLinks；Home 固定置顶，图标按 href 映射
export const NAV_ITEMS = [
  { href: '/home', label: { en: 'Home', zh: '首页' }, Icon: HomeIcon },
  ...(config.navLinks || [])
    .filter((link) => link.href !== '/')
    .map((link) => ({
      href: link.href,
      label: link.label,
      Icon: NAV_ICONS[link.href] || FolderIcon,
    })),
]

const SECTIONS_LABEL = { en: 'Sections', zh: '分区' }
const ONLINE_LABEL = { en: 'Online', zh: '在线' }

function normalizeUrl(value) {
  return String(value || '').replace(/\/+$/, '')
}

export function isNavActive(pathname, href) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function MenuContent({ onNavigate }) {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const [wechat, setWechat] = useState(null)
  const [emailOpen, setEmailOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const emailRef = useRef(null)
  const emailFrontRef = useRef(null)
  const emailCopyRef = useRef(null)
  const emailPanelId = useId()
  const name = t(config.personal.name)
  const role = t(config.personal.tags?.[0] || '')
  const socials = config.socialLinks || []
  const methods = config.contactPage?.contactMethods || []
  const avatar = config.personal.avatar
  const linkedUrls = new Set(
    methods.filter((method) => method.href).map((method) => normalizeUrl(method.href))
  )
  const extraSocials = socials
    .filter((social) => !linkedUrls.has(normalizeUrl(social.url)))
    .map((social) => ({
      href: social.url,
      label: social.platform,
      Icon: platformIcon(social.platform),
    }))

  useEffect(() => {
    setEmailOpen(false)
    setCopied(false)
  }, [pathname])

  useEffect(() => {
    if (!emailOpen) return undefined
    const frame = requestAnimationFrame(() => emailCopyRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [emailOpen])

  useEffect(() => {
    if (!emailOpen) return undefined
    function onPointerDown(event) {
      if (emailRef.current && !emailRef.current.contains(event.target)) {
        setEmailOpen(false)
      }
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') closeEmail()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [emailOpen])

  useEffect(() => {
    if (!copied) return undefined
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  function closeEmail() {
    setEmailOpen(false)
    requestAnimationFrame(() => emailFrontRef.current?.focus())
  }

  async function copyEmail(value) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mobile-menu-content flex w-full flex-col gap-4 text-sm">
      <Link
        to="/"
        aria-label={t({ en: 'STYLAN homepage', zh: 'STYLAN 首页' })}
        className="menu-avatar flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-hover"
        onClick={onNavigate}
      >
        {typeof avatar === 'string' &&
        (avatar.startsWith('/') || avatar.startsWith('http')) ? (
          <img
            src={avatar}
            alt={name}
            width={40}
            height={40}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
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
        <span className="menu-online-label px-2 text-xs font-medium text-muted">{t(ONLINE_LABEL)}</span>
        <div className="menu-online-list flex flex-col gap-1">
          {methods.map((method) => {
            const Icon = CONTACT_ICONS[method.icon] || MailIcon
            if (method.icon === 'email' && method.value) {
              return (
                <div key={`contact-${method.icon}`} ref={emailRef}>
                  <div className={cn('online-email-stack', emailOpen && 'is-open')}>
                    <button
                      ref={emailFrontRef}
                      type="button"
                      aria-expanded={emailOpen}
                      aria-controls={emailPanelId}
                      inert={emailOpen ? true : undefined}
                      onClick={() => setEmailOpen((value) => !value)}
                      className="online-email-layer online-email-front flex items-center justify-between gap-2 rounded-lg p-2 text-sm text-ink hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <Icon size={16} className="shrink-0" />
                        <span className="truncate font-medium">{t(method.label)}</span>
                      </span>
                      <ArrowUpRightIcon size={14} className="shrink-0 opacity-70" />
                    </button>
                    <div
                      id={emailPanelId}
                      inert={!emailOpen ? true : undefined}
                      className="online-email-layer online-email-back flex items-center gap-1.5 rounded-lg bg-subtle px-2 py-1"
                    >
                      <button
                        type="button"
                        onClick={closeEmail}
                        title={t({ en: 'Hide email', zh: '收起邮箱' })}
                        className="min-w-0 flex-1 truncate text-left font-mono text-[11px] leading-4 text-heading"
                      >
                        {method.value}
                      </button>
                      <button
                        ref={emailCopyRef}
                        type="button"
                        onClick={() => copyEmail(method.value)}
                        aria-label={
                          copied
                            ? t({ en: 'Copied', zh: '已复制' })
                            : t({ en: 'Copy email', zh: '复制邮箱' })
                        }
                        title={
                          copied
                            ? t({ en: 'Copied', zh: '已复制' })
                            : t({ en: 'Copy email', zh: '复制邮箱' })
                        }
                        className="grid size-7 shrink-0 place-items-center rounded-md border border-line bg-page text-ink transition-colors hover:bg-hover"
                      >
                        {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
                      </button>
                    </div>
                  </div>
                  <span className="sr-only" aria-live="polite">
                    {copied
                      ? t({ en: 'Email copied', zh: '邮箱已复制' })
                      : emailOpen
                        ? t({
                            en: `Email address: ${method.value}`,
                            zh: `邮箱地址：${method.value}`,
                          })
                        : ''}
                  </span>
                </div>
              )
            }
            if (method.icon === 'wechat' && method.qrcode) {
              return (
                <NavItem
                  key={`contact-${method.icon}`}
                  label={t(method.label)}
                  Icon={Icon}
                  onClick={() => setWechat(method)}
                  hasPopup="dialog"
                  showArrow
                />
              )
            }
            if (!method.href) return null
            return (
              <NavItem
                key={`contact-${method.icon}-${method.href}`}
                href={method.href}
                label={t(method.label)}
                Icon={Icon}
                external
                onNavigate={onNavigate}
              />
            )
          })}
          {extraSocials.map((item) => (
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

      <WechatDialog
        open={Boolean(wechat)}
        onClose={() => setWechat(null)}
        qrcode={wechat?.qrcode}
        wechatId={wechat?.value}
        alt={wechat ? t(wechat.label) : 'WeChat'}
      />
    </div>
  )
}
