# STYLAN Site · Design Spec v2

> 状态：**主体已实施**（表现层为 SiteRail 左轨 + 静态 CSS 网格，非独立 Hero 全屏页）  
> 主方向：**A · Neo Editorial** + 少量 **B · Soft Glass**  
> 用户锁定：Roboto Display · 双主题对等 · 极细网格 · 项目**无** hover 预览  
> 布局参考：[brittanychiang.com](https://brittanychiang.com/) · [oiloil.org](https://www.oiloil.org/)
> 实现说明：全屏交互画布（ShapeGrid / PixelBlast / Dither）已移除，背景改为纯 CSS 网格 + 径向光晕；Display 字体为本地 Roboto，不使用 Clash Display。

---

## 1. 设计原则

1. **编辑部优先**：编号章节、大标题、严网格、留白；动效只做标点。
2. **唯一强调色**：蓝 `#3B82F6` 收敛使用，禁止彩虹渐变。
3. **科技感**：mono 角标、细线、编号、精确排版；不用满屏粒子。
4. **双主题对等**：Light / Dark 都是完整一等公民，默认跟随系统，可手动切换。
5. **原结构与原功能全保留**：只升级表现层与局部实现质量；不改目录约定、路由语义、内容数据源（详见 §12）。

---

## 2. 布局总纲（融合两站）

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

### 3.1 色板（双主题对等）

| Token | Light | Dark | 用途 |
|-------|-------|------|------|
| `--bg` | `#F7F7F5` | `#0B0C0E` | 页面底 |
| `--bg-elevated` | `#FFFFFF` | `#12141A` | 卡片/面板 |
| `--ink` | `#12141A` | `#F2F3F5` | 主文字 |
| `--ink-muted` | `#5C6370` | `#9AA1AC` | 次要文字 |
| `--line` | `#E4E6EA` | `#2A2E36` | 分割线 |
| `--accent` | `#3B82F6` | `#5B9CFF` | 唯一强调色 |
| `--accent-soft` | `rgba(59,130,246,.10)` | `rgba(91,156,255,.14)` | 选中/底 |
| `--accent-glow` | `rgba(59,130,246,.20)` | `rgba(91,156,255,.26)` | 极轻光晕（CTA/菜单） |

**蓝的使用面**：链接、焦点环、主 CTA、活动锚点、hover 描边微光、少量数字。  
**禁止**：大面积蓝渐变底、多色按钮、重阴影。

### 3.2 字体

| 角色 | 字体 | 规格 |
|------|------|------|
| Display | **Roboto**（本地 `public/fonts`） | `clamp(2.75rem, 8vw, 6.5rem)` / 500–700 / tracking `-0.03em` / lh `0.95–1.05` |
| 中文大标题 | Noto Sans SC 800–900 | 紧字距，与 Display 同级 |
| 正文 | Inter + Noto Sans SC | 16–18px / 1.7 |
| Mono 元信息 | FiraCode Nerd Font（本地） | 11–13px / `0.04em` / 常 uppercase |
| 博客正文 | Noto Sans SC | 17–18px / 行宽 `38–42rem` |

实现口径（与 `src/index.css` 一致）：

- `--font-display` / `--font-heading`: `"Roboto", "Noto Sans SC", sans-serif`
- `--font-body` / `--font-post`: Noto Sans SC 优先
- `--font-mono`: `"FiraCode Nerd Font", "Fira Code", ui-monospace, monospace`
- Roboto 300/400/500/700 本地 `@font-face`；中文回退 Noto Sans SC，**不用** Roboto 顶中文
- Noto Sans SC + Inter 经 Google Fonts CDN；Display/Mono 不走 CDN

### 3.3 网格与间距

- 基准 8px；区块间距 96–160px（移动 64–80px）
- 容器 `max-width: 1120–1200px`
- 圆角 4–8px；描边 `1px solid var(--line)`
- **Hero 极细网格**：CSS 背景网格，线宽 1px，间距 48–64px，颜色 `var(--line)` 或 accent @ 4–6% opacity；Light/Dark 都要清晰但不抢戏

### 3.4 动效（克制 + reduced-motion）

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

## 4. 全局导航

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
- 四列或两行分组：AI / Frontend / Backend / Tools（从 config 读）
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
  config.js                   # 主站内容配置（扩展字段，不删旧字段）
  blogConfig.js               # 博客分类与页面文案
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
public/（字体、图片、404、rss）
```

路由语义保持：`/` `/skills` `/projects` `/blog` `/blog/:slug` `/contact` `*`。

### 12.2 功能清单：保留 → 优化方向

| 功能 | 现状 | 处理 |
|------|------|------|
| **Markdown 博客解析** | `utils/markdown.js` + `front-matter` + `import.meta.glob`；中/英分目录 | **保留管线**。优化：统一 slug/日期解析；图片路径解析更稳；缺字段兜底；解析错误可见；可选 `marked`/`remark` 仅用于 RSS，**不替换**前端 `react-markdown` 渲染链 |
| **文章渲染** | `react-markdown` + GFM + highlight + Mac 代码块 | **保留**。优化：rehype-slug / autolink、外链 `rel`、图片尺寸、表格与引用样式对齐新 token |
| **双语** | `useLanguage` + `{en,zh}` + `posts/` vs `posts/en/` | **保留**。优化：升为 Context，避免多实例不同步；语言切换时 TOC/标题/SEO 一并刷新 |
| **主题** | `useTheme` + `html.dark` + localStorage | **保留**。优化：Context 化；首屏防闪烁脚本（可选）；token 驱动明暗 |
| **RSS** | `scripts/generate-rss.js` 挂在 `build` | **保留**。优化：站点 title/description 与 `config.js` 单源；修正文章 URL；HTML 转换更稳 |
| **搜索 Ctrl+K** | `BlogSearch` 过滤 posts | **保留**。优化 UI 为命令面板；逻辑仍用已有 posts 列表 |
| **分类筛选** | `blogConfig.categories` + frontmatter `category` | **保留**。优化：卡片显示翻译后的分类名；校验/统一 id 小写（修 `Tutorials` 类不一致） |
| **文章 TOC** | `TableOfContents` + heading id | **保留**。优化：`useMemo` 随 content 更新；scroll 改为只监听必要事件 |
| **简历下载** | `public/resume.pdf` | **保留**，Contact 行展示 |
| **微信二维码** | Contact 浮层 | **保留**，样式改轻玻璃 |
| **GitHub Pages SPA** | `404.html` + index 重定向脚本 | **保留**，404 视觉对齐新设计 |
| **SEO** | index meta + `PageTitle` | **保留并延续** `STYLAN · ` 标题约定 |
| **动画配置项** | `heroRight.type` wave/dots/rays… | **保留配置能力**；首页默认改为网格 Hero，wave 等仍可在 config 切换或标为 legacy |
| **Loading 首屏** | `Loading` + lazy 路由 | **保留**；缩短时长、样式对齐；并补上缺失的 `<Suspense>` 包裹 |

### 12.3 明确禁止的「重构过界」

- 不把博客改成 CMS / 远程 MD  
- 不删除中英双文章目录约定  
- 不把 `config.js` 拆成必须手改多文件才能换文案  
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
| 数据/约定（posts、config 字段、路由） | 原则上不改；可**新增**可选字段 |
| 工具层（markdown.js、generate-rss） | 可修 bug、可增强，不换产品形态 |
| Hook 层 | 可升 Context，对外 API 尽量保持 `useTheme()` / `useLanguage()` |
| 组件/页面 JSX + CSS | **主要改造面**（布局、排版、动效） |
| 依赖 | 可增 Display/Mono 字体资源（当前 Roboto + FiraCode 本地）、可选动画库；`react-markdown` 链保留 |
