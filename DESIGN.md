# STYLAN Site · Design Spec v3

> 状态：**v3 已实施**（2026-10-29 重构）
> 主方向：**居中单列 · 低饱和卡片 · 系统字体**
> 参考：antfu.me（项目卡片网格）· onur.dev（博客排版）
> 设计规格：`docs/superpowers/specs/2026-10-29-redesign-antfu-onur-design.md`
> 说明：左轨布局、Web 字体、网格背景与重型动效已移除。

> **历史说明**：§2、§3.3–§3.4、§4、§5、§7–§9 描述的是 v2 方案（Brittany 式左轨、Roboto/FiraCode、网格背景、入场动效、首屏 Loading），已于 v3 移除，仅作历史记录，不再是实现依据。**当前实现以本文件 §1、§3.1–§3.2 与设计规格为准**：

| 项目 | v3 现状 |
|------|---------|
| 布局 | 顶部导航（sticky）+ 居中单列，内容容器 `max-width: 72rem` |
| 字体 | 系统字体栈（`--font-sans` / `--font-mono`），无 `@font-face`、无 Google Fonts |
| 背景 | 纯色 `--bg`，无网格/光晕/渐变 |
| 动效 | 仅颜色、边框、背景 150ms 过渡；无滚动 Reveal、无磁吸按钮、无逐字动画 |
| 加载 | 无首屏 Loading 门；首页静态导入，子页 `lazy` + `Suspense` 占位 |

---

## 1. 设计原则

1. **内容优先**：居中单列、克制的字号层级与留白，装饰只服务于信息层级。
2. **唯一强调色**：蓝 `#2563EB`（dark `#60A5FA`），仅用于链接、焦点环、活动标签、当前路由。
3. **低饱和**：卡片用 `--bg-elevated` + 1px `--line` 描边，不用渐变、阴影、光晕。
4. **双主题对等**：Light / Dark 都是完整一等公民，默认跟随系统，可手动切换。
5. **原结构与原功能全保留**：只升级表现层与局部实现质量；不改目录约定、路由语义、内容数据源（详见 §12）。

---

## 2. 布局总纲（v2 · 历史）

> 本节为 v2 的「左轨 + 锚点」方案，v3 已改为顶部导航 + 居中单列；保留仅供追溯。

### 从 Brittany 借

| 元素 | 用法 |
|------|------|
| **桌面左侧固定轨** | 姓名、一句话定位、锚点导航、底部社交；右侧滚动内容 |
| **锚点式首页** | About / Work / Writing / Contact 同页锚点 + 独立子页 |
| **经历时间线** | 年份 + 角色 + 描述 + 技术标签，列表而非卡片堆 |

### 从 Oil 借

| 元素 | 用法 |
|------|------|
| **编号章节** | `01` `02` `03` + mono 中英标签（`WORK / 项目`） |
| **超大 Display 标题** | 姓名 / 区块标题用 Roboto（`--font-display`） |
| **联系列表** | `01 GitHub →` `02 Email →` 编号外链行 |
| **文章行** | 日期 + 标题 + 摘要，可带封面（可选） |
| **角标 meta** | `ENGINEER · AI · OPEN-SOURCE` 一类 mono 标签 |

**不借**：Oil 的大型交互 demo 画廊、咨询付费模块、满屏产品轮播——你站不需要。

---

## 3. 视觉系统

### 3.1 颜色令牌（v3，与 `src/index.css` 一致）

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

### 3.2 字体（v3：系统字体栈，无 Web 字体）

```css
--font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "PingFang SC",
  "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif;
--font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
  "Liberation Mono", monospace;
```

- 全站只使用上面两个 CSS 变量：正文 / 标题用 `--font-sans`，元信息、标签、代码用 `--font-mono`。
- **不加载任何 Web 字体**：无 Google Fonts `@import`、无 `@font-face`、无字体文件请求；`public/fonts/` 为历史遗留，当前未被引用。
- Roboto / FiraCode Nerd Font 与 `--font-display` / `--font-heading` / `--font-body` / `--font-post` 旧变量均已删除，字体不做 CDN 回退。

字号层级见设计规格 §5.3：h1 `clamp(2rem, 5vw, 3rem)` / 600 / `-0.03em`；区块标题 1.5rem / 600；卡片标题 0.9375rem / 600；正文 0.9375rem–1rem / 1.75；文章正文 1.0625rem / 1.85；元信息 0.6875–0.75rem mono 大写。

### 3.3 网格与间距（v2 · 历史）

> v3 已取消网格背景：间距基准 4px，区块纵向 64px（移动）/ 96px（桌面），容器 `max-width: 72rem`，圆角 8–10px，详见规格 §5.4。以下为 v2 记录。

- 基准 8px；区块间距 96–160px（移动 64–80px）
- 容器 `max-width: 1120–1200px`
- 圆角 4–8px；描边 `1px solid var(--line)`
- **Hero 极细网格**：CSS 背景网格，线宽 1px，间距 48–64px，颜色 `var(--line)` 或 accent @ 4–6% opacity；Light/Dark 都要清晰但不抢戏

### 3.4 动效（v2 · 历史；v3 仅保留 150ms 颜色/边框过渡）

| 场景 | 方案 | 时长 |
|------|------|------|
| Hero 姓名 | SplitText 逐字 | 0.6–0.8s |
| 区块入场 | fade + 12px 上移 + stagger | 0.4–0.5s |
| Hover 链接/行 | 颜色/背景微变 | 150ms |
| 主 CTA | Magnet（仅 1 处） | 跟随 |
| 数字 | CountUp（可选） | ~1s |
| 全局 | `prefers-reduced-motion` 全关动画 | — |

**签名时刻（仅 3 个）**  
1. Hero：Roboto 大姓名 + 网格底 + mono 角标  
2. Work：编号大列表（无 hover 预览图）  
3. Contact：编号外链行 + 一处磁性邮箱按钮  

---

## 4. 全局导航（v2 · 历史）

> v3 已改为：sticky 顶部导航（品牌 + Projects / Blog / Skills / Contact + 主题/语言 + 移动端菜单）+ 居中单列内容，不再有左轨与锚点高亮。以下为 v2 记录。

### 桌面（≥1024px）— Brittany 轨

```text
┌────────────┬──────────────────────────────────────┐
│ STYLAN     │                                      │
│ AI Dev     │         右侧内容滚动区                │
│            │                                      │
│ 01 About   │                                      │
│ 02 Work    │                                      │
│ 03 Writing │                                      │
│ 04 Skills  │                                      │
│ 05 Contact │                                      │
│            │                                      │
│ [GitHub]   │                                      │
│ [Bilibili] │                                      │
│ theme/lang │                                      │
└────────────┴──────────────────────────────────────┘
```

- 左轨宽 `280–320px`，`position: sticky; top: 0; height: 100vh`
- 锚点高亮当前 section（IntersectionObserver）
- 独立子页（/blog /blog/:slug 等）左轨变为：品牌 + 返回 + 简短 nav
- 移动端：顶栏 + 全屏菜单（Oil 式大号编号列表）

### 子页顶栏（Blog/文章详情等）

细顶栏 56–64px：左品牌 mono，右 nav / theme / lang；可沿用「下滚隐藏」。

---

## 5. 首页结构（单页锚点 + 子页）

```text
[Hero 00]
[About 01]
[Work 02]
[Writing 03]
[Skills 04]
[Contact 05]
```

### 00 Hero

- 全屏（min-height 100vh），背景 **极细网格**
- 左/中：Roboto 姓名 `STYLAN`；下方一句定位（中英）
- mono 角标：`AI APPLICATION DEVELOPER` · `LLM / RAG` · `BASED IN CN`
- CTA：`Contact`（磁性）+ `View work →`
- **无** Wave/Dots/Rays 大动画；可选角落实时时间（mono，可关）
- 中英：标题结构固定，文案走 `t()`

### 01 About

- 编号 `01` + 标签 `ABOUT / 关于`
- 2–3 段短文（专注 LLM 落地与 RAG…）
- 右侧或下方：技能关键词 chips（AI · LangChain · React · …）

### 02 Work（项目）

- 编号 `02` + `SELECTED WORK / 精选项目`
- **大列表**（非三列卡、**无 hover 预览图**）：

```text
01  LangChain RAG Demo          Python · LangChain · Chroma     2025  ↗
02  AI CRM                      LangGraph · SQLite · Tavily     2025  ↗
03  …
```

- 行 hover：背景 `--accent-soft` 或底边线变 accent；整行可点外链
- 底部：`More on GitHub →`

### 03 Writing（最新文章）

- 编号 `03` + `WRITING / 文章`
- 3 条精选：`日期 mono` + 标题（大一号）+ 一行摘要 → `/blog/:slug`
- `All posts →` 进 `/blog`

### 04 Skills

- 编号 `04` + `SKILLS / 技能`
- 四列或两行分组：AI / Frontend / Backend / Tools（从 site.yaml 读）
- Hobbies 不进主列表，可进 About 末尾一句或省略
- 独立 `/skills` 页可做更全版本，首页只摘要

### 05 Contact

- 编号 `05` + `CONTACT / 联系`
- 一句欢迎语
- **编号外链行**（Oil 式）：

```text
01  GitHub     duan-deqing          →
02  Email      duan-deqing@…        →
03  Bilibili   -stylan-             →
04  WeChat     扫码                  [浮层二维码]
05  Resume     PDF                  →
```

- 微信：轻玻璃浮层（blur + 线框，B 元素）
- 页脚：`© 2026 STYLAN` + 主题/语言（若未在左轨）

---

## 6. 子页

| 路由 | 布局 |
|------|------|
| `/skills` | 顶栏 + 编号章节 + 完整分类网格 |
| `/projects` | 与 Home Work 同列表，可多项目、分年 |
| `/blog` | 时间线/编辑列表 + mono 分类 chip + Ctrl+K 命令面板（轻玻璃） |
| `/blog/:slug` | 窄栏正文 + 侧 TOC + Mac 代码块（accent 高亮） |
| `/contact` | 可与 Home 05 同构，或全页放大版 |
| `404` | mono `404` + 网格底 + 返回 |

---

## 7. React Bits / 实现选型

| 优先 | 用途 |
|------|------|
| P0 | Display 字体（Roboto 本地）、CSS 变量 token、左轨导航、Hero 网格 |
| P0 | SplitText（Hero）· Magnet（Contact CTA） |
| P1 | 命令面板搜索、微信玻璃浮层、CountUp（可选） |
| P1 | DecryptedText 仅 AI 关键词 1 处 |
| 不做 | 项目 hover 预览图、Aurora/Orb 满屏、GridMotion 全页、TiltedCard、全屏交互画布（ShapeGrid/PixelBlast/Dither） |

---

## 8. 组件改造映射

| 现有 | 目标 |
|------|------|
| `WaveAnimation` Hero | 删除或移出首页默认 |
| `TypewriterText` | 可选保留短词；主标题用 SplitText |
| `Projects` 三列卡 | 编号大列表 |
| `BlogSection` 三卡 | Writing 编号行 |
| `PageHeader` | 桌面左轨 + 移动全屏菜单；子页细顶栏 |
| `Contact` 区块 | 编号外链行 + 玻璃二维码 |
| `theme.js` | 扩展为 CSS 变量 + 少量工具类 |
| `index.css` | Display 字体（Roboto）、网格、token、reduced-motion |

---

## 9. 实施阶段

> 每阶段验收必须包含：**博客能开、文章能读、主题/语言能切、搜索/TOC/简历仍在**（回归清单见 §12）。

| 阶段 | 内容 | 验收 |
|------|------|------|
| **P0** | Token + 字体 + 网格 utility + 基础组件肤 + 功能回归基线 | 无 JS 可辨新皮；原功能清单可跑 |
| **P1** | 左轨导航 + Hero + Home 五段 | 首屏定调；配置驱动内容仍在 |
| **P2** | Skills/Projects/Contact/404 | 子页统一；简历/二维码/外链正常 |
| **P3** | Blog 列表/正文/搜索面板 + markdown 体验优化 | 分类/搜索/TOC/双语文章正常 |
| **P4** | SplitText/Magnet/入场 + reduced-motion + Hook Context 化 | 手感；多处主题语言同步 |
| **P5** | 响应式/双主题细节/SEO/RSS | 可上线 |

---

## 10. 明确不做

- 项目卡 hover 大图预览  
- 全站 3D / 重粒子 / 全屏交互画布  
- 第二强调色体系  
- 改 Markdown 约定与路由  

---

## 11. 参考

- https://brittanychiang.com/ — 左轨 + 锚点 + 时间线  
- https://www.oiloil.org/ — 编号章节 + mono 角标 + 联系行 + 文章列表  
- https://www.dennissnellenberg.com/ — 大字与 CTA  
- https://emilkowal.ski/ — 克制与密度  
- https://linear.app/ — 暗色玻璃质感（仅菜单/面板）  
- Display 字体：本地 Roboto（`public/fonts`），token 见 §3.2  

---

## 12. 原项目结构与功能保留（硬约束）

> 实施红线：**不得推倒现有工程结构**。新设计是「换皮 + 局部重构表现层」，不是重写站点。

### 12.1 目录与入口（保持）

```text
src/
  main.jsx / App.jsx          # 路由与懒加载入口保留
  content/site.yaml           # 全站内容配置（扩展字段，不删旧字段）
  content/blog.yaml           # 博客分类与页面文案
  admin/                      # 本地内容后台（仅 dev，不参与构建）
  theme.js                    # 可升级为 token 映射，但继续可被组件引用
  index.css                   # 全局样式入口
  pages/                      # 页面组件目录不变
  components/
    shared/  HomePage/  BlogPage/
  posts/  + en/ + img/        # Markdown 文章约定不变
  hooks/useTheme.js  useLanguage.js
  utils/markdown.js
  styles/blog-post.css
scripts/generate-rss.js
public/（图片、404、robots.txt、rss；`public/fonts/` 为历史遗留、当前未引用）
```

路由语义保持：`/` `/skills` `/projects` `/blog` `/blog/:slug` `/contact` `*`。

### 12.2 功能清单：保留 → 优化方向

| 功能 | 现状 | 处理 |
|------|------|------|
| **Markdown 博客解析** | `utils/markdown.js` + `front-matter` + `import.meta.glob`；中/英分目录 | **保留管线**。优化：统一 slug/日期解析；图片路径解析更稳；缺字段兜底；解析错误可见；可选 `marked`/`remark` 仅用于 RSS，**不替换**前端 `react-markdown` 渲染链 |
| **文章渲染** | `react-markdown` + GFM + highlight + Mac 代码块 | **保留**。优化：rehype-slug / autolink、外链 `rel`、图片尺寸、表格与引用样式对齐新 token |
| **双语** | `useLanguage` + `{en,zh}` + `posts/` vs `posts/en/` | **保留**。优化：升为 Context，避免多实例不同步；语言切换时 TOC/标题/SEO 一并刷新 |
| **主题** | `useTheme` + `html.dark` + localStorage | **保留**。优化：Context 化；首屏防闪烁脚本（可选）；token 驱动明暗 |
| **RSS** | `scripts/generate-rss.js` 挂在 `build` | **保留**。优化：站点 title/description 与 `content/site.yaml` 单源；修正文章 URL；HTML 转换更稳 |
| **搜索 Ctrl+K** | `BlogSearch` 过滤 posts | **保留**。优化 UI 为命令面板；逻辑仍用已有 posts 列表 |
| **分类筛选** | `blog.yaml` 的 `categories` + frontmatter `category` | **保留**。优化：卡片显示翻译后的分类名；校验/统一 id 小写（修 `Tutorials` 类不一致） |
| **文章 TOC** | `TableOfContents` + heading id | **保留**。优化：`useMemo` 随 content 更新；scroll 改为只监听必要事件 |
| **简历下载** | `public/resume.pdf` | **保留**，Contact 行展示 |
| **微信二维码** | Contact 浮层 | **保留**，样式改轻玻璃 |
| **GitHub Pages SPA** | `404.html` + index 重定向脚本 | **保留**，404 视觉对齐新设计 |
| **SEO** | index meta + `PageTitle` | **保留并延续** `STYLAN · ` 标题约定 |
| **动画配置项** | `heroRight.type` wave/dots/rays… | **组件已移除**；`heroRight` 仅作为遗留字段留在 `site.yaml`，不再生效，可删除 |
| **Loading 首屏** | `Loading` + lazy 路由 | **v3 已移除**：首页静态导入，子页 `lazy` + `Suspense`（占位预留一屏高度以避免 CLS）；无启动 Loading 门 |

### 12.3 明确禁止的「重构过界」

- 不把博客改成 CMS / 远程 MD  
- 不删除中英双文章目录约定  
- 不把 `content/site.yaml` 拆成必须手改多文件才能换文案  
- 不移除主题/语言切换  
- 不在改视觉时顺手删掉 RSS、搜索、TOC、简历、二维码  

### 12.4 建议的「优化」优先级（与视觉阶段并行）

| 优先 | 项 |
|------|----|
| P0 | `Suspense` 补全；分类 id 与文案显示统一；`useTheme`/`useLanguage` Context 化 |
| P1 | TOC 与语言切换同步；markdown 图片/字段容错；RSS 配置单源 |
| P2 | 文章正文排版组件化（避免 BlogPostPage 内巨型 components 对象无限膨胀） |
| P3 | 性能：配图压缩、可选关闭 prod sourcemap |

### 12.5 与视觉改造的边界

| 层 | 改不改 |
|----|--------|
| 数据/约定（posts、site.yaml 字段、路由） | 原则上不改；可**新增**可选字段 |
| 工具层（markdown.js、generate-rss） | 可修 bug、可增强，不换产品形态 |
| Hook 层 | 可升 Context，对外 API 尽量保持 `useTheme()` / `useLanguage()` |
| 组件/页面 JSX + CSS | **主要改造面**（布局、排版、动效） |
| 依赖 | 不引入任何 Web 字体资源（系统字体栈），不引入动画库；`react-markdown` 链保留 |
