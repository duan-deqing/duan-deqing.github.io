import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import config from '../content/site.yaml'
import { useLanguage } from '../hooks/useLanguage'
import { getAllPosts } from '../utils/markdown'
import { groupPostsByYear } from '../utils/postGroups'
import { formatDate } from '../utils/postFormat'
import PageTitle from '../components/shared/PageTitle'
import SiteLink from '../components/site/SiteLink'
import {
  ArrowUpRightIcon,
  BilibiliIcon,
  GitHubIcon,
  MailIcon,
  RssIcon,
} from '../components/site/icons'

function SocialLink({ href, label, Icon }) {
  return (
    <SiteLink
      href={href}
      className="inline-flex items-center gap-2 text-sm text-muted-strong transition-colors hover:text-ink"
    >
      <Icon />
      {label}
    </SiteLink>
  )
}

export default function HomePage() {
  const { lang, t } = useLanguage()
  const [posts, setPosts] = useState([])
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    getAllPosts(lang)
      .then((value) => {
        if (!cancelled) setPosts(value)
      })
      .catch((error) => {
        console.error('[HomePage] Failed to load posts:', error)
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [lang])

  const groups = useMemo(() => groupPostsByYear(posts.slice(0, 5)), [posts])
  const focus = (config.about?.focus || []).map((item) => t(item))
  const socials = config.socialLinks || []
  const email = config.contact?.email

  return (
    <>
      <PageTitle
        title={config.site?.pageTitle}
        description={config.site?.description}
        t={t}
        lang={lang}
      />

      <div className="slide-enter-content">
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
                <a className="link" href={`mailto:${email}`}>{email}</a>.
              </>
            ),
            zh: (
              <>
                我在<Link className="link" to="/blog">博客</Link>里记录 AI 产品的构建，
                欢迎通过<Link className="link" to="/contact">联系页</Link>或{' '}
                <a className="link" href={`mailto:${email}`}>{email}</a> 找我。
              </>
            ),
          })}
        </p>

        <div className="mt-10">
          <p className="mb-3 text-sm text-muted">
            {t({ en: 'Find me on', zh: '在这些地方找到我' })}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {socials.map((social) => (
              <SocialLink
                key={social.platform}
                href={social.url}
                label={social.platform}
                Icon={social.platform.toLowerCase().includes('github') ? GitHubIcon : BilibiliIcon}
              />
            ))}
            {email ? <SocialLink href={`mailto:${email}`} label="Email" Icon={MailIcon} /> : null}
            <SocialLink href="/rss.xml" label="RSS" Icon={RssIcon} />
          </div>
        </div>

        <hr className="my-10 border-line" />

        <section aria-labelledby="home-writing">
          <div className="mb-2 flex items-center justify-between gap-4">
            <h2
              id="home-writing"
              className="text-lg font-semibold tracking-tight text-heading md:text-xl"
            >
              {t({ en: 'Writing', zh: '写作' })}
            </h2>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm text-muted-strong transition-colors hover:text-ink"
            >
              {t({ en: 'All posts', zh: '全部文章' })}
              <ArrowUpRightIcon size={14} />
            </Link>
          </div>

          {failed ? (
            <p className="py-6 text-sm text-muted">
              {t({ en: 'Unable to load posts.', zh: '文章加载失败。' })}
            </p>
          ) : groups.length === 0 ? (
            <p className="py-6 text-sm text-muted">
              {t({ en: 'Nothing here yet.', zh: '暂无文章。' })}
            </p>
          ) : (
            groups.map((group) => (
              <div key={group.year}>
                <div className="relative h-16" aria-hidden="true">
                  <span className="year-mark">{group.year}</span>
                </div>
                <ul>
                  {group.posts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="flex items-baseline justify-between gap-4 border-b border-line py-3 text-base text-ink transition-colors hover:text-accent"
                      >
                        <span>{t(post.title)}</span>
                        <time
                          dateTime={post.date}
                          className="shrink-0 text-sm tabular-nums text-muted"
                        >
                          {formatDate(post.date, t)}
                        </time>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>
      </div>
    </>
  )
}
