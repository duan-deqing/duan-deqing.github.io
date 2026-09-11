/**
 * HomePage — 右栏：About 起，Work / Writing / Skills / Contact
 * 左栏身份信息见 SiteRail（原 Hero）
 */

import { useState, useEffect } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { getAllPosts } from '../utils/markdown'
import SiteLayout from '../components/shared/SiteLayout'
import About from '../components/HomePage/About'
import Projects from '../components/HomePage/Projects'
import BlogSection from '../components/HomePage/BlogSection'
import Skills from '../components/HomePage/Skills'
import Contact from '../components/HomePage/Contact'
import Reveal from '../components/shared/Reveal'
import config from '../config'

/** 移动端身份区（桌面由左栏承担） */
function MobileIntro({ t }) {
  return (
    <section className="lg:hidden pt-8 pb-10 border-b border-line">
      <p
        className="font-mono-ui text-[11px] tracking-[0.14em] uppercase"
        style={{ color: 'var(--accent)' }}
      >
        {t(config.personal?.titlePrefix)}
      </p>
      <h1
        className="mt-3 font-display font-semibold text-ink leading-[0.95] tracking-tight"
        style={{ fontSize: 'clamp(2.5rem, 12vw, 3.5rem)' }}
      >
        {t(config.personal?.titleName) || 'STYLAN'}
      </h1>
      <div
        className="mt-5 h-px w-12"
        style={{ background: 'var(--accent)' }}
        aria-hidden
      />
      <p className="mt-5 text-[15px] text-muted leading-[1.75] max-w-prose">
        {t(config.personal?.bio)}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {(config.personal?.tags || []).map((tag) => (
          <span key={t(tag)} className="tag-chip">
            {t(tag)}
          </span>
        ))}
      </div>
    </section>
  )
}

function HomePage() {
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

  return (
    <SiteLayout t={t} lang={lang} showFooter={false}>
      <MobileIntro t={t} />
      <Reveal>
        <About t={t} />
      </Reveal>
      <Reveal>
        <Projects t={t} />
      </Reveal>
      <Reveal>
        <BlogSection posts={posts} t={t} />
      </Reveal>
      <Reveal>
        <Skills t={t} />
      </Reveal>
      <Reveal>
        <Contact t={t} />
      </Reveal>
    </SiteLayout>
  )
}

export default HomePage
