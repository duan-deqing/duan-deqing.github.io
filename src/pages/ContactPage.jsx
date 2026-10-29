import { useState } from 'react'
import config from '../content/site.yaml'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'
import Button from '../components/site/Button'
import WechatDialog from '../components/contact/WechatDialog'
import {
  ArrowUpRightIcon,
  BilibiliIcon,
  DownloadIcon,
  GitHubIcon,
  MailIcon,
  WechatIcon,
} from '../components/site/icons'

const ICONS = {
  email: MailIcon,
  github: GitHubIcon,
  bilibili: BilibiliIcon,
  wechat: WechatIcon,
}

export default function ContactPage() {
  const { lang, t } = useLanguage()
  const page = config.contactPage || {}
  const email = config.contact?.email
  const methods = page.contactMethods || []
  const [wechat, setWechat] = useState(null)

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageTitle
        title={`STYLAN · ${t({ en: 'Contact', zh: '联系' })}`}
        description={page.description}
        t={t}
        lang={lang}
      />
      <PageHeading
        title={t(page.title || { en: 'Contact', zh: '联系' })}
        description={t(page.description || '')}
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {email ? (
          <Button as="a" href={`mailto:${email}`}>
            <MailIcon size={15} />
            {t({ en: 'Email me', zh: '发送邮件' })}
          </Button>
        ) : null}
        <Button as="a" variant="outline" href="/resume.pdf" download>
          <DownloadIcon size={15} />
          {t({ en: 'Resume', zh: '简历' })}
        </Button>
      </div>

      <div className="border-t border-line">
        {methods.map((method) => {
          const Icon = ICONS[method.icon] || MailIcon
          const label = t(method.label)
          const content = (
            <>
              <span className="flex min-w-0 items-center gap-2">
                <Icon size={16} className="shrink-0 text-muted" />
                <span className="font-medium text-heading">{label}</span>
                <span className="truncate text-sm text-muted">{method.value}</span>
              </span>
              <ArrowUpRightIcon size={14} className="shrink-0 text-muted" />
            </>
          )

          if (method.href) {
            return (
              <a
                key={label}
                href={method.href}
                target={method.href.startsWith('http') ? '_blank' : undefined}
                rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center justify-between gap-4 border-b border-line py-4 text-sm transition-colors hover:text-accent"
              >
                {content}
              </a>
            )
          }

          return (
            <button
              key={label}
              type="button"
              onClick={() => setWechat(method)}
              className="flex w-full items-center justify-between gap-4 border-b border-line py-4 text-left text-sm transition-colors hover:text-accent"
            >
              {content}
            </button>
          )
        })}
      </div>

      <WechatDialog
        open={Boolean(wechat)}
        onClose={() => setWechat(null)}
        qrcode={wechat?.qrcode}
        alt={wechat ? t(wechat.label) : 'WeChat'}
      />
    </div>
  )
}
