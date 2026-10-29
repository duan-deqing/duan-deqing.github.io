# STYLAN v4 双壳重构与后台重做 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按 antfu.me 首页与 onur.dev 博客/子页/后台的源码规则，把站点重做为「antfu 首页 + onur 子页 + onur 后台」的双壳结构，并替换为 Geist 字体与白/zinc/黑/蓝链接配色。

**Architecture:** React Router 布局路由分成 `HomeLayout`（仅 `/`）与 `SubpageLayout`（其余路由），后台保持独立入口。设计令牌集中在 `src/index.css`，页面只消费语义色与 Geist 字体；博客列表、项目表格、后台表单按 onur 的 14px 列表密度与黑底选中态实现。

**Tech Stack:** React 19、React Router 7、Tailwind CSS v4（`@tailwindcss/vite`）、Vite 8、react-markdown + remark-gfm + rehype-highlight、Node `node:test`。

**Spec:** `docs/superpowers/specs/2026-10-29-v4-strict-reference-redesign-design.md`

## Global Constraints

- 不新增运行时依赖（不引入 shadcn、Radix、cva、vaul、framer-motion、图标库）。
- 颜色只通过 `src/index.css` 的 CSS 变量与 Tailwind 语义类使用；组件内禁止十六进制颜色（代码高亮 CSS 除外）。
- 字体固定为自托管 `Geist Sans` + `Geist Mono`；不加载 Google Fonts；中文回退系统 CJK。
- 浅色严格为 `#FFFFFF / #FAFAFA / #E5E7EB / #000000 / #111827 / #6B7280 / #2563EB`；深色按变量等价推导。
- 按钮与选中态一律黑/白；蓝色只用于正文链接与焦点环。
- 路由语义保持不变：`/` `/projects` `/blog` `/blog/:slug` `/skills` `/contact` `*`。
- 内容源保持 YAML + Markdown；双语、主题、搜索、TOC、RSS、简历、二维码、后台 API/校验逻辑全部保留。
- 后台只改表现层与布局，不改 `adminApi`、`validate.js`、`preview.js`、文件读写协议。
- 每个任务结束执行 `pnpm lint && pnpm test && pnpm build`（任务内另注明更小的验证命令），然后本地 commit（不 push）。
- 提交信息使用中文 Conventional Commits（`feat:` / `fix:` / `refactor:` / `docs:` / `chore:`）。
- 浏览器 QA 尺寸：1440×900、390×844、320×568；主题与语言各测一遍。
- 不修改工作区中与本计划无关的 `dist/`、`public/rss.xml`、`OPTIMIZATION.md`、`public/site-structure.svg`、`src/posts/2026-09-16-two-sum.md`。

---

## 文件结构

```text
src/
├── App.jsx                          # 布局路由 + 懒加载
├── layouts/
│   ├── HomeLayout.jsx               # antfu 壳
│   └── SubpageLayout.jsx            # onur 壳（侧栏 + 移动顶栏）
├── components/
│   ├── site/
│   │   ├── icons.jsx                # 内联 SVG 图标集
│   │   ├── HomeHeader.jsx
│   │   ├── HomeFooter.jsx
│   │   ├── SideMenu.jsx
│   │   ├── MenuContent.jsx          # 侧栏与移动抽屉共用
│   │   ├── NavItem.jsx
│   │   ├── MobileHeader.jsx
│   │   ├── MobileMenuSheet.jsx
│   │   ├── PageHeading.jsx
│   │   ├── ThemeLangControls.jsx
│   │   ├── Button.jsx
│   │   ├── SiteLink.jsx
│   │   └── Modal.jsx
│   ├── blog/
│   │   ├── WritingFilterBar.jsx
│   │   ├── WritingList.jsx
│   │   ├── WritingRowSkeleton.jsx
│   │   └── SearchDialog.jsx
│   ├── projects/ProjectTable.jsx
│   └── contact/WechatDialog.jsx
├── utils/
│   ├── cn.js
│   ├── postGroups.js
│   ├── blogSearch.js
│   └── rehypeCodeLines.js
├── pages/                           # 全部重写
├── admin/                           # 布局 + CSS 重做，逻辑不变
├── index.css                        # 令牌、字体、基础排版、代码/表格 utility
└── styles/blog-post.css             # 代码高亮浅/深色
```

保留：`components/shared/PageTitle.jsx`、`CopyButton.jsx`、`ScrollToTop.jsx`、`SocialIcon.jsx`、`ArrowIcon.jsx`、`utils/markdown.js`、`utils/blogFilters.js`、`utils/postFormat.js`、`utils/markdownHeading.js`、`hooks/*`、`scripts/*`、`tests/*`。

---

## M1 · 基础与首页

### Task 1: 设计令牌、Geist 字体与基础样式

**Files:**
- Create: `public/fonts/Geist-Variable.woff2`、`public/fonts/GeistMono-Variable.woff2`、`public/fonts/Geist-LICENSE.txt`
- Delete: `public/fonts/FiraCodeNerdFont-*.ttf`、`public/fonts/Merriweather-*.ttf`、`public/fonts/Roboto-*.ttf`
- Modify: `index.html`、`src/index.css`

**Interfaces:**
- Produces: CSS 变量 `--bg` `--bg-sidebar` `--bg-subtle` `--bg-hover` `--line` `--line-strong` `--heading` `--ink` `--muted` `--muted-strong` `--accent` `--accent-strong` `--active-bg` `--active-fg` `--code-bg` `--code-line` `--overlay` `--glow`；Tailwind 颜色类 `bg-page` `bg-sidebar` `bg-subtle` `bg-hover` `border-line` `border-line-strong` `text-heading` `text-ink` `text-muted` `text-muted-strong` `text-accent` `bg-active` `text-active-fg` `bg-code`；工具类 `.link` `.year-mark` `.writing-table` `.inline-code` `.code-block` `.code-line` `.article-glow` `.slide-enter-content`。

- [ ] **Step 1: 下载 Geist 字体并删除旧字体**

```bash
mkdir -p public/fonts
curl -sSL https://unpkg.com/geist@1.3.1/dist/fonts/geist-sans/Geist-Variable.woff2 -o public/fonts/Geist-Variable.woff2
curl -sSL https://unpkg.com/geist@1.3.1/dist/fonts/geist-mono/GeistMono-Variable.woff2 -o public/fonts/GeistMono-Variable.woff2
curl -sSL https://unpkg.com/geist@1.3.1/LICENSE.txt -o public/fonts/Geist-LICENSE.txt
rm public/fonts/FiraCodeNerdFont-Bold.ttf public/fonts/FiraCodeNerdFont-Regular.ttf
rm public/fonts/Merriweather-Black.ttf public/fonts/Merriweather-Bold.ttf public/fonts/Merriweather-Italic.ttf public/fonts/Merriweather-Light.ttf public/fonts/Merriweather-Regular.ttf
rm public/fonts/Roboto-300.ttf public/fonts/Roboto-400.ttf public/fonts/Roboto-500.ttf public/fonts/Roboto-700.ttf
ls -l public/fonts
```

预期：只剩 `Geist-Variable.woff2`（约 57KB）、`GeistMono-Variable.woff2`（约 58KB）、`Geist-LICENSE.txt`。

- [ ] **Step 2: 在 `index.html` 预加载 Sans**

在 `<link rel="icon" ...>` 之后插入：

```html
<link
  rel="preload"
  href="/fonts/Geist-Variable.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

- [ ] **Step 3: 重写 `src/index.css`**

用以下内容完整替换文件：

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@font-face {
  font-family: "Geist Sans";
  src: url("/fonts/Geist-Variable.woff2") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Geist Mono";
  src: url("/fonts/GeistMono-Variable.woff2") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@theme {
  --font-sans: "Geist Sans", system-ui, -apple-system, "Segoe UI",
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif;
  --font-mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

@theme inline {
  --color-page: var(--bg);
  --color-sidebar: var(--bg-sidebar);
  --color-subtle: var(--bg-subtle);
  --color-hover: var(--bg-hover);
  --color-line: var(--line);
  --color-line-strong: var(--line-strong);
  --color-heading: var(--heading);
  --color-ink: var(--ink);
  --color-muted: var(--muted);
  --color-muted-strong: var(--muted-strong);
  --color-accent: var(--accent);
  --color-accent-strong: var(--accent-strong);
  --color-active: var(--active-bg);
  --color-active-fg: var(--active-fg);
  --color-code: var(--code-bg);
}

:root {
  --bg: #ffffff;
  --bg-sidebar: #fafafa;
  --bg-subtle: #f4f4f5;
  --bg-hover: #e5e7eb;
  --line: #e5e7eb;
  --line-strong: #d1d5db;
  --heading: #000000;
  --ink: #111827;
  --muted: #6b7280;
  --muted-strong: #4b5563;
  --accent: #2563eb;
  --accent-strong: #1d4ed8;
  --active-bg: #000000;
  --active-fg: #ffffff;
  --code-bg: #f3f4f6;
  --code-line: #9ca3af;
  --overlay: rgb(0 0 0 / 0.2);
  --glow: rgb(173 109 244 / 0.25);
  color-scheme: light;
}

.dark {
  --bg: #09090b;
  --bg-sidebar: #111113;
  --bg-subtle: #18181b;
  --bg-hover: #27272a;
  --line: #27272a;
  --line-strong: #3f3f46;
  --heading: #fafafa;
  --ink: #e4e4e7;
  --muted: #a1a1aa;
  --muted-strong: #d4d4d8;
  --accent: #60a5fa;
  --accent-strong: #93c5fd;
  --active-bg: #fafafa;
  --active-fg: #09090b;
  --code-bg: #18181b;
  --code-line: #52525b;
  --overlay: rgb(0 0 0 / 0.6);
  --glow: rgb(96 165 250 / 0.12);
  color-scheme: dark;
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
    background: var(--active-bg);
    color: var(--active-fg);
  }

  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  code,
  pre {
    font-family: var(--font-mono);
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, var(--muted) 35%, transparent) transparent;
  }
}

@layer components {
  .link {
    color: var(--accent);
    text-decoration: none;
    text-underline-offset: 4px;
    transition: color 0.15s ease;
  }

  .link:hover {
    color: var(--accent-strong);
    text-decoration: underline;
  }

  .year-mark {
    position: absolute;
    left: -0.5rem;
    top: -0.75rem;
    font-size: 5rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.04em;
    color: transparent;
    -webkit-text-stroke: 1px var(--muted);
    opacity: 0.18;
    pointer-events: none;
    user-select: none;
  }

  .writing-table tbody tr {
    transition: opacity 0.2s ease;
  }

  .writing-table tbody:hover tr {
    opacity: 0.35;
  }

  .writing-table tbody tr:hover {
    opacity: 1;
  }

  .inline-code {
    display: inline-block;
    border-radius: 6px;
    background: var(--code-bg);
    padding: 0.05rem 0.3rem;
    font-size: 0.875em;
    color: var(--ink);
  }

  .inline-code::before,
  .inline-code::after {
    content: "`";
    color: var(--muted);
  }

  .code-block {
    margin: 1.5rem 0;
    overflow-x: auto;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: var(--bg);
    padding: 1.25rem 1rem;
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.7;
  }

  .code-line {
    display: block;
    position: relative;
    padding-left: 2.5rem;
  }

  .code-line::before {
    content: attr(data-line);
    position: absolute;
    left: 0;
    width: 1.75rem;
    text-align: right;
    color: var(--code-line);
    font-variant-numeric: tabular-nums;
    user-select: none;
  }

  .article-glow {
    position: absolute;
    top: 0;
    right: 0;
    height: 320px;
    width: 320px;
    border-radius: 9999px;
    background: var(--glow);
    filter: blur(80px);
    pointer-events: none;
  }

  .slide-enter-content > * {
    animation: slide-enter 1s both 1;
    animation-delay: calc(var(--enter-stage, 0) * 90ms);
  }

  .slide-enter-content > :nth-child(1) { --enter-stage: 1; }
  .slide-enter-content > :nth-child(2) { --enter-stage: 2; }
  .slide-enter-content > :nth-child(3) { --enter-stage: 3; }
  .slide-enter-content > :nth-child(4) { --enter-stage: 4; }
  .slide-enter-content > :nth-child(5) { --enter-stage: 5; }
  .slide-enter-content > :nth-child(6) { --enter-stage: 6; }
  .slide-enter-content > :nth-child(7) { --enter-stage: 7; }
  .slide-enter-content > :nth-child(8) { --enter-stage: 8; }
  .slide-enter-content > :nth-child(9) { --enter-stage: 9; }
  .slide-enter-content > :nth-child(10) { --enter-stage: 10; }

  @keyframes slide-enter {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .slide-enter-content > * {
      animation: none;
    }

    .writing-table tbody tr {
      transition: none;
    }
  }
}
```

- [ ] **Step 4: 验证构建与字体产物**

```bash
pnpm build
find dist/fonts -maxdepth 1 -type f -printf '%f %s\n' | sort
```

预期：构建成功；`dist/fonts` 中只有两个 Geist woff2（若 Vite 未复制 public 字体，用 `ls dist/fonts` 确认；public 目录会原样复制）。

- [ ] **Step 5: Commit**

```bash
git add index.html src/index.css public/fonts
git commit -m "feat: 引入 Geist 字体与 v4 设计令牌"
```

---

### Task 2: 基础 UI 原语（cn、图标、Button、SiteLink、PageHeading、主题语言）

**Files:**
- Create: `src/utils/cn.js`、`src/components/site/icons.jsx`、`Button.jsx`、`SiteLink.jsx`、`PageHeading.jsx`、`ThemeLangControls.jsx`
- Test: `tests/unit/cn.test.js`

**Interfaces:**
- Produces: `cn(...values): string`；`Button({ as, variant, size, className, ...props })`；`SiteLink({ href, className, children })`；`PageHeading({ title, description, actions })`；`ThemeLangControls({ variant?: 'icon' | 'sidebar', className? })`；图标组件 `HomeIcon FolderIcon PenIcon SparklesIcon MailIcon GitHubIcon BilibiliIcon RssIcon MenuIcon CloseIcon SunIcon MoonIcon SearchIcon DownloadIcon ArrowUpRightIcon WechatIcon`。

- [ ] **Step 1: 写 `cn` 的失败测试**

`tests/unit/cn.test.js`：

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { cn } from '../../src/utils/cn.js'

test('cn joins truthy class names and flattens arrays', () => {
  assert.equal(cn('a', false, 'b', null, undefined, ['c', ''], [['d']]), 'a b c d')
})

test('cn returns an empty string when nothing is truthy', () => {
  assert.equal(cn(false, null, undefined, ''), '')
})
```

- [ ] **Step 2: 运行测试确认失败**

```bash
node --test tests/unit/cn.test.js
```

预期：FAIL，`Cannot find module .../src/utils/cn.js`。

- [ ] **Step 3: 实现 `cn`**

`src/utils/cn.js`：

```js
export function cn(...values) {
  return values.flat(Infinity).filter(Boolean).join(' ')
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
node --test tests/unit/cn.test.js
```

预期：2 个测试 PASS。

- [ ] **Step 5: 写图标集**

`src/components/site/icons.jsx`：

```jsx
function LineIcon({ children, size = 16, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      {children}
    </svg>
  )
}

function FillIcon({ children, size = 16, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      {children}
    </svg>
  )
}

export const HomeIcon = (props) => (
  <LineIcon {...props}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </LineIcon>
)

export const FolderIcon = (props) => (
  <LineIcon {...props}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
  </LineIcon>
)

export const PenIcon = (props) => (
  <LineIcon {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </LineIcon>
)

export const SparklesIcon = (props) => (
  <LineIcon {...props}>
    <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />
    <path d="M19 15.5 19.7 18l2.3.7-2.3.8L19 22l-.7-2.5-2.3-.8 2.3-.7Z" />
  </LineIcon>
)

export const MailIcon = (props) => (
  <LineIcon {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </LineIcon>
)

export const GitHubIcon = (props) => (
  <FillIcon {...props}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
  </FillIcon>
)

export const BilibiliIcon = (props) => (
  <FillIcon {...props}>
    <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773z" />
  </FillIcon>
)

export const RssIcon = (props) => (
  <LineIcon {...props}>
    <path d="M4 11a9 9 0 0 1 9 9" />
    <path d="M4 4a16 16 0 0 1 16 16" />
    <circle cx="5" cy="19" r="1" />
  </LineIcon>
)

export const MenuIcon = (props) => (
  <LineIcon {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </LineIcon>
)

export const CloseIcon = (props) => (
  <LineIcon {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </LineIcon>
)

export const SunIcon = (props) => (
  <LineIcon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </LineIcon>
)

export const MoonIcon = (props) => (
  <LineIcon {...props}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
  </LineIcon>
)

export const SearchIcon = (props) => (
  <LineIcon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </LineIcon>
)

export const DownloadIcon = (props) => (
  <LineIcon {...props}>
    <path d="M12 3v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M5 21h14" />
  </LineIcon>
)

export const ArrowUpRightIcon = (props) => (
  <LineIcon {...props}>
    <path d="M7 17 17 7" />
    <path d="M9 7h8v8" />
  </LineIcon>
)

export const WechatIcon = (props) => (
  <LineIcon {...props}>
    <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3 9.6 9.6 0 0 1-3.6-.7L4 20l1-3.4A8.2 8.2 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" />
    <path d="M9 10h.01M15 10h.01" />
  </LineIcon>
)
```

- [ ] **Step 6: 写 Button / SiteLink / PageHeading / ThemeLangControls**

`src/components/site/Button.jsx`：

```jsx
import { cn } from '../../utils/cn'

const VARIANTS = {
  primary: 'bg-active text-active-fg hover:opacity-90',
  outline: 'border border-line bg-page text-ink shadow-xs hover:bg-subtle dark:shadow-none',
  ghost: 'text-ink hover:bg-subtle',
  link: 'text-ink underline-offset-4 hover:underline',
}

const SIZES = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-9 px-4 text-sm',
  icon: 'size-9',
}

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  className,
  type,
  ...props
}) {
  return (
    <Comp
      type={Comp === 'button' ? type || 'button' : type}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    />
  )
}
```

`src/components/site/SiteLink.jsx`：

```jsx
import { Link } from 'react-router-dom'

export default function SiteLink({ href, children, ...props }) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  }
  return (
    <Link to={href} {...props}>
      {children}
    </Link>
  )
}
```

`src/components/site/PageHeading.jsx`：

```jsx
export default function PageHeading({ title, description, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-heading md:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}
```

`src/components/site/ThemeLangControls.jsx`：

```jsx
import { useLanguage } from '../../hooks/useLanguage'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../utils/cn'
import { MoonIcon, SunIcon } from './icons'

const BUTTON =
  'inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-strong transition-colors hover:bg-hover hover:text-ink'

export default function ThemeLangControls({ variant = 'icon', className }) {
  const { isDark, toggle: toggleTheme } = useTheme()
  const { lang, toggle: toggleLang } = useLanguage()
  const showLabels = variant === 'sidebar'

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button
        type="button"
        className={BUTTON}
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
        {showLabels ? <span>{isDark ? '浅色' : '深色'}</span> : null}
      </button>
      <button
        type="button"
        className={BUTTON}
        onClick={toggleLang}
        aria-label={lang === 'en' ? '切换为中文' : 'Switch to English'}
        title={lang === 'en' ? '切换为中文' : 'Switch to English'}
      >
        <span>{lang === 'en' ? '中' : 'EN'}</span>
        {showLabels ? <span>{lang === 'en' ? '中文' : 'English'}</span> : null}
      </button>
    </div>
  )
}
```

- [ ] **Step 7: 验证**

```bash
pnpm lint
pnpm build
```

预期：无未使用导入；构建成功。

- [ ] **Step 8: Commit**

```bash
git add src/utils/cn.js tests/unit/cn.test.js src/components/site
git commit -m "feat: 新增 v4 基础 UI 原语与图标"
```

---

### Task 3: 首页壳与路由布局拆分

**Files:**
- Create: `src/layouts/HomeLayout.jsx`、`src/components/site/HomeHeader.jsx`、`HomeFooter.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `ThemeLangControls`、`SocialIcon`、`ArrowUpRightIcon`。
- Produces: `HomeLayout` 渲染 `<Outlet />`；`HomeHeader` 使用 `config.navLinks`；`HomeFooter` 使用 `config.footer.copyright` 与 `config.socialLinks`。

- [ ] **Step 1: 写 `HomeHeader.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import config from '../../content/site.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import { cn } from '../../utils/cn'
import ThemeLangControls from './ThemeLangControls'
import { CloseIcon, MenuIcon } from './icons'

export default function HomeHeader() {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const links = config.navLinks || []

  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="mx-auto w-full max-w-6xl px-5 py-6 md:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/"
          className="text-sm font-semibold tracking-tight text-heading"
          aria-label={t({ en: 'STYLAN home', zh: 'STYLAN 首页' })}
        >
          STYLAN
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className="text-sm text-ink opacity-60 transition-opacity hover:opacity-100"
            >
              {t(link.label)}
            </Link>
          ))}
          <ThemeLangControls />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeLangControls />
          <button
            type="button"
            className="grid size-8 place-items-center rounded-md text-ink hover:bg-subtle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          aria-label="Mobile"
          className="mt-4 flex flex-col divide-y divide-line border-y border-line md:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'py-3 text-base',
                pathname === link.href ? 'text-heading' : 'text-muted-strong'
              )}
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  )
}
```

- [ ] **Step 2: 写 `HomeFooter.jsx`**

```jsx
import config from '../../content/site.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import SocialIcon from '../shared/SocialIcon'

export default function HomeFooter() {
  const { t } = useLanguage()
  const socials = config.socialLinks || []
  const copyright = config.footer?.copyright || `© ${new Date().getFullYear()} STYLAN`

  return (
    <footer className="mx-auto w-full max-w-[65ch] px-5 pb-6 pt-10 md:px-7">
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-xs text-muted">{copyright}</p>
        <div className="flex items-center gap-1">
          {socials.map((social) => (
            <SocialIcon key={social.platform} platform={social.platform} href={social.url} />
          ))}
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center rounded-md px-2 text-xs text-muted-strong transition-colors hover:bg-subtle hover:text-ink"
          >
            {t({ en: 'RSS', zh: 'RSS' })}
          </a>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: 写 `HomeLayout.jsx`**

```jsx
import { Outlet } from 'react-router-dom'
import HomeFooter from '../components/site/HomeFooter'
import HomeHeader from '../components/site/HomeHeader'

export default function HomeLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-page text-ink">
      <HomeHeader />
      <main className="mx-auto w-full max-w-[65ch] flex-1 px-5 py-10 md:px-7">
        <Outlet />
      </main>
      <HomeFooter />
    </div>
  )
}
```

- [ ] **Step 4: 重写 `src/App.jsx`**

```jsx
import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppSettingsProvider } from './hooks/AppSettings'
import ScrollToTop from './components/shared/ScrollToTop'
import HomeLayout from './layouts/HomeLayout'
import SubpageLayout from './layouts/SubpageLayout'
import HomePage from './pages/HomePage'

const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const SkillsPage = lazy(() => import('./pages/SkillsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function prefetchSubpages() {
  const loaders = [
    () => import('./pages/ProjectsPage'),
    () => import('./pages/BlogPage'),
    () => import('./pages/SkillsPage'),
    () => import('./pages/ContactPage'),
  ]
  loaders.forEach((load) => {
    load().catch(() => {})
  })
}

function page(element) {
  return <Suspense fallback={<div className="min-h-[60vh]" aria-hidden />}>{element}</Suspense>
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
      <ScrollToTop />
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route element={<SubpageLayout />}>
          <Route path="/projects" element={page(<ProjectsPage />)} />
          <Route path="/blog" element={page(<BlogPage />)} />
          <Route path="/blog/:slug" element={page(<BlogPostPage />)} />
          <Route path="/skills" element={page(<SkillsPage />)} />
          <Route path="/contact" element={page(<ContactPage />)} />
          <Route path="*" element={page(<NotFoundPage />)} />
        </Route>
      </Routes>
    </AppSettingsProvider>
  )
}
```

`SubpageLayout` 在 Task 6 创建；本任务先创建占位实现，保证构建：

`src/layouts/SubpageLayout.jsx`：

```jsx
import { Outlet } from 'react-router-dom'

export default function SubpageLayout() {
  return (
    <div className="min-h-dvh bg-page text-ink">
      <main className="mx-auto w-full max-w-5xl px-6 py-8 lg:px-8 lg:py-16">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 5: 验证首页与路由**

```bash
pnpm dev
```

浏览器打开 `/`：应看到 antfu 式顶部导航 + 旧 HomePage 内容（Task 4 再重写）；打开 `/blog`：应能看到旧博客页被包在占位子页壳中。确认无控制台错误。

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/layouts src/components/site/HomeHeader.jsx src/components/site/HomeFooter.jsx
git commit -m "feat: 拆分 antfu 首页壳与子页布局路由"
```

---

### Task 4: 首页内容与按年分组工具

**Files:**
- Create: `src/utils/postGroups.js`、`src/pages/HomePage.jsx`（重写）
- Test: `tests/unit/post-groups.test.js`

**Interfaces:**
- Produces: `groupPostsByYear(posts): Array<{ year: number, posts: Array }>`（输入需已按日期降序）。
- Consumes: `getAllPosts`、`formatDate`、`SiteLink`/`Link`、`ArrowUpRightIcon`、`SocialIcon`。

- [ ] **Step 1: 写分组测试**

`tests/unit/post-groups.test.js`：

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { groupPostsByYear } from '../../src/utils/postGroups.js'

test('groups consecutive posts by year', () => {
  const posts = [
    { slug: 'a', date: '2026-05-01' },
    { slug: 'b', date: '2026-01-01' },
    { slug: 'c', date: '2023-07-23' },
  ]
  assert.deepEqual(
    groupPostsByYear(posts).map((group) => [group.year, group.posts.map((post) => post.slug)]),
    [[2026, ['a', 'b']], [2023, ['c']]]
  )
})

test('returns an empty array for empty input', () => {
  assert.deepEqual(groupPostsByYear([]), [])
})
```

- [ ] **Step 2: 运行确认失败**

```bash
node --test tests/unit/post-groups.test.js
```

预期：FAIL，模块不存在。

- [ ] **Step 3: 实现 `postGroups.js`**

```js
export function groupPostsByYear(posts = []) {
  const groups = []
  for (const post of posts) {
    const year = new Date(post.date).getFullYear()
    const last = groups[groups.length - 1]
    if (last && last.year === year) last.posts.push(post)
    else groups.push({ year, posts: [post] })
  }
  return groups
}
```

- [ ] **Step 4: 运行确认通过**

```bash
node --test tests/unit/post-groups.test.js
```

- [ ] **Step 5: 重写 `src/pages/HomePage.jsx`**

```jsx
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import config from '../content/site.yaml'
import { useLanguage } from '../hooks/useLanguage'
import { getAllPosts } from '../utils/markdown'
import { groupPostsByYear } from '../utils/postGroups'
import { formatDate } from '../utils/postFormat'
import PageTitle from '../components/shared/PageTitle'
import {
  ArrowUpRightIcon,
  BilibiliIcon,
  GitHubIcon,
  MailIcon,
  RssIcon,
} from '../components/site/icons'

function SocialLink({ href, label, Icon }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="inline-flex items-center gap-2 text-sm text-muted-strong transition-colors hover:text-ink"
    >
      <Icon />
      {label}
    </a>
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
```

- [ ] **Step 6: 验证**

```bash
node --test tests/unit/post-groups.test.js
pnpm build
```

浏览器检查 `/`：三段 lead 文案、社交行、年份水印、5 篇最新文章、页脚；移动端 390px 无横向滚动。

- [ ] **Step 7: Commit**

```bash
git add src/pages/HomePage.jsx src/utils/postGroups.js tests/unit/post-groups.test.js
git commit -m "feat: 首页改为 antfu 式文本流与年份文章列表"
```

---

### Task 5: 清理旧首页组件与旧壳

**Files:**
- Delete: `src/components/HomePage/Hero.jsx`、`AboutSection.jsx`、`ProjectGrid.jsx`、`ProjectCard.jsx`、`SkillsSection.jsx`、`ContactCta.jsx`
- Delete: `src/components/shared/SiteHeader.jsx`、`SiteFooter.jsx`、`ThemeLangControls.jsx`
- Keep for later: `PostRow.jsx`、`PostRowSkeleton.jsx`（博客页在 Task 10 前仍引用）

- [ ] **Step 1: 确认无引用**

```bash
grep -rn "Hero\|AboutSection\|ProjectGrid\|ProjectCard\|SkillsSection\|ContactCta\|SiteHeader\|SiteFooter\|shared/ThemeLangControls" src --include="*.jsx" --include="*.js" | grep -v "components/HomePage\|components/shared/SiteHeader\|components/shared/SiteFooter\|components/shared/ThemeLangControls"
```

预期：无输出（或仅有历史注释）。

- [ ] **Step 2: 删除文件**

```bash
git rm src/components/HomePage/Hero.jsx src/components/HomePage/AboutSection.jsx src/components/HomePage/ProjectGrid.jsx src/components/HomePage/ProjectCard.jsx src/components/HomePage/SkillsSection.jsx src/components/HomePage/ContactCta.jsx
git rm src/components/shared/SiteHeader.jsx src/components/shared/SiteFooter.jsx src/components/shared/ThemeLangControls.jsx
```

- [ ] **Step 3: 全量验证 M1**

```bash
pnpm lint
pnpm test
pnpm build
```

预期：全部通过；首页不再引用旧组件。

- [ ] **Step 4: Commit**

```bash
git commit -m "refactor: 移除旧首页与旧站点壳组件"
```

---

## M2 · 子页与博客

### Task 6: onur 子页壳（侧栏、移动抽屉、路由布局）

**Files:**
- Create: `src/components/site/NavItem.jsx`、`MenuContent.jsx`、`SideMenu.jsx`、`MobileHeader.jsx`、`MobileMenuSheet.jsx`
- Modify: `src/layouts/SubpageLayout.jsx`

**Interfaces:**
- Produces: `NAV_ITEMS`（`{ href, label: {en,zh}, Icon }[]`，顺序 Home / Projects / Blog / Skills / Contact）；`MenuContent({ onNavigate? })`；`SideMenu`；`MobileHeader({ open, onOpenMenu })`；`MobileMenuSheet({ open, onClose })`；`SubpageLayout` 使用 `max-w-5xl` 内容区。
- Consumes: `config`、`useLanguage`、`useLocation`、`useNavigate`、`ThemeLangControls`。

- [ ] **Step 1: 写 `NavItem.jsx`**

```jsx
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { ArrowUpRightIcon } from './icons'

const BASE = 'flex w-full items-center justify-between gap-2 rounded-lg p-2 text-sm transition-colors'

export default function NavItem({
  href,
  label,
  Icon,
  active = false,
  shortcut,
  external = false,
  onNavigate,
}) {
  const inner = (
    <>
      <span className="flex min-w-0 items-center gap-2">
        <Icon size={16} className="shrink-0" />
        <span className={cn('truncate font-medium', active && 'text-active-fg')}>{label}</span>
      </span>
      {external ? (
        <ArrowUpRightIcon size={14} className="shrink-0 opacity-70" />
      ) : shortcut ? (
        <span
          className={cn(
            'grid size-5 shrink-0 place-content-center rounded border border-line bg-subtle text-[11px] font-medium text-muted',
            active && 'border-transparent bg-active-fg/15 text-active-fg'
          )}
          aria-hidden="true"
        >
          {shortcut}
        </span>
      ) : null}
    </>
  )

  const className = cn(
    BASE,
    active ? 'bg-active text-active-fg' : 'text-ink hover:bg-hover'
  )

  if (external) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={className}
        onClick={onNavigate}
      >
        {inner}
      </a>
    )
  }

  return (
    <Link to={href} className={className} aria-current={active ? 'page' : undefined} onClick={onNavigate}>
      {inner}
    </Link>
  )
}
```

- [ ] **Step 2: 写 `MenuContent.jsx`**

```jsx
import { Link, useLocation } from 'react-router-dom'
import config from '../../content/site.yaml'
import { useLanguage } from '../../hooks/useLanguage'
import NavItem from './NavItem'
import {
  BilibiliIcon,
  FolderIcon,
  GitHubIcon,
  HomeIcon,
  MailIcon,
  PenIcon,
  RssIcon,
  SparklesIcon,
} from './icons'

export const NAV_ITEMS = [
  { href: '/', label: { en: 'Home', zh: '首页' }, Icon: HomeIcon },
  { href: '/projects', label: { en: 'Projects', zh: '项目' }, Icon: FolderIcon },
  { href: '/blog', label: { en: 'Blog', zh: '博客' }, Icon: PenIcon },
  { href: '/skills', label: { en: 'Skills', zh: '技能' }, Icon: SparklesIcon },
  { href: '/contact', label: { en: 'Contact', zh: '联系' }, Icon: MailIcon },
]

export function isNavActive(pathname, href) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function MenuContent({ onNavigate }) {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const name = t(config.personal.name)
  const role = t(config.personal.tags?.[0] || '')
  const email = config.contact?.email
  const socials = config.socialLinks || []
  const avatar = config.personal.avatar

  const online = [
    ...socials.map((social) => ({
      href: social.url,
      label: social.platform,
      Icon: social.platform.toLowerCase().includes('github') ? GitHubIcon : BilibiliIcon,
    })),
    ...(email ? [{ href: `mailto:${email}`, label: 'Email', Icon: MailIcon }] : []),
    { href: '/rss.xml', label: 'RSS', Icon: RssIcon },
  ]

  return (
    <div className="flex w-full flex-col gap-4 text-sm">
      <Link
        to="/"
        className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-hover"
        onClick={onNavigate}
      >
        {typeof avatar === 'string' && avatar.startsWith('/') ? (
          <img
            src={avatar}
            alt={name}
            width={40}
            height={40}
            loading="lazy"
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

      <nav aria-label="Sections" className="flex flex-col gap-1">
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
        <span className="px-2 text-xs font-medium text-muted">Online</span>
        <div className="flex flex-col gap-1">
          {online.map((item) => (
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
    </div>
  )
}
```

- [ ] **Step 3: 写 `SideMenu.jsx`**

```jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeLangControls from './ThemeLangControls'
import MenuContent, { NAV_ITEMS } from './MenuContent'

function isEditable(target) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

export default function SideMenu() {
  const navigate = useNavigate()

  useEffect(() => {
    function onKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isEditable(event.target)) return
      const index = Number(event.code.replace('Digit', '')) - 1
      const item = NAV_ITEMS[index]
      if (item && event.code.startsWith('Digit')) {
        event.preventDefault()
        navigate(item.href)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navigate])

  return (
    <aside className="hidden lg:flex lg:h-dvh lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-line lg:bg-sidebar xl:w-72">
      <div className="flex-1 overflow-y-auto p-3">
        <MenuContent />
      </div>
      <div className="border-t border-line p-3">
        <ThemeLangControls variant="sidebar" className="justify-between" />
      </div>
    </aside>
  )
}
```

- [ ] **Step 4: 写 `MobileHeader.jsx` 与 `MobileMenuSheet.jsx`**

`MobileHeader.jsx`：

```jsx
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import ThemeLangControls from './ThemeLangControls'
import { MenuIcon } from './icons'
import { NAV_ITEMS, isNavActive } from './MenuContent'

export default function MobileHeader({ open, onOpenMenu }) {
  const { pathname } = useLocation()
  const { t } = useLanguage()
  const current = NAV_ITEMS.find((item) => isNavActive(pathname, item.href))

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b border-line bg-page px-3 lg:hidden">
      <button
        type="button"
        className="grid size-8 place-items-center rounded-md text-ink hover:bg-subtle"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={onOpenMenu}
      >
        <MenuIcon size={18} />
      </button>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight text-heading">
        {current ? t(current.label) : 'STYLAN'}
      </span>
      <ThemeLangControls />
    </header>
  )
}
```

`MobileMenuSheet.jsx`：

```jsx
import { useEffect, useRef } from 'react'
import MenuContent from './MenuContent'
import ThemeLangControls from './ThemeLangControls'
import { CloseIcon } from './icons'

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

export default function MobileMenuSheet({ open, onClose }) {
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const restoreRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    restoreRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const items = Array.from(panelRef.current.querySelectorAll(FOCUSABLE))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      const restore = restoreRef.current
      if (restore instanceof HTMLElement) restore.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-[var(--overlay)]"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-y-auto rounded-t-2xl border-t border-line bg-page p-4 shadow-xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-heading">STYLAN</span>
          <button
            ref={closeRef}
            type="button"
            className="grid size-8 place-items-center rounded-md text-ink hover:bg-subtle"
            aria-label="Close menu"
            onClick={onClose}
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <MenuContent onNavigate={onClose} />
        <div className="mt-3 border-t border-line pt-3">
          <ThemeLangControls variant="sidebar" className="justify-between" />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: 重写 `SubpageLayout.jsx`**

```jsx
import { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'
import MobileHeader from '../components/site/MobileHeader'
import MobileMenuSheet from '../components/site/MobileMenuSheet'
import SideMenu from '../components/site/SideMenu'

export default function SubpageLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <div className="min-h-dvh bg-page text-ink lg:flex lg:h-dvh lg:overflow-hidden">
      <SideMenu />
      <div className="flex min-w-0 flex-1 flex-col lg:h-dvh lg:overflow-y-auto">
        <MobileHeader open={menuOpen} onOpenMenu={openMenu} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 pt-8 lg:px-8 lg:pb-16 lg:pt-24">
          <Outlet />
        </main>
      </div>
      <MobileMenuSheet open={menuOpen} onClose={closeMenu} />
    </div>
  )
}
```

- [ ] **Step 6: 验证**

```bash
pnpm lint
pnpm build
pnpm dev
```

检查 `/blog`：桌面显示 240px 侧栏、active 项黑底白字、快捷键 1–5 可跳转；390px 下显示 48px 顶栏、底部抽屉可开合、Esc 关闭、焦点回到菜单按钮。

- [ ] **Step 7: Commit**

```bash
git add src/layouts/SubpageLayout.jsx src/components/site
git commit -m "feat: 实现 onur 式侧栏与移动抽屉子页壳"
```

---

### Task 7: 项目页（onur workspace 表格）

**Files:**
- Create: `src/components/projects/ProjectTable.jsx`
- Rewrite: `src/pages/ProjectsPage.jsx`

**Interfaces:**
- `ProjectTable({ projects })`：项目字段 `title`（i18n）、`description`（i18n）、`tags`、`link`、`repo`、`icon`。

- [ ] **Step 1: 写 `ProjectTable.jsx`**

```jsx
import { useLanguage } from '../../hooks/useLanguage'
import { ArrowUpRightIcon } from '../site/icons'

function projectUrl(project) {
  return project.link || project.repo || null
}

function ProjectIcon({ project }) {
  return (
    <span className="grid size-6 shrink-0 place-items-center text-base" aria-hidden="true">
      {project.icon || '•'}
    </span>
  )
}

export default function ProjectTable({ projects }) {
  const { t } = useLanguage()

  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border border-line md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="px-4 py-3 font-normal">Project</th>
              <th className="px-4 py-3 font-normal">Stack</th>
              <th className="w-24 px-4 py-3 text-right font-normal">Link</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const url = projectUrl(project)
              return (
                <tr
                  key={t(project.title)}
                  className="border-b border-line transition-colors last:border-0 hover:bg-subtle/50"
                >
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <ProjectIcon project={project} />
                      <span className="font-medium text-heading">{t(project.title)}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{(project.tags || []).join(' · ')}</td>
                  <td className="px-4 py-3 text-right">
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-accent hover:underline"
                      >
                        Visit
                        <ArrowUpRightIcon size={13} />
                      </a>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {projects.map((project) => {
          const url = projectUrl(project)
          return (
            <article key={t(project.title)} className="rounded-lg border border-line p-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="flex items-center gap-2 font-medium text-heading">
                  <ProjectIcon project={project} />
                  {t(project.title)}
                </h2>
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent"
                    aria-label={`${t(project.title)} link`}
                  >
                    <ArrowUpRightIcon size={16} />
                  </a>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t(project.description)}</p>
              <p className="mt-3 text-xs text-muted">{(project.tags || []).join(' · ')}</p>
            </article>
          )
        })}
      </div>
    </>
  )
}
```

- [ ] **Step 2: 重写 `ProjectsPage.jsx`**

```jsx
import config from '../content/site.yaml'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'
import ProjectTable from '../components/projects/ProjectTable'
import Button from '../components/site/Button'
import { ArrowUpRightIcon } from '../components/site/icons'

export default function ProjectsPage() {
  const { lang, t } = useLanguage()
  const projects = config.projects || []

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageTitle
        title={`STYLAN · ${t({ en: 'Projects', zh: '项目' })}`}
        description={t({
          en: 'Projects I build and maintain — AI agents, writing tools and small products.',
          zh: '我构建与维护的项目：AI Agent、写作工具与小产品。',
        })}
        t={t}
        lang={lang}
      />
      <PageHeading
        title={t({ en: 'Projects', zh: '项目' })}
        description={t({
          en: 'A selection of things I have built or maintained.',
          zh: '我构建或维护过的一部分作品。',
        })}
        actions={
          <Button
            as="a"
            variant="outline"
            href="https://github.com/duan-deqing"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
            <ArrowUpRightIcon size={14} />
          </Button>
        }
      />
      <ProjectTable projects={projects} />
    </div>
  )
}
```

- [ ] **Step 3: 验证**

```bash
pnpm build
pnpm dev
```

检查 `/projects`：桌面表格 3 列、hover 浅底；390px 下为卡片列表；项目链接可点击。

- [ ] **Step 4: Commit**

```bash
git add src/pages/ProjectsPage.jsx src/components/projects/ProjectTable.jsx
git commit -m "feat: 项目页改为 onur 式表格与移动卡片"
```

---

### Task 8: 技能页、联系页与通用 Modal

**Files:**
- Create: `src/components/site/Modal.jsx`、`src/components/contact/WechatDialog.jsx`
- Rewrite: `src/pages/SkillsPage.jsx`、`src/pages/ContactPage.jsx`

**Interfaces:**
- `Modal({ open, onClose, label, children, panelClassName })`：Esc、遮罩、焦点锁定、滚动锁。
- `WechatDialog({ open, onClose, qrcode, alt })`。

- [ ] **Step 1: 写 `Modal.jsx`**

```jsx
import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

export default function Modal({ open, onClose, label, children, panelClassName = '' }) {
  const panelRef = useRef(null)
  const restoreRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    restoreRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const panel = panelRef.current
    const focusables = () => Array.from(panel?.querySelectorAll(FOCUSABLE) || [])
    requestAnimationFrame(() => focusables()[0]?.focus())

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      const restore = restoreRef.current
      if (restore instanceof HTMLElement) restore.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[var(--overlay)]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`relative w-full max-w-lg rounded-lg border border-line bg-page p-5 shadow-xl ${panelClassName}`}
      >
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 写 `WechatDialog.jsx`**

```jsx
import Modal from '../site/Modal'
import Button from '../site/Button'
import { CloseIcon } from '../site/icons'

export default function WechatDialog({ open, onClose, qrcode, alt }) {
  return (
    <Modal open={open} onClose={onClose} label={alt || 'WeChat QR code'} panelClassName="max-w-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight text-heading">{alt || 'WeChat'}</h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <CloseIcon size={16} />
        </Button>
      </div>
      <img
        src={qrcode}
        alt={alt || 'WeChat QR code'}
        width={240}
        height={240}
        loading="lazy"
        decoding="async"
        className="mx-auto size-60 rounded-lg border border-line bg-page object-contain"
      />
    </Modal>
  )
}
```

- [ ] **Step 3: 重写 `SkillsPage.jsx`**

```jsx
import config from '../content/site.yaml'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'

export default function SkillsPage() {
  const { lang, t } = useLanguage()
  const groups = config.skills || []

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageTitle
        title={`STYLAN · ${t({ en: 'Skills', zh: '技能' })}`}
        description={t({
          en: 'The tools and technologies I use to build AI products.',
          zh: '我用来构建 AI 产品的工具与技术。',
        })}
        t={t}
        lang={lang}
      />
      <PageHeading
        title={t({ en: 'Skills', zh: '技能' })}
        description={t({
          en: 'Tools I reach for when building and shipping.',
          zh: '构建与交付时常用的工具。',
        })}
      />

      <div className="border-t border-line">
        {groups.map((group) => (
          <section
            key={t(group.category)}
            className="grid gap-2 border-b border-line py-5 md:grid-cols-[160px_1fr] md:gap-6"
          >
            <h2 className="text-sm font-medium text-heading">{t(group.category)}</h2>
            <p className="text-sm leading-relaxed text-muted">
              {(group.items || []).join(' · ')}
            </p>
          </section>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 重写 `ContactPage.jsx`**

```jsx
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
```

- [ ] **Step 5: 验证**

```bash
pnpm build
pnpm dev
```

检查 `/skills` 行式定义列表；`/contact` 主/次按钮、链接行、微信二维码弹窗（Esc/遮罩关闭、焦点归还）、简历下载。

- [ ] **Step 6: Commit**

```bash
git add src/pages/SkillsPage.jsx src/pages/ContactPage.jsx src/components/site/Modal.jsx src/components/contact/WechatDialog.jsx
git commit -m "feat: 技能与联系页改为 onur 式排版"
```

---

### Task 9: 404 页

**Files:**
- Rewrite: `src/pages/NotFoundPage.jsx`

- [ ] **Step 1: 重写 `NotFoundPage.jsx`**

```jsx
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'
import { ArrowUpRightIcon } from '../components/site/icons'

export default function NotFoundPage() {
  const { lang, t } = useLanguage()

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageTitle
        title={`STYLAN · ${t({ en: 'Not found', zh: '页面未找到' })}`}
        description={t({
          en: 'This link might be broken, deleted, or moved.',
          zh: '这个链接可能已损坏、被删除或移动。',
        })}
        t={t}
        lang={lang}
        noindex
      />
      <PageHeading title={t({ en: 'Not found', zh: '页面未找到' })} />
      <p className="max-w-prose text-base leading-[1.75] text-muted">
        {t({
          en: 'This link might be broken, deleted, or moved. Nevertheless, there’s nothing to see here…',
          zh: '这个链接可能已损坏、被删除或移动。总之，这里没有内容可看…',
        })}
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-1 text-sm text-accent hover:underline"
      >
        {t({ en: 'Back home', zh: '返回首页' })}
        <ArrowUpRightIcon size={14} />
      </Link>
    </div>
  )
}
```

- [ ] **Step 2: 验证**

```bash
pnpm build
```

访问 `/does-not-exist`：显示子页壳内的 Not found 页面与返回链接。

- [ ] **Step 3: Commit**

```bash
git add src/pages/NotFoundPage.jsx
git commit -m "feat: 404 页改为 onur 式文案与排版"
```

---

### Task 10: 博客列表（筛选、表格、搜索）

**Files:**
- Create: `src/utils/blogSearch.js`、`src/components/blog/WritingFilterBar.jsx`、`WritingList.jsx`、`WritingRowSkeleton.jsx`、`SearchDialog.jsx`
- Rewrite: `src/pages/BlogPage.jsx`
- Modify: `src/content/blog.yaml`
- Test: `tests/unit/blog-search.test.js`

**Interfaces:**
- `searchPosts(posts, query, t): posts[]`。
- `WritingList({ groups, t })`，`groups` 来自 `groupPostsByYear`。
- `SearchDialog({ open, posts, onClose, t })`。

- [ ] **Step 1: 写搜索测试**

`tests/unit/blog-search.test.js`：

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { searchPosts } from '../../src/utils/blogSearch.js'

const posts = [
  {
    slug: 'react',
    title: { en: 'React Hooks', zh: 'React 钩子' },
    excerpt: { en: 'A guide to hooks', zh: '钩子指南' },
    tags: ['React', 'Hooks'],
    category: 'tutorial',
  },
  {
    slug: 'vim',
    title: { en: 'Vim Basics', zh: 'Vim 基础' },
    excerpt: { en: 'Modal editing', zh: '模态编辑' },
    tags: ['Vim'],
    category: 'tutorial',
  },
]

const t = (value) => (value && typeof value === 'object' && 'en' in value ? value.en : value)

test('empty query returns all posts', () => {
  assert.equal(searchPosts(posts, '', t).length, 2)
})

test('matches title, excerpt, tag and category', () => {
  assert.deepEqual(searchPosts(posts, 'hooks', t).map((post) => post.slug), ['react'])
  assert.deepEqual(searchPosts(posts, 'docs', t).map((post) => post.slug), [])
  assert.deepEqual(searchPosts(posts, 'modal', t).map((post) => post.slug), ['vim'])
  assert.deepEqual(searchPosts(posts, 'vim', t).map((post) => post.slug), ['vim'])
  assert.deepEqual(searchPosts(posts, 'tutorial', t).map((post) => post.slug), ['react', 'vim'])
})
```

- [ ] **Step 2: 运行确认失败**

```bash
node --test tests/unit/blog-search.test.js
```

- [ ] **Step 3: 实现 `blogSearch.js`**

```js
export function searchPosts(posts, query, t) {
  const list = posts || []
  const term = String(query || '').trim().toLowerCase()
  if (!term) return list
  return list.filter((post) => {
    const haystack = [
      t(post.title),
      t(post.excerpt),
      (post.tags || []).join(' '),
      post.category,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(term)
  })
}
```

- [ ] **Step 4: 运行确认通过**

```bash
node --test tests/unit/blog-search.test.js
```

- [ ] **Step 5: 写 `WritingFilterBar.jsx`**

```jsx
import { cn } from '../../utils/cn'

const BASE = 'rounded-md px-2.5 py-1 text-sm transition-colors'

export default function WritingFilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  tags,
  activeTag,
  onTagChange,
  t,
}) {
  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={t({ en: 'Filter by category', zh: '按分类筛选' })}>
        {categories.map((category) => {
          const active = activeCategory === category.id
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={active}
              className={cn(
                BASE,
                active
                  ? 'bg-active text-active-fg'
                  : 'text-muted-strong hover:bg-hover hover:text-ink'
              )}
              onClick={() => onCategoryChange(category.id)}
            >
              {t(category.label)}
            </button>
          )
        })}
      </div>

      {tags.length ? (
        <div className="flex flex-wrap gap-x-3 gap-y-1" role="group" aria-label={t({ en: 'Filter by tag', zh: '按标签筛选' })}>
          {tags.map((tag) => {
            const active = activeTag === tag
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                className={cn(
                  'text-xs transition-colors',
                  active ? 'text-ink underline underline-offset-4' : 'text-muted hover:text-ink'
                )}
                onClick={() => onTagChange(active ? null : tag)}
              >
                {tag}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 6: 写 `WritingList.jsx`**

```jsx
import { Link } from 'react-router-dom'
import { categoryLabel, formatDate } from '../../utils/postFormat'

export default function WritingList({ groups, t }) {
  if (!groups.length) {
    return (
      <p className="py-8 text-sm text-muted">
        {t({ en: '{ nothing here yet }', zh: '{ 暂无匹配文章 }' })}
      </p>
    )
  }

  return (
    <table className="writing-table w-full text-sm">
      <thead className="hidden md:table-header-group">
        <tr className="text-left text-muted">
          <th className="w-16 pb-2 font-normal">Year</th>
          <th className="w-24 pb-2 font-normal">Date</th>
          <th className="pb-2 font-normal">Title</th>
          <th className="w-28 pb-2 text-right font-normal">Category</th>
        </tr>
      </thead>
      <tbody>
        {groups.flatMap((group) =>
          group.posts.map((post, index) => (
            <tr key={post.slug} className="relative border-t border-line">
              <td className="hidden py-4 pr-4 align-baseline text-muted tabular-nums md:table-cell">
                {index === 0 ? group.year : ''}
              </td>
              <td className="hidden py-4 pr-4 align-baseline text-muted tabular-nums md:table-cell">
                {formatDate(post.date, t)}
              </td>
              <td className="py-4 align-baseline">
                <Link
                  to={`/blog/${post.slug}`}
                  className="font-medium text-heading transition-colors after:absolute after:inset-0 hover:text-accent"
                >
                  {t(post.title)}
                </Link>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted md:hidden">
                  <time dateTime={post.date}>{formatDate(post.date, t)}</time>
                  <span aria-hidden="true">·</span>
                  <span>{categoryLabel(post.category, t)}</span>
                </div>
              </td>
              <td className="hidden py-4 pl-4 text-right align-baseline text-muted md:table-cell">
                {categoryLabel(post.category, t)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
```

- [ ] **Step 7: 写 `WritingRowSkeleton.jsx`**

```jsx
export default function WritingRowSkeleton({ rows = 6 }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 border-t border-line py-4">
          <span className="hidden h-4 w-12 rounded bg-subtle md:block" />
          <span className="hidden h-4 w-20 rounded bg-subtle md:block" />
          <span className="h-4 flex-1 rounded bg-subtle" />
          <span className="hidden h-4 w-16 rounded bg-subtle md:block" />
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 8: 写 `SearchDialog.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../site/Modal'
import { categoryLabel, formatDate } from '../../utils/postFormat'
import { searchPosts } from '../../utils/blogSearch'
import { SearchIcon } from '../site/icons'
import { cn } from '../../utils/cn'

export default function SearchDialog({ open, posts, onClose, t }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()
  const results = searchPosts(posts, query, t)

  useEffect(() => {
    if (!open) {
      setQuery('')
      setActiveIndex(0)
      return
    }
    setActiveIndex(0)
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  function openPost(post) {
    if (!post) return
    onClose()
    navigate(`/blog/${post.slug}`)
  }

  return (
    <Modal open={open} onClose={onClose} label={t({ en: 'Search posts', zh: '搜索文章' })}>
      <div className="flex items-center gap-2 border-b border-line pb-2">
        <SearchIcon size={16} className="shrink-0 text-muted" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setActiveIndex((value) => Math.min(value + 1, Math.max(results.length - 1, 0)))
            } else if (event.key === 'ArrowUp') {
              event.preventDefault()
              setActiveIndex((value) => Math.max(value - 1, 0))
            } else if (event.key === 'Enter') {
              event.preventDefault()
              openPost(results[activeIndex])
            }
          }}
          placeholder={t({ en: 'Search posts…', zh: '搜索文章…' })}
          className="h-9 w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          aria-label={t({ en: 'Search posts', zh: '搜索文章' })}
        />
        <kbd className="rounded border border-line bg-subtle px-1.5 py-0.5 text-[11px] text-muted">
          ESC
        </kbd>
      </div>

      <div ref={listRef} className="mt-2 max-h-[50vh] overflow-y-auto">
        {results.length === 0 ? (
          <p className="py-6 text-sm text-muted">
            {t({ en: 'No results.', zh: '没有结果。' })}
          </p>
        ) : (
          results.map((post, index) => (
            <button
              key={post.slug}
              type="button"
              data-index={index}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => openPost(post)}
              className={cn(
                'flex w-full items-baseline justify-between gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors',
                index === activeIndex ? 'bg-subtle text-ink' : 'text-muted-strong hover:bg-subtle'
              )}
            >
              <span className="min-w-0 truncate font-medium">{t(post.title)}</span>
              <span className="shrink-0 text-xs text-muted">
                {formatDate(post.date, t)} · {categoryLabel(post.category, t)}
              </span>
            </button>
          ))
        )}
      </div>
    </Modal>
  )
}
```

- [ ] **Step 9: 重写 `BlogPage.jsx`**

```jsx
import { useEffect, useMemo, useState } from 'react'
import blogConfig from '../content/blog.yaml'
import { useLanguage } from '../hooks/useLanguage'
import { getAllPosts } from '../utils/markdown'
import { collectTags, filterPosts } from '../utils/blogFilters'
import { groupPostsByYear } from '../utils/postGroups'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'
import WritingFilterBar from '../components/blog/WritingFilterBar'
import WritingList from '../components/blog/WritingList'
import WritingRowSkeleton from '../components/blog/WritingRowSkeleton'
import SearchDialog from '../components/blog/SearchDialog'
import Button from '../components/site/Button'
import { RssIcon, SearchIcon } from '../components/site/icons'

export default function BlogPage() {
  const { lang, t } = useLanguage()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [tag, setTag] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getAllPosts(lang)
      .then((value) => {
        if (!cancelled) setPosts(value)
      })
      .catch((error) => {
        console.error('[BlogPage] Failed to load posts:', error)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [lang])

  useEffect(() => {
    function onKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const tags = useMemo(() => collectTags(posts), [posts])
  const filtered = useMemo(
    () => filterPosts(posts, { category, tag }),
    [posts, category, tag]
  )
  const groups = useMemo(() => groupPostsByYear(filtered), [filtered])

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageTitle
        title={`STYLAN · ${t(blogConfig.page.title)}`}
        description={t(blogConfig.page.subtitle)}
        t={t}
        lang={lang}
      />
      <PageHeading
        title={t(blogConfig.page.title)}
        description={t(blogConfig.page.subtitle)}
        actions={
          <>
            <Button
              as="a"
              variant="outline"
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RssIcon size={15} />
              RSS
            </Button>
            <Button variant="outline" onClick={() => setSearchOpen(true)}>
              <SearchIcon size={15} />
              Search
              <kbd className="rounded border border-line bg-subtle px-1 text-[10px] text-muted">
                ⌘K
              </kbd>
            </Button>
          </>
        }
      />

      <WritingFilterBar
        categories={blogConfig.categories}
        activeCategory={category}
        onCategoryChange={setCategory}
        tags={tags}
        activeTag={tag}
        onTagChange={setTag}
        t={t}
      />

      {loading ? <WritingRowSkeleton /> : <WritingList groups={groups} t={t} />}

      <SearchDialog
        open={searchOpen}
        posts={posts}
        onClose={() => setSearchOpen(false)}
        t={t}
      />
    </div>
  )
}
```

- [ ] **Step 10: 修改博客页标题文案**

`src/content/blog.yaml` 的 `page.title`：

```yaml
page:
  title:
    en: Writing
    zh: 写作
```

- [ ] **Step 11: 验证**

```bash
node --test tests/unit/blog-search.test.js
pnpm build
pnpm dev
```

检查 `/blog`：分类黑底选中、标签筛选、年份列只在组首行、hover 行高亮并压暗同组其他行、Search 打开后方向键/回车/Esc、RSS 链接。

- [ ] **Step 12: Commit**

```bash
git add src/pages/BlogPage.jsx src/components/blog src/utils/blogSearch.js tests/unit/blog-search.test.js src/content/blog.yaml
git commit -m "feat: 博客列表改为 onur 式年份表格并重做搜索"
```

---

### Task 11: 文章页、代码行号、TOC 与文章排版

**Files:**
- Create: `src/utils/rehypeCodeLines.js`
- Rewrite: `src/components/BlogPage/markdownComponents.jsx`、`TableOfContents.jsx`、`src/pages/BlogPostPage.jsx`、`src/styles/blog-post.css`
- Test: `tests/unit/rehype-code-lines.test.js`

**Interfaces:**
- `rehypeCodeLines()`：rehype 插件，把 `pre > code` 的子节点按行包成 `<span class="code-line" data-line="n">`。
- `markdownComponents`：供 `ReactMarkdown` 使用。
- 文章页使用 `rehypePlugins={[rehypeHighlight, rehypeCodeLines]}`。

- [ ] **Step 1: 写行号插件测试**

`tests/unit/rehype-code-lines.test.js`：

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import rehypeCodeLines from '../../src/utils/rehypeCodeLines.js'

test('wraps code children into numbered lines and keeps nested spans', () => {
  const tree = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'pre',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'code',
            properties: { className: ['hljs', 'language-js'] },
            children: [
              {
                type: 'element',
                tagName: 'span',
                properties: { className: ['hljs-keyword'] },
                children: [{ type: 'text', value: 'const' }],
              },
              { type: 'text', value: ' a = 1\n' },
              { type: 'text', value: 'console.log(a)\n' },
            ],
          },
        ],
      },
    ],
  }

  rehypeCodeLines()(tree)
  const code = tree.children[0].children[0]
  assert.equal(code.children.length, 3)
  assert.equal(code.children[0].tagName, 'span')
  assert.deepEqual(code.children[0].properties.className, ['code-line'])
  assert.equal(code.children[0].properties['data-line'], '1')
  assert.equal(code.children[0].children[0].tagName, 'span')
  assert.equal(code.children[1].properties['data-line'], '2')
  assert.equal(code.children[2].properties['data-line'], '3')
})

test('leaves non-pre trees unchanged', () => {
  const tree = { type: 'root', children: [{ type: 'element', tagName: 'p', properties: {}, children: [] }] }
  rehypeCodeLines()(tree)
  assert.equal(tree.children[0].tagName, 'p')
})
```

- [ ] **Step 2: 运行确认失败**

```bash
node --test tests/unit/rehype-code-lines.test.js
```

- [ ] **Step 3: 实现 `rehypeCodeLines.js`**

```js
function splitLineNodes(nodes) {
  const lines = [[]]

  for (const node of nodes) {
    if (node.type === 'text') {
      const parts = node.value.split('\n')
      parts.forEach((part, index) => {
        if (part) lines[lines.length - 1].push({ ...node, value: part })
        if (index < parts.length - 1) lines.push([])
      })
      continue
    }

    if (node.children) {
      const childLines = splitLineNodes(node.children)
      childLines.forEach((childLine, index) => {
        if (index > 0) lines.push([])
        if (childLine.length) {
          lines[lines.length - 1].push({ ...node, children: childLine })
        }
      })
      continue
    }

    lines[lines.length - 1].push(node)
  }

  return lines
}

function transformPre(pre) {
  const code = pre.children?.find(
    (child) => child.type === 'element' && child.tagName === 'code'
  )
  if (!code?.children) return
  const lines = splitLineNodes(code.children)
  code.children = lines.map((line, index) => ({
    type: 'element',
    tagName: 'span',
    properties: {
      className: ['code-line'],
      'data-line': String(index + 1),
    },
    children: line,
  }))
}

function walk(node) {
  if (!node || typeof node !== 'object') return
  if (node.type === 'element' && node.tagName === 'pre') transformPre(node)
  if (node.children) node.children.forEach(walk)
}

export default function rehypeCodeLines() {
  return (tree) => walk(tree)
}
```

- [ ] **Step 4: 运行确认通过**

```bash
node --test tests/unit/rehype-code-lines.test.js
```

- [ ] **Step 5: 重写 `markdownComponents.jsx`**

```jsx
import { headingId, getTextContent } from '../../utils/markdownHeading'

const heading = (level) => {
  const Tag = `h${level}`
  const className =
    level === 2
      ? 'mt-10 mb-4 scroll-mt-24 text-xl font-semibold tracking-tight text-heading md:text-2xl'
      : level === 3
        ? 'mt-8 mb-3 scroll-mt-24 text-lg font-semibold tracking-tight text-heading'
        : 'mt-6 mb-2 scroll-mt-24 text-base font-semibold text-heading'

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

  p: ({ children }) => <p className="mb-5 text-base leading-[1.75] text-ink">{children}</p>,

  a: ({ href, children }) => (
    <a
      href={href}
      className="link"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),

  ul: ({ children }) => (
    <ul className="mb-5 list-disc space-y-1.5 pl-5 text-base leading-[1.75] text-ink">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="mb-5 list-decimal space-y-1.5 pl-5 text-base leading-[1.75] text-ink">
      {children}
    </ol>
  ),

  li: ({ children }) => <li className="pl-0.5">{children}</li>,

  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l border-line-strong pl-4 text-muted-strong">
      {children}
    </blockquote>
  ),

  code({ className, children, ...props }) {
    const isBlock = typeof className === 'string' && /(^|\s)(hljs|language-)/.test(className)
    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }
    return (
      <code className="inline-code" {...props}>
        {children}
      </code>
    )
  },

  pre({ children }) {
    return <pre className="code-block">{children}</pre>
  },

  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      decoding="async"
      className="my-6 h-auto w-full rounded-xl border border-line"
    />
  ),

  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-line">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  ),

  th: ({ children }) => (
    <th className="border-b border-line px-4 py-2 text-left font-medium text-muted">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="border-b border-line px-4 py-2 text-ink last:border-0">{children}</td>
  ),

  hr: () => <hr className="my-10 border-line" />,
}
```

- [ ] **Step 6: 重写 `TableOfContents.jsx` 的渲染部分**

保留现有 `extractHeadings`、IntersectionObserver、`handleClick` 逻辑，只替换 JSX 为：

```jsx
  return (
    <nav aria-label="Table of contents">
      <p className="mb-3 text-xs font-medium text-muted">On this page</p>
      <ul className="border-l border-line">
        {headings.map(({ level, text, id }) => {
          const active = activeId === id
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(event) => handleClick(event, id)}
                style={{ paddingLeft: `${0.75 + (level - 2) * 0.75}rem` }}
                className={`-ml-px block border-l-2 py-1 pr-2 text-sm leading-snug transition-colors ${
                  active
                    ? 'border-ink text-ink'
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
```

- [ ] **Step 7: 重写 `BlogPostPage.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useLanguage } from '../hooks/useLanguage'
import { getPostBySlug } from '../utils/markdown'
import { categoryLabel, formatDate } from '../utils/postFormat'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'
import TableOfContents from '../components/BlogPage/TableOfContents'
import { markdownComponents } from '../components/BlogPage/markdownComponents'
import rehypeCodeLines from '../utils/rehypeCodeLines'
import { ArrowUpRightIcon } from '../components/site/icons'
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
    setLoading(true)
    setError(false)
    getPostBySlug(slug, lang)
      .then((value) => {
        if (cancelled) return
        if (value) setPost(value)
        else setError(true)
      })
      .catch((err) => {
        console.error('Failed to load post:', err)
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug, lang])

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-3xl items-center justify-center">
        <p className="text-sm text-muted">{t({ en: 'Loading…', zh: '加载中…' })}</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-3xl flex-col items-start justify-center">
        <PageHeading title={t({ en: 'Post not found', zh: '文章未找到' })} />
        <p className="text-sm text-muted">
          {t({ en: 'The post you are looking for does not exist.', zh: '您查找的文章不存在。' })}
        </p>
        <button
          type="button"
          onClick={() => navigate('/blog')}
          className="mt-6 text-sm text-accent hover:underline"
        >
          {t({ en: 'Back to blog', zh: '返回博客' })}
        </button>
      </div>
    )
  }

  return (
    <div className="relative mx-auto w-full">
      <div className="article-glow" aria-hidden="true" />
      <PageTitle
        title={`STYLAN · ${t(post.title)}`}
        description={t(post.excerpt)}
        t={t}
        lang={lang}
        type="article"
      />

      <div className="relative">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-muted-strong transition-colors hover:text-ink"
        >
          <ArrowUpRightIcon size={14} className="rotate-180" />
          {t({ en: 'Writing', zh: '写作' })}
        </Link>

        <div className="mt-6">
          <PageHeading title={t(post.title)} />
          <div className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
            <time dateTime={post.date}>{formatDate(post.date, t)}</time>
            {post.readTime ? <span aria-hidden="true">·</span> : null}
            {post.readTime ? <span>{post.readTime}</span> : null}
            <span aria-hidden="true">·</span>
            <span>{categoryLabel(post.category, t)}</span>
          </div>
          {post.tags?.length ? (
            <div className="mb-8 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
              {post.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          ) : null}
        </div>

        <details className="mb-8 rounded-lg border border-line p-4 xl:hidden">
          <summary className="cursor-pointer text-sm font-medium text-heading">
            {t({ en: 'On this page', zh: '本页目录' })}
          </summary>
          <div className="mt-3">
            <TableOfContents content={post.content} />
          </div>
        </details>

        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_200px] xl:gap-12">
          <article className="min-w-0 max-w-[68ch]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeCodeLines]}
              components={markdownComponents}
            >
              {post.content}
            </ReactMarkdown>
          </article>
          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <TableOfContents content={post.content} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 8: 重写 `src/styles/blog-post.css`**

```css
.hljs {
  color: #24292f;
  background: transparent !important;
}

.hljs-comment,
.hljs-quote {
  color: #6e7781;
  font-style: italic;
}

.hljs-keyword,
.hljs-selector-tag,
.hljs-literal,
.hljs-section,
.hljs-link {
  color: #cf222e;
}

.hljs-string,
.hljs-title,
.hljs-name,
.hljs-type,
.hljs-attribute,
.hljs-symbol,
.hljs-bullet,
.hljs-addition,
.hljs-variable,
.hljs-template-tag,
.hljs-template-variable {
  color: #116329;
}

.hljs-number,
.hljs-regexp,
.hljs-built_in,
.hljs-builtin-name,
.hljs-attr {
  color: #953800;
}

.hljs-function .hljs-keyword,
.hljs-params {
  color: #0550ae;
}

.hljs-meta,
.hljs-deletion {
  color: #82071e;
}

.dark .hljs {
  color: #e6edf3;
}

.dark .hljs-comment,
.dark .hljs-quote {
  color: #8b949e;
}

.dark .hljs-keyword,
.dark .hljs-selector-tag,
.dark .hljs-literal,
.dark .hljs-section,
.dark .hljs-link {
  color: #ff7b72;
}

.dark .hljs-string,
.dark .hljs-title,
.dark .hljs-name,
.dark .hljs-type,
.dark .hljs-attribute,
.dark .hljs-symbol,
.dark .hljs-bullet,
.dark .hljs-addition,
.dark .hljs-variable,
.dark .hljs-template-tag,
.dark .hljs-template-variable {
  color: #7ee787;
}

.dark .hljs-number,
.dark .hljs-regexp,
.dark .hljs-built_in,
.dark .hljs-builtin-name,
.dark .hljs-attr {
  color: #ffa657;
}

.dark .hljs-function .hljs-keyword,
.dark .hljs-params {
  color: #79c0ff;
}

.dark .hljs-meta,
.dark .hljs-deletion {
  color: #ffa198;
}
```

- [ ] **Step 9: 验证**

```bash
node --test tests/unit/rehype-code-lines.test.js
pnpm build
pnpm dev
```

检查文章页：68ch 正文、行号代码块、行内码反引号、图片圆角、右侧 TOC 激活黑线、移动端 `<details>` 目录、返回写作链接。

- [ ] **Step 10: Commit**

```bash
git add src/pages/BlogPostPage.jsx src/components/BlogPage/markdownComponents.jsx src/components/BlogPage/TableOfContents.jsx src/utils/rehypeCodeLines.js src/styles/blog-post.css tests/unit/rehype-code-lines.test.js
git commit -m "feat: 文章页改为 onur 排版并加入代码行号"
```

---

### Task 12: 清理旧博客组件并验证 M2

**Files:**
- Delete: `src/components/BlogPage/BlogHero.jsx`、`CategoryFilter.jsx`、`TagFilter.jsx`、`SearchTrigger.jsx`、`BlogSearch.jsx`、`BlogList.jsx`
- Delete: `src/components/HomePage/PostRow.jsx`、`PostRowSkeleton.jsx`
- Delete: `src/components/shared/PageHeader.jsx`、`TagChip.jsx`、`SkillGroups.jsx`

- [ ] **Step 1: 确认无引用**

```bash
grep -rn "BlogHero\|CategoryFilter\|TagFilter\|SearchTrigger\|BlogSearch\|BlogList\|PostRow\|PageHeader\|TagChip\|SkillGroups" src --include="*.jsx" --include="*.js" | grep -v "components/BlogPage/BlogHero\|components/BlogPage/CategoryFilter\|components/BlogPage/TagFilter\|components/BlogPage/SearchTrigger\|components/BlogPage/BlogSearch\|components/BlogPage/BlogList\|components/HomePage/PostRow\|components/shared/PageHeader\|components/shared/TagChip\|components/shared/SkillGroups"
```

预期：无输出。

- [ ] **Step 2: 删除**

```bash
git rm src/components/BlogPage/BlogHero.jsx src/components/BlogPage/CategoryFilter.jsx src/components/BlogPage/TagFilter.jsx src/components/BlogPage/SearchTrigger.jsx src/components/BlogPage/BlogSearch.jsx src/components/BlogPage/BlogList.jsx
git rm src/components/HomePage/PostRow.jsx src/components/HomePage/PostRowSkeleton.jsx
git rm src/components/shared/PageHeader.jsx src/components/shared/TagChip.jsx src/components/shared/SkillGroups.jsx
```

- [ ] **Step 3: 全量验证 M2**

```bash
pnpm lint
pnpm test
pnpm build
```

- [ ] **Step 4: 浏览器回归**

检查 `/` `/projects` `/blog` `/blog/getting-started-with-react-hooks` `/skills` `/contact` `/404` 在 1440/390/320 下无横向滚动；主题/语言切换仍生效；Ctrl+K 搜索可用。

- [ ] **Step 5: Commit**

```bash
git commit -m "refactor: 清理旧博客与旧页面组件"
```

---

## M3 · 后台重做

### Task 13: 后台壳、侧栏、顶栏与全局样式

**Files:**
- Modify: `src/admin/AdminApp.jsx`（渲染层）
- Rewrite: `src/admin/admin.css`

**Interfaces:**
- 保留所有 state、`load`、`save`、`discardChanges`、`goTo`、`PreviewDrawer` props 不变。
- 新增 `dark` state 与 `toggleAdminTheme`。

- [ ] **Step 1: 在 `AdminApp.jsx` 顶部加入主题状态**

在 `const [postDirty, setPostDirty] = useState(false)` 之后加入：

```jsx
  const [dark, setDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  )

  const toggleAdminTheme = useCallback(() => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }, [dark])
```

- [ ] **Step 2: 替换加载态与主渲染结构**

保留 1–113 行的状态与回调，替换 `if (!docs) { ... }` 之后到组件结尾的 JSX 为：

```jsx
  if (!docs) {
    return (
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand-block">
            <span className="admin-brand">STYLAN</span>
            <span className="admin-brand-sub">内容后台</span>
          </div>
        </aside>
        <div className="admin-workspace">
          <header className="admin-topbar">
            <div className="admin-topbar-left">
              <span className="admin-breadcrumb">内容管理 / {activeItem.label}</span>
            </div>
            <div className="admin-topbar-actions">
              <button className="admin-btn" onClick={load}>重试</button>
            </div>
          </header>
          <main className="admin-main">
            <div className="admin-page">
              <p className="text-sm text-muted">{status.text || '正在加载配置…'}</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand-block">
          <span className="admin-brand">STYLAN</span>
          <span className="admin-brand-sub">内容后台</span>
        </div>

        <nav className="admin-nav" aria-label="后台导航">
          {NAV.map(({ id, label }, index) => (
            <Fragment key={id}>
              {id === 'posts' && <div className="admin-nav-divider" />}
              <button
                className={`admin-nav-btn ${activeId === id ? 'is-active' : ''}`}
                onClick={() => goTo(id)}
                aria-current={activeId === id ? 'page' : undefined}
              >
                <span>{label}</span>
                <span className="admin-nav-index" aria-hidden="true">{index + 1}</span>
              </button>
            </Fragment>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button type="button" className="admin-text-btn" onClick={toggleAdminTheme}>
            {dark ? '浅色主题' : '深色主题'}
          </button>
          <a className="admin-text-btn" href="/" target="_blank" rel="noopener noreferrer">
            打开前台 ↗
          </a>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <span className="admin-breadcrumb">内容管理 / {activeItem.label}</span>
          </div>
          <div className="admin-topbar-actions">
            {dirty ? <span className="admin-badge">未保存</span> : null}
            <button className="admin-btn" onClick={discardChanges} disabled={!dirty}>
              撤销
            </button>
            <button
              className="admin-btn admin-btn-primary"
              onClick={save}
              disabled={saving || !dirty}
            >
              {saving ? '保存中…' : '保存'}
            </button>
            <button className="admin-btn" onClick={() => setPreviewOpen((value) => !value)}>
              预览
            </button>
          </div>
        </header>

        <main className="admin-main">
          <div className="admin-page">
            <div className="admin-page-head">
              <h1 className="admin-page-title">{activeItem.label}</h1>
              <p className="admin-page-desc">
                {activeId === 'posts'
                  ? '按语言筛选文章，编辑与新建均写入本地 Markdown 文件。'
                  : '修改后点击右上角「保存」写入本地 YAML 配置。'}
              </p>
            </div>

            <section className="admin-panel">
              <header className="admin-panel-head">
                <span className="admin-panel-title">
                  {activeId === 'posts' ? '文章列表' : '字段设置'}
                </span>
                {status.text ? (
                  <span className={status.kind === 'error' ? 'admin-error' : 'admin-ok'}>
                    {status.text}
                  </span>
                ) : (
                  <span className="admin-panel-note">
                    {activeId === 'posts' ? '本地 Markdown 文件' : '改动需保存后生效'}
                  </span>
                )}
              </header>
              <div className="admin-panel-body">
                {activeId === 'posts' ? (
                  <PostsSection onDirtyChange={setPostDirty} />
                ) : activeSection ? (
                  <ConfigSection
                    section={activeSection}
                    value={getIn(docs[activeSection.doc], activeSection.path)}
                    onChange={(next) =>
                      setDocs((prev) => ({
                        ...prev,
                        [activeSection.doc]: setIn(prev[activeSection.doc], activeSection.path, next),
                      }))
                    }
                  />
                ) : null}
              </div>
            </section>
          </div>
        </main>
      </div>

      <PreviewDrawer
        open={previewOpen}
        onClose={closePreview}
        page={previewPath}
        onPageChange={setPreviewPath}
        device={previewDevice}
        onDeviceChange={setPreviewDevice}
        iframeRef={iframeRef}
      />
    </div>
  )
```

- [ ] **Step 3: 重写 `src/admin/admin.css`**

```css
.admin-shell {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  height: 100dvh;
  background: var(--bg);
  color: var(--ink);
}

.admin-sidebar {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-right: 1px solid var(--line);
  background: var(--bg-sidebar);
  padding: 12px;
}

.admin-brand-block {
  display: flex;
  flex-direction: column;
  padding: 8px 8px 16px;
}

.admin-brand {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--heading);
}

.admin-brand-sub {
  font-size: 12px;
  color: var(--muted);
}

.admin-nav {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.admin-nav-divider {
  margin: 8px 4px;
  border-top: 1px solid var(--line);
}

.admin-nav-btn {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  text-align: left;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.admin-nav-btn:hover {
  background: var(--bg-hover);
}

.admin-nav-btn.is-active {
  background: var(--active-bg);
  color: var(--active-fg);
}

.admin-nav-index {
  display: grid;
  width: 20px;
  height: 20px;
  place-content: center;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--bg-subtle);
  font-size: 11px;
  font-weight: 500;
  color: var(--muted);
}

.admin-nav-btn.is-active .admin-nav-index {
  border-color: transparent;
  background: color-mix(in srgb, var(--active-fg) 12%, transparent);
  color: var(--active-fg);
}

.admin-sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-top: 1px solid var(--line);
  padding-top: 8px;
}

.admin-text-btn {
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 12px;
  color: var(--muted-strong);
  text-align: left;
}

.admin-text-btn:hover {
  background: var(--bg-hover);
  color: var(--ink);
}

.admin-workspace {
  display: flex;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
}

.admin-topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  height: 56px;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--line);
  background: var(--bg);
  padding: 0 20px;
}

.admin-topbar-left {
  min-width: 0;
}

.admin-breadcrumb {
  font-size: 13px;
  color: var(--muted);
}

.admin-topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.admin-main {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  padding: 40px 32px 80px;
}

.admin-page {
  max-width: 896px;
  margin: 0 auto;
}

.admin-page-head {
  margin-bottom: 24px;
}

.admin-page-title {
  font-size: 24px;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--heading);
}

.admin-page-desc {
  margin-top: 6px;
  font-size: 14px;
  color: var(--muted);
}

.admin-panel {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg);
}

.admin-panel-head {
  display: flex;
  min-height: 44px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--line);
  padding: 0 16px;
}

.admin-panel-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--heading);
}

.admin-panel-note {
  font-size: 12px;
  color: var(--muted);
}

.admin-panel-body {
  padding: 20px;
}

.admin-subpanel {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg-subtle);
  padding: 16px;
}

.admin-label-text {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
}

.admin-sub {
  display: block;
  margin-bottom: 4px;
  font-size: 11px;
  color: var(--muted);
}

.admin-input {
  width: 100%;
  min-height: 36px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--bg);
  color: var(--ink);
  padding: 7px 10px;
  font-size: 14px;
  outline: none;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
}

.dark .admin-input {
  box-shadow: none;
}

.admin-input:focus {
  border-color: var(--line-strong);
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.admin-textarea {
  min-height: 96px;
  resize: vertical;
}

.admin-help {
  margin-top: 4px;
  font-size: 12px;
  color: var(--muted);
}

.admin-btn {
  display: inline-flex;
  height: 36px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--bg);
  padding: 0 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
  transition: background-color 0.15s ease, color 0.15s ease;
}

.dark .admin-btn {
  box-shadow: none;
}

.admin-btn:hover {
  background: var(--bg-subtle);
}

.admin-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.admin-btn-primary {
  border-color: var(--active-bg);
  background: var(--active-bg);
  color: var(--active-fg);
}

.admin-btn-primary:hover {
  background: var(--ink);
  color: var(--bg);
}

.dark .admin-btn-primary:hover {
  background: var(--ink);
  color: var(--bg);
}

.admin-btn-danger {
  color: #dc2626;
}

.admin-btn-danger:hover {
  background: rgb(220 38 38 / 0.08);
}

.admin-tab {
  display: inline-flex;
  height: 30px;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--bg);
  padding: 0 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-strong);
  transition: background-color 0.15s ease, color 0.15s ease;
}

.admin-tab:hover {
  background: var(--bg-subtle);
  color: var(--ink);
}

.admin-tab.is-active {
  border-color: var(--active-bg);
  background: var(--active-bg);
  color: var(--active-fg);
}

.admin-badge {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--bg-subtle);
  padding: 2px 6px;
  font-size: 11px;
  color: var(--muted);
}

.admin-error {
  font-size: 12px;
  color: #dc2626;
}

.admin-ok {
  font-size: 12px;
  color: #059669;
}

.admin-link {
  font-size: 12px;
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.admin-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 8px;
}

.admin-table {
  width: 100%;
  font-size: 14px;
  border-collapse: collapse;
}

.admin-table th {
  height: 40px;
  padding: 0 12px;
  border-bottom: 1px solid var(--line);
  font-weight: 400;
  color: var(--muted);
  text-align: left;
}

.admin-table td {
  padding: 12px;
  border-bottom: 1px solid var(--line);
  vertical-align: middle;
}

.admin-table tr:last-child td {
  border-bottom: 0;
}

.admin-table tbody tr:hover {
  background: var(--bg-subtle);
}

.admin-table-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.prose-admin {
  font-size: 14px;
  line-height: 1.75;
  color: var(--ink);
}

.prose-admin h1,
.prose-admin h2,
.prose-admin h3 {
  margin: 1.2em 0 0.5em;
  font-weight: 600;
  color: var(--heading);
}

.prose-admin pre {
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--bg-subtle);
  padding: 12px;
  font-family: var(--font-mono);
  font-size: 12px;
}

.preview-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  background: var(--overlay);
}

.preview-drawer {
  display: flex;
  height: 100%;
  width: min(90vw, 720px);
  flex-direction: column;
  border-left: 1px solid var(--line);
  background: var(--bg);
  box-shadow: -24px 0 60px rgb(0 0 0 / 0.18);
  animation: preview-slide-in 0.3s ease-out;
}

@keyframes preview-slide-in {
  from {
    transform: translateX(24px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.preview-head {
  display: flex;
  min-height: 48px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid var(--line);
  background: var(--bg);
  padding: 8px 12px;
}

.preview-head-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.preview-page-select {
  width: auto;
  min-width: 96px;
}

.preview-devices {
  display: flex;
  gap: 4px;
}

.preview-stage {
  display: flex;
  min-height: 0;
  flex: 1;
  overflow: auto;
  background: var(--bg-subtle);
  padding: 16px;
}

.preview-stage iframe {
  flex-shrink: 0;
  margin: 0 auto;
  height: 100%;
  border: 0;
  background: #fff;
  transition: width 0.2s ease;
}

@media (prefers-reduced-motion: reduce) {
  .preview-drawer {
    animation: none;
  }

  .preview-stage iframe {
    transition: none;
  }
}

@media (max-width: 1023px) {
  .admin-shell {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
  }

  .admin-sidebar {
    flex-direction: row;
    align-items: center;
    gap: 8px;
    border-right: 0;
    border-bottom: 1px solid var(--line);
    padding: 8px 12px;
    overflow-x: auto;
  }

  .admin-brand-block {
    padding: 0;
    white-space: nowrap;
  }

  .admin-brand-sub {
    display: none;
  }

  .admin-nav {
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .admin-nav-btn {
    width: auto;
    white-space: nowrap;
  }

  .admin-nav-index,
  .admin-sidebar-footer {
    display: none;
  }

  .admin-main {
    padding: 24px 16px 56px;
  }

  .admin-topbar {
    padding: 0 12px;
  }
}

@media (max-width: 640px) {
  .admin-breadcrumb {
    display: none;
  }

  .preview-drawer {
    width: 100%;
    border-left: 0;
  }
}
```

- [ ] **Step 4: 验证后台壳**

```bash
pnpm dev
```

打开 `http://localhost:5173/admin.html`：应看到 onur 式侧栏、黑底选中分区、顶栏操作区；切换主题与「打开前台」可用。

- [ ] **Step 5: Commit**

```bash
git add src/admin/AdminApp.jsx src/admin/admin.css
git commit -m "feat: 后台改为 onur 式侧栏工作区布局"
```

---

### Task 14: 后台表单、文章表格与编辑器样式

**Files:**
- Modify: `src/admin/components/Field.jsx`、`src/admin/sections/PostEditor.jsx`、`src/admin/sections/PostsSection.jsx`
- Modify: `src/admin/admin.css`（如缺少类）

- [ ] **Step 1: 替换 `soft-card`**

```bash
grep -rn "soft-card" src/admin
```

将三处 `soft-card` 改为 `admin-subpanel`：

- `Field.jsx` 第 24 行：`<div className="admin-subpanel space-y-4">`
- `Field.jsx` 第 215 行：`<div key={index} className="admin-subpanel space-y-3">`
- `PostEditor.jsx` 第 317 行：`<div className="admin-subpanel">`

- [ ] **Step 2: 给编辑器 textarea 加 `admin-textarea`**

在 `PostEditor.jsx` 中做三处精确替换：

- `BiTextField` 内的两个动态输入（第 55、65 行）把 `className="admin-input"` 改为：

```jsx
className={multiline ? 'admin-input admin-textarea' : 'admin-input'}
```

- 正文编辑器（第 309–311 行）把：

```jsx
className="admin-input font-mono-ui text-[12px] leading-[1.7]"
```

改为：

```jsx
className="admin-input admin-textarea font-mono text-[12px] leading-[1.7]"
```

- 预览面板（第 317 行）把 `<div className="soft-card p-5">` 改为 `<div className="admin-subpanel">`。

- [ ] **Step 3: 把文章列表改为表格**

替换 `PostsSection.jsx` 中 `visible.map(...)` 的列表容器为：

```jsx
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>标题</th>
                <th className="w-20">语言</th>
                <th className="w-28">日期</th>
                <th className="w-24">分类</th>
                <th className="w-36 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((post) => (
                <tr key={`${post.lang}:${post.filename}`}>
                  <td className="font-medium text-heading">{displayTitle(post.title)}</td>
                  <td><span className="admin-badge">{post.lang}</span></td>
                  <td className="text-muted">{post.date}</td>
                  <td className="text-muted">{post.category}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        className="admin-btn"
                        onClick={() => setEditing({ isNew: false, lang: post.lang, filename: post.filename })}
                      >
                        编辑
                      </button>
                      <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(post)}>
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 && <p className="p-6 text-sm text-muted">暂无文章</p>}
        </div>
```

- [ ] **Step 4: 调整顶部分类 tab 与新建按钮**

将 `PostsSection.jsx` 顶部按钮容器改为：

```jsx
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="group" aria-label="按语言筛选">
          {['all', 'zh', 'en'].map((value) => (
            <button
              key={value}
              className={`admin-tab ${lang === value ? 'is-active' : ''}`}
              aria-pressed={lang === value}
              onClick={() => setLang(value)}
            >
              {value === 'all' ? '全部' : value.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => setEditing({ isNew: true, lang: 'zh', filename: '' })}
        >
          新建文章
        </button>
      </div>
```

- [ ] **Step 5: 验证后台表单**

```bash
pnpm test
pnpm build
pnpm dev
```

在 `/admin.html` 检查：站点信息表单、项目列表、技能列表、文章表格、语言筛选、新建/编辑/删除入口、保存与撤销；字段 label 为 14px Geist，输入框 36px 高，选中 tab 黑底白字。

- [ ] **Step 6: Commit**

```bash
git add src/admin/components/Field.jsx src/admin/sections/PostEditor.jsx src/admin/sections/PostsSection.jsx src/admin/admin.css
git commit -m "feat: 后台表单与文章表格改用 onur 式密度"
```

---

### Task 15: 预览抽屉、响应式与 M3 验证

**Files:**
- Modify: `src/admin/components/PreviewDrawer.jsx`（仅表现层）
- Modify: `src/admin/admin.css`（如需微调）

- [ ] **Step 1: 预览头部文案与结构**

把 `PreviewDrawer.jsx` 头部左侧的 `admin-label-text` 改为：

```jsx
<span className="admin-panel-title">站点预览</span>
```

关闭按钮加 `admin-btn` 类（已有），刷新按钮保持 `admin-btn`。

- [ ] **Step 2: 验证预览行为**

```bash
pnpm dev
```

打开 `/admin.html` → 预览：
- 右侧抽屉宽度约 720px，遮罩为 20% 黑；
- 页面选择、设备切换（桌面/平板/手机）正常；
- iframe 内 Esc 关闭、外部 Esc 关闭；
- 关闭后焦点回到「预览」按钮；
- 1024px 以下后台侧栏变横向分区条，预览抽屉全宽。

- [ ] **Step 3: 全量验证 M3**

```bash
pnpm lint
pnpm test
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add src/admin/components/PreviewDrawer.jsx src/admin/admin.css
git commit -m "feat: 后台预览抽屉与响应式收尾"
```

---

## M4 · 文档与验收

### Task 16: README、DESIGN 与残留清理

**Files:**
- Modify: `README.md`
- Verify: `DESIGN.md` 与 spec 的实现一致性（首页 header 不吸顶、文章页 1024px 例外）

- [ ] **Step 1: 更新 README 字体说明**

把 README 中「字体：系统字体栈…不加载任何 Web 字体…」整段替换为：

```markdown
字体：自托管 [Geist Sans / Geist Mono](https://vercel.com/font)（`public/fonts/*.woff2`，SIL OFL 1.1），中文回退到 `PingFang SC` / `Microsoft YaHei` 等系统字体；不请求第三方字体服务。
```

- [ ] **Step 2: 更新 README 项目结构**

把 `src/components/` 的说明改为：

```text
│   ├── layouts/                  # HomeLayout（antfu 首页）/ SubpageLayout（onur 子页）
│   ├── components/
│   │   ├── site/                 # 侧栏、移动抽屉、按钮、图标、主题语言
│   │   ├── blog/                 # 文章表格、筛选、搜索、骨架
│   │   ├── projects/             # 项目表格
│   │   ├── contact/              # 微信二维码弹窗
│   │   └── shared/               # PageTitle / SocialIcon / ArrowIcon / ScrollToTop
```

并把 `public/fonts/` 的注释从「历史字体文件（当前未引用）」改为「Geist 字体与许可」。

- [ ] **Step 3: 更新 README 设计说明**

在「技术栈」后增加一段：

```markdown
设计：首页参考 [antfu.me](https://github.com/antfu/antfu.me) 的 65ch 文本流，博客/项目/技能/联系与后台参考 [onur.dev](https://github.com/suyalcinkaya/onur.dev) 的侧栏与表格体系；完整令牌与规则见 `DESIGN.md`。
```

- [ ] **Step 4: 检索旧视觉残留**

```bash
grep -rn "font-mono-ui\|tag-chip\|container-page\|text-ink/90\|bg-elevated\|--font-display\|accent-soft\|search-modal" src DESIGN.md README.md
```

预期：无输出。若有残留，删除或替换为 v4 语义类。

- [ ] **Step 5: 验证**

```bash
pnpm lint
pnpm test
pnpm build
```

- [ ] **Step 6: Commit**

```bash
git add README.md
git commit -m "docs: 更新 README 的字体、结构与设计说明"
```

---

### Task 17: Lighthouse、无障碍与最终回归

**Files:**
- 可能需要微调：`src/index.css`、页面组件、`lighthouserc.json`（仅当阈值路径失效）

- [ ] **Step 1: 构建并启动预览**

```bash
pnpm build
pnpm preview --port 4173 --strictPort
```

另开终端执行：

```bash
pnpm dlx @lhci/cli@0.15.1 autorun
```

预期：`/`、`/blog`、`/blog/getting-started-with-react-hooks` 三条 URL 的 Performance ≥ 0.90，Accessibility / Best Practices / SEO ≥ 0.95。若失败，记录报告路径（`.lighthouseci/`）并修复。

- [ ] **Step 2: 无障碍检查**

使用浏览器 DevTools 或 axe：
- 所有导航链接有可见文本或 `aria-label`；
- `aria-current="page"` 只出现在当前项；
- 移动抽屉/搜索/二维码弹窗 Esc 可关、焦点锁定与归还；
- 表格有 `<th>`；图片有 `alt`；
- 对比度：`--muted` 在浅色 `#6B7280` / 白色 ≥ 4.5:1；深色 `#A1A1AA` / `#09090B` ≥ 4.5:1。

- [ ] **Step 3: 浏览器回归矩阵**

1440×900 / 390×844 / 320×568，明/暗与中/英各一遍：

- `/`：三段 intro、社交行、年份水印、5 篇文章、页脚；无项目卡片。
- `/projects`：表格/卡片、外链。
- `/blog`：分类/标签筛选、年份列、hover 压暗、RSS、⌘K 搜索键盘操作。
- `/blog/getting-started-with-react-hooks`：TOC 高亮、行号代码块、图片、返回链接。
- `/skills`：分类行。
- `/contact`：邮件、二维码、简历。
- `/404`：返回首页。
- `/admin.html`：编辑、保存、撤销、文章表格、预览抽屉。
- 控制台无错误、无横向溢出。

- [ ] **Step 4: 修复问题并复跑**

任何失败按以下顺序处理：

```bash
pnpm lint
pnpm test
pnpm build
```

修复后重新运行 Lighthouse 三条 URL，直到达到阈值。

- [ ] **Step 5: 最终提交**

```bash
git add src index.html admin.html DESIGN.md README.md docs tests public/fonts
git commit -m "chore: 完成 v4 重构验收与细节修正"
```

若没有需要提交的改动，跳过此步并记录「无额外改动」。

---

## 自检记录

- **Spec 覆盖**：双壳（Task 3/6）、Geist（Task 1）、onur 配色（Task 1）、首页（Task 4）、博客列表（Task 10）、文章页（Task 11）、项目/技能/联系/404（Task 7/8/9）、后台（Task 13/14/15）、清理旧文档与组件（Task 5/12/16）、Lighthouse（Task 17）。
- **占位符**：无 TBD/TODO；每个代码步骤给出完整代码或精确替换片段。
- **类型一致**：`groupPostsByYear` 输出 `{ year, posts }`，首页与博客列表一致；`searchPosts(posts, query, t)` 在测试与 SearchDialog 一致；`rehypeCodeLines` 输出的 `code-line` / `data-line` 与 CSS 一致；`Button` 的 `as`/`variant`/`size` 在页面与后台一致。
- **已知取舍**：文章页在 ≥1280px 扩展到 1024px 放置 TOC；首页 header 不吸顶以匹配 antfu 的 NavBar 流式布局。
