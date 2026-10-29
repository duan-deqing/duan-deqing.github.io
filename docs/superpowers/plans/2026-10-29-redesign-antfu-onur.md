# 个人站重构（antfu × onur）实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有个人站重构为居中单列、低饱和项目卡片网格 + onur 式博客排版，并把移动端 Lighthouse 性能从 73 提升到 90 以上。

**Architecture:** 保留 React 19 + React Router 7 + Tailwind 4 + Vite 8 与 YAML/Markdown 内容源，重写表现层：全局顶部导航 + 72rem 单列容器；删除左轨、启动 Loading 门禁、Web 字体与重型动效；首页静态导入，子页懒加载。

**Tech Stack:** React 19、React Router 7、Tailwind CSS 4（`@theme` + CSS 变量）、Vite 8、react-markdown、rehype-highlight、node:test。

**Spec:** `docs/superpowers/specs/2026-10-29-redesign-antfu-onur-design.md`

## Global Constraints

- 分支：`redesign/antfu-onur`，不要 push、不要合并 main（另行确认）。
- 不新增运行时依赖；不引入新框架；不加重型动画（仅 150ms 颜色/边框过渡）。
- 字体只使用系统字体栈，删除 Google Fonts `@import` 与所有 `@font-face` 引用。
- 颜色令牌（逐字使用）：
  - Light：`--bg #FAFAF9`、`--bg-elevated #FFFFFF`、`--bg-subtle #F4F4F2`、`--ink #18181B`、`--ink-muted #71717A`、`--line #E7E5E4`、`--accent #2563EB`
  - Dark：`--bg #0E0E10`、`--bg-elevated #17171A`、`--bg-subtle #1D1D20`、`--ink #ECECEE`、`--ink-muted #A1A1AA`、`--line #27272A`、`--accent #60A5FA`
  - `--accent-soft` Light `rgba(37,99,235,.08)`；Dark `rgba(96,165,250,.12)`
- 内容容器 `max-width: 72rem`，水平 padding 24px / 40px（≥1024px）；文章 68ch。
- 每个任务结束运行 `pnpm lint && pnpm test`（涉及构建时再跑 `pnpm build`），然后做一次本地 commit。
- 中文文案使用现有 YAML 的双语数据，不写死新的中文长文案（项目描述除外，见 Task 10）。

---

## 文件结构

```
src/
  index.css                         重写：令牌、@theme、基础层、少量组件类
  App.jsx                           重写：去掉 Boot，统一 Header/Main/Footer
  components/
    shared/
      SiteHeader.jsx                新增
      SiteFooter.jsx                新增
      ThemeLangControls.jsx         新增（从 SiteRail/SubpageHeader 抽取）
      SocialIcon.jsx                新增（从 SiteRail 抽取）
      ScrollToTop.jsx               新增（从 PageTransition 抽取）
      PageHeader.jsx                新增
      TagChip.jsx                   新增
      PageTitle.jsx                 保留
      ArrowIcon.jsx                 保留
      CopyButton.jsx                保留，样式微调
      TransitionLink.jsx            保留
    HomePage/
      Hero.jsx                      新增
      ProjectCard.jsx               新增
      ProjectGrid.jsx               新增
      PostRow.jsx                   新增（博客与首页共用）
      SkillsSection.jsx             新增
      ContactCta.jsx                新增
    BlogPage/
      BlogPage 组件与搜索保留文件名，内部重写
      TagFilter.jsx                 新增
      markdownComponents.jsx        新增（ReactMarkdown 映射）
  pages/                            重写表现层
  utils/
    postFormat.js                   新增：日期与分类格式化
    blogFilters.js                  新增：标签聚合与筛选（纯函数）
    markdownHeading.js              新增：标题 id 与文本提取
  styles/blog-post.css              重写：只保留 hljs 配色 + 代码块
tests/unit/
  blog-filters.test.js              新增
  markdown-heading.test.js          新增
```

---

### Task 1: 设计令牌与全局样式

**Files:**
- Modify: `src/index.css`（整体替换）
- Verify: `src/main.jsx` 仍只导入 `./index.css`

**Interfaces:**
- Produces：CSS 变量 `--bg/--bg-elevated/--bg-subtle/--ink/--ink-muted/--line/--accent/--accent-soft`、Tailwind 主题色 `bg-page/bg-elevated/bg-subtle/text-ink/text-muted/border-line/text-accent`、组件类 `.font-mono-ui`、`.tag-chip`、`.tag-chip.is-active`、`.container-page`、`.container-prose`、`.divider`。

- [ ] **Step 1: 整体替换 `src/index.css`**

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-page: var(--bg);
  --color-elevated: var(--bg-elevated);
  --color-subtle: var(--bg-subtle);
  --color-ink: var(--ink);
  --color-muted: var(--ink-muted);
  --color-line: var(--line);
  --color-accent: var(--accent);
  --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
    "Liberation Mono", monospace;
}

:root {
  --bg: #fafaf9;
  --bg-elevated: #ffffff;
  --bg-subtle: #f4f4f2;
  --ink: #18181b;
  --ink-muted: #71717a;
  --line: #e7e5e4;
  --accent: #2563eb;
  --accent-soft: rgba(37, 99, 235, 0.08);
}

.dark {
  --bg: #0e0e10;
  --bg-elevated: #17171a;
  --bg-subtle: #1d1d20;
  --ink: #ececee;
  --ink-muted: #a1a1aa;
  --line: #27272a;
  --accent: #60a5fa;
  --accent-soft: rgba(96, 165, 250, 0.12);
}

@layer base {
  html {
    -webkit-text-size-adjust: 100%;
    scroll-behavior: auto;
  }

  body {
    background-color: var(--bg);
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: 16px;
    line-height: 1.75;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  ::selection {
    background: var(--accent-soft);
  }

  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-radius: 2px;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, var(--ink-muted) 35%, transparent) transparent;
  }
}

@layer components {
  .container-page {
    width: 100%;
    max-width: 72rem;
    margin-inline: auto;
    padding-inline: 1.5rem;
  }

  @media (min-width: 1024px) {
    .container-page {
      padding-inline: 2.5rem;
    }
  }

  .container-prose {
    max-width: 68ch;
  }

  .font-mono-ui {
    font-family: var(--font-mono);
  }

  .tag-chip {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 0.125rem 0.4rem;
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    letter-spacing: 0.04em;
    line-height: 1.5;
    color: var(--ink-muted);
    background: transparent;
    transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
  }

  .tag-chip.is-active {
    color: var(--accent);
    border-color: var(--accent);
    background: var(--accent-soft);
  }

  .divider {
    border-top: 1px solid var(--line);
  }
}
```

- [ ] **Step 2: 验证字体与旧类已清除**

Run:
```bash
grep -rn "fonts.googleapis\|@font-face\|--font-display\|--font-post\|--font-heading\|--font-body" src/index.css
```
Expected: 无输出。

- [ ] **Step 3: 构建**

Run: `pnpm build`
Expected: 构建成功。此时页面样式会暂时错乱（组件仍在用旧类），属预期。

- [ ] **Step 4: 提交**

```bash
git add src/index.css
git commit -m "style: 重写全局设计令牌与系统字体"
```

---

### Task 2: 全局壳层与共用组件

**Files:**
- Create: `src/components/shared/ThemeLangControls.jsx`
- Create: `src/components/shared/SocialIcon.jsx`
- Create: `src/components/shared/ScrollToTop.jsx`
- Create: `src/components/shared/SiteHeader.jsx`
- Create: `src/components/shared/SiteFooter.jsx`
- Create: `src/components/shared/PageHeader.jsx`
- Create: `src/components/shared/TagChip.jsx`
- Modify: `src/App.jsx`（整体替换）
- Modify: `src/main.jsx`（不变，确认 BrowserRouter 仍在）

**Interfaces:**
- Consumes：`useTheme()` → `{ isDark, toggle }`；`useLanguage()` → `{ lang, toggle, t }`；`config.navLinks`；`config.socialLinks`；`config.footer.copyright`。
- Produces：
  - `<ThemeLangControls />`
  - `<SocialIcon platform={string} href={string} />`
  - `<SiteHeader />`、`<SiteFooter />`
  - `<PageHeader kicker?: string, title: string, description?: string, actions?: ReactNode />`
  - `<TagChip as?: 'span'|'button', active?: boolean, ...props />`
  - 页面不再使用 `SubPageShell` / `SiteLayout`。

- [ ] **Step 1: 创建 `ThemeLangControls.jsx`**

```jsx
import { useTheme } from '../../hooks/useTheme'
import { useLanguage } from '../../hooks/useLanguage'

export default function ThemeLangControls() {
  const { isDark, toggle: toggleTheme } = useTheme()
  const { lang, toggle: toggleLang } = useLanguage()

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-subtle hover:text-ink"
      >
        <span className="font-mono-ui text-xs">{isDark ? '☾' : '☀'}</span>
      </button>
      <button
        type="button"
        onClick={toggleLang}
        aria-label="Toggle language"
        className="h-8 rounded-md px-2 font-mono-ui text-[11px] tracking-wider text-muted transition-colors hover:bg-subtle hover:text-ink"
      >
        {lang === 'en' ? '中文' : 'EN'}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: 创建 `SocialIcon.jsx`**（把 SiteRail 中的 SVG 原样搬入）

```jsx
import ArrowIcon from './ArrowIcon'

export default function SocialIcon({ platform, href }) {
  const label = String(platform || '').toLowerCase()
  let path = null

  if (label.includes('github')) {
    path = (
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    )
  } else if (label.includes('bilibili')) {
    path = (
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 01-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 01.16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
    )
  } else {
    path = <ArrowIcon direction="up-right" size={16} />
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-subtle hover:text-ink"
      aria-label={platform}
      title={platform}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {path}
      </svg>
    </a>
  )
}
```

- [ ] **Step 3: 创建 `ScrollToTop.jsx`**（行为与现有 `PageTransition` 中的一致）

```jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
```

- [ ] **Step 4: 创建 `SiteHeader.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import config from '../../content/site.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import TransitionLink from './TransitionLink'
import ThemeLangControls from './ThemeLangControls'

export default function SiteHeader() {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const links = config.navLinks || []

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-page">
        <div className="container-page flex h-14 items-center justify-between gap-4">
          <TransitionLink
            to="/"
            className="text-[15px] font-semibold tracking-[-0.02em] text-ink"
          >
            STYLAN
          </TransitionLink>

          <nav aria-label="Main" className="hidden items-center gap-0.5 md:flex">
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <TransitionLink
                  key={link.href}
                  to={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    active ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {t(link.label)}
                </TransitionLink>
              )
            })}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeLangControls />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="flex h-8 w-8 flex-col items-center justify-center gap-1 md:hidden"
            >
              <span className="block h-px w-4 bg-ink" />
              <span className="block h-px w-4 bg-ink" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-30 bg-page pt-14 md:hidden">
          <nav aria-label="Mobile" className="container-page flex flex-col py-6">
            <TransitionLink
              to="/"
              onClick={() => setOpen(false)}
              className="border-b border-line py-4 text-xl font-semibold tracking-[-0.02em] text-ink"
            >
              {t({ en: 'Home', zh: '首页' })}
            </TransitionLink>
            {links.map((link) => (
              <TransitionLink
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 text-xl font-semibold tracking-[-0.02em] text-ink"
              >
                {t(link.label)}
              </TransitionLink>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 5: 创建 `SiteFooter.jsx`**

```jsx
import config from '../../content/site.yaml'
import SocialIcon from './SocialIcon'

export default function SiteFooter() {
  const socials = config.socialLinks || []

  return (
    <footer className="mt-auto border-t border-line">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-8">
        <p className="font-mono-ui text-[11px] tracking-wider text-muted">
          {config.footer?.copyright || `© ${new Date().getFullYear()} STYLAN`}
        </p>
        <div className="flex items-center gap-1">
          {socials.map((social) => (
            <SocialIcon key={social.platform} platform={social.platform} href={social.url} />
          ))}
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 6: 创建 `PageHeader.jsx` 与 `TagChip.jsx`**

```jsx
export default function PageHeader({ kicker, title, description, actions }) {
  return (
    <section className="border-b border-line py-10 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          {kicker ? (
            <p className="mb-3 font-mono-ui text-[11px] uppercase tracking-[0.12em] text-accent">
              {kicker}
            </p>
          ) : null}
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 text-[15px] leading-[1.75] text-muted">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </section>
  )
}
```

```jsx
export default function TagChip({ as: Tag = 'span', active = false, className = '', children, ...props }) {
  return (
    <Tag className={`tag-chip${active ? ' is-active' : ''} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  )
}
```

- [ ] **Step 7: 整体替换 `src/App.jsx`**

```jsx
import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppSettingsProvider } from './hooks/AppSettings'
import ScrollToTop from './components/shared/ScrollToTop'
import SiteHeader from './components/shared/SiteHeader'
import SiteFooter from './components/shared/SiteFooter'
import HomePage from './pages/HomePage'

const SkillsPage = lazy(() => import('./pages/SkillsPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function prefetchSubpages() {
  const loaders = [
    () => import('./pages/SkillsPage'),
    () => import('./pages/ProjectsPage'),
    () => import('./pages/BlogPage'),
    () => import('./pages/ContactPage'),
  ]
  loaders.forEach((load) => {
    load().catch(() => {})
  })
}

export default function App() {
  useEffect(() => {
    const idle =
      typeof window !== 'undefined' && 'requestIdleCallback' in window
        ? window.requestIdleCallback
        : (fn) => setTimeout(fn, 200)
    const handle = idle(prefetchSubpages)
    return () => {
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window && handle) {
        window.cancelIdleCallback(handle)
      }
    }
  }, [])

  return (
    <AppSettingsProvider>
      <div className="flex min-h-screen flex-col bg-page text-ink">
        <ScrollToTop />
        <SiteHeader />
        <main className="flex-1">
          <Suspense fallback={<div className="container-page min-h-[50vh]" aria-hidden />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <SiteFooter />
      </div>
    </AppSettingsProvider>
  )
}
```

- [ ] **Step 8: 跑 lint 与测试，提交**

Run: `pnpm lint && pnpm test`
Expected: 通过（页面尚未重写，但能编译；`HomePage` 仍在用旧组件，样式已变但可运行）。

```bash
git add src/App.jsx src/components/shared
git commit -m "refactor: 新顶部导航与全局壳层"
```

---

### Task 3: 首页 Hero 与项目卡片网格

**Files:**
- Create: `src/components/HomePage/Hero.jsx`
- Create: `src/components/HomePage/ProjectCard.jsx`
- Create: `src/components/HomePage/ProjectGrid.jsx`

**Interfaces:**
- Consumes：`config.personal.{titleName,bio,tags}`、`config.socialLinks`、`config.projects[]`；`t(value)`。
- Produces：
  - `<Hero t={t} />`
  - `<AboutSection t={function} />`
  - `<ProjectCard project={object} t={function} />`
  - `<ProjectGrid projects={array} t={function} />`

- [ ] **Step 1: 创建 `Hero.jsx`**

```jsx
import config from '../../content/site.yaml'
import SocialIcon from '../shared/SocialIcon'

export default function Hero({ t }) {
  const personal = config.personal || {}
  const socials = config.socialLinks || []

  return (
    <section className="py-14 sm:py-20">
      <p className="font-mono-ui text-[11px] uppercase tracking-[0.12em] text-accent">
        {t({ en: 'AI Application Developer', zh: 'AI 应用开发' })}
      </p>
      <h1 className="mt-4 text-[clamp(2.25rem,7vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
        {t(personal.titleName) || 'STYLAN'}
      </h1>
      <p className="mt-5 max-w-[42rem] text-[15px] leading-[1.8] text-muted sm:text-base">
        {t(personal.bio)}
      </p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {(personal.tags || []).map((tag) => (
          <li key={t(tag)} className="tag-chip">
            {t(tag)}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-1">
        {socials.map((social) => (
          <SocialIcon key={social.platform} platform={social.platform} href={social.url} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: 创建 `ProjectCard.jsx`**

```jsx
import ArrowIcon from '../shared/ArrowIcon'

export default function ProjectCard({ project, t }) {
  const label = t(project.title)
  const href = project.link || project.repo
  const Tag = href ? 'a' : 'div'
  const external = href?.startsWith('http')

  return (
    <Tag
      href={href || undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group flex h-full flex-col rounded-[10px] border border-line bg-elevated p-5 transition-colors hover:border-ink/25"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-subtle text-lg"
          aria-hidden="true"
        >
          {project.icon || String(label).slice(0, 1)}
        </span>
        <h3 className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
          {label}
        </h3>
      </div>

      <p className="mt-3 line-clamp-3 text-[13px] leading-[1.7] text-muted">
        {t(project.description)}
      </p>

      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
        <ul className="flex flex-wrap gap-1.5">
          {(project.tags || []).map((tag) => (
            <li key={tag} className="tag-chip">
              {tag}
            </li>
          ))}
        </ul>
        {href ? (
          <ArrowIcon
            direction="up-right"
            size={14}
            className="shrink-0 text-muted transition-colors group-hover:text-accent"
          />
        ) : null}
      </div>
    </Tag>
  )
}
```

- [ ] **Step 3: 创建 `ProjectGrid.jsx`**

```jsx
import ProjectCard from './ProjectCard'

export default function ProjectGrid({ projects, t }) {
  const list = (projects || []).filter(
    (project) => !String(project.title?.en || '').includes('<')
  )

  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {list.map((project) => (
        <ProjectCard key={project.title?.en || project.title} project={project} t={t} />
      ))}
    </div>
  )
}
```

- [ ] **Step 4: 创建 `AboutSection.jsx`（保留原 About 文案）**

```jsx
import config from '../../content/site.yaml'

const DEFAULT_FOCUS = [
  { en: 'LLM applications', zh: '大模型应用' },
  { en: 'RAG systems', zh: 'RAG 检索增强' },
  { en: 'Full-stack delivery', zh: '全栈交付' },
  { en: 'Design-aware engineering', zh: '有设计感的工程' },
]

export default function AboutSection({ t }) {
  const focus = config.about?.focus || DEFAULT_FOCUS

  return (
    <section id="about" className="border-t border-line py-12 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[15rem_1fr] lg:gap-12">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink">
            {t({ en: 'About', zh: '关于我' })}
          </h2>
          <ul className="mt-4 space-y-2">
            {focus.map((item) => (
              <li key={item.en} className="font-mono-ui text-[11px] uppercase tracking-[0.07em] text-muted">
                {t(item)}
              </li>
            ))}
          </ul>
        </div>

        <div className="max-w-[42rem] space-y-4 text-[15px] leading-[1.85] text-muted">
          <p>
            {t({
              en: "I'm an AI application developer focused on turning large language models into reliable products. Most of my work sits at the intersection of RAG systems, agent workflows, and interfaces people actually enjoy using.",
              zh: '我是 AI 应用开发者，专注把大语言模型做成可靠的产品。日常工作主要在 RAG 系统、Agent 工作流，以及人们真正愿意用的界面之间展开。',
            })}
          </p>
          <p>
            {t({
              en: 'I care about structure: pipelines you can trust, code you can read, and UIs that stay calm under complexity. Clear interfaces are not decoration — they are how AI capability becomes usable.',
              zh: '我在意结构：可信任的管线、可读的代码，以及在复杂度下依然克制的界面。清晰的界面不是装饰，而是 AI 能力变得可用的方式。',
            })}
          </p>
          <p>
            {t({
              en: `Currently I build with ${config.personal?.tagDescription?.en || 'LangChain · RAG · LLM'}, and I'm always open to thoughtful collaborations.`,
              zh: `目前主要使用 ${config.personal?.tagDescription?.zh || 'LangChain · RAG · 大模型'} 进行构建，也欢迎认真的合作与交流。`,
            })}
          </p>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: 验证构建与视觉**

Run: `pnpm build`
Expected: 成功。此时首页还没组装，可在 `/projects` 尚未更新前先跳过视觉检查。

- [ ] **Step 6: 提交**

```bash
git add src/components/HomePage/Hero.jsx src/components/HomePage/AboutSection.jsx src/components/HomePage/ProjectCard.jsx src/components/HomePage/ProjectGrid.jsx
git commit -m "feat: 首页身份区与项目卡片组件"
```

---

### Task 4: 首页文章、技能、联系区与页面组装

**Files:**
- Create: `src/components/HomePage/PostRow.jsx`
- Create: `src/components/HomePage/SkillsSection.jsx`
- Create: `src/components/HomePage/ContactCta.jsx`
- Modify: `src/pages/HomePage.jsx`（整体替换）
- Delete: `src/components/HomePage/About.jsx`、`BlogSection.jsx`、`Skills.jsx`、`Contact.jsx`、`AnimatedText.jsx`

**Interfaces:**
- Consumes：`getAllPosts(lang)`；`config.projects`、`config.skills`、`config.contact`、`config.personal`。
- Produces：`<PostRow post t showTags />`（Task 5 也会复用）、`<SkillsSection t />`、`<ContactCta t />`。

- [ ] **Step 1: 创建 `src/utils/postFormat.js`**

```js
import blogConfig from '../content/blog.yaml'

export function formatDate(dateString, t) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString(t({ en: 'en-CA', zh: 'zh-CN' }), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function categoryLabel(id, t) {
  const category = blogConfig.categories.find((item) => item.id === id)
  return category ? t(category.label) : id
}
```

- [ ] **Step 2: 创建 `PostRow.jsx`**

```jsx
import { Link } from 'react-router-dom'
import { categoryLabel, formatDate } from '../../utils/postFormat'

export default function PostRow({ post, t, showTags = true }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group grid gap-1 border-b border-line py-5 sm:grid-cols-[6rem_1fr_auto] sm:gap-6"
    >
      <time className="font-mono-ui text-[11px] uppercase tracking-[0.08em] text-muted sm:pt-1">
        {formatDate(post.date, t)}
      </time>

      <div className="min-w-0">
        <h3 className="text-[1.125rem] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
          {t(post.title)}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.7] text-muted">
          {t(post.excerpt)}
        </p>
        {showTags && post.tags?.length ? (
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 4).map((tag) => (
              <li key={tag} className="tag-chip">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <span className="hidden pt-1 font-mono-ui text-[10px] uppercase tracking-[0.06em] text-muted sm:block">
        {categoryLabel(post.category, t)}
      </span>
    </Link>
  )
}
```

- [ ] **Step 3: 创建 `SkillsSection.jsx`**

```jsx
import config from '../../content/site.yaml'

export default function SkillsSection({ t }) {
  const groups = (config.skills || []).filter(
    (group) => !/hobbies/i.test(group.category?.en || String(group.category || ''))
  )

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <div key={t(group.category)}>
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.1em] text-accent">
            {t(group.category)}
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {(group.items || []).map((item) => (
              <li key={item} className="tag-chip">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: 创建 `ContactCta.jsx`**

```jsx
import { Link } from 'react-router-dom'
import config from '../../content/site.yaml'
import ArrowIcon from '../shared/ArrowIcon'

export default function ContactCta({ t }) {
  const contact = config.contact || {}

  return (
    <section className="border-t border-line py-14 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink">
            {t(contact.title) || t({ en: 'Get in touch', zh: '联系我' })}
          </h2>
          <p className="mt-3 text-[15px] leading-[1.75] text-muted">
            {t(contact.description)}
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-page transition-colors hover:bg-accent"
        >
          {t({ en: 'Contact me', zh: '联系我' })}
          <ArrowIcon direction="right" size={14} />
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: 替换 `src/pages/HomePage.jsx`**

```jsx
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
```

- [ ] **Step 6: 删除旧首页组件**

```bash
git rm src/components/HomePage/About.jsx src/components/HomePage/BlogSection.jsx \
  src/components/HomePage/Skills.jsx src/components/HomePage/Contact.jsx \
  src/components/HomePage/AnimatedText.jsx
```

- [ ] **Step 7: 浏览器检查首页**

Run: `pnpm dev`
Expected（访问 `http://localhost:5173/`）：
- 顶部导航、Hero、项目卡片网格、文章行、技能、联系 CTA 均出现。
- 明暗切换、中英切换生效。
- 无 Web 字体请求（DevTools Network 过滤 `font` 应为空）。

- [ ] **Step 8: 提交**

```bash
git add src/pages/HomePage.jsx src/components/HomePage
git commit -m "feat: 首页改为居中单列与项目卡片网格"
```

---

### Task 5: 博客筛选工具与列表页

**Files:**
- Create: `src/utils/blogFilters.js`
- Create: `tests/unit/blog-filters.test.js`
- Create: `src/components/BlogPage/TagFilter.jsx`
- Modify: `src/components/BlogPage/BlogPost.jsx` → 删除，改用 `HomePage/PostRow`
- Modify: `src/components/BlogPage/BlogHero.jsx`（整体替换）
- Modify: `src/components/BlogPage/CategoryFilter.jsx`（整体替换）
- Modify: `src/components/BlogPage/SearchTrigger.jsx`（样式微调）
- Modify: `src/components/BlogPage/BlogList.jsx`（整体替换）
- Modify: `src/pages/BlogPage.jsx`（整体替换）

**Interfaces:**
- Produces：
  - `collectTags(posts, limit = 8): string[]`
  - `filterPosts(posts, { category = 'all', tag = null }): post[]`
  - `<TagFilter tags t activeTag onTagChange />`
  - `<BlogList posts t />`
- Consumes：`PostRow`、`TagChip`、`PageHeader`。

- [ ] **Step 1: 先写失败测试 `tests/unit/blog-filters.test.js`**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { collectTags, filterPosts } from '../../src/utils/blogFilters.js'

const posts = [
  { slug: 'a', category: 'tech', tags: ['React', 'CSS'] },
  { slug: 'b', category: 'tech', tags: ['React'] },
  { slug: 'c', category: 'thoughts', tags: ['CSS', 'AI'] },
]

test('collectTags 按出现次数排序并去重', () => {
  assert.deepEqual(collectTags(posts), ['React', 'CSS', 'AI'])
})

test('collectTags 遵守 limit', () => {
  assert.deepEqual(collectTags(posts, 2), ['React', 'CSS'])
})

test('filterPosts 同时按分类与标签过滤', () => {
  assert.deepEqual(filterPosts(posts, { category: 'tech' }).map((p) => p.slug), ['a', 'b'])
  assert.deepEqual(filterPosts(posts, { category: 'tech', tag: 'CSS' }).map((p) => p.slug), ['a'])
  assert.deepEqual(filterPosts(posts, { tag: 'AI' }).map((p) => p.slug), ['c'])
})

test('filterPosts 空输入返回空数组', () => {
  assert.deepEqual(filterPosts(undefined, {}), [])
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test tests/unit/blog-filters.test.js`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现 `src/utils/blogFilters.js`**

```js
export function collectTags(posts, limit = 8) {
  const counts = new Map()
  const order = new Map()

  for (const post of posts || []) {
    for (const tag of post.tags || []) {
      counts.set(tag, (counts.get(tag) || 0) + 1)
      if (!order.has(tag)) order.set(tag, order.size)
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || order.get(a[0]) - order.get(b[0]))
    .slice(0, limit)
    .map(([tag]) => tag)
}

export function filterPosts(posts, { category = 'all', tag = null } = {}) {
  return (posts || []).filter((post) => {
    const matchCategory = category === 'all' || post.category === category
    const matchTag = !tag || (post.tags || []).includes(tag)
    return matchCategory && matchTag
  })
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `node --test tests/unit/blog-filters.test.js`
Expected: PASS（4 个测试）。

- [ ] **Step 5: 创建 `TagFilter.jsx`**

```jsx
import TagChip from '../shared/TagChip'

export default function TagFilter({ tags, activeTag, onTagChange, t }) {
  if (!tags?.length) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 font-mono-ui text-[10px] uppercase tracking-[0.1em] text-muted">
        {t({ en: 'Tags', zh: '标签' })}
      </span>
      {tags.map((tag) => {
        const active = activeTag === tag
        return (
          <TagChip
            key={tag}
            as="button"
            type="button"
            active={active}
            aria-pressed={active}
            onClick={() => onTagChange(active ? null : tag)}
          >
            {tag}
          </TagChip>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 6: 替换 `BlogHero.jsx`、`CategoryFilter.jsx`、`BlogList.jsx`**

`BlogHero.jsx`:

```jsx
import PageHeader from '../shared/PageHeader'
import ArrowIcon from '../shared/ArrowIcon'
import blogConfig from '../../content/blog.yaml'

export default function BlogHero({ t }) {
  return (
    <PageHeader
      kicker="WRITING"
      title={t(blogConfig.page.title)}
      description={t(blogConfig.page.subtitle)}
      actions={
        <a
          href="/rss.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-mono-ui text-[11px] uppercase tracking-[0.08em] text-muted transition-colors hover:border-ink/25 hover:text-ink"
        >
          RSS
          <ArrowIcon direction="up-right" size={12} />
        </a>
      }
    />
  )
}
```

`CategoryFilter.jsx`:

```jsx
import TagChip from '../shared/TagChip'

export default function CategoryFilter({ categories, activeCategory, onCategoryChange, t }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {categories.map((category) => {
        const active = activeCategory === category.id
        return (
          <TagChip
            key={category.id}
            as="button"
            type="button"
            active={active}
            aria-pressed={active}
            onClick={() => onCategoryChange(category.id)}
          >
            {t(category.label)}
          </TagChip>
        )
      })}
    </div>
  )
}
```

`BlogList.jsx`:

```jsx
import PostRow from '../HomePage/PostRow'

export default function BlogList({ posts, t }) {
  if (!posts?.length) {
    return (
      <p className="py-12 font-mono-ui text-sm text-muted">
        {t({ en: 'No posts found. Try another filter.', zh: '没有匹配的文章，试试其他筛选。' })}
      </p>
    )
  }

  return (
    <div className="border-t border-line">
      {posts.map((post) => (
        <PostRow key={post.slug} post={post} t={t} />
      ))}
    </div>
  )
}
```

- [ ] **Step 7: 替换 `src/pages/BlogPage.jsx`**

```jsx
import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { getAllPosts } from '../utils/markdown'
import { collectTags, filterPosts } from '../utils/blogFilters'
import blogConfig from '../content/blog.yaml'
import PageTitle from '../components/shared/PageTitle'
import PageHeader from '../components/shared/PageHeader'
import CategoryFilter from '../components/BlogPage/CategoryFilter'
import TagFilter from '../components/BlogPage/TagFilter'
import BlogList from '../components/BlogPage/BlogList'
import BlogSearch from '../components/BlogPage/BlogSearch'
import SearchTrigger from '../components/BlogPage/SearchTrigger'
import ArrowIcon from '../components/shared/ArrowIcon'

export default function BlogPage() {
  const { lang, t } = useLanguage()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTag, setActiveTag] = useState(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const allPosts = await getAllPosts(lang)
        if (!cancelled) setPosts(allPosts)
      } catch (error) {
        console.error('[BlogPage] Failed to load posts:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [lang])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const tags = useMemo(() => collectTags(posts), [posts])
  const filteredPosts = useMemo(
    () => filterPosts(posts, { category: activeCategory, tag: activeTag }),
    [posts, activeCategory, activeTag]
  )

  return (
    <>
      <PageTitle
        title={`STYLAN · ${t(blogConfig.page.title)}`}
        description={t(blogConfig.page.subtitle)}
        t={t}
        lang={lang}
      />
      <BlogHero t={t} />

      <section className="flex flex-col gap-4 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CategoryFilter
            categories={blogConfig.categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            t={t}
          />
          <SearchTrigger
            onClick={() => setIsSearchOpen(true)}
            t={t}
            isMac={
              typeof navigator !== 'undefined' &&
              /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
            }
          />
        </div>
        <TagFilter
          tags={tags}
          activeTag={activeTag}
          onTagChange={setActiveTag}
          t={t}
        />
      </section>

      <section className="pb-12">
        {loading ? (
          <p className="py-12 font-mono-ui text-sm text-muted">
            {t({ en: 'Loading…', zh: '加载中…' })}
          </p>
        ) : (
          <BlogList posts={filteredPosts} t={t} />
        )}
      </section>

      <BlogSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={posts}
        t={t}
      />
    </>
  )
}
```

- [ ] **Step 8: 替换 `SearchTrigger.jsx`**

```jsx
export default function SearchTrigger({ onClick, t, isMac }) {
  const kbd = isMac ? '⌘' : 'Ctrl'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t({ en: 'Search posts', zh: '搜索文章' })}
      className="inline-flex h-8 items-center gap-2 rounded-md border border-line px-2.5 text-[11px] text-muted transition-colors hover:border-ink/25 hover:text-ink"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
      </svg>
      <span className="hidden sm:inline">{t({ en: 'Search posts', zh: '搜索文章' })}</span>
      <kbd className="font-mono-ui text-[10px] tracking-wider">{kbd} K</kbd>
    </button>
  )
}
```

- [ ] **Step 9: 删除 `BlogPost.jsx` 并跑测试**

```bash
git rm src/components/BlogPage/BlogPost.jsx
pnpm lint && pnpm test
```
Expected: 全部通过。

- [ ] **Step 10: 浏览器检查 `/blog`**

Run: `pnpm dev`
Expected：列表行排版、分类筛选、标签筛选、组合筛选、空状态、Ctrl+K 均正常；窄屏（390px）日期在标题上方。

- [ ] **Step 11: 提交**

```bash
git add src/utils/blogFilters.js tests/unit/blog-filters.test.js src/components/BlogPage src/pages/BlogPage.jsx
git commit -m "feat: 博客列表改为标签筛选与 onur 式行排版"
```

---

### Task 6: 文章页排版与 TOC

**Files:**
- Create: `src/utils/markdownHeading.js`
- Create: `tests/unit/markdown-heading.test.js`
- Create: `src/components/BlogPage/markdownComponents.jsx`
- Modify: `src/components/BlogPage/TableOfContents.jsx`（整体替换）
- Modify: `src/pages/BlogPostPage.jsx`（整体替换）
- Modify: `src/styles/blog-post.css`（整体替换，保留 hljs 配色）

**Interfaces:**
- Produces：
  - `headingId(text): string`
  - `getTextContent(children): string`
  - `markdownComponents`（ReactMarkdown `components` 映射）
  - `<TableOfContents content onItemClick? />`

- [ ] **Step 1: 先写 `tests/unit/markdown-heading.test.js`**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { headingId } from '../../src/utils/markdownHeading.js'

test('headingId 处理英文标题', () => {
  assert.equal(headingId('Getting Started With React'), 'getting-started-with-react')
})

test('headingId 保留中文', () => {
  assert.equal(headingId('安装 与 配置'), '安装-与-配置')
})

test('headingId 去掉标点并压缩连字符', () => {
  assert.equal(headingId('Hello, World! -- Again'), 'hello-world-again')
})
```

- [ ] **Step 2: 运行确认失败**

Run: `node --test tests/unit/markdown-heading.test.js`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现 `src/utils/markdownHeading.js`**

```js
export function headingId(text) {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function getTextContent(children) {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(getTextContent).join('')
  if (children?.props?.children) return getTextContent(children.props.children)
  return ''
}
```

- [ ] **Step 4: 运行确认通过**

Run: `node --test tests/unit/markdown-heading.test.js`
Expected: PASS（3 个测试）。

- [ ] **Step 5: 创建 `markdownComponents.jsx`**

```jsx
import { headingId, getTextContent } from '../../utils/markdownHeading'

const heading = (level) => {
  const Tag = `h${level}`
  const className =
    level === 2
      ? 'mt-10 mb-4 scroll-mt-24 text-2xl font-semibold tracking-[-0.02em] text-ink'
      : level === 3
        ? 'mt-8 mb-3 scroll-mt-24 text-xl font-semibold tracking-[-0.01em] text-ink'
        : 'mt-6 mb-2 scroll-mt-24 text-lg font-semibold text-ink'

  return function Heading({ children }) {
    return (
      <Tag id={headingId(getTextContent(children))} className={className}>
        {children}
      </Tag>
    )
  }
}

export const markdownComponents = {
  h1: heading(2),
  h2: heading(2),
  h3: heading(3),
  h4: heading(4),

  p: ({ children }) => (
    <p className="mb-4 text-[1.0625rem] leading-[1.85] text-ink/90">{children}</p>
  ),

  a: ({ href, children }) => (
    <a
      href={href}
      className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),

  ul: ({ children }) => (
    <ul className="mb-4 list-disc space-y-2 pl-5 text-[1.0625rem] leading-[1.85] text-ink/90">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="mb-4 list-decimal space-y-2 pl-5 text-[1.0625rem] leading-[1.85] text-ink/90">
      {children}
    </ol>
  ),

  li: ({ children }) => <li className="pl-0.5">{children}</li>,

  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-2 border-accent bg-subtle py-1 pl-4 text-ink/75">
      {children}
    </blockquote>
  ),

  code({ inline, className, children, ...props }) {
    if (!inline && /language-/.test(className || '')) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }

    return (
      <code
        className="rounded bg-subtle px-1.5 py-0.5 font-mono text-[0.875em] text-ink"
        {...props}
      >
        {children}
      </code>
    )
  },

  pre({ children, ...props }) {
    const codeChild = children?.props
    const className = codeChild?.className || ''
    const match = /language-(\w+)/.exec(className)
    const language = match ? match[1] : 'code'

    return (
      <div className="my-6 overflow-hidden rounded-lg border border-line">
        <div className="border-b border-line bg-subtle px-4 py-2 font-mono-ui text-[10px] uppercase tracking-[0.08em] text-muted">
          {language}
        </div>
        <pre
          {...props}
          className="overflow-x-auto bg-elevated px-4 py-5 font-mono text-[0.875rem] leading-[1.7]"
        >
          {children}
        </pre>
      </div>
    )
  },

  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      decoding="async"
      className="my-6 h-auto w-full rounded-lg border border-line"
    />
  ),

  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-line">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  ),

  th: ({ children }) => (
    <th className="border-b border-line bg-subtle px-4 py-2 text-left font-medium text-ink">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="border-b border-line px-4 py-2 text-ink/85 last:border-0">{children}</td>
  ),

  hr: () => <hr className="my-10 border-line" />,
}
```

- [ ] **Step 6: 整体替换 `TableOfContents.jsx`**

```jsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import { headingId } from '../../utils/markdownHeading'

function extractHeadings(content) {
  if (!content) return []

  const seen = new Set()
  return content
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trim().match(/^(#{2,4})\s+(.+)$/))
    .filter(Boolean)
    .map((match) => {
      const level = match[1].length
      const text = match[2].trim()
      let id = headingId(text)
      if (seen.has(id)) {
        let counter = 2
        while (seen.has(`${id}-${counter}`)) counter += 1
        id = `${id}-${counter}`
      }
      seen.add(id)
      return { level, text, id }
    })
}

export default function TableOfContents({ content, onItemClick }) {
  const headings = useMemo(() => extractHeadings(content), [content])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -75% 0px', threshold: 0 }
    )

    const timer = setTimeout(() => {
      headings.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [headings])

  const handleClick = useCallback(
    (event, id) => {
      event.preventDefault()
      const el = document.getElementById(id)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80
        window.scrollTo({ top, behavior: 'auto' })
      }
      onItemClick?.()
    },
    [onItemClick]
  )

  if (headings.length === 0) return null

  return (
    <nav aria-label="Table of contents">
      <p className="mb-3 font-mono-ui text-[10px] uppercase tracking-[0.1em] text-muted">
        On this page
      </p>
      <ul className="border-l border-line">
        {headings.map(({ level, text, id }) => {
          const active = activeId === id
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(event) => handleClick(event, id)}
                style={{ paddingLeft: `${0.75 + (level - 2) * 0.75}rem` }}
                className={`-ml-px block border-l-2 py-1 pr-2 text-[13px] leading-snug transition-colors ${
                  active
                    ? 'border-accent text-ink'
                    : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                {text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
```

- [ ] **Step 7: 整体替换 `src/pages/BlogPostPage.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useLanguage } from '../hooks/useLanguage'
import { getPostBySlug } from '../utils/markdown'
import blogConfig from '../content/blog.yaml'
import PageTitle from '../components/shared/PageTitle'
import TagChip from '../components/shared/TagChip'
import ArrowIcon from '../components/shared/ArrowIcon'
import TableOfContents from '../components/BlogPage/TableOfContents'
import { markdownComponents } from '../components/BlogPage/markdownComponents'
import { categoryLabel, formatDate } from '../utils/postFormat'
import '../styles/blog-post.css'

export default function BlogPostPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { lang, t } = useLanguage()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        setError(false)
        const postData = await getPostBySlug(slug, lang)
        if (cancelled) return
        if (postData) setPost(postData)
        else setError(true)
      } catch (err) {
        console.error('Failed to load post:', err)
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug, lang])

  if (loading) {
    return (
      <div className="container-page flex min-h-[50vh] items-center justify-center">
        <p className="font-mono-ui text-sm text-muted">
          {t({ en: 'Loading…', zh: '加载中…' })}
        </p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink">
          {t({ en: 'Post not found', zh: '文章未找到' })}
        </h1>
        <p className="mt-3 text-muted">
          {t({ en: 'The post you are looking for does not exist.', zh: '您查找的文章不存在。' })}
        </p>
        <button
          type="button"
          onClick={() => navigate('/blog')}
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-page transition-colors hover:bg-accent"
        >
          {t({ en: 'Back to blog', zh: '返回博客' })}
          <ArrowIcon direction="right" size={14} />
        </button>
      </div>
    )
  }

  return (
    <>
      <PageTitle
        title={`STYLAN · ${t(post.title)}`}
        description={t(post.excerpt)}
        t={t}
        lang={lang}
      />

      <div className="py-10 sm:py-12 xl:grid xl:grid-cols-[minmax(0,68ch)_12rem] xl:justify-center xl:gap-12">
        <article className="min-w-0">
          <Link
            to="/blog"
            className="mb-8 inline-flex items-center gap-2 font-mono-ui text-[11px] uppercase tracking-[0.08em] text-muted transition-colors hover:text-accent"
          >
            <ArrowIcon direction="left" size={13} />
            {t({ en: 'All posts', zh: '全部文章' })}
          </Link>

          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            <TagChip>{categoryLabel(post.category, t)}</TagChip>
            {post.featured ? (
              <TagChip active>{t({ en: 'Featured', zh: '精选' })}</TagChip>
            ) : null}
          </div>

          <h1 className="text-[clamp(2rem,5vw,2.75rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-ink">
            {t(post.title)}
          </h1>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-b border-line pb-6 font-mono-ui text-[11px] uppercase tracking-[0.06em] text-muted">
            <span>{formatDate(post.date, t)}</span>
            {post.readTime ? <span>{t(post.readTime)}</span> : null}
          </div>

          {post.excerpt ? (
            <p className="mt-6 border-l-2 border-accent pl-4 text-[15px] leading-[1.8] text-muted">
              {t(post.excerpt)}
            </p>
          ) : null}

          <details className="mt-8 border-y border-line py-3 xl:hidden">
            <summary className="cursor-pointer font-mono-ui text-[11px] uppercase tracking-[0.08em] text-muted">
              {t({ en: 'Table of contents', zh: '目录' })}
            </summary>
            <div className="mt-3">
              <TableOfContents content={post.content} />
            </div>
          </details>

          <div className="mt-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              urlTransform={(url) => url}
              components={markdownComponents}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {post.tags?.length ? (
            <div className="mt-12 border-t border-line pt-6">
              <p className="mb-3 font-mono-ui text-[10px] uppercase tracking-[0.1em] text-muted">
                {t({ en: 'Tags', zh: '标签' })}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <TagChip key={tag}>{tag}</TagChip>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-10 border-t border-line pt-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-mono-ui text-[11px] uppercase tracking-[0.08em] text-muted transition-colors hover:text-accent"
            >
              <ArrowIcon direction="left" size={13} />
              {t({ en: 'All posts', zh: '全部文章' })}
            </Link>
          </div>
        </article>

        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <TableOfContents content={post.content} />
          </div>
        </aside>
      </div>
    </>
  )
}
```

- [ ] **Step 8: 精简 `src/styles/blog-post.css`**

保留文件第 31–254 行的全部 `.hljs` 规则（One Light + Everforest Dark 两套配色），删除第 257 行之后的 `.markdown-content`、`.toc-*`、`.code-block-wrapper` 与旧字体引用；把文件头注释改为「代码高亮配色（rehype-highlight）」。新组件已用 Tailwind 类完成其余排版，无需补充其他规则。

- [ ] **Step 9: 跑测试与浏览器检查**

Run: `pnpm lint && pnpm test && pnpm build`
Expected: 全绿；访问 `/blog/two-sum`：
- 68ch 正文、章节标题间距、代码块横向滚动。
- ≥1280px 右侧 TOC 粘性吸顶并高亮；窄屏为折叠目录。
- 明暗主题下代码配色正常。

- [ ] **Step 10: 提交**

```bash
git add src/utils/markdownHeading.js tests/unit/markdown-heading.test.js src/components/BlogPage src/pages/BlogPostPage.jsx src/styles/blog-post.css
git commit -m "feat: 文章页改为 onur 式排版与粘性目录"
```

---

### Task 7: 搜索弹窗适配新令牌

**Files:**
- Modify: `src/index.css`（追加搜索相关组件类）
- Modify: `src/components/BlogPage/BlogSearch.jsx`（仅替换样式类，交互不动）

**Interfaces:**
- Consumes：`.search-backdrop`、`.search-modal`、`.search-input-bar`、`.search-result-row`（保留类名，便于最小改动）。
- Produces：无新接口。

- [ ] **Step 1: 在 `src/index.css` 的 `@layer components` 内追加**

```css
  .search-backdrop {
    background: color-mix(in srgb, var(--ink) 45%, transparent);
  }

  .search-modal {
    position: relative;
    z-index: 1;
    display: flex;
    width: 100%;
    max-width: 34rem;
    max-height: min(72vh, 38rem);
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--bg-elevated);
  }

  .search-modal-top {
    flex-shrink: 0;
    padding: 0.75rem;
    border-bottom: 1px solid var(--line);
  }

  .search-modal-body {
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .search-input-bar {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem 0.75rem;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--bg);
  }

  .search-input-bar input:focus,
  .search-input-bar input:focus-visible {
    outline: none;
  }

  .search-result-row {
    display: grid;
    width: 100%;
    grid-template-columns: 2rem 1fr auto;
    gap: 0.5rem 0.75rem;
    align-items: start;
    padding: 0.85rem 0.9rem;
    border-bottom: 1px solid var(--line);
    text-align: left;
    transition: background-color 0.15s ease;
  }

  .search-result-row:last-child {
    border-bottom: none;
  }

  .search-result-row.is-active {
    background: var(--accent-soft);
  }

  .search-result-num {
    padding-top: 0.15rem;
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--ink-muted);
  }

  .search-result-title {
    display: block;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--ink);
  }

  .search-result-row.is-active .search-result-title {
    color: var(--accent);
  }

  .search-result-meta {
    margin-top: 0.3rem;
    font-family: var(--font-mono);
    font-size: 0.625rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--ink-muted);
  }

  .search-result-excerpt {
    display: block;
    margin-top: 0.35rem;
    font-size: 0.8125rem;
    line-height: 1.55;
    color: var(--ink-muted);
  }

  @media (max-width: 640px) {
    .search-result-row {
      grid-template-columns: 1.5rem 1fr;
    }

    .search-result-arrow {
      display: none;
    }
  }
```

- [ ] **Step 2: `BlogSearch.jsx` 的旧类替换**

1. 第 173 行附近「No results」标题：
   - 旧：`className="font-display text-lg text-ink mb-1.5"`
   - 新：`className="mb-1.5 text-lg font-semibold text-ink"`
2. `SearchTrigger` 已整体替换，`BlogSearch` 内其余类名（`search-*`、`tag-chip`、`border-line`、`text-muted`）在新 CSS 中均有定义，保持不动。
3. 结果箭头若仍含 `transform` 内联样式，删除该样式，只保留颜色过渡。
4. 删除文件顶部的本地 `formatDate` / `categoryLabel`，改为 `import { categoryLabel, formatDate } from '../../utils/postFormat'`。

- [ ] **Step 3: 浏览器检查**

Run: `pnpm dev`
Expected：`/blog` 按 Ctrl+K 打开弹窗；↑↓ 选择、Enter 打开、Esc 关闭；明暗主题对比正常；打开时无背景模糊。

- [ ] **Step 4: 提交**

```bash
git add src/index.css src/components/BlogPage/BlogSearch.jsx
git commit -m "style: 搜索弹窗适配新设计令牌"
```

---

### Task 8: Projects 与 Skills 子页

**Files:**
- Modify: `src/pages/ProjectsPage.jsx`（整体替换）
- Modify: `src/pages/SkillsPage.jsx`（整体替换）

**Interfaces:**
- Consumes：`PageHeader`、`ProjectGrid`、`config.projects`、`config.skills`。

- [ ] **Step 1: 替换 `ProjectsPage.jsx`**

```jsx
import { useLanguage } from '../hooks/useLanguage'
import config from '../content/site.yaml'
import PageTitle from '../components/shared/PageTitle'
import PageHeader from '../components/shared/PageHeader'
import ProjectGrid from '../components/HomePage/ProjectGrid'

export default function ProjectsPage() {
  const { lang, t } = useLanguage()

  return (
    <>
      <PageTitle
        title={t({ en: 'STYLAN · Projects', zh: 'STYLAN · 项目' })}
        description={t(config.site?.description)}
        t={t}
        lang={lang}
      />
      <PageHeader
        kicker="WORK"
        title={t(config.projectsSection?.title) || t({ en: 'Featured Projects', zh: '精选项目' })}
        description={t({
          en: 'Selected work across LLM applications, RAG systems and full-stack delivery.',
          zh: '大模型应用、RAG 系统与全栈交付的精选作品。',
        })}
      />
      <section className="py-10 sm:py-12">
        <ProjectGrid projects={config.projects || []} t={t} />
      </section>
    </>
  )
}
```

- [ ] **Step 2: 替换 `SkillsPage.jsx`**

```jsx
import { useLanguage } from '../hooks/useLanguage'
import config from '../content/site.yaml'
import PageTitle from '../components/shared/PageTitle'
import PageHeader from '../components/shared/PageHeader'

export default function SkillsPage() {
  const { lang, t } = useLanguage()

  return (
    <>
      <PageTitle
        title={t({ en: 'STYLAN · Skills', zh: 'STYLAN · 技能与技术' })}
        description={t({ en: 'Technologies and tools I work with.', zh: '我使用的技术与工具。' })}
        t={t}
        lang={lang}
      />
      <PageHeader
        kicker="SKILLS"
        title={t({ en: 'Skills & Technologies', zh: '技能与技术' })}
        description={t({
          en: 'Technologies and tools I work with.',
          zh: '我使用的技术与工具。',
        })}
      />
      <section className="grid gap-8 py-10 sm:grid-cols-2 sm:py-12 xl:grid-cols-3">
        {(config.skills || []).map((group) => (
          <div key={t(group.category)}>
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.1em] text-accent">
              {t(group.category)}
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {(group.items || []).map((item) => (
                <li key={item} className="tag-chip">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  )
}
```

- [ ] **Step 3: 浏览器检查**

Run: `pnpm dev`
Expected：`/projects` 全部项目卡片；`/skills` 分组标签；两页导航高亮正确。

- [ ] **Step 4: 提交**

```bash
git add src/pages/ProjectsPage.jsx src/pages/SkillsPage.jsx
git commit -m "feat: 项目与技能子页统一新排版"
```

---

### Task 9: Contact 与 404

**Files:**
- Modify: `src/pages/ContactPage.jsx`（整体替换）
- Modify: `src/pages/NotFoundPage.jsx`（整体替换）
- Modify: `src/components/shared/CopyButton.jsx`（样式类适配）

**Interfaces:**
- Consumes：`config.contactPage.contactMethods`、`config.contactPage.image`、`CopyButton`、`ArrowIcon`、`PageHeader`。
- Produces：无新接口。

- [ ] **Step 1: 替换 `ContactPage.jsx`**

```jsx
import { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import config from '../content/site.yaml'
import PageTitle from '../components/shared/PageTitle'
import PageHeader from '../components/shared/PageHeader'
import ArrowIcon from '../components/shared/ArrowIcon'
import CopyButton from '../components/shared/CopyButton'

export default function ContactPage() {
  const { lang, t } = useLanguage()
  const { contactPage } = config
  const [openQr, setOpenQr] = useState(false)
  const methods = contactPage?.contactMethods || []
  const emailMethod = methods.find((method) => method.icon === 'email')
  const emailValue = emailMethod?.value || config.contact?.email || ''

  return (
    <>
      <PageTitle
        title={t({ en: 'STYLAN · Contact', zh: 'STYLAN · 联系' })}
        description={t(contactPage?.description)}
        t={t}
        lang={lang}
      />
      <PageHeader
        kicker="CONTACT"
        title={t(contactPage?.title) || 'CONTACT'}
        description={t(contactPage?.description)}
      />

      <section className="grid gap-10 py-10 sm:py-12 lg:grid-cols-[1fr_20rem] lg:gap-12">
        <div>
          <a
            href={`mailto:${emailValue}`}
            className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-page transition-colors hover:bg-accent"
          >
            {t({ en: 'Email me', zh: '发送邮件' })}
            <ArrowIcon direction="up-right" size={14} />
          </a>

          <ul className="mt-8 border-t border-line">
            {methods.map((method) => {
              const isWechat = method.icon === 'wechat'
              const isEmail = method.icon === 'email'
              const external = method.href?.startsWith('http')

              return (
                <li key={method.icon || method.value} className="border-b border-line">
                  <div className="flex items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium text-ink">{t(method.label)}</p>
                      <p className="mt-0.5 truncate font-mono-ui text-[11px] text-muted">
                        {method.value}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {isEmail ? (
                        <CopyButton
                          value={method.value}
                          label={{
                            copy: t({ en: 'Copy', zh: '复制' }),
                            copied: t({ en: 'Copied', zh: '已复制' }),
                            failed: t({ en: 'Failed', zh: '失败' }),
                          }}
                        />
                      ) : null}

                      {isWechat ? (
                        <button
                          type="button"
                          onClick={() => setOpenQr((value) => !value)}
                          aria-expanded={openQr}
                          aria-label={t({ en: 'Show WeChat QR code', zh: '显示微信二维码' })}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-subtle hover:text-ink"
                        >
                          <ArrowIcon direction={openQr ? 'down' : 'right'} size={15} />
                        </button>
                      ) : method.href ? (
                        <a
                          href={method.href}
                          target={external ? '_blank' : undefined}
                          rel={external ? 'noopener noreferrer' : undefined}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-subtle hover:text-ink"
                          aria-label={t(method.label)}
                        >
                          <ArrowIcon direction={external ? 'up-right' : 'right'} size={15} />
                        </a>
                      ) : null}
                    </div>
                  </div>

                  {isWechat && openQr && method.qrcode ? (
                    <div className="pb-4">
                      <img
                        src={method.qrcode}
                        alt={t({ en: 'WeChat QR code', zh: '微信二维码' })}
                        width="160"
                        height="160"
                        loading="lazy"
                        decoding="async"
                        className="h-40 w-40 rounded-md border border-line bg-white object-contain p-2"
                      />
                      <p className="mt-2 font-mono-ui text-[10px] text-muted">
                        {t({ en: 'Scan to add', zh: '扫码添加' })}
                      </p>
                    </div>
                  ) : null}
                </li>
              )
            })}

            <li className="border-b border-line">
              <a
                href="/resume.pdf"
                download
                className="flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <p className="text-[15px] font-medium text-ink">
                    {t({ en: 'Resume', zh: '简历' })}
                  </p>
                  <p className="mt-0.5 font-mono-ui text-[11px] text-muted">
                    {t({ en: 'Download PDF', zh: '下载 PDF' })}
                  </p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center text-muted">
                  <ArrowIcon direction="down" size={15} />
                </span>
              </a>
            </li>
          </ul>
        </div>

        {contactPage?.image ? (
          <div>
            <img
              src={contactPage.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="aspect-[3/4] w-full rounded-lg border border-line object-cover"
            />
          </div>
        ) : null}
      </section>
    </>
  )
}
```

- [ ] **Step 2: 替换 `NotFoundPage.jsx`**

```jsx
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/shared/PageTitle'
import ArrowIcon from '../components/shared/ArrowIcon'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const { t, lang } = useLanguage()

  return (
    <>
      <PageTitle title="STYLAN · Not Found" t={t} lang={lang} />
      <section className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.12em] text-accent">ERROR</p>
        <h1 className="mt-4 text-[clamp(4rem,18vw,7rem)] font-semibold leading-none tracking-[-0.04em] text-ink">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-ink">
          {t({ en: 'Page not found', zh: '页面未找到' })}
        </h2>
        <p className="mt-3 max-w-md text-[15px] leading-[1.75] text-muted">
          {t({
            en: 'The page you are looking for does not exist or has been moved.',
            zh: '您访问的页面不存在或已被移动。',
          })}
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-page transition-colors hover:bg-accent"
        >
          {t({ en: 'Back to home', zh: '返回首页' })}
          <ArrowIcon direction="right" size={14} />
        </button>
      </section>
    </>
  )
}
```

- [ ] **Step 3: 适配 `CopyButton.jsx`**

把现有按钮的 `style`/旧类替换为：

```jsx
className="rounded-md border border-line px-2.5 py-1 font-mono-ui text-[10px] uppercase tracking-[0.06em] text-muted transition-colors hover:border-ink/25 hover:text-ink"
```

其余逻辑（复制、状态文案、超时）保持不变。

- [ ] **Step 4: 浏览器检查**

Run: `pnpm dev`
Expected：
- `/contact` 两列（桌面）、单列（移动）；邮箱可复制；微信按钮展开二维码；resume 下载。
- 访问不存在路径显示 404 且可返回首页。
- 移动端 320px 无横向溢出。

- [ ] **Step 5: 提交**

```bash
git add src/pages/ContactPage.jsx src/pages/NotFoundPage.jsx src/components/shared/CopyButton.jsx
git commit -m "feat: 联系页与 404 采用新布局"
```

---

### Task 10: 内容补充与后台 schema

**Files:**
- Modify: `src/content/site.yaml`（projects 增加 4 项与新字段）
- Modify: `src/admin/schema.js`（projects 字段增加 repo/icon/featured）
- Test: `pnpm test`

**Interfaces:**
- Produces：`projects[].{icon?, repo?, featured?}`，后台可编辑。

- [ ] **Step 1: 替换 `site.yaml` 中的 `projects` 段**

```yaml
projects:
  - title:
      en: Orbit Desk
      zh: Orbit Desk
    description:
      en: Customer-service agent for e-commerce — FastAPI, RAG retrieval, SSE streaming, offline evaluation and full-chain tracing.
      zh: 电商客服 Agent：FastAPI + RAG 检索 + SSE 流式响应，含离线评测与全链路监控。
    tags:
      - FastAPI
      - RAG
      - SSE
    link: https://github.com/duan-deqing/e-commerce-cs-agent
    icon: "🛒"
    featured: true
  - title:
      en: Weijian
      zh: 微笺
    description:
      en: Markdown writing workspace for WeChat official accounts — draft, preview and export in one place.
      zh: 公众号 Markdown 写作工作台，集写作、预览与导出于一体。
    tags:
      - React
      - TypeScript
      - Markdown
    link: https://github.com/duan-deqing/weijian
    icon: "✍️"
    featured: true
  - title:
      en: ZensheetCV
      zh: ZensheetCV
    description:
      en: Online Markdown resume editor with live preview — write a clean CV in Markdown and export it anytime.
      zh: 在线 Markdown 简历编辑器，支持实时预览，用 Markdown 写出干净利落的简历并随时导出。
    tags:
      - React
      - Markdown
      - Tailwind CSS
    link: https://duan-deqing.github.io/zensheetCV/#/
    repo: https://github.com/duan-deqing/zensheetCV
    icon: "📄"
    featured: true
  - title:
      en: ArtVault
      zh: ArtVault
    description:
      en: A personal art vault for collecting and showcasing works — browse, organize, and present creative pieces in a calm gallery UI.
      zh: 个人艺术作品库：收集与展示作品，用克制的画廊界面浏览、整理与呈现创作内容。
    tags:
      - React
      - Vite
      - Tailwind CSS
    link: https://stylan-artvault.vercel.app/
    repo: https://github.com/duan-deqing/ArtVault
    icon: "🎨"
    featured: true
  - title:
      en: AI CRM
      zh: AI CRM
    description:
      en: AI assistant built on LangGraph and LangChain, combining RAG with legal Q&A, web search and database queries.
      zh: 基于 LangGraph + LangChain 的 AI 助手，结合 RAG 实现法律咨询、联网搜索与数据库查询。
    tags:
      - LangGraph
      - RAG
      - Python
    link: https://github.com/duan-deqing/AI_CRM
    icon: "🧠"
    featured: true
  - title:
      en: rea
      zh: rea
    description:
      en: Reverse engineering toolkit for agents — inspect app behavior down to native binaries.
      zh: 面向 Agent 的逆向工程工具，从应用行为一路追到原生二进制。
    tags:
      - TypeScript
      - CLI
      - Agents
    link: https://github.com/duan-deqing/rea
    icon: "🔍"
    featured: true
```

- [ ] **Step 2: 更新 `src/admin/schema.js` 的 projects 列表字段**

在 `fields` 中 `link` 之后追加：

```js
        { key: 'repo', label: '仓库链接', type: 'url' },
        { key: 'icon', label: '图标', type: 'text', help: '可填一个 emoji' },
        { key: 'featured', label: '首页精选', type: 'toggle', help: '关闭后不出现在首页' },
```

- [ ] **Step 3: 跑测试与构建**

Run: `pnpm test && pnpm build`
Expected：YAML 解析、后台 schema 校验、RSS 构建全部通过。

- [ ] **Step 4: 后台验证**

Run: `pnpm dev`，打开 `/admin.html`（或 README 记载的本地入口）：
- 项目列表出现 6 项，`repo/icon/featured/` 可编辑并保存。
- 保存后首页立即反映。

- [ ] **Step 5: 提交**

```bash
git add src/content/site.yaml src/admin/schema.js
git commit -m "content: 补充项目卡片数据并扩展后台字段"
```

---

### Task 11: 删除旧组件与死样式

**Files:**
- Delete: `src/components/shared/SiteRail.jsx`、`SubpageHeader.jsx`、`SubPageShell.jsx`、`SiteLayout.jsx`、`Reveal.jsx`、`MagneticButton.jsx`、`PageTransition.jsx`、`Loading.jsx`、`SectionKicker.jsx`
- Delete: `src/theme.js`
- Verify: 全仓 grep 无引用

**Interfaces:**
- 无（纯清理）。

- [ ] **Step 1: 先确认无引用**

Run:
```bash
grep -rn "SiteRail\|SubpageHeader\|SubPageShell\|SiteLayout\|Reveal\|MagneticButton\|PageTransition\|Loading\|SectionKicker\|theme.js" src tests scripts
```
Expected：仅出现被删除文件自身（若有别处引用，先改掉再删）。

- [ ] **Step 2: 删除文件**

```bash
git rm src/components/shared/SiteRail.jsx src/components/shared/SubpageHeader.jsx \
  src/components/shared/SubPageShell.jsx src/components/shared/SiteLayout.jsx \
  src/components/shared/Reveal.jsx src/components/shared/MagneticButton.jsx \
  src/components/shared/PageTransition.jsx src/components/shared/Loading.jsx \
  src/components/shared/SectionKicker.jsx src/theme.js
```

- [ ] **Step 3: 清理旧 CSS 选择器**

Run:
```bash
grep -n "site-rail\|site-main\|site-mobile\|subpage-\|app-enter\|page-shell\|row-link\|row-num\|row-title\|row-meta\|section-kicker\|soft-card\|bg-grid\|grid-line\|prose-measure\|btn-\|magnetic\|reveal" src/index.css
```
Expected：无输出（Task 1 已整体替换；若 `index.css` 有残留则删除）。

- [ ] **Step 4: 全量校验**

Run: `pnpm lint && pnpm test && pnpm build`
Expected：全绿；构建产物中不再出现 `fonts/` 预加载或字体请求。

- [ ] **Step 5: 浏览器回归**

Run: `pnpm dev`
Expected：首页 / 项目 / 博客 / 文章 / 技能 / 联系 / 404 全部正常，控制台无错误。

- [ ] **Step 6: 提交**

```bash
git add -A src
git commit -m "chore: 移除旧布局组件与动效代码"
```

---

### Task 12: Lighthouse 验收与文档

**Files:**
- Create: `lighthouserc.json`
- Modify: `DESIGN.md`（顶部状态与令牌表）
- Modify: `README.md`（如提到左轨/布局则更新）
- Output: `.lighthouseci/` 报告

**Interfaces:**
- 无。

- [ ] **Step 1: 创建 `lighthouserc.json`**

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "pnpm preview --port 4173 --strictPort",
      "startServerReadyPattern": "Local:",
      "url": [
        "http://localhost:4173/",
        "http://localhost:4173/blog",
        "http://localhost:4173/blog/two-sum"
      ],
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    },
    "upload": {
      "target": "filesystem",
      "outputDir": ".lighthouseci"
    }
  }
}
```

- [ ] **Step 2: 构建并跑 Lighthouse**

```bash
pnpm build
npx -y @lhci/cli autorun
```

Expected：
- 三个 URL 均通过断言：performance ≥ 0.90、a11y ≥ 0.95、best-practices ≥ 0.95、seo ≥ 0.95。
- `.lighthouseci/` 生成新报告。

- [ ] **Step 3: 若性能未达标，按顺序排查**

1. Network 面板确认无 `fonts.googleapis.com`、无 `.ttf`、无第三方 JS 请求。
2. Lighthouse 报告看 LCP 元素：应为首页 h1 文本；若仍等待 JS，确认 `HomePage` 是静态导入而非 `lazy`。
3. 检查 CSS 体积与阻塞资源；删除未使用的旧样式残留。
4. 检查 `render-blocking-resources` 与 `unused-javascript`，优先减少首屏 CSS。
5. 复查是否有图片未懒加载（联系页插图、二维码）。
修复后重跑 Step 2，直到通过。

- [ ] **Step 4: 记录桌面端结果（不作为门槛）**

```bash
npx -y lighthouse http://localhost:4173/ --preset=desktop --output=json --output-path=.lighthouseci/home-desktop.json --chrome-flags="--headless=new"
```
Expected：performance ≥ 0.95，记录在最终汇报中。

- [ ] **Step 5: 更新 `DESIGN.md`**

在文件顶部替换状态块为：

```markdown
> 状态：**v3 已实施**（2026-10-29 重构）
> 主方向：**居中单列 · 低饱和卡片 · 系统字体**
> 参考：antfu.me（项目卡片网格）· onur.dev（博客排版）
> 设计规格：`docs/superpowers/specs/2026-10-29-redesign-antfu-onur-design.md`
> 说明：左轨布局、Web 字体、网格背景与重型动效已移除。
```

并把 §3.1 色板表替换为 spec 第 5.1 节的令牌表，§3.2 字体表替换为系统字体栈说明。

- [ ] **Step 6: 更新 `README.md` 中与布局相关的描述**

Run: `grep -n "左栏\|左轨\|Brittany\|Roboto\|FiraCode\|动画\|Loading" README.md`
Expected：把过时描述改为「顶部导航 + 居中单列；系统字体；无重型动效」。

- [ ] **Step 7: 最终全量校验**

```bash
pnpm lint && pnpm test && pnpm build
```

- [ ] **Step 8: 提交**

```bash
git add lighthouserc.json DESIGN.md README.md
git commit -m "docs: 更新设计文档并加入 Lighthouse 验收配置"
```

---

## 执行后的验收清单

- [ ] 所有页面在 320 / 390 / 768 / 1024 / 1440 宽度下无横向溢出。
- [ ] 明暗主题、中英切换在刷新后保持。
- [ ] 首页卡片、文章行、技能、联系区与 `/projects`、`/blog`、`/skills`、`/contact` 数据一致。
- [ ] Ctrl+K 搜索、分类 + 标签组合筛选、TOC 高亮与跳转、微信二维码、resume 下载全部可用。
- [ ] `pnpm lint && pnpm test && pnpm build` 全绿。
- [ ] Lighthouse 三个移动端页面 performance ≥ 90，其余类别 ≥ 95。
- [ ] `git log` 上每个任务一个独立 commit，分支 `redesign/antfu-onur`，未 push。
