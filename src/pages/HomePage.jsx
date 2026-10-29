import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import config from '../content/site.yaml'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/shared/PageTitle'
import SiteLink from '../components/site/SiteLink'
import {
  ArrowUpRightIcon,
  WechatIcon,
  platformIcon,
} from '../components/site/icons'

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
  const wrapperRef = useRef(null)
  const label = t(method.label || { en: 'WeChat', zh: '微信' })
  const qrLabel = t({ en: 'WeChat QR code', zh: '微信二维码' })

  const closeIfOutside = (event) => {
    if (!wrapperRef.current?.contains(event.relatedTarget)) setOpen(false)
  }

  return (
    <span
      ref={wrapperRef}
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="social-link text-base text-heading"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
        onFocus={() => setOpen(true)}
        onBlur={closeIfOutside}
      >
        <WechatIcon size={19} className="mr-1 inline-block opacity-75 align-text-bottom" />
        {label}
      </button>
      {open ? (
        <span
          role="dialog"
          aria-label={qrLabel}
          className="absolute left-0 top-full z-20 mt-2 block w-48 rounded-lg border border-line bg-page p-2 shadow-xl max-sm:bottom-full max-sm:top-auto max-sm:mb-2 max-sm:mt-0"
        >
          <img
            src={method.qrcode}
            alt={qrLabel}
            width={176}
            height={176}
            loading="lazy"
            decoding="async"
            className="h-44 w-44 rounded-md object-contain"
          />
        </span>
      ) : null}
    </span>
  )
}

export default function HomePage() {
  const { lang, t } = useLanguage()
  const focus = (config.about?.focus || []).map((item) => t(item))
  const socials = config.socialLinks || []
  const email = config.contact?.email
  const wechat = (config.contactPage?.contactMethods || []).find(
    (method) => method.icon === 'wechat' && method.qrcode
  )
  const skills = (config.skills || []).filter((group) => {
    const label = `${group.category?.en || ''} ${group.category?.zh || ''}`.toLowerCase()
    return !label.includes('hobbies') && !label.includes('爱好')
  })

  return (
    <>
      <PageTitle
        title={config.site?.pageTitle}
        description={config.site?.description}
        t={t}
        lang={lang}
      />

      <h1 className="sr-only">{t(config.personal.name)}</h1>

      <div key={lang} className="home-body-text home-links-bold slide-enter-content">
        <p className="mb-6 text-base leading-[1.75]">
          {t({ en: "Hey, I'm ", zh: '你好，我是 ' })}
          <strong className="font-semibold text-heading">{t(config.personal.name)}</strong>
          {t({ en: '. ', zh: '。' })}
          {t(config.personal.bio)}
        </p>

        <p className="mb-6 text-base leading-[1.75]">
          {t({
            en: (
              <>
                I focus on {focus.join(' · ')}. See my{' '}
                <Link className="link" to="/projects">projects</Link> and{' '}
                <Link className="link" to="/skills">skills</Link>.
              </>
            ),
            zh: (
              <>
                我专注于 {focus.join(' · ')}。查看我的{' '}
                <Link className="link" to="/projects">项目</Link>与{' '}
                <Link className="link" to="/skills">技能</Link>。
              </>
            ),
          })}
        </p>

        <p className="mb-6 text-base leading-[1.75]">
          {t({
            en: (
              <>
                I write about building AI products in my{' '}
                <Link className="link" to="/blog">blog</Link>. Say hi via{' '}
                <Link className="link" to="/contact">contact</Link> or{' '}
                <SiteLink className="link" href={`mailto:${email}`}>{email}</SiteLink>.
              </>
            ),
            zh: (
              <>
                我在<Link className="link" to="/blog">博客</Link>里记录 AI 产品的构建，
                欢迎通过<Link className="link" to="/contact">联系页</Link>或{' '}
                <SiteLink className="link" href={`mailto:${email}`}>{email}</SiteLink> 找我。
              </>
            ),
          })}
        </p>

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

          <ul className="flex list-disc flex-col gap-0.5 pl-6">
            {skills.map((group) => (
              <li
                key={group.category?.en || t(group.category)}
                className="marker:text-[var(--code-line)] leading-[1.75]"
              >
                <Link to="/skills" className="stack-link">
                  {t(group.category)}
                  <ArrowUpRightIcon size={14} className="ml-1 inline-block align-text-bottom" />
                </Link>
                <span className="text-muted"> — {(group.items || []).join(' · ')}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
