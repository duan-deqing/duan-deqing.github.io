import { useState } from 'react'
import config from '@content/site.yaml'
import indexIntroEn from '@content/pages/index.en.md?raw'
import indexIntroZh from '@content/pages/index.zh.md?raw'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/shared/PageTitle'
import RichText from '../components/shared/RichText'
import SiteLink from '../components/site/SiteLink'
import StackButtonGroup from '../components/site/StackButtonGroup'
import WechatDialog from '../components/site/WechatDialog'
import { WechatIcon, platformIcon } from '../components/site/icons'

function SocialLink({ href, label, Icon }) {
  return (
    <SiteLink
      href={href}
      className="social-link text-base text-heading"
    >
      <Icon size={19} className="mr-1 inline-block opacity-75 align-text-bottom" />{label}
    </SiteLink>
  )
}

function WechatSocialLink({ method, t }) {
  const [open, setOpen] = useState(false)
  const label = t(method.label || { en: 'WeChat', zh: '微信' })

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
        <WechatIcon size={19} className="mr-1 inline-block opacity-75 align-text-bottom" />
        {label}
      </button>
      <WechatDialog
        open={open}
        onClose={() => setOpen(false)}
        qrcode={method.qrcode}
        wechatId={method.value}
        alt={label}
      />
    </>
  )
}

export default function HomePage() {
  const { lang, t } = useLanguage()
  const socials = config.socialLinks || []
  const email = config.contact?.email
  const wechat = (config.contactPage?.contactMethods || []).find(
    (method) => method.icon === 'wechat' && method.qrcode
  )

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
            {socials.map((social) => (
              <SocialLink
                key={social.platform}
                href={social.url}
                label={social.platform}
                Icon={platformIcon(social.platform)}
              />
            ))}
            {wechat ? <WechatSocialLink method={wechat} t={t} /> : null}
          </div>
          {email ? (
            <p className="mt-3 text-base leading-[1.75]">
              {t({ en: 'Or mail me at', zh: '或发邮件至' })}{' '}
              <SiteLink
                href={`mailto:${email}`}
                className="link font-mono"
              >
                {email}
              </SiteLink>
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
