import { Link } from 'react-router-dom'
import config from '../content/site.yaml'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/shared/PageTitle'
import SiteLink from '../components/site/SiteLink'
import {
  ArrowUpRightIcon,
  BilibiliIcon,
  GitHubIcon,
  RssIcon,
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

export default function HomePage() {
  const { lang, t } = useLanguage()
  const focus = (config.about?.focus || []).map((item) => t(item))
  const socials = config.socialLinks || []
  const email = config.contact?.email
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

      <div className="home-body-text home-links-bold slide-enter-content">
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
                Icon={social.platform.toLowerCase().includes('github') ? GitHubIcon : BilibiliIcon}
              />
            ))}
            <SocialLink href="/rss.xml" label="RSS" Icon={RssIcon} />
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

        <section aria-labelledby="home-stack">
          <h2
            id="home-stack"
            className="text-lg font-semibold tracking-tight text-heading md:text-xl"
          >
            {t({ en: 'Stack', zh: '技术栈' })}
          </h2>
          <p className="mb-4 mt-2 text-base leading-[1.75] text-ink">
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
