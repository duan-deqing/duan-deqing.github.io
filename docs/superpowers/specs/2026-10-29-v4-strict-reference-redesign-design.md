# STYLAN Site · v4 严格参考重构设计规格

> 日期：2026-10-29
> 分支：`redesign/antfu-onur`
> 状态：设计已确认，已实现
> 参考源码：[antfu/antfu.me](https://github.com/antfu/antfu.me)（首页）· [suyalcinkaya/onur.dev](https://github.com/suyalcinkaya/onur.dev)（博客、子页、后台视觉）
> 取代：已删除的 `2026-10-28-local-admin-design.md`、`2026-10-29-redesign-antfu-onur-design.md` 及对应 plan
> 设计契约：`DESIGN.md`（随本规格同步重写）

## 1. 背景

站点当前是 v3「顶部导航 + 居中单列 + 暖灰卡片」方案。本次不是局部调色，而是按两份参考源码重做页面壳、信息层级、组件形态与设计令牌：

- 首页按 antfu.me：极简双端导航、65ch prose、透明度层级、年份水印文章列表、阶梯入场。
- 博客、项目、技能、联系、404 按 onur.dev：固定 240px 侧栏、zinc 中性色、Geist 字体、表格式列表、shadcn 式按钮/输入框。
- 后台按 onur 的 UI 语言重做：侧栏 + 顶栏 + 卡片表单 + 表格 + 预览抽屉。
- 配色从暖灰 `#FAFAF9` 改为纯白 / zinc / 黑 / 蓝链接；字体从系统栈改为自托管 Geist。
- 删除旧设计文档，重写 `DESIGN.md`。

技术栈、路由、内容数据源、双语、主题、搜索、TOC、RSS、简历、二维码、后台功能全部保留。

## 2. 目标与非目标

### 目标

1. 两套页面壳：`/` 使用 antfu 壳；其余路由使用 onur 壳；后台独立壳。
2. 浅色严格对齐 onur 的 white / zinc-50 / gray-200 / black / blue-600 体系；深色按同一语义推导。
3. 全站自托管 Geist Sans + Geist Mono，中文回退系统字体。
4. 首页只保留：自我介绍（内联链接）、社交与邮箱、技术栈、页脚；移除首页项目卡片、技能网格、联系 CTA。
5. 博客列表改为 onur 式「年 / 日期 / 标题 / 分类」表格行；文章页改为 onur 式排版 + 保留 TOC。
6. 项目页改为 onur `workspace` 式表格；技能页改为 onur 定义行；联系页改为 onur 文本页 + 链接列表。
7. 后台在保留全部功能的前提下，视觉与布局重做为 onur 风格。
8. 移动端 Lighthouse Performance ≥ 90（`/`、`/blog`、`/blog/<slug>`），A11y / Best Practices / SEO ≥ 95。
9. 不新增运行时依赖（不引入 shadcn/Radix/cva/vaul/framer-motion/图标库）。

### 非目标

- 不改路由语义、不改 YAML + Markdown 内容源、不做 SSR/SSG。
- 不新增博客能力（不做独立标签路由、不做浏览量、不做评论）。
- 不移除深色主题（参考站无深色，本站按等价规则推导）。
- 不改后台的数据读写协议与字段结构。
- 不追求像素级复制参考站的品牌资产（logo、头像、插图）；只复制布局、排版、配色与组件行为。

## 3. 参考实现基线（直接采用的规则）

### 3.1 antfu.me（首页）

| 项目 | 源码事实 | 本站用法 |
| --- | --- | --- |
| 页面容器 | Markdown 页面包在 `prose m-auto slide-enter-content` | 首页主列 `max-width: 65ch` 居中 |
| 正文 | 1rem / 1.75（`prose.css`） | 首页正文 16px / 1.75 |
| 主区内边距 | `main px-7 py-10` | 首页 `padding: 2.5rem 1.75rem` |
| 导航 | 链接 `opacity: .6`，hover `1`；间距 `1.2rem`；导航区 `padding: 2rem` | 首页右上导航同规则 |
| 品牌 | 左上 48×48 固定 logo | 左上文字 wordmark `STYLAN` |
| 分隔线 | `#8884`（约 27% 灰） | `--line` |
| 选区 | `#8884` | 浅色黑底白字 / 深色白底黑字（onur 规则） |
| 入场 | `slide-enter` 1s、90ms 阶梯、上移 10px | 仅首页启用 |
| 文章列表 | 年份 `text-8em` 描边水印 + 标题/日期 | 不用于首页；首页改为技术栈，博客列表使用年份列 |
| 项目网格 | 350px 卡片、图标 + 名称 + 描述、hover `#88888811` | 不采用三列网格；`/projects` 按 onur 表格实现（见 6.4） |

### 3.2 onur.dev（博客、子页、后台）

| 项目 | 源码事实 | 本站用法 |
| --- | --- | --- |
| 侧栏 | `lg:w-60 xl:w-72`，`bg-zinc-50`，`border-r`，内部 `p-3` | 子页桌面侧栏 240 / 288px |
| 侧栏名片 | 40px 圆头像 + 姓名 + 职位 | 头像 emoji / 图片 + STYLAN + 职位 |
| 导航项 | `rounded-lg p-2`；选中 `bg-black text-white`；hover `bg-gray-200`；快捷键 20px 徽标 | 子页与后台导航 |
| 内容区 | `px-6 pt-8 pb-8 lg:px-8 lg:pt-24 lg:pb-16`；`mx-auto max-w-3xl` | 所有子页 |
| 移动顶栏 | `h-12` sticky，白底，边框 | 子页移动端 |
| 页面标题 | `PageTitle` → `h1 text-2xl md:text-3xl`，`mb-6` | 所有子页 |
| 文章列表 | 14px；表头灰字；年 / 日期 / 标题列；行 `border-t`、`py-4`；hover 时整组变灰、当前行变深 | 博客列表 |
| 链接 | `text-blue-600 hover:underline underline-offset-4` | 改为黑色文字 + 常态 30% 灰线 + hover `--link-underline` 底线 |
| 按钮 | h-9、rounded-md、`shadow-xs`；primary 黑底白字；outline 白底灰边 | 博客操作、联系页、后台 |
| 表格 | 外层 `rounded-lg border`；表头 `h-10` 灰字；行 hover `bg-gray-100/50` | 项目页、后台文章列表 |
| 代码块 | 13px、行号灰色、横向滚动 | 文章代码块 |
| 404 | `Not found` + 一句说明 | 404 页 |
| 渐变 | 文章页右上紫色光晕 `rgba(173,109,244,.5)` + `blur(80px)` | 文章页顶部一层极淡装饰 |

### 3.3 参考差异的处理

- 参考站字体分别为 Inter/DM Mono 与 Geist；全站统一用 Geist（用户已确认），首页用 Geist 复刻 antfu 的排版比例。
- onur 只有浅色；深色按第 4 节令牌推导。
- 本站为双语；参考站为单语，语言切换放入侧栏底部与首页导航。
- 本站无浏览量；博客列表第四列用「分类」替代 Views。

## 4. 设计令牌

### 4.1 颜色

浅色以 onur 的 Tailwind 灰阶为准；深色为等价推导。

| Token | Light | Dark | 用途 |
| --- | --- | --- | --- |
| `--bg` | `#FFFFFF` | `#09090B` | 页面底色 |
| `--bg-sidebar` | `#FAFAFA` | `#111113` | 侧栏、后台导航 |
| `--bg-subtle` | `#F4F4F5` | `#18181B` | 代码底、标签底、hover 浅底 |
| `--bg-hover` | `#E5E7EB` | `#27272A` | 导航/行 hover |
| `--line` | `#E5E7EB` | `#27272A` | 描边、分隔线 |
| `--line-strong` | `#D1D5DB` | `#3F3F46` | hover 描边、强调分隔 |
| `--heading` | `#000000` | `#FAFAFA` | 标题 |
| `--ink` | `#111827` | `#E4E4E7` | 正文 |
| `--muted` | `#6B7280` | `#A1A1AA` | 次要文字、日期、表头 |
| `--muted-strong` | `#4B5563` | `#D4D4D8` | 次级正文、职位 |
| `--accent` | `#2563EB` | `#60A5FA` | 焦点环、文章光晕、后台链接、Stack 分类链接 |
| `--accent-strong` | `#1D4ED8` | `#93C5FD` | 强调色深阶（备用） |
| `--link-underline` | `#555555` | `#BBBBBB` | 正文/社交/页脚链接 hover 下边框 |
| `--home-body` | `#555555` | `#BBBBBB` | 首页正文（antfu `--fg`） |
| `--active-bg` | `#000000` | `#FAFAFA` | 选中导航、active 胶囊 |
| `--active-fg` | `#FFFFFF` | `#09090B` | 选中导航文字 |
| `--code-bg` | `#F3F4F6` | `#18181B` | 行内码底 |
| `--code-line` | `#9CA3AF` | `#52525B` | 代码行号 |
| `--overlay` | `rgba(0,0,0,.20)` | `rgba(0,0,0,.60)` | 弹窗/抽屉遮罩 |
| `--glow` | `rgba(173,109,244,.25)` | `rgba(96,165,250,.12)` | 文章页顶部光晕 |

规则：

- 蓝色只用于**正文链接与焦点环**；按钮、选中态、导航 active 一律黑/白。
- 不使用渐变、玻璃模糊、彩色描边、彩色阴影（文章页光晕除外）。
- 卡片只有 1px `--line` 描边；唯一阴影为 `0 1px 2px rgb(0 0 0 / .05)`（按钮/输入框），深色不用阴影。
- 选区：浅色黑底白字，深色白底黑字。
- 图片统一 `border-radius: 12px` + 1px `--line`。

### 4.2 字体

```css
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

--font-sans: "Geist Sans", system-ui, -apple-system, "Segoe UI",
  "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif;
--font-mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
```

- 字体文件来自 `geist@1.3.1`（SIL OFL 1.1），存入 `public/fonts/`，随仓库提交许可说明。
- `index.html` 仅预加载 `Geist-Variable.woff2`；Mono 按需加载。
- 中文由系统 CJK 字体渲染，字重靠 `font-weight` 与字距建立层级。

### 4.3 字号与排版

| 角色 | 规格 |
| --- | --- |
| 页面 h1 | `text-2xl md:text-3xl`（24/30px），600，`tracking-tight`（-0.025em），`text-heading` |
| 区块 h2 | `text-lg md:text-xl`（18/20px），600，`tracking-tight` |
| 卡片/行标题 | `text-sm font-medium`（14px），正文行高 |
| 首页正文 | 16px / 1.75，`max-width: 65ch` |
| 文章正文 | 16px / 1.75，`max-width: 68ch`；段落 `mb-5` |
| 次要文字 | 14px / 1.6，`text-muted` |
| 表头/日期 | 14px，`tabular-nums`，`text-muted` |
| 导航 | 14px / 500 |
| 代码 | 13px Geist Mono；行号 13px `tabular-nums` |
| 标签/说明 | 12px，不使用全大写 mono kicker |

明确删除旧系统中的「mono 大写小标签 + 字距 0.12em」视觉。

### 4.4 间距、圆角、容器

- 基准 4px；常用 4 / 8 / 12 / 16 / 24 / 32 / 40 / 64。
- 首页主区：`padding: 2.5rem 1.75rem`；移动端 `padding-inline: 1.25rem`。
- 子页内容：`px-6 pt-8 pb-8`，桌面 `px-8 pt-24 pb-16`；普通页面 `max-width: 768px`；文章页在 ≥1280px 可扩展到 1024px 以容纳右侧 TOC。
- 文章列 `max-width: 68ch`；TOC 200px，间距 48px。
- 侧栏：240px（≥1024），288px（≥1280）；内部 `p-3`；导航项间距 4px。
- 移动顶栏 48px。
- 圆角：按钮/输入框 6px；卡片/导航项 8px；图片 12px；移动抽屉顶部 16px。
- 列表行纵向 16px，分隔线 1px；页面标题下 24px。

### 4.5 图标与动效

- 图标为内联 SVG，16px，`stroke-width: 1.5`，无图标库依赖；外链统一 `↗`（ArrowUpRight）。
- 首页内容使用 `slide-enter`：1s、`translateY(10px)`、90ms 阶梯；仅首页。
- 其余交互只做颜色/背景/边框 150–300ms 过渡；抽屉 `transform 300ms`。
- 主题切换与 antfu.me 一致：以点击位置为圆心的 View Transition 圆形扩散，400ms `ease-out`；切到深色时反向收缩；不支持 View Transition 或 `prefers-reduced-motion` 时即时换色。
- 语言切换：重放首页加载效果（内容 `key={lang}` 重挂载，`slide-enter` 1s + 90ms 阶梯；页脚 1.2s 入场）；`prefers-reduced-motion` 下无动画。
- 子页导航：与首页相同的 `.slide-enter-content`（`slide-enter` 1s + 90ms 阶梯）；路由 key 重挂载；懒加载 `Suspense` fallback 为居中 16px spinner + sr-only Loading；`prefers-reduced-motion` 下无动画。
- `prefers-reduced-motion` 下关闭入场与过渡位移；抽屉直接显示。

## 5. 页面架构

### 5.1 两套壳与路由

```text
App
├── HomeLayout（/）
│   ├── HomeHeader（左 wordmark / 右导航 / 主题 / 语言）
│   ├── HomePage（65ch prose）
│   └── HomeFooter
└── SubpageLayout（/projects /blog /blog/:slug /skills /contact /404）
    ├── SideMenu（≥1024 固定左栏）
    ├── MobileHeader + MobileMenuSheet（<1024）
    └── 内容区（ScrollArea + ContentWrapper）
```

- 后台 `admin.html` 独立入口，不经过前台壳。
- 两套壳共享 `PageTitle`（SEO）、`ThemeLangControls`、`SocialIcon`、`ArrowIcon`、`Button`。

### 5.2 首页壳（antfu）

- 桌面：wordmark 在左上 `1.25rem`、导航在右上 `2rem`，随页面滚动（与 antfu 的 NavBar 一致，不吸顶）；链接 60% 不透明度、hover 100%，间距 20px；背景/主题/语言控制为同一组裸图标按钮（组内 4px，无边框无底色，60% opacity，hover 100%），顺序为背景切换 → 主题 → 语言。
- 移动：顶部普通流式排布（不固定），wordmark 左、菜单按钮右；展开为全屏面板，导航项大号、分隔线。
- 主列：`max-width: 65ch`，居中，`padding: 2.5rem 1.75rem`。
- 页脚：`© 2026 STYLAN` 单行，14px、50% 不透明度，与 65ch 正文对齐；无边框、无社交图标（与 antfu 一致）。

### 5.3 子页壳（onur）

- 桌面侧栏固定、独立滚动：名片 → 主导航（Home / Projects / Blog / Skills / Contact，编号 1–5，active 黑底白字）→ 分隔线 → Online（GitHub / Bilibili / Bluesky / Email / RSS，带 ↗）→ 底部主题与语言。
- 侧栏在 ≥1024 显示；<1024 隐藏，改为 48px sticky 顶栏：左菜单按钮、中当前页标题、右主题。
- 移动菜单为底部抽屉（80vh、顶部圆角、上滑 300ms），内容复用 `MenuContent`，主题与语言控件在抽屉内；Esc、遮罩点击、路由变化均可关闭，焦点在打开时锁定、关闭后归还。
- 内容区 `max-width: 768px` 居中；`ScrollArea` 保证侧栏固定、内容滚动。
- 所有子页均不显示全站页脚。

### 5.4 后台壳

- 桌面：240px 侧栏（zinc-50）+ 内容区；顶部 56px sticky 操作栏位于内容区上方。
- 侧栏：品牌 → 分区导航（编号、active 黑底白字）→ 分隔线 → 「打开前台」/主题。
- 内容区：`max-width: 896px` 居中，`padding: 40px 32px 80px`。
- <1024：侧栏收起为顶栏下方的横向滚动分区条；操作栏按钮不换行。

## 6. 页面规格

### 6.1 首页 `/`

内容顺序：

1. **Intro**（3 段，65ch）：
   - 第 1 段：`Hi, I'm STYLAN.` + `personal.bio`。
   - 第 2 段：专注方向（`about.focus`）+ 内联链接 `projects`、`skills`。
   - 第 3 段：写作与联系（`blog`、`contact`、`email`）。
2. `<hr>`。
3. **Find me on**：GitHub / Bilibili / Bluesky / WeChat，正文式链接（16px / 600、图标 1.2em / `inline-block` / 75% 不透明度 / `text-bottom` 对齐、图标与文字间隔 4px、链接间距 8px）；链接常态有 1px `rgba(125,125,125,.3)` 下边框，hover 变为 `--link-underline`，`border 0.3s ease-in-out`；WeChat hover/focus 显示二维码气泡，触摸端点击切换，气泡桌面端在按钮右侧垂直居中、移动端在按钮上方，以 `slide-enter` 1s 入场；下一行 `Or mail me at` + mono 字体邮箱链接。首页内所有带底线链接字重 600，页脚链接例外（400）。
4. `<hr>`。
5. **Stack**：无可见标题；介绍段落（`text-ink`）+ `ul.list-disc pl-6`、`gap-0.5`、marker `--code-line`；每行分类为蓝色 `/skills` 链接 + ↗ + `—` + `·` 连接的技术项（muted）；链接仿 onur `.link`，仅 hover 下划线。
6. **Footer**：`CC BY-NC-SA 4.0 2026 © STYLAN · 设计参考 antfu/antfu.me`，14px、50% 不透明度；许可与来源为链接，无 RSS/社交图标。

规则：

- `<hr>` 为 50px 居中短横线，上下 `2em`（与 antfu.me 的 `.prose hr` 一致）。
- 不出现项目卡片、技能网格、联系 CTA、Hero 大标题、头像大图。
- 所有段落可含内联链接；外链带 ↗ 图标。
- 首页正文：使用 `--home-body`（#555/#BBB，对应 antfu `--fg`）；标题 `--heading`，链接黑色 + 常态浅灰底线 + hover 深灰底线。
- 首页内容以 `slide-enter` 阶梯进入。
- 首页背景：antfu 式生成艺术，默认 `plum`（Canvas 分形枝条）；右上角按钮循环 `plum → dots → none` 并持久化到 `localStorage.home-background`；背景层固定 `z-0`、内容 `z-10`；也可通过 `src/backgrounds/index.js` 切换默认值；其他页面可引用 `<BackgroundLayer />`；`prefers-reduced-motion` 下关闭。

### 6.2 博客列表 `/blog`

- 页头：h1（默认文案改为 `Writing` / `写作`，可在后台修改）+ 副标题 + 右侧 `RSS`（outline）与 `Search ⌘K`（outline）。
- 筛选：分类按钮组（All / Technology / Tutorials / Thoughts / Projects），active 黑底白字 rounded-md；标签行用 12px 文本按钮，active 加下划线并变 `text-ink`。
- 列表（桌面）：CSS grid 行（视觉上近似表格）：表头 `Year | Date | Title | Category`（14px muted）；按年分组，年份只在组首行显示；行 `border-t`、`py-4`；标题 14px/500；hover 时同一组其他行降到 30% 文本色，当前行保持 `text-ink`；整行可点。
- 移动：去掉 Year/Category 列；日期在标题上方；分类在右侧；行高略减。
- 不显示摘要与标签（列表保持 onur 的极简密度）；标签只在筛选区出现。
- 空状态：`{ nothing here yet }` 风格的双语短句。
- 搜索：`⌘K / Ctrl+K` 打开 onur 式对话框（白底、rounded-lg、描边、overlay 20% 黑、输入框 h-9、结果行 hover `bg-subtle`、键盘上下选择、Esc 关闭、焦点锁定）。
- 加载：行骨架与最终行同高，避免 CLS。

### 6.3 文章页 `/blog/:slug`

- 顶部：`← Writing` 返回链接 → h1 → 元信息 `日期 · 阅读时长 · 分类` → 标签（12px 文本，不用彩色 chips）。
- 顶部背景：一层 onur 式径向光晕（`--glow`），高度 320px，`pointer-events: none`，内容在其上；仅 ≥1280px（`xl`）显示，移动端隐藏以免降低 `text-muted` 元信息对比度。
- 正文：68ch；段落 16px/1.75；h2 20px/600、上间距 40px、`scroll-mt-24`；h3 18px；列表紧凑；引用左侧 1px `--line-strong`、muted；链接黑色 + 常态浅灰底线 + hover 深灰底线；图片圆角 12px + 描边 + 居中小字说明。
- 行内码：`--code-bg` 底、6px 圆角、13px Mono，采用 onur 的反引号装饰（`::before/::after` 为 `` ` ``）。
- 代码块：白底描边卡片、13px、行号 `--code-line`、横向滚动；不使用 Mac 红绿灯装饰。
- TOC：≥1280px 右侧 200px sticky（top 96px）；标题 `On this page` 12px muted；项 14px；当前项 `text-ink` + 左侧 2px 黑线；移动端折叠为正文上方 `<details>`。
- 阅读进度/上一篇下一篇：不做（参考站没有）。

### 6.4 项目页 `/projects`

- 页头：h1 `Projects` + 一段说明 + `GitHub ↗`（outline 按钮）。
- 桌面：onur `workspace` 表格——外层 `rounded-lg border`，表头 `Project | Stack | Link`，行 `py-3 px-4`，hover `bg-subtle/50`；项目名 14px/500，前置 emoji 图标；Stack 为 14px muted 文本；Link 为黑色文字 + 常态底线 + ↗。
- 移动：每条项目变卡片：标题 + 描述 + 技术栈文本 + 链接；`rounded-lg border p-4`。
- 不使用 antfu 的三列 350px 项目网格（本项目路由归属 onur 页面）。

### 6.5 Stack 页 `/skills`

- 页头：h1 `Stack / 技术栈` + 一段说明。
- 每个分类一行：桌面 `grid-cols-[160px_1fr]`，分类名 14px/500 `text-heading`，技术项为 14px 文本、`·` 分隔、可换行；行间 `border-t`、纵向 24px。
- 不使用 chips、卡片、图标。
- 移动：分类名在上，技术项在下。

### 6.6 联系页 `/contact`

- 页头 h1 + 描述。
- 主按钮：黑底白字 `Email me`（mailto）；次按钮：outline `Download resume`。
- 联系列表：Email / GitHub / Bilibili / WeChat；行 14px，左侧图标 + 标签 + 值，右侧 ↗；WeChat 行点击打开二维码对话框（白底描边、二维码 240px、关闭按钮）。
- 社交行（GitHub / Bilibili / Email / RSS）与首页一致。
- 不显示插画大图。

### 6.7 404

- 子页壳内：h1 `Not found` + onur 语气说明（中英）+ `← Back home` 文本链接。
- 保留 `noindex`。

### 6.8 搜索对话框

- 结构：遮罩 + 面板（`max-w-lg`、白底、`rounded-lg`、1px 描边、`shadow-xl`）。
- 顶部输入（图标 + input + `ESC` 提示），下方结果列表（日期 + 标题 + 分类）。
- 选中行 `bg-subtle`，不用蓝色底；标题保持 `text-ink`。
- 空状态与无结果文案沿用双语。

### 6.9 后台 `/admin.html`（dev only）

- **侧栏**：240px、`--bg-sidebar`、右边框；品牌 `STYLAN` + `内容后台`；分区：站点信息 / 个人信息 / 导航 / 关于 / 技能 / 项目 / 文章管理（编号 1–7）；active 黑底白字、rounded-lg；底部主题切换 + `打开前台 ↗`。
- **顶栏**：56px、白底、下边框；左面包屑 `内容管理 / {分区}`；右 `未保存` 胶囊（描边 + 黑点）、`撤销`（outline）、`保存`（黑底白字）、`预览`（outline）。
- **内容**：h1 + 说明；面板卡片（`rounded-lg border`）；面板头 44px、底部边框、14px/500；正文 16–20px padding。
- **表单**：label 14px/500；input/select h-9、6px 圆角、1px 描边、白底、`shadow-xs`、focus 2px accent 环；textarea 最小 96px、Mono；双语字段左右或上下成组；列表项用分隔线 + ghost 操作按钮。
- **文章列表**：表格（标题 / 语言 / 日期 / 状态 / 操作）；语言用 `bg-subtle` 小胶囊；行 hover `bg-subtle/50`；操作按钮 outline xs。
- **文章编辑器**：标题、slug、日期、分类、标签、摘要、正文（Mono textarea）、保存/新建/删除；沿用现有逻辑。
- **预览抽屉**：右侧 720px / 90vw，白底 + 左边框；头部（页面选择 / 设备分段控件 / 关闭）；iframe 区域 `bg-subtle`；遮罩 20% 黑；Esc 关闭；焦点锁定与 iframe 快捷键行为保持。
- **状态**：保存成功 `text-emerald-600`，错误 `text-red-600`，14px 内联文本。
- 不改变任何 API、校验、脏数据提示、Ctrl/Cmd+S 逻辑。

## 7. 组件与文件影响

### 7.1 新增

- `src/layouts/HomeLayout.jsx`、`src/layouts/SubpageLayout.jsx`
- `src/backgrounds/`：`index.js`（注册表、顺序与 `HOME_BACKGROUND`）、`BackgroundLayer.jsx`、`BackgroundToggle.jsx`、`PlumBackground.jsx`、`DotsBackground.jsx`
- `src/components/site/HomeHeader.jsx`、`SideMenu.jsx`、`MenuContent.jsx`、`NavItem.jsx`、`MobileHeader.jsx`、`MobileMenuSheet.jsx`
- `src/components/site/PageHeading.jsx`、`ThemeLangControls.jsx`、`HomeFooter.jsx`
- `src/components/site/Button.jsx`、`IconButton.jsx`、`SiteLink.jsx`
- `src/components/blog/WritingList.jsx`、`WritingFilterBar.jsx`、`WritingRowSkeleton.jsx`、`SearchDialog.jsx`
- `src/components/projects/ProjectTable.jsx`
- `src/components/contact/WechatDialog.jsx`
- `src/utils/cn.js`（轻量类名合并）

### 7.2 重写

- `src/index.css`：令牌、Geist、基础排版、焦点、选区、首页 prose、文章排版入口。
- `src/styles/blog-post.css`：保留 highlighted 代码配色，改为 onur 的浅色/深色映射。
- `src/App.jsx`：按路由选择 `HomeLayout` / `SubpageLayout`。
- `src/pages/HomePage.jsx`、`BlogPage.jsx`、`BlogPostPage.jsx`、`ProjectsPage.jsx`、`SkillsPage.jsx`、`ContactPage.jsx`、`NotFoundPage.jsx`。
- `src/components/BlogPage/TableOfContents.jsx`、`markdownComponents.jsx`。
- `src/admin/admin.css`、`src/admin/AdminApp.jsx`、`src/admin/sections/*`、`src/admin/components/*` 的表现层类名。
- `DESIGN.md`。

### 7.3 删除

- `src/components/shared/SiteHeader.jsx`、`SiteFooter.jsx`、`ThemeLangControls.jsx`、`PageHeader.jsx`、`TagChip.jsx`、`SkillGroups.jsx`
- `src/components/HomePage/*`（Hero、AboutSection、ProjectGrid、ProjectCard、PostRow、PostRowSkeleton、SkillsSection、ContactCta）
- `src/components/BlogPage/BlogHero.jsx`、`CategoryFilter.jsx`、`TagFilter.jsx`、`SearchTrigger.jsx`、`BlogSearch.jsx`、`BlogList.jsx`
- 仅服务旧布局的 CSS 类与工具类。

### 7.4 保留

- 路由、`utils/markdown.js`、`utils/blogFilters.js`、`postFormat`、`markdownHeading`、`hooks/AppSettings`、`useTheme`、`useLanguage`
- `PageTitle`（SEO）、`ScrollToTop`、`SocialIcon`、`ArrowIcon`
- 后台 API、schema、校验、预览逻辑、`scripts/generate-rss.js`、测试

### 7.5 内容与数据

- 不新增 YAML 字段；不改后台 schema。
- `src/content/blog.yaml` 的 `page.title` 默认值改为 `Writing` / `写作`（纯文案）。
- 首页 intro 由 `personal.bio`、`about.focus`、`skills`、`contact` 组合生成，不新增字段。

## 8. 无障碍

- 导航 `<nav aria-label>`；当前路由 `aria-current="page"`。
- 移动菜单按钮 `aria-expanded` + `aria-controls`；抽屉打开时焦点锁定、Esc 关闭、关闭后焦点归还。
- 所有图标按钮有 `aria-label`；装饰图标 `aria-hidden="true"`。
- 焦点环：`outline: 2px solid var(--accent); outline-offset: 2px`。
- 对比度：正文与 muted 在两种主题下 ≥ 4.5:1；14px 次要文字不使用更低对比度。
- 表格使用真实 `<table>/<thead>/<th>`；博客列表可用 `<ul>/<li>` + 链接。
- `prefers-reduced-motion` 关闭首页阶梯与所有过渡位移。

## 9. 性能

1. 字体：仅 2 个 woff2（约 22KB + 26KB，Latin 子集），本地自托管；只预加载 Sans；`font-display: swap`。
2. 不新增运行时依赖；图标内联。
3. 首屏无大图；文章图片懒加载 + 圆角描边。
4. 首页静态导入；子页保留 `lazy` + `Suspense`，fallback 高度与最终布局一致。
5. 删除所有旧动画代码与无用 CSS。

### 验收阈值（Lighthouse 移动端，`vite preview`）

| 页面 | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| `/` | ≥ 90 | ≥ 95 | ≥ 95 | ≥ 95 |
| `/blog` | ≥ 90 | ≥ 95 | ≥ 95 | ≥ 95 |
| `/blog/getting-started-with-react-hooks` | ≥ 90 | ≥ 95 | ≥ 95 | ≥ 95 |

桌面同步记录一次，Performance ≥ 95。

## 10. 测试与验收

### 自动化

- `pnpm test`（15 个测试文件 / 58 个测试全部通过）
- `pnpm lint`（当前不可用：仓库未安装 ESLint，命令会报 `eslint` not found）
- `pnpm build`（含 RSS 生成）

### 浏览器实测

- 1440×900、390×844、320×568。
- 明/暗主题、中/英切换、刷新保持。
- 首页导航与外链、技术栈分组显示。
- 子页侧栏 active、快捷键 1–5、移动抽屉开合与焦点。
- 博客分类 + 标签组合筛选、空状态、搜索键盘操作。
- 文章 TOC 高亮/跳转、代码块横向滚动、长表格、图片。
- 项目表格/移动卡片、联系页二维码与 resume、404。
- 后台：加载、编辑、校验、保存、撤销、文章新建/编辑、预览抽屉与设备切换。
- 控制台无错误、无横向溢出。

## 11. 里程碑

1. **M1 基础与首页**：令牌、Geist、双壳、首页、页脚、主题/语言。
2. **M2 子页与博客**：Projects / Skills / Contact / 404、博客列表与筛选、文章页、搜索、TOC。
3. **M3 后台**：侧栏、顶栏、表单、文章表格、编辑器、预览抽屉。
4. **M4 收尾**：清理旧组件/CSS、a11y、Lighthouse、README、`DESIGN.md` 校对、全量回归。

每个里程碑结束执行 lint/test/build + 浏览器实测，并做一次本地 commit（不 push）。

## 12. 风险

| 风险 | 应对 |
| --- | --- |
| 双壳导致导航体验不一致 | 两壳使用同一导航数据与 active 规则；移动端行为分别实现但文案/顺序一致 |
| Geist 不含中文 | 明确 CJK 回退栈；标题靠字重与字距建立层级，不用字体特性 |
| 深色为推导，参考站无深色 | 用同一语义令牌映射，单独做两主题截图检查对比度 |
| 首页信息量下降 | intro 内联链接覆盖项目/技能/联系；导航始终可见 |
| 自托管字体影响 LCP | 仅预加载 Sans、总量 < 120KB、`swap`、本地无第三方请求 |
| 后台重做破坏原有交互 | 只改类名与布局，不改 API/校验/预览逻辑；逐项回归 |
| 旧组件删除遗漏引用 | 删除后跑 lint/build；grep 旧类名与组件名 |

## 13. 文档清理记录

已删除：

- `docs/superpowers/specs/2026-10-28-local-admin-design.md`
- `docs/superpowers/specs/2026-10-29-redesign-antfu-onur-design.md`
- `docs/superpowers/plans/2026-10-28-local-admin-implementation.md`
- `docs/superpowers/plans/2026-10-29-redesign-antfu-onur.md`

新增：

- 本规格
- 重写的 `DESIGN.md`
- 由 writing-plans 生成的新实施计划
