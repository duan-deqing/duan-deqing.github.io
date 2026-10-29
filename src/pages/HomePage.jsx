import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { getAllPosts } from '../utils/markdown'
import config from '../content/site.yaml'
import PageTitle from '../components/shared/PageTitle'
import ArrowIcon from '../components/shared/ArrowIcon'
import Hero from '../components/HomePage/Hero'
import AboutSection from '../components/HomePage/AboutSection'
import ProjectGrid from '../components/HomePage/ProjectGrid'
import PostRow from '../components/HomePage/PostRow'
import SkillsSection from '../components/HomePage/SkillsSection'
import ContactCta from '../components/HomePage/ContactCta'

function SectionHead({ title, href, linkLabel, t }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink">{title}</h2>
      {href ? (
        <Link
          to={href}
          className="inline-flex items-center gap-1.5 font-mono-ui text-[11px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-accent"
        >
          {linkLabel}
          <ArrowIcon direction="right" size={12} />
        </Link>
      ) : null}
    </div>
  )
}

export default function HomePage() {
  const { lang, t } = useLanguage()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const allPosts = await getAllPosts(lang)
        if (!cancelled) setPosts(allPosts)
      } catch (error) {
        console.error('[HomePage] Failed to load posts:', error)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [lang])

  const projects = (config.projects || []).filter((project) => project.featured !== false)

  return (
    <>
      <PageTitle title={config.site?.pageTitle} description={config.site?.description} t={t} lang={lang} />
      <Hero t={t} />
      <AboutSection t={t} />

      <section className="border-t border-line py-12 sm:py-14">
        <SectionHead
          title={t(config.projectsSection?.title) || t({ en: 'Featured projects', zh: '精选项目' })}
          href="/projects"
          linkLabel={t({ en: 'All projects', zh: '全部项目' })}
          t={t}
        />
        <ProjectGrid projects={projects} t={t} />
      </section>

      {posts.length > 0 ? (
        <section className="border-t border-line py-12 sm:py-14">
          <SectionHead
            title={t({ en: 'Latest writing', zh: '最新文章' })}
            href="/blog"
            linkLabel={t({ en: 'All posts', zh: '全部文章' })}
            t={t}
          />
          <div className="border-t border-line">
            {posts.slice(0, 4).map((post) => (
              <PostRow key={post.slug} post={post} t={t} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="border-t border-line py-12 sm:py-14">
        <SectionHead
          title={t({ en: 'Skills & Technologies', zh: '技能与技术' })}
          href="/skills"
          linkLabel={t({ en: 'Details', zh: '详情' })}
          t={t}
        />
        <SkillsSection t={t} />
      </section>

      <ContactCta t={t} />
    </>
  )
}
