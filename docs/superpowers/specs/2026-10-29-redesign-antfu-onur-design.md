# 个人站视觉与信息架构重构 · 设计规格

> 日期：2026-10-29
> 分支：`redesign/antfu-onur`（从 `dev` 切出）
> 状态：设计已确认，待实现
> 参考：首页项目卡片网格 [antfu.me](https://antfu.me/)，博客排版 [onur.dev](https://onur.dev/)

## 1. 背景

现有站点已经是 React 19 + Tailwind 4 + Vite，内容由 `src/content/site.yaml` 与 `src/posts/` 驱动，中文/英文双语。当前视觉为 Brittany 式「左侧固定身份栏 + 右侧编号列表」，Lighthouse 移动端性能 **73**。

本次不是换栈，而是**重做布局与视觉系统的表现层**：把首页改成 antfu 式「居中单列 + 低饱和项目卡片网格」，把博客改成 onur 式「字号层级 + 宽行距 + 标签系统」，同时把移动端性能拉到 90 以上。

## 2. 目标与非目标

### 目标

1. 居中单列布局，桌面最大内容宽 72rem，文章正文 68ch。
2. 低饱和、高信息密度的项目卡片网格（1/2/3 列响应式）。
3. 博客列表与文章页采用 onur 式字号层级、行距和标签系统。
4. 保留并重做现有页面：About / Projects / Blog / Skills / Contact / 404。
5. 保留交互：中英切换、主题切换、Ctrl+K 搜索、分类筛选、文章 TOC、微信二维码、resume 入口。
6. 移动端 Lighthouse 性能 ≥ 90（`/`、`/blog`、`/blog/<slug>`），a11y / best-practices / SEO 不低回退。
7. 不引入新框架、不加重型动画。

### 非目标

- 不改路由语义、不改内容数据源形态（仍是 YAML + Markdown）。
- 不改后台（`src/admin`）的交互与布局，仅为其 schema 增补字段。
- 不新增语言、不新增博客功能（标签只做就地过滤，不做标签独立路由）。
- 不做 SSR/SSG 迁移。

## 3. 约束

- 技术栈固定为现有 React 19、React Router 7、Tailwind 4、Vite 8、react-markdown。
- 字体改为**系统字体栈**，删除 Google Fonts CDN `@import` 与本地 TTF 的 `@font-face` 引用。
- 动效仅保留颜色/边框/背景的 150ms 过渡；禁止位移、缩放、视差、逐字动画、磁性按钮。
- 保留现有单测、RSS 生成脚本与 GitHub Pages 部署方式。

## 4. 信息架构与路由

| 路由 | 页面 | 说明 |
| --- | --- | --- |
| `/` | 首页 | Hero / 精选项目 / 最新文章 / 技能 / 联系 CTA |
| `/projects` | 项目全览 | 全部项目卡片网格 |
| `/blog` | 博客列表 | 分类 + 标签筛选、Ctrl+K 搜索 |
| `/blog/:slug` | 文章页 | 68ch 正文 + TOC |
| `/skills` | 技能 | 分组全览 |
| `/contact` | 联系 | 联系方式、二维码、resume |
| `*` | 404 | 返回首页 |

全局顶部导航（桌面 ≥768px）：左 `STYLAN`，中 `Projects / Blog / Skills / Contact`，右主题与语言切换。移动端折叠为菜单按钮 + 抽屉面板。当前路由用 `text-ink` 与 `aria-current="page"` 标识，非活动项 `text-muted`。

## 5. 设计系统

### 5.1 颜色令牌

| Token | Light | Dark | 用途 |
| --- | --- | --- | --- |
| `--bg` | `#FAFAF9` | `#0E0E10` | 页面底色 |
| `--bg-elevated` | `#FFFFFF` | `#17171A` | 卡片、面板 |
| `--bg-subtle` | `#F4F4F2` | `#1D1D20` | 标签底、代码底 |
| `--ink` | `#18181B` | `#ECECEE` | 主文字 |
| `--ink-muted` | `#71717A` | `#A1A1AA` | 次要文字 |
| `--line` | `#E7E5E4` | `#27272A` | 分割线、描边 |
| `--accent` | `#2563EB` | `#60A5FA` | 唯一强调色 |
| `--accent-soft` | `rgba(37,99,235,.08)` | `rgba(96,165,250,.12)` | 选中底、hover 底 |

强调色仅用于链接、焦点环、活动标签、当前路由。不使用渐变、阴影、光晕、网格背景。

### 5.2 字体

```css
--font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "PingFang SC",
  "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif;
--font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
  "Liberation Mono", monospace;
```

- 删除 `index.css` 顶部的 Google Fonts `@import`。
- 删除 Roboto / FiraCode Nerd Font 的 `@font-face` 与 `--font-display` / `--font-heading` / `--font-body` / `--font-post` 旧变量，统一为 `--font-sans` / `--font-mono`。
- `public/fonts/` 下文件本次不删除，只是不再引用；如后续确认无他用可单独清理。

### 5.3 字号层级

| 角色 | 规格 |
| --- | --- |
| 页面主标题 h1 | `clamp(2rem, 5vw, 3rem)` / 1.1 / 600 / `-0.03em` |
| 区块标题 h2 | 1.5rem / 1.3 / 600 / `-0.02em` |
| 卡片标题 | 0.9375rem / 1.4 / 600 |
| 正文 | 0.9375rem–1rem / 1.75 |
| 文章正文 | 1.0625rem / 1.85 |
| 元信息 / 标签 | 0.6875rem–0.75rem mono / 大写 / `0.08em` |

### 5.4 间距与容器

- 间距基准 4px；区块纵向间距 64px（移动）/ 96px（桌面）。
- 内容容器 `max-width: 72rem`，水平 padding 24px / 40px。
- 文章容器 `max-width: 68ch`。
- 圆角 8–10px，描边 1px `var(--line)`。

### 5.5 动效

- 仅颜色、边框、背景 150ms 过渡。
- 删除全局 `* { transition }`、页面进入动画、滚动 Reveal、磁性按钮、逐字标题。
- 不新增任何 keyframe 动画。

## 6. 页面规格

### 6.1 首页 `/`

1. **Hero**：小号 mono 上标（accent）→ 名字 h1 → 身份标签 chips → 简介（muted，`max-width: 40rem`）→ 社交图标行。
2. **About**：保留原 About 的三段自述与 `about.focus` 方向列表；桌面为「左标题 + 右正文」两列，移动端单列。
3. **精选项目**：区块标题 + 「全部项目 →」；卡片网格，取 `featured !== false` 的前 6 个（不足则全部）。
4. **最新文章**：区块标题 + 「全部文章 →」；4 条文章行，复用博客行组件。
5. **技能**：3 列分组（移动 1 列），每组 mono 分类名 + 换行排列的标签 chips。
6. **联系 CTA**：一句话 + 主按钮（mailto）+ 社交链接。

### 6.2 项目卡片

- 结构：图标块 40×40（`icon` emoji 或标题首字母，`--bg-subtle` 底）→ 标题 → 描述（3 行截断）→ 底部标签 chips + 外链箭头。
- 卡片整体可点击（`link` 或 `repo` 优先 `link`）；外链 `target="_blank" rel="noopener noreferrer"`。
- Hover：边框变 `--ink` 20% 透明、标题变 accent、箭头右移 2px 以内（可选，不强制）。
- 网格：`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`，gap 12–16px。
- 卡片内不放图片，保证 LCP 与布局稳定。

### 6.3 博客列表 `/blog`

- 页头：mono 上标 `WRITING` + h1 + 副标题 + 右侧 RSS 与搜索按钮。
- 筛选条：分类 chips（现有分类，含「全部」）+ 标签 chips（从全部文章 tags 去重，最多展示高频 8 个）。两者可同时生效；选中项 accent 底。
- 文章行：桌面三栏 `日期(6rem) | 内容 | 分类`；移动端日期与分类在标题上方一行。
  - 标题 1.125rem/600，hover 变 accent。
  - 摘要 0.875rem muted，2 行截断。
  - 标签 chips 小号 mono。
- 行间 1px 分割线，上下 padding 20–24px。
- 空状态：muted mono 文案。
- Ctrl+K 打开现有搜索弹窗，样式随新令牌调整。

### 6.4 文章页 `/blog/:slug`

- 头部：返回链接 → 分类/标签 → h1 → 元信息（日期 · 阅读时长 · 标签）。
- 正文 68ch 居中；`prose` 规则自写（不复用第三方 typography 插件）：段落 1.0625rem/1.85；h2 1.5rem，`margin-top: 2.5em`，`scroll-margin-top: 6rem`；h3 1.25rem；列表、引用（左侧 2px accent 线）、行内码（`--bg-subtle` 底 + 4px 圆角）、代码块（横向滚动，等宽字体）、表格细线。
- TOC：≥1280px 右侧 sticky（`top: 6rem`，宽 200px）；小屏折叠为正文上方的 `<details>`。
- 底部：上一篇/下一篇（若现有数据可得）或返回列表。

### 6.5 `/projects`

PageHeader（上标 `WORK` + h1 + 描述）+ 全部项目卡片网格，不筛选。

### 6.6 `/skills`

PageHeader + 分组网格（`sm:grid-cols-2 xl:grid-cols-3`）。每组：mono 分类名 + 技术项 chips。

### 6.7 `/contact`

两列（≥1024px）：左侧标题 + 描述 + 邮箱按钮 + 联系方式列表；右侧二维码/插图卡（`loading="lazy"`、`decoding="async"`、显式宽高或 `aspect-ratio`）。保留 resume.pdf 下载入口。

### 6.8 404

居中：mono `404`、一句话说明、返回首页按钮。

## 7. 组件与文件影响

### 新增

- `src/components/shared/SiteHeader.jsx`：全局导航 + 主题/语言 + 移动菜单。
- `src/components/shared/ThemeLangControls.jsx`：从 SiteRail/SubpageHeader 抽取共用。
- `src/components/shared/PageHeader.jsx`：上标 + h1 + 描述 + 右侧动作。
- `src/components/shared/TagChip.jsx`：统一标签样式，支持 `active` 与 `as`。
- `src/components/shared/ScrollToTop.jsx`：从 PageTransition 抽出，保留原行为。
- `src/components/HomePage/ProjectCard.jsx`、`ProjectGrid.jsx`、`PostRow.jsx`。
- `src/components/BlogPage/TagFilter.jsx`。

### 重写

- `src/index.css`（令牌、系统字体、少量工具类、prose 入口）。
- `src/styles/blog-post.css`（文章排版）。
- `src/App.jsx`（去掉 Boot Loading 门禁，改为立即渲染；统一顶部导航 + 页脚）。
- `src/pages/*.jsx` 与 `src/components/HomePage/*`、`src/components/BlogPage/*` 的表现层。

### 删除

- `src/components/shared/SiteRail.jsx`、`SubpageHeader.jsx`、`Reveal.jsx`、`MagneticButton.jsx`、`PageTransition.jsx`（ScrollToTop 先抽出）、`Loading.jsx`、`SectionKicker.jsx`。
- `src/components/HomePage/AnimatedText.jsx`。
- `src/theme.js`（未被引用）。
- 仅服务于旧布局的 CSS 类与规则。

### 保留

- 路由、内容加载（`utils/markdown.js`）、语言/主题 Context、后台全部逻辑、RSS 脚本、测试。

## 8. 数据模型变更

`site.yaml` 的 `projects[]` 新增可选字段：

```yaml
projects:
  - title: { en, zh }
    description: { en, zh }
    tags: [React, ...]
    link: https://...        # 展示链接（保留）
    repo: https://github.com/...  # 新增，可选
    icon: "📄"               # 新增，可选 emoji
    featured: true           # 新增，可选，默认 true
```

内容补充（双语草稿，用户可在后台修改）：

| 项目 | 来源仓库 | 描述要点 |
| --- | --- | --- |
| Orbit Desk | `e-commerce-cs-agent` | 电商客服 Agent，FastAPI + RAG + SSE 流式，含离线评测 |
| 微笺 | `weijian` | 公众号 Markdown 写作工作台 |
| AI CRM | `AI_CRM` | LangGraph + RAG 的法律咨询/搜索/数据库助手 |
| rea | `rea` | 面向 Agent 的逆向工程工具 |

保留 ZensheetCV、ArtVault。

`src/admin/schema.js` 的 projects 字段增加 `repo`（url）、`icon`（text）、`featured`（`toggle`，后台已有该字段类型）。后台预览与校验逻辑保持兼容。

## 9. 性能策略

1. **字体零请求**：删除 Google Fonts `@import` 与 TTF `@font-face`（FiraCode TTF 单文件 2.6MB，是最大负担）。
2. **取消启动门禁**：`App.jsx` 立即渲染路由，删除 `Boot` 的 Loading 阶段；首页静态导入，子页保留 `lazy` 与 idle 预取，Suspense fallback 为轻量骨架（纯文本/细线）。
3. 删除全局 `*` 过渡与所有滚动/入场动画。
4. 图片：联系页插图懒加载 + 显式尺寸；项目卡片无图。
5. 保持现有代码分割（首页/子页 chunk），不新增运行时依赖。
6. 构建产物检查：确认字体不再被打包/预加载。

### 验收阈值

Lighthouse 移动端（模拟节流，`vite preview` 产物）：

| 页面 | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| `/` | ≥ 90 | ≥ 95 | ≥ 95 | ≥ 95 |
| `/blog` | ≥ 90 | ≥ 95 | ≥ 95 | ≥ 95 |
| `/blog/two-sum` | ≥ 90 | ≥ 95 | ≥ 95 | ≥ 95 |

桌面端同步记录一次，性能 ≥ 95。若首页因路由懒加载导致性能不达标，优先排查字体请求、LCP 元素与主线程任务。

## 10. 无障碍

- 导航 `<nav aria-label>`，当前路由 `aria-current="page"`。
- 主题/语言/菜单按钮有 `aria-label` 与 `aria-expanded`（菜单）。
- 可见焦点环：`outline: 2px solid var(--accent); outline-offset: 2px`。
- 标签 chips 若可点击使用 `<button aria-pressed>`。
- 对比度：muted 文本在两种主题下均 ≥ 4.5:1。
- 尊重 `prefers-reduced-motion`：由于已无动画，无需额外代码。

## 11. 测试

### 自动化

- `pnpm lint`
- `pnpm test`（现有 8 个单测必须全绿）
- `pnpm build`（含 RSS 生成）

### 浏览器实测（桌面 1440×900 / 移动 390×844）

- 明/暗主题切换、中/英切换、刷新后保持。
- 顶部导航与移动菜单、当前路由高亮。
- 首页卡片跳转；`/projects` 全量。
- 博客分类 + 标签组合筛选、空状态、Ctrl+K 搜索。
- 文章页 TOC 高亮与跳转、代码块横向滚动、长表格。
- 联系页二维码、resume 下载、外链。
- 404 返回首页。
- 控制台无错误、无布局溢出（含 320px 宽度）。

## 12. 里程碑

1. **M1 基础与首页**：令牌/字体/导航/App 壳/首页（Hero、项目卡片、文章、技能、联系）。
2. **M2 博客**：列表页（筛选 + 标签）、文章页（prose + TOC）、搜索弹窗样式。
3. **M3 子页与内容**：Projects、Skills、Contact、404；YAML 补项目；后台 schema。
4. **M4 收尾**：a11y 检查、Lighthouse 三条页面达标、文档更新（README / DESIGN.md）、清理旧代码。

每个里程碑结束跑 lint/test/build 并做浏览器实测，然后提交一次本地 commit（不 push）。

## 13. 风险

| 风险 | 应对 |
| --- | --- |
| 系统字体在 Windows/macOS 观感差异 | 采用主流系统栈，中文优先 PingFang/微软雅黑；标题仅靠字重与字距建立层级 |
| 取消 Loading 后首屏出现空壳 | Suspense fallback 用与最终布局同高的骨架，避免 CLS |
| 标签与分类筛选状态叠加后无结果 | 提供空状态与「清除筛选」 |
| Lighthouse 仍受第三方请求影响 | 确认无 Google Fonts、无外链图片；本地字体文件不再引用 |
| 后台 schema 变更破坏预览 | 新字段全部可选，保留 `validate.js` 现有必填规则 |
