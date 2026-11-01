import { useEffect, useState } from 'react'
import config from '@content/site.yaml'
import indexIntroEn from '@content/home/index.en.md?raw'
import indexIntroZh from '@content/home/index.zh.md?raw'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/ui/PageTitle'
import RichText from '../components/ui/RichText'
import RegistryIcon from '../components/ui/RegistryIcon'
import SiteLink from '../components/layout/SiteLink'
import StackButtonGroup from '../components/ui/StackButtonGroup'
import WechatDialog from '../components/ui/dialogs/WechatDialog'
import { CheckIcon } from '../components/ui/icons'

function SocialLink({ href, label, icon }) {
  return (
    <SiteLink
      href={href}
      className="social-link text-base text-heading"
    >
      <RegistryIcon
        name={icon}
        size={19}
        className="mr-1 inline-block opacity-75 align-text-bottom"
      />
      {label}
    </SiteLink>
  )
}

function WechatSocialLink({ contact, t }) {
  const [open, setOpen] = useState(false)
  const label = t(contact.label || { en: 'WeChat', zh: '微信' })

  return (
    <>
      <button
        type="button"
        className="social-link cursor-pointer text-base text-heading"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <RegistryIcon
          name="wechat"
          size={19}
          className="mr-1 inline-block opacity-75 align-text-bottom"
        />
        {label}
      </button>
      <WechatDialog
        open={open}
        onClose={() => setOpen(false)}
        qrcode={contact.qrcode}
        wechatId={contact.value}
        alt={label}
      />
    </>
  )
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  }
}

function EmailCopyLink({ value, t }) {
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)
  const label = copied
    ? t({ en: 'Copied', zh: '已复制' })
    : t({ en: 'Click to copy', zh: '点击复制' })

  useEffect(() => {
    if (!copied) return undefined
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  function handleCopy() {
    setCopied(true)
    copyText(value)
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        onClick={handleCopy}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="link cursor-pointer font-mono"
      >
        {value}
      </button>
      {hovered || copied ? (
        <span className="home-icon-tooltip home-email-tooltip" aria-hidden="true">
          {copied ? <CheckIcon size={12} className="mr-1 shrink-0" /> : null}
          {label}
        </span>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {copied ? t({ en: 'Email copied', zh: '邮箱已复制' }) : ''}
      </span>
    </span>
  )
}

export default function HomePage() {
  const { lang, t } = useLanguage()
  const contacts = config.contacts || []
  const email = contacts.find((item) => item.icon === 'email')
  const links = contacts.filter((item) => item.icon !== 'email')

  return (
    <>
      <PageTitle
        title={config.site?.pageTitle}
        description={config.site?.description}
        t={t}
        lang={lang}
      />

      <div key={lang} className="home-body-text home-links-bold slide-enter-content">
        <h1 className="home-name mb-8">{t(config.personal.name)}</h1>

        <RichText content={lang === 'zh' ? indexIntroZh : indexIntroEn} />

        <hr className="home-divider" />

        <div>
          <p className="text-base leading-[1.75]">
            {t({ en: 'Find me on', zh: '在这些地方找到我' })}
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            {links.map((item, index) => {
              const key = `${item.icon}-${item.href || item.value || index}`
              if (item.icon === 'wechat' && item.qrcode) {
                return <WechatSocialLink key={key} contact={item} t={t} />
              }
              if (!item.href) return null
              return (
                <SocialLink
                  key={key}
                  href={item.href}
                  label={t(item.label)}
                  icon={item.icon}
                />
              )
            })}
          </div>
          {email?.value ? (
            <p className="mt-3 text-base leading-[1.75]">
              {t({ en: 'Or mail me at', zh: '或发邮件至' })}{' '}
              <EmailCopyLink value={email.value} t={t} />
            </p>
          ) : null}
        </div>

        <hr className="home-divider" />

        <section aria-label={t({ en: 'Stack', zh: '技术栈' })}>
          <p className="mb-4 text-base leading-[1.75] text-ink">
            {t({
              en: 'Tools and technologies I use to build and ship AI products.',
              zh: '我用来构建与交付 AI 产品的工具与技术。',
            })}
          </p>

          <StackButtonGroup />
        </section>
      </div>
    </>
  )
}
