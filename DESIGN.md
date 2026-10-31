# STYLAN Site · Design System v4

> 状态：**v4 设计契约**（2026-10-29 重构）
> 参考：首页 [antfu.me](https://github.com/antfu/antfu.me) · 博客/子页/后台 [onur.dev](https://github.com/suyalcinkaya/onur.dev)
> 实现规格：[2026-10-29-v4-strict-reference-redesign-design.md](./docs/superpowers/specs/2026-10-29-v4-strict-reference-redesign-design.md)
> 本文是实现依据；与规格冲突时以规格为准，并同步修正本文。

---

## 1. 方向

1. **两套壳，一套语言**：首页是 antfu 式文本文档；其余页面是 onur 式侧栏工作区。二者共享字型、灰阶、链接色与组件规则。
2. **中性优先**：页面只由白、zinc/gray 灰阶与黑构成；蓝色只属于正文链接和焦点环。
3. **黑即主色**：主按钮、选中导航、active 胶囊用黑底白字（深色反之），不再使用蓝色按钮。
4. **内容密度**：首页与列表以文本密度为主；内容卡片只用于书签/项目浏览页，不用彩色 chips、渐变面板填充页面。
5. **双主题对等**：浅色为参考站原样；深色按同一语义推导，不另起一套风格。
6. **克制动效**：只有首页阶梯入场与颜色/位移过渡；尊重 `prefers-reduced-motion`。

---

## 2. 颜色

### 2.1 令牌

| Token | Light | Dark | 用途 |
| --- | --- | --- | --- |
| `--bg` | `#FFFFFF` | `#09090B` | 页面底色 |
| `--bg-sidebar` | `#FAFAFA` | `#111113` | 子页侧栏、后台导航 |
| `--bg-subtle` | `#F4F4F5` | `#18181B` | 代码底、标签底、浅 hover |
| `--bg-hover` | `#E5E7EB` | `#27272A` | 导航/列表行 hover |
| `--line` | `#E5E7EB` | `#27272A` | 描边、分隔线 |
| `--line-strong` | `#D1D5DB` | `#3F3F46` | hover 描边、引用线 |
| `--heading` | `#000000` | `#FAFAFA` | 标题 |
| `--ink` | `#111827` | `#E4E4E7` | 正文 |
| `--muted` | `#6B7280` | `#A1A1AA` | 日期、表头、次要文字 |
| `--muted-strong` | `#4B5563` | `#D4D4D8` | 职位、次级正文 |
| `--accent` | `#2563EB` | `#60A5FA` | 焦点环、文章光晕、后台链接、QuietActionLink 默认 hover 色（可被按钮 `color` 覆盖） |
| `--accent-strong` | `#1D4ED8` | `#93C5FD` | 强调色深阶（备用） |
| `--link-underline` | `#555555` | `#BBBBBB` | 正文/社交/页脚链接 hover 下边框 |
| `--home-body` | `#555555` | `#BBBBBB` | 首页正文（antfu `--fg`） |
| `--active-bg` | `#000000` | `#FAFAFA` | 选中导航、active 胶囊 |
| `--active-fg` | `#FFFFFF` | `#09090B` | 选中导航文字 |
| `--code-bg` | `#F3F4F6` | `#18181B` | 行内码、代码复制按钮 hover |
| `--code-header` | `#F9FAFB` | `#111113` | 代码块头部 |
| `--code-line` | `#9CA3AF` | `#52525B` | 代码行号 |
| `--overlay` | `rgb(0 0 0 / .20)` | `rgb(0 0 0 / .60)` | 对话框/抽屉遮罩 |
| `--glow` | `rgb(173 109 244 / .25)` | `rgb(96 165 250 / .12)` | 文章页顶部光晕 |

### 2.2 使用规则

- `--accent`：正文链接、焦点环、文章链接。**不得**用于按钮背景、导航选中、标签底、卡片描边。
- `--active-bg` / `--active-fg`：侧栏导航选中、筛选 active、后台分区 active、分段控件 active。
- 普通卡片：`background: var(--bg)`、`border: 1px solid var(--line)`、`border-radius: 8px`；不用阴影。书签/项目内容卡片例外：12px 圆角 + 双层描边阴影（见 5.3）。
- 按钮/输入框唯一阴影：`0 1px 2px rgb(0 0 0 / .05)`；深色不用阴影。
- 选区：浅色黑底白字，深色白底黑字。
- 图片：12px 圆角 + 1px `--line`。
- 装饰光晕仅文章页一处，仅 ≥1280px（`xl`）显示，`pointer-events: none`，不参与语义色。

---

## 3. 字体与排版

```css
--font-sans: "Geist Sans", system-ui, -apple-system, "Segoe UI",
  "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif;
--font-mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
```

- Geist Sans / Geist Mono 自托管（`public/fonts/*.woff2`，OFL-1.1），`font-display: swap`；只预加载 Sans。
- 中文由系统 CJK 字体回退；不加载中文 Web 字体。

| 角色 | 规格 |
| --- | --- |
| 页面 h1 | 24px（≥768px 30px）/ 600 / `letter-spacing: -0.025em` / `--heading`；Projects/Stack 居中页头为 36px/800/1.11 |
| 分类标题 | 80px / 600 / 衬线字体栈（Noto Serif SC / Songti SC / SimSun）/ 行高 1 / 透明填充 + 1.5px 描边 |
| 区块 h2 | 18px（≥768px 20px）/ 600 / `-0.02em` |
| 行标题 | 14px / 500 / `--heading` |
| 首页正文 | 16px / 1.75 / 65ch |
| 文章正文 | 16px / 1.75 / 容器 768px；段落间距 16px |
| 次要文字 | 14px / 1.6 / `--muted` |
| 日期/表头 | 14px / `font-variant-numeric: tabular-nums` / `--muted` |
| 导航 | 14px / 500 |
| 代码 | 13px Geist Mono；行号同尺寸 `--code-line` |
| 徽标/说明 | 12px；不使用全大写 mono kicker |

规则：

- 一个页面最多三级标题层级；h1 每页一个。
- Projects / Stack 使用居中页头：h1 36px/800/1.11；说明 16px（≥768px 18px）斜体 `--muted`、`max-w-2xl`；操作按钮居中；页头底部统一使用 50px 宽居中的 1px 分隔线。项目页与 Stack 页头按钮共用通用 `QuietActionLink`（复刻 antfu `.btn-*`）：透明底、50% 不透明度、1px `#8884` 描边、4px 圆角、`10px 4px` 内距、16px/24px、图标 + 文字，hover/focus 为 100% 不透明度 + 自定义/默认色文字 + 10% 同色底；`icon` 可换成 `logo`（1.2em 遮罩图标），`color` 来自 YAML，缺省为 `--accent`。
- 正文链接为黑色（`--heading`）：常态 1px `rgba(125,125,125,.3)` 下边框，hover 变 `--link-underline`，`border 0.3s ease-in-out`；文字颜色不变、底线常驻不挤压布局。首页内带底线的正文/社交链接字重 600，页脚链接例外（400）。
- 文章正文宽度 768px（onur `content`）；首页 65ch。
- 不用字重 300、斜体长文、渐变文字。

---

## 4. 布局

### 4.1 首页壳（antfu）

```text
┌──────────────────────────────────────────────┐
│ deqing                        Projects Blog│
│                             Skills Bookmarks│
│                                              │
│           65ch 居中正文                       │
│           姓名 h1（STYLAN）                   │
│           自我介绍（内联链接）                 │
│           ───                                │
│           Find me on …                       │
│           ───                                │
│           Stack（logo 按钮 + 分类/介绍）    │
│                                              │
│ © 2026 STYLAN                               │
└──────────────────────────────────────────────┘
```

- 左上 20px 处使用 deqing 单笔画 SVG（viewBox 100×100、48×48、stroke-width 2.5、currentColor），沿用 antfu 的 grow 关键帧，以 stroke-dasharray/offset 按字母路径绘制，10s 循环（0–40% 绘制、40–85% 停留、85–95% 擦除）；focus-visible 静态显示完整签名，reduced-motion 静态；导航右上 32px（随页面滚动，不吸顶）。Home / Projects / Blog / Stack / Bookmarks 依次使用 19px 房子、文件夹、笔、代码、书签图标（与 antfu.me 的 1.2em 图标一致），并与背景、主题、语言按钮合并为同一组裸图标控件（组内间距 4px，无边框无底色，60% 不透明度，hover 100%，图标带 `aria-label`）；桌面端悬停或键盘聚焦任一图标（导航五个图标及背景、主题、语言按钮）时，在 Home 图标左侧 10px 处显示当前按钮名称的胶囊提示：22px 高、11px Geist Mono/500、`--muted-strong` 文字、`--line-strong` 细描边、88% 页面底色 + 8px 背景模糊、轻微阴影，100ms 从右侧 4px 淡入，reduced-motion 下静态显示；点击背景 / 主题 / 语言后提示文字经 `requestAnimationFrame` 刷新为最新状态；首页桌面端对这三个按钮设置 `suppressTitle` 隐藏原生 `title`，避免与胶囊提示重复，移动端及子页仍保留原生提示；移动端不显示悬停提示；语言按钮使用地球图标，侧栏变体显示地球图标 + 文字。
- 正文前显示姓名 h1（`personal.name`，36px/800/1.11、`mb-8`、`--heading`），位于 65ch 自我介绍之前，与 antfu 首页一致；这是首页唯一 h1。
- 主列 `max-width: 65ch`，`padding: 40px 28px`。首页正文颜色为 `--home-body`（#555/#BBB，对应 antfu 的 `--fg`）；标题用 `--heading`，链接用 `--heading`。
- Stack 区块无可见标题：介绍（`text-ink`）+ 共享 `StackButtonGroup`。按钮与 `/stack` 页头完全相同（读取 `stack.yaml` 顶层 `buttons`，logo + 名称、品牌色 hover），首页使用左对齐 `flex-wrap` 布局、间距 8px；不再列出分类文本。
- 背景：`src/backgrounds/` 统一管理可复用背景组件。首页默认 `plum`（Canvas 分形枝条，40fps，停笔后静止），右上角按钮循环 `plum → dots → grid → waves → aurora → none` 并写入 `localStorage.home-background`；按钮图标对应当前背景（枝条 / 9 点变化点阵 / 四宫格 / 三行波纹 / 三道极光斜带 / 禁用圆），切换时图标以 220ms 缩放旋转淡入（`bg-toggle-icon-in`，reduced-motion 关闭）；`dots` 参考 antfu `ArtDots`：18px 网格（移动端 20px），每个点带 0.45–1 的随机基础透明度，并在正弦噪声场中漂移、做亮度呼吸，而不是规则等亮度的纯点阵；新增 `grid`（CSS 渐隐网格，36s 平移）、`waves`（Canvas 正弦波纹，30fps，边缘 CSS 遮罩）、`aurora`（三层极光渐变，26s 缓慢漂移）。子页面通过 `PAGE_BACKGROUNDS` 映射：`/home → aurora`、`/projects → dots`（与书签页的网格区分）、`/stack → waves`、`/changelog → aurora`，由 `SubpageLayout` 渲染 `BackgroundLayer`；波纹使用 1.2px 线条与中心增强透明度以提高辨识度；背景固定 `z-0`，侧栏与内容 `z-10`，`prefers-reduced-motion` 下关闭 Canvas 动效与 CSS 动画。
- “Find me on” 使用正文链接样式：16px / 400（`font-weight: inherit`），图标 1.2em（约 19px）、`inline-block`、75% 不透明度、`text-bottom` 对齐，图标与文字间隔 4px，链接间距 8px；链接常态有 1px `rgba(125,125,125,.3)` 下边框，hover 变为 `--link-underline`（#555/#BBB），`border 0.3s ease-in-out`，底线常驻不挤压布局。平台为 GitHub / Bilibili / Bluesky / WeChat；WeChat 与子页面共用 `WechatDialog`，仅通过点击打开二维码 Modal（二维码 + 微信号 `stylan-ai`），不再使用 hover 气泡或粒子消散效果。下方 `Or mail me at` + mono 邮箱。
- 区块之间使用 50px 居中短分割线，上下 `2em`（与 antfu 的 `.prose hr` 一致）。
- 页脚：`CC BY-NC-SA 4.0 2026 © STYLAN · 设计参考 antfu/antfu.me`，14px、50% 不透明度，与 65ch 正文对齐；链接使用同一 1px 底线规则；窄屏可换行，无边框、无社交图标（与 antfu 一致）。
- 移动端右上：Home / Projects / Blog / Stack / Bookmarks 五个图标与背景、主题、语言按钮直接同组展示，不再使用汉堡菜单或浮层选项框。
- 页面无侧栏、无大标题、无项目卡片。

### 4.2 子页壳（onur）

```text
┌────────────┬───────────────────────────────┐
│ 头像 STYLAN │                               │
│ AI Dev     │       max-width: 768px        │
│            │                               │
│ 1 Home     │       PageTitle               │
│ 2 Projects │       content …               │
│ 3 Blog     │                               │
│ 4 Stack    │                               │
│ 5 Bookmarks│                               │
│ ─────────  │                               │
│ Online     │                               │
│ GitHub ↗   │                               │
│ …          │                               │
└────────────┴───────────────────────────────┘
```

- 侧栏：240px（≥1024）/ 288px（≥1280），`--bg-sidebar`，右边框，独立滚动；底部不再放控制按钮。
- 主题与语言控制固定于视口右上角（`position: fixed; right: 32px; top: 24px`，不随内容滚动），使用与首页相同的裸图标组（间距 4px、无边框、60% 不透明度、hover 100%）；移动端仍在 48px 胶囊顶栏右上角。
- 导航图标：Home 房子、Projects 文件夹、Blog 钢笔、Stack 代码符号（Code）、Bookmarks 书签。
- Online 依次为 GitHub、Email、Bilibili、WeChat、Bluesky：前四项来自 `contactPage.contactMethods`，Bluesky 来自 `socialLinks` 且与联系方式去重；Email 右侧保持 ↗，点击后两张卡片叠放在同一位置，上层用 clip-path 从左往右擦除、露出下层邮箱卡（400ms），并可一键复制；WeChat 与其它项一样带右侧 ↗ 图标，点击打开液态玻璃二维码弹窗（二维码 + 微信号 `stylan-ai`）；不再显示 RSS。
- 侧栏 Home 指向子页 `/home`（onur 式首页）；顶部头像/姓名卡片是指向 `/`（antfu 首页）的唯一入口，头像读取 `personal.avatar`，当前为 GitHub 头像 URL。
- 内容：普通页面 `max-width: 768px`，`padding: 32px 24px`（桌面 `96px 32px 64px`）。内容滚动容器使用 `overflow-x-clip`：装饰性 80px 空心分类标题可继续出血到屏幕边缘，但不会撑宽移动端布局视口（否则 fixed 弹窗会偏移），同时保持胶囊吸顶头部正常。
- 博客路由为 onur 式三栏：导航栏 + 320/384px 写作列表栏（`--bg-sidebar`、右边框、标题 + RSS/Search + 选择框 + 列表）+ 右侧内容区；`/blog` 内容区为空并显示 16px 点状底纹，中央居中随机显示一条双语语录（`content/pages/quotes.yaml`，18px muted、600ms 入场）；`/blog/:slug` 为白底文章（`max-width: 768px`），列表栏常驻并高亮当前文章。
- 书签路由为 blog 同款三栏：导航栏 + 320/384px 分类栏（标题 + 总数 + 分类行：名称/数量，复用写作列表卡片的 60px 高度与 hover/active 样式）+ 右侧 24px 网格底纹内容区；`/bookmarks` 内容区为空并随机显示一条 `quotes.yaml` 语录；`/bookmarks/:slug` 为 onur 式 h1 + 双列书签卡（1200×630 封面、标题 18px/600、域名与描述 14px/20px，16px 内距与卡片间距、hover 底色；卡片高度随内容自适应），分类栏高亮当前分类；书签背景/尺寸在 `src/styles/bookmarks.css`，卡片与网格由 `src/styles/content-cards.css` 提供（项目页共用）；分类与书签数据在 `content/pages/bookmarks.yaml`。
- 移动：48px 胶囊形 sticky 顶栏（两侧 12px 留白、1px 描边、85% 页面底色 + 背景模糊）+ 底部抽屉菜单；博客为「列表页 → 文章页」两页。
- 侧栏底部固定显示 CC BY-NC-SA 4.0 / 版权，以及设计参考 `onur.dev`（12px、50% 不透明度，链接沿用 1px 底线）；信息下方新增「更新日志」`ChangelogLink`（h-7 小描边按钮、历史图标，按当前路由映射 `/home`、`/projects`、`/stack`，当前日志页标记 `aria-current`）；移动端菜单底部提供同款入口；内容区不显示全站页脚。

### 4.3 后台壳

- 240px 侧栏 + 内容区（`max-width: 896px`）。
- 内容区顶部 56px sticky 操作栏：面包屑 + 撤销/保存/预览。
- <1024：侧栏变横向分区条。

### 4.4 间距与圆角

- 基准 4px；常用 4 / 8 / 12 / 16 / 24 / 32 / 40 / 64。
- 列表行纵向 16px；页面标题下 24px；区块之间 40–64px。
- 圆角：按钮/输入 6px；卡片/导航项 8px；图片 12px；移动抽屉顶部 16px。

---

## 5. 组件规则

### 5.1 导航

- 子页导航项：`rounded-lg`、`padding: 8px`、14px/500；默认 `hover: bg-hover`；选中 `bg-active-bg text-active-fg`；快捷键徽标 20px、1px 描边。
- 首页导航：Home / Projects / Blog / Stack / Bookmarks 全部为图标，依次排列；均 60% 不透明度，hover 100%，无背景，并与背景/主题/语言按钮同组。
- 当前路由必须 `aria-current="page"`。

### 5.2 按钮

| 类型 | 规格 |
| --- | --- |
| Primary | 黑底白字（深色白底黑字），h-9、px-4、6px 圆角、14px/500 |
| Outline | 透明底、1px `--line`、`--ink` 文字、极轻阴影 |
| Ghost | 无边框、hover `--bg-subtle` |
| Icon | 32–36px 方形、居中 16px SVG |

- 按钮文字不使用蓝色；图标与文字间距 8px。
- `QuietActionLink`：项目页/Stack 页头等次要操作使用的 antfu 式描边按钮，支持 `icon` 或 `logo`（本地/远程 SVG，遮罩渲染为 1.2em 单色）与可选 `color`（未设置时使用 `--accent`）；规格见 5.2，可在其它页面复用。
- 博客工具：桌面写作栏的 `RSS feed` 为 Outline + 电台图标；移动端页头 RSS 复用 `QuietActionLink`（RSS 图标、新窗口打开）；搜索入口为字段式按钮（h-9、1px 描边、放大镜 + `Search posts…` + `⌘K` 徽标）。
- 禁用态 50% 不透明度，`cursor: not-allowed`。

### 5.3 列表与表格

- 博客行：onur writing 列表，标题 14px/500 + 元信息「日期 · 分类」；行 `rounded-lg p-2`、列表 `gap-1`，hover `--bg-hover`，当前文章 `bg-active` + `text-active-fg`（元信息 70%）；扁平列表，无年列与表头。
- 移动端 Writing：`/blog` 复用 `/home` 的 `WritingTable`；日期在左、分类在右、标题在下的移动端行结构，行间 1px `--line` 分隔，按年份分组；搜索与分类/标签筛选保留。
- 子页返回：通用 `ParentLink` 对齐 antfu `WrapperPost`：提示符 `>` 固定 50% 不透明度且不可点击，`cd ..` 链接复用 `.link` 的常驻 1px `rgba(125,125,125,.3)` 下边框（`border .3s ease-in-out`），默认 50% 不透明度；hover/focus 时链接 75%、下划线变为 `--link-underline`，无位移；通过 `aria-label` 保留“返回博客 / 返回书签 / 返回首页”的可访问名称。
- 书签分类列表（移动端页面与桌面侧栏共用）：复用 `ProjectLinkCard` 的 `compact` 规格与 `.project-cards-grid`：卡片高 60px（与博客侧栏卡片一致）、28px 分类图标（`bookmarks.yaml` 的 `icon`，遮罩渲染、75% 不透明度）、14px/500 标题、12px/50% 数量描述（不展示分类介绍）；整条默认 60% 不透明度、hover 100% + 8% 灰底；列表间距 4px。选中项 `aria-current="page"`，全不透明、文字转 `--heading`、8% 灰底，并在左侧显示 2px `--active-bg` 指示条；图标同步提到 100%。
- 移动端书签背景：18px 点阵 + 顶部 22rem 高的 8% `--accent` 光晕，`bookmarks-surface` 最小高度 100dvh，避免内容下方背景截断；≥1024px 仍使用 24px 网格。
- 后台表格：外层 `rounded-lg` 描边；表头 14px `--muted`、h-10；行 `border-top`；hover `--bg-subtle` 50%。
- 书签卡片：样式在 `src/styles/content-cards.css`；1200/630 媒体区、标题 18px/600、元信息与描述 14px/20px、12px 圆角 + 双层描边阴影、hover `--bg-subtle`；封面优先 YAML `cover`，缺省时用 Raindrop 截图预览（rdl.ink/render，来源同 onur.dev），加载失败回退域名首字母，前 2 张 eager、其余 lazy；书签页为双列瀑布流。
- 项目条目：antfu 式无边框行（样式在 `src/styles/projects.css`）：项目图标以单色遮罩渲染、36px/75%（本地 public/images/projects 文件或 URL，缺省用英文首字母方牌）、标题 1.1rem/400、描述 14px/50%、整条 60% 不透明度、hover 100% + 8% 灰底、6px 圆角、内距 8/14/14；网格 1–3 列自适应（最小 272px，随子页内容区 `max-w-6xl`）；网格上下 8px 内距。
- 分类标题（Projects / Stack 共用）：组件 `CategoryHeading`，样式在 `src/styles/category-heading.css`。外层相对定位、72px（4.5rem）占位高 + 1.25rem 上边距、`pointer-events: none`；标题绝对定位、左移 16px（-1rem），字号固定 80px（中英文一致）、字重 600、行高 1、字距 0.01em、透明填充 + 1.5px #aaa 描边，衬线字体栈 `Noto Serif SC → Source Han Serif SC → Songti SC → STSong → SimSun → ui-serif`，浅色 35%/深色 20% 不透明度，按 `--category-index` 依次入场。
- Stack 行（`.stack-list`，`src/styles/stack-list.css`）：`list-disc`、左内距 1.5rem、上内距 1.25rem、行间 0.5rem、marker `--code-line`；每行介绍 `--muted`、以 `—` 连接名称；名称与 `buttons[].name` 匹配时复用按钮链接，显示为蓝色 `.stack-link`（常驻 1px 下划线 + ↗），否则为 500 / `--heading` 普通文字。
- Stack 页头 logo 按钮：读取 `stack.yaml` 顶层 `buttons`（`name` / `link` / `logo` / 可选 `color`，数组顺序即展示顺序），渲染在居中页头介绍下方（`max-w-3xl`、`flex-wrap`、间距 8px、居中）；每个按钮使用 `QuietActionLink` + 对应 logo，名称保持 16px，无箭头；当前按钮按品牌配置颜色，未设置时回退 `--accent`；分类 `items` 不再维护 `link` / `logo`。首页通过共享 `StackButtonGroup` 复用同一组按钮，仅改为左对齐布局。
- Projects 页头按钮：读取 `projects.yaml` 顶层 `buttons`（同样支持 `name` / `link` / `logo` / 可选 `color`），渲染在居中页头介绍下方；底部 “All projects on GitHub” 使用名为 `GitHub` 的按钮链接。
- 富文本段落通用类 `.rich-text`（`RichText` 组件）：16px/1.75、段块间 1.5rem、strong 600 + `--heading`；使用 ReactMarkdown + remark-gfm + remark-breaks，空行分隔段落、段内单换行直接显示为换行，支持 `[文字](href)`（站内 Link、站外新窗口）与 `**加粗**` 等标准 Markdown；每个段落块作为 `slide-enter-content` 的直接子项，保留首页逐段入场动画。
- 下划线链接通用类 `.underline-link`：无 text-decoration，常驻 1px `rgba(125,125,125,.3)` 底边，hover/focus 变为 `--link-underline`，`border .3s ease-in-out`；文章 TOC 链接复用。
- hover-reveal 通用交互：容器 `.hover-reveal`、触发器 `.hover-reveal-anchor`、面板 `.hover-reveal-panel`（`--hover-reveal-opacity` 默认 0.75）；hover/focus-within 锚点转为继承色，面板以 700ms cubic-bezier(0.4,0,0.2,1) 淡入，支持 `.is-open` 与 reduced-motion；宽屏文章 TOC 复用，可继续用于其它浮层。
- 不使用斑马纹、彩色状态点。

### 5.4 表单

- label 14px/500；输入 h-9、6px 圆角、1px `--line`、白底；focus 2px `--accent` 环。
- 筛选下拉：触发器 h-9、圆角描边；菜单 `rounded-lg border border-line bg-page p-1 shadow-lg`，选项 hover `--bg-hover`，当前项加粗 + check；支持 ↑/↓/Home/End/Enter/Esc 与点击外部关闭。
- textarea 最小 96px；正文/代码类字段用 Mono。
- 双语字段成组排列，组间 16px。

### 5.5 对话框 / 抽屉

- 遮罩 `--overlay`；面板白底、1px 描边、8px 圆角、`shadow-xl`。
- 通用 `Modal` 使用 presence 状态机：遮罩淡入并过渡到 2px 背景模糊（220ms），面板淡入 + 上移 8px + 0.985 轻缩放（240ms）；关闭时反向过渡（160–200ms），保持内容到卸载前再移除（240ms）。搜索窗与微信二维码共用状态机；微信二维码额外传入 `backdropClassName`，使用更轻的遮罩展示折射；reduced-motion 下即时切换。
- 弹窗拖动：`Modal` 传 `draggable` 后，面板内带 `data-modal-drag-handle` 的元素即拖动把手（把手内的链接、按钮、输入框与 `[data-no-drag]` 不触发，保留自身行为）；Pointer Events 跟手并 `setPointerCapture`，位移写入面板的 `translate` 而非 `transform`，因此不打断入场/退场过渡；按视口边缘 12px 夹紧，不会把面板拖出屏幕。把手 `cursor: grab`、拖动中面板 `cursor: grabbing`、`touch-action: none` 兼容触摸；每次重新打开复位到居中。`GlassDialog` 默认开启拖动（把手即其头部行），搜索窗未启用。
- 搜索面板 `max-width: 576px`、无内边距：h-14 输入行（放大镜 + 16px 输入 + ESC）、Posts 列表、底部快捷键提示条；关闭过程中保留当前搜索词与结果。
- 通用玻璃弹窗 `GlassDialog`（`src/components/site/GlassDialog.jsx` + `src/styles/glass-dialog.css`）：复用 `Modal`（`flush` + `panelClassName="glass-dialog"` + `backdropClassName="glass-dialog-backdrop"`）与 `LiquidGlassLens`，自带头部行（可选 kicker 玻璃胶囊 + 32px 玻璃圆形关闭按钮，整行标记 `data-modal-drag-handle` 即拖动把手；无 kicker 时关闭按钮仍贴右）、`glass-dialog-body` 内容槽与可选 `glass-dialog-footer` 槽；`maxWidth` 默认 `23rem`、`draggable` 默认开启；关闭过程中沿用最后一次打开的内容快照，退场动画不空帧；内容区默认 `user-select: none`（展示型弹窗，避免选中与拖动冲突）。内容专属样式留在调用方，不进外壳。
- 液态玻璃材质与折射（参考 [archisvaze/liquid-glass](https://github.com/archisvaze/liquid-glass)）：`GlassDialog` 以 `flush` + `.glass-dialog` 覆盖默认白底，并传入 `backdropClassName="glass-dialog-backdrop"` 使用更轻的遮罩（亮色 15% / 暗色 36%、1.5px 模糊），让背景折射可见。`LiquidGlassLens`（`.liquid-glass-lens` / `.liquid-glass-defs`）读取面板实际尺寸与计算后的圆角，折射位移图（按 Snell 定律计算 bezel 区域的位移）与镜面高光图由 `liquidGlassMaps.js` 生成、跑在 Web Worker（`liquidGlassWorker.js` + `OffscreenCanvas.convertToBlob`）里，主线程只把 blob URL 拼进 SVG `feImage + feDisplacementMap + feColorMatrix + feComposite + feBlend` 并在 `backdrop-filter` 中做真实背景折射与白色镜面缘，`ResizeObserver`（120ms 防抖）在尺寸变化时重建。首帧渲染 72% 页面底色的轻量磨砂层并立即开始 350ms 入场动画，同一帧就向 Worker 派发生成任务，滤镜就绪后 260ms 淡出兜底层——既不阻塞动画也不延后折射；生成图为半分辨率（`MAP_SCALE 0.5`），按尺寸/折射参数做最多 4 条 LRU 缓存（淘汰时 revoke blob URL），环境缺少 Worker 或 `OffscreenCanvas` 时回退主线程同步生成。玻璃面板最大 368px、48px 圆角（≤380px 为 40px），纯透明底、12% 白色染色 + 内阴影（暗色 6% + 白色内高光），外阴影与 1px 发丝线定义边界；bezel 取短边 12%，IOR 2.6、厚度 80、blur 1.1、specularOpacity 0.72。打开 350ms `cubic-bezier(0.32, 0.72, 0, 1)` 缩放上移，关闭 180ms 退场；`prefers-reduced-motion` 下取消过渡；不支持 `backdrop-filter` 时回退为 94% 页面底色。
- 微信二维码：`WechatDialog` 只填 `GlassDialog` 的内容槽与 footer 槽——白色二维码托盘（`.wechat-qr-tray` 240px、1.75rem 圆角，保证扫描对比）与「微信号 | 值」玻璃胶囊（`.wechat-id-*`），专属样式在 `src/styles/wechat-glass.css`；不再显示 kicker，头部行只留右上角关闭按钮（整行仍是拖动把手）。胶囊高 34px：`微信号` 11px 大写标签（字距 0.12em）+ 分隔线 + 16px Mono 微信号，右侧为裸图标复制按钮（`CopyButton`，24px 命中区、14px 图标、60% 不透明度，hover 提亮、按下缩放，无描边与底色；`复制微信号 / Copy WeChat ID`，复制后图标变勾 2s 回弹 + `aria-live` 播报）。弹窗内容整体禁选中（`.glass-dialog-content` 的 `user-select: none`），二维码 `draggable={false}` 且 `-webkit-user-drag: none`，避免选中/拖拽与拖动冲突。
- 预览抽屉 720px / 90vw，右侧滑入。
- 移动菜单：80dvh、顶部 16px 圆角、无标题栏（关闭按钮居右上）；顶部保持 32px 行高，行内在关闭按钮左侧居中显示一条随机语录（取自 `quotes.yaml`，每次打开刷新，单行截断），不增加栏高；打开 460ms 上滑 + 540ms 轻微弹性缩放 + 240ms 淡入，菜单项自 80ms 起以 22ms 间隔依次浮入（380ms easeOutBack）；关闭 300ms 下滑 + 200ms 淡出，内容保持显示；遮罩 260ms 淡入并过渡到 2px 背景模糊。上层 `Modal`（如二维码）打开时菜单忽略 Esc/Tab，避免一次 Esc 同时关闭二维码与菜单。
- Esc、遮罩点击、路由变化关闭；焦点锁定与归还。

### 5.6 代码、公式与媒体

- 行内码：`--code-bg`、6px 圆角、13px Mono，前后反引号装饰。
- 代码块：头部 `rounded-t-lg` 描边 + `--code-header`（#F9FAFB / #111113）+ 14px 中性灰点 + 语言标题 + h-7 Copy（固定 56px 文案宽度、300ms 淡入上移、hover `--code-bg`、复制后禁用 2s）；代码区 `rounded-b-lg border-x/b`、13px/1.7、行号 20px + 24px 间距、横向滚动；不使用彩色红绿灯。语言标识既支持 `js` / `JavaScript` 等直接写法，也支持 `src/main.js` 路径写法（按最后一个扩展名映射 highlight.js 语言，标题保留完整路径）；末尾由换行产生的空行在行号生成前移除。
- 语法高亮：自定义 STYLAN 主题，位于 `src/styles/blog-post.css`。浅色以 `#27272a` 为基底、深色以 `#e4e4e7` 为基底；关键字/选择器/字面量 `#7c3aed / #c4b5fd`，函数与类型 `#1d4ed8 / #93c5fd`，字符串与新增 `#0f766e / #5eead4`，数字、内置、属性与变量 `#b45309 / #fbbf24`，meta 与删除 `#be123c / #fda4af`；注释使用 5:1 以上的次要灰阶斜体，参数继承正文色，标签符号使用 muted。所有配色经过明暗底对比度校准；主题色仅存在于该样式文件。
- 公式：行内 KaTeX 1.08em；`$$...$$` 为居中卡片（`--code-header` 底、1px `--line`、8px 圆角、16px 内边距、横向滚动），字号 1.15em；KaTeX 仅在文章含公式时按需加载。
- GitHub 提示块：结构由 `remark-github-blockquote-alert` 生成（`div.markdown-alert` + 标题段 + 16px octicon），外观对齐 antfu：无底色、无圆角，4px 彩色左边线、8px/16px 内距；标题 16px/500、图标与文字间距 8px、标题下 20px。颜色沿用 GitHub：Note `#0969da` / `#2f81f7`，Tip `#1a7f37` / `#3fb950`，Important `#8250df` / `#a371f7`，Warning `#9a6700` / `#d29922`，Caution `#d1242f` / `#f85149`（浅色 / 深色）；普通 `>` 引用仍使用现有细线样式。
- Mermaid：` ```mermaid ` 块替换代码块，渲染为 1px `--line`、12px 圆角、`--bg` 底的卡片，内距 20px、横向滚动；SVG 默认自适应正文宽度，`<768px` 最小宽度 640px 以保证可读。主题使用 Mermaid `base` + 站点变量：节点 `--bg-subtle` / `--line-strong`、文字 `--ink`、连线 `--muted`、cluster 与 note 使用 `--code-header`；明暗切换时重新渲染。Mermaid 动态 import，并在图表进入视口前 400px 才渲染；解析失败显示错误与原始代码。
- 视频：` ```video ` 块（`url` + `title`）；16:9、圆角 12px + 1px 描边、黑底、进入视口再挂载 iframe/video；所有平台显式 `autoplay=0`，不自动播放；标题作为 12px muted 居中说明。
- 图集：` ```carousel ` 块，每行一张 Markdown 图片；Embla 单图轮播（`align: start` + `loop`，与 onur 一致，惯性拖拽后吸附），每张图放在独立卡片中（`rounded-xl`、1px `--line`、`--bg` 底、`shadow-sm`，图片 `object-cover` 铺满卡片），卡片铺满幻灯片、幻灯片之间 24px 间距，桌面相对正文左右各内缩 4px，接近满宽；桌面左右 h-8 圆形描边按钮位于图片外侧（4px 间距），移动端叠加在图片内；支持鼠标拖拽、触控滑动与键盘方向键，循环切换不置灰按钮，caption 随选中项更新并 `aria-live`。
- 单图与徽章：普通图片（无 `title`）保持 12px 圆角 + 1px 描边；带 `title` 时在图片下方显示 12px、`--muted`、居中的说明。shields.io / badgen.net / badge.fury.io / GitHub Actions `badge.svg` 等徽章图片按 20px 高、`width: auto` 内联显示，不加描边，链接包裹时也不显示下划线。
- 列表：顶层有序列表保持 `decimal-leading-zero` + `list-inside`；嵌套有序列表改为 `lower-alpha → lower-roman`，嵌套无序列表为 `circle → square`，子级 `list-outside`、左缩进 2rem、marker 使用 `--muted`，形成清晰的层级递进。
- 脚注：文末 `[data-footnotes]` 区距正文 2.5rem、上方 1px `--line` 分割线，14px `--muted`；脚注序号为 11px 浅灰胶囊角标，hover 加深；返回箭头小号、低调，hover 转为 `--ink`；`Footnotes` 标题保持 `sr-only`，不显示在页面中。
- GitHub 提及与引用：提及使用显式 `{@username}` / `{@username|显示名称}`，避免普通 `@` 与邮箱被误识别；`#123`、7–40 位含字母与数字的 commit hash 自动转链。样式沿用 antfu magic-link 的浅灰胶囊（14% #888 底、4px 圆角、hover 22%），但改用 `inline-block` + `vertical-align: baseline`，提及、Issue 与 commit 的文字均与正文同字号且基线完全对齐；提及带 1.3em 圆形 GitHub 头像，Issue/commit 前置 12px GitHub 图标，commit 文本使用 Mono；不处理链接与行内代码。
- 折叠块：原生 `<details>/<summary>` 经过安全白名单过滤，渲染为 1px `--line`、12px 圆角、`--bg` 底、12/16px 内距的卡片；summary 16px/500、左侧自绘旋转箭头（0.2s），键盘 focus-visible 使用 2px `--accent` 外框；关闭时仅显示标题，展开后内部 Markdown 正常排版，末元素去掉下边距。
- 内部锚点：标题 slug 为小写、空格转 `-`、移除标点；`<a name="x">` / `<a id="x">` 转为不可见锚点目标。`#hash` 在文章异步加载完成后自动定位，hashchange 同步滚动；目标位于折叠块内时自动展开所有祖先 details。锚点统一 `scroll-margin-top: 6rem`，避免被胶囊顶栏遮挡。

### 5.7 徽标与空状态

- 徽标：12px、`--bg-subtle` 底、`--muted` 文字、4px 圆角；不用彩色。
- 空状态：14px `--muted`，句式简短（`{ nothing here yet }`）。

---

## 6. 页面构图

| 页面 | 构图 |
| --- | --- |
| `/` | 姓名 h1 → 三段 Markdown 自我介绍（`content/pages/index.{en,zh}.md`，由 `RichText` 渲染）→ hr → Find me on → hr → Stack → 页脚 |
| `/home` | 子页 Home（onur）：两段 Markdown 自我介绍（`content/pages/home.{en,zh}.md`，由 `RichText` 渲染，站内链接走 router）→ Writing 标题 → 年/日期/标题/分类表格 → 50px 分割线 + 随机语录；桌面无可见大标题 |
| `/blog` | 三栏：导航 + 写作列表栏（标题 + RSS/Search + 分类/标签选择框 + onur writing 行）+ 右侧点状空内容区（中央随机显示 `quotes.yaml` 的一条语录）；移动端为居中页头 + 斜体说明 + 居中 `QuietActionLink` RSS（新窗口）+ 50px 分割线 + 搜索/筛选 + 与 `/home` 相同的 `WritingTable` |
| `/blog/:slug` | 三栏同 `/blog`，列表栏高亮当前文章，右侧白底文章（返回链接仅移动端显示；≥1536px 时文章左侧吸附 antfu 式目录（菜单图标触发，默认隐藏，悬停/聚焦/点击展开；0.8rem、无边框、低透明度），窄屏与移动端不显示目录；移动端正文末尾显示 `CC BY-NC-SA 4.0 2026 © STYLAN`，复用 `FooterInfo` 并隐藏设计参考） |
| `/projects` | 居中 h1 + 斜体说明 + 居中 `buttons` 按钮组 → 大号描边分类标题 + 1–3 列 antfu 式项目条目 → 底部 All projects on GitHub + 50px 分割线 + 随机语录 |
| `/stack` | 居中 h1 `Stack` + 斜体说明 → 页头 logo 官网按钮组（介绍下方）→ 大号描边分类标题 + bullet 技术项（蓝色箭头名称 + `—` + 双语介绍）→ 50px 分割线 + 随机语录 |
| `/changelog/:scope` | onur Journey 式更新日志：居中 h1「更新日志」+ 当前页面说明 → 按年份分组的双列时间线（年份 Mono 列 + 虚线 + 20px 白底圆点/蓝点）→ 每条记录显示 `v版本号`（Mono/600）、`NEW` 徽标（`latest: true`）、日期与 `BlogMarkdown` 正文；内容按 `pages` 过滤，背景 `aurora` |
| `/bookmarks` | 三栏：导航 + 项目卡片式书签分类栏（标题 + 总数 + 分类图标/名称/数量，当前分类带左侧指示条）+ 右侧网格底纹空内容区（中央随机显示 `quotes.yaml` 的一条语录）；移动端为居中页头 + 50px 分割线 + 项目卡片式分类列表 + 底部随机语录 |
| `/bookmarks/:slug` | 三栏同 `/bookmarks`，分类栏高亮当前分类，右侧为居中 h1 + 分类介绍（`bookmarks.yaml` 的 `description`）+ 双列书签卡 + 50px 分割线 + 随机语录；移动端顶部显示 `> cd ..` |
| `404` | h1 `Not found` + 一句说明 + 返回链接 |
| `/admin.html` | 侧栏 + 操作栏 + 卡片表单 / 表格 / 预览抽屉 |

---

## 7. 动效

| 场景 | 规格 |
| --- | --- |
| 首页入场 | 1s、上移 10px、90ms 阶梯；仅 `/` |
| 链接/导航 hover | 颜色/背景 150–300ms |
| 抽屉/对话框 | 通用 `Modal` presence：遮罩淡入 + 2px 模糊（220ms），面板淡入 + 上移 8px + 0.985 缩放（240ms）；关闭 160–200ms 反向过渡，240ms 后卸载；搜索窗与微信共用状态机，微信走 `GlassDialog` 使用液态玻璃专属轻遮罩与 350ms 缩放开场；`GlassDialog` 头部行即拖动把手（`translate` 位移、视口边缘 12px 夹紧、重开复位）；reduced-motion 下即时 |
| 首页签名 | deqing 单笔画路径，10s grow 循环：0–40% `stroke-dasharray` 0→350px 按字母路径绘制，40–85% 停留，85–95% 擦除；focus-visible 静态显示；reduced-motion 静态 |
| 主题切换 | View Transition 圆形扩散（点击位置为圆心，400ms ease-out；切到深色反向）；不支持 API 或 reduced-motion 时即时换色 |
| 语言切换 | 首页与所有子页：内容用 `key={lang}` 重挂载，`slide-enter` 1s + 90ms 阶梯；子页 `Outlet` 与博客/书签侧栏列表同步重挂载；首页页脚 1.2s 入场；reduced-motion 下无动画 |
| 首页移动菜单 | 右上浮层选项框，160ms 淡入上移；点击外部 / Esc / 路由变化关闭；reduced-motion 下无动画 |
| 子页移动菜单 | 底部抽屉：打开 460ms 上滑 + 540ms 弹性缩放（0.97→1）+ 240ms 淡入，遮罩过渡到 2px 模糊；头像、导航项、Online 项以 22ms 阶梯依次浮入（380ms easeOutBack）；关闭 300ms 下滑 + 200ms 淡出，内容保持；无标题栏；reduced-motion 下无动画 |
| 子页导航 / 加载 | 与首页相同：页面根节点使用 `.slide-enter-content`，`slide-enter` 1s + 90ms 阶梯；路由 key 重挂载；除文章页外直接预加载（避免首次点击出现整页 spinner），文章页懒加载并在空闲时预取，懒加载时居中 16px spinner（sr-only Loading）；reduced-motion 下无动画 |
| Writing 列表 | 加载时骨架脉冲；桌面侧栏卡片以 `slide-enter` 0.5s + 25ms 阶梯入场（筛选/语言切换重播，最多 12 张）；移动端 `/blog` 使用 `WritingTable`，随页面根节点入场，无逐卡动画；reduced-motion 下关闭 |
| Online 邮箱 | 两张卡片叠放在同一位置，上层 `clip-path` 从左往右擦除露出下层（400ms）；复制成功显示「已复制」2s；reduced-motion 下无过渡 |
| `prefers-reduced-motion` | 关闭入场与所有位移动画 |

---

## 8. 无障碍

- 焦点环：2px `--accent`，offset 2px；不得 `outline: none` 后不补替代。
- 正文与次要文字对比度 ≥ 4.5:1。
- 图标按钮必须有 `aria-label`；装饰图标 `aria-hidden`。
- 表格用真实语义标签；列表链接整行可点但保留文本可选。
- 抽屉/对话框焦点锁定与归还；Esc 关闭。
- 移动端可点击目标 ≥ 40×40px（导航项行高 ≥ 40px）。

---

## 9. Do / Don't

**Do**

- 白底、zinc 侧栏、黑标题、灰正文、蓝链接。
- 除书签/项目内容卡片外，用描边和留白分层，而不是阴影和圆角卡片堆叠。
- 列表优先：日期、标题、分类横向对齐，`tabular-nums`。
- 选中态用黑底白字；按钮主色用黑。
- 中文与英文都保持同一字号与行高。

**Don't**

- 不用蓝色按钮、蓝色选中底、彩色 chips、渐变卡片。
- 不用全大写 mono 小标签、超大 Hero 标题、首页项目卡片。
- 不用玻璃拟态、彩色阴影、光晕铺满页面。
- 不在列表行里塞摘要、标签、封面图。
- 不引入第二套强调色或第二套字体。

---

## 10. 实现映射（Tailwind v4）

```css
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
  --color-active: var(--active-bg);
  --color-active-fg: var(--active-fg);
}
```

- 所有颜色必须走变量；禁止在组件里写十六进制颜色（代码高亮除外）。
- 所有间距使用 4px 倍数；禁止任意值 `[13px]` 一类散落尺寸（代码字号与行高除外）。
- 深色只允许通过 `.dark` 覆盖变量，不允许在组件里写 `dark:` 颜色分支（布局/显示切换除外）。

---

## 11. 验收清单

- [x] 首页为 65ch 文本流，无项目卡片与技能网格。
- [x] 子页 Home 为 onur 式独立页（介绍 + Writing 表格）；侧栏 Home 指向 `/home`，只有头像卡片回到 `/`。
- [x] 子页为 240/288px 侧栏 + 768px 内容区；移动端 48px 胶囊顶栏 + 底部抽屉。
- [x] 浅色为纯白 / zinc-50 / gray-200 / 黑 / 蓝链接；深色为等价推导。
- [x] 全站 Geist Sans + Geist Mono，自托管，无第三方字体请求。
- [x] 博客为 onur 式三栏 master-detail：列表在写作栏，点击文章在右侧显示；移动端为列表页 → 文章页。
- [x] 博客列表为 onur writing 行（标题 + 日期 · 分类），当前文章黑底高亮；分类/标签为选择框，无摘要与年份列。
- [x] 文章页 onur 式正文（紧凑标题/列表/引用，嵌套列表分级样式）+ 头部带灰点、语言与 Copy 的代码块（路径语言识别、去尾部空行）+ KaTeX 行内/块级公式（按需加载） + GitHub Alerts + Mermaid 图表（按需加载、跟随主题） + 引用式链接 + 脚注 + GitHub 提及（`{@username}`）/引用胶囊 + `<details>` 折叠块 + 内部锚点/深链 + `video`/`carousel` 媒体块 + 宽屏左侧吸附 TOC + 圆角描边图片（title 说明、徽章内联）。
- [x] 项目页为居中页头 + 大号描边分类标题 + 1–3 列 antfu 式项目条目；Stack 为居中页头 + logo 官网按钮 + 同款大号描边分类标题 + 技术项 bullet（蓝色箭头名称 / 介绍）；书签页为分类栏 + 双列书签卡，空态显示双语语录。
- [x] 后台为 onur 式侧栏 + 卡片表单 + 表格 + 预览抽屉。
- [x] 背景统一在 `src/backgrounds/`：首页可循环 `plum` / `dots` / `grid` / `waves` / `aurora` / `none`；`/home`、`/projects`、`/stack` 分别使用 `aurora`、`dots`、`waves`，`/changelog` 使用 `aurora`。
- [x] 更新日志：侧栏底部与移动菜单入口；`content/changelog/v<版本>-<日期>.<zh|en>.md`，frontmatter 含 `version` / `date` / `latest` / `pages`；页面按当前页面筛选，onur Journey 式年份时间线，复用 `BlogMarkdown`。
- [x] 移动端 Lighthouse：三条页面 Performance ≥ 90，其余 ≥ 95。
- [x] 双主题、双语、搜索、筛选、宽屏 TOC、RSS、简历、二维码全部可用。
