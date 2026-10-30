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
4. **内容密度**：列表行与表格承载信息；不用大卡片、彩色 chips、渐变面板填充页面。
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
| `--accent` | `#2563EB` | `#60A5FA` | 焦点环、文章光晕、后台链接、Stack 分类链接 |
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
- 卡片：`background: var(--bg)`、`border: 1px solid var(--line)`、`border-radius: 8px`；不用阴影。
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
| 页面 h1 | 24px（≥768px 30px）/ 600 / `letter-spacing: -0.025em` / `--heading` |
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
- 正文链接为黑色（`--heading`）：常态 1px `rgba(125,125,125,.3)` 下边框，hover 变 `--link-underline`，`border 0.3s ease-in-out`；文字颜色不变、底线常驻不挤压布局。首页内带底线的正文/社交链接字重 600，页脚链接例外（400）。
- 文章正文宽度 768px（onur `content`）；首页 65ch。
- 不用字重 300、斜体长文、渐变文字。

---

## 4. 布局

### 4.1 首页壳（antfu）

```text
┌──────────────────────────────────────────────┐
│ STYLAN                        Projects Blog│
│                             Skills Bookmarks│
│                                              │
│           65ch 居中正文                       │
│           自我介绍（内联链接）                 │
│           ───                                │
│           Find me on …                       │
│           ───                                │
│           Stack（分类链接 + 技术项）          │
│                                              │
│ © 2026 STYLAN                               │
└──────────────────────────────────────────────┘
```

- wordmark 左上 20px；导航右上 32px（随页面滚动，不吸顶）、链接间距 20px、默认 60% 不透明度。背景/主题/语言控制为同一组裸图标按钮：组内间距 4px，无边框无底色，60% 不透明度，hover 100%。
- 主列 `max-width: 65ch`，`padding: 40px 28px`。首页正文颜色为 `--home-body`（#555/#BBB，对应 antfu 的 `--fg`）；标题用 `--heading`，链接用 `--heading`。
- Stack 区块无可见标题：介绍（`text-ink`）+ `list-disc` 列表（`pl-6`、`gap-2px`、marker `--code-line`）；每行分类为蓝色 `/skills` 链接 + ↗ + `—` + 技术项（muted）；链接沿用 `.link` 下划线：常驻 1px `rgba(125,125,125,.3)`，hover 加深为 `--link-underline`，文字保持蓝色。
- 背景：antfu 式生成艺术，默认 `plum`（Canvas 分形枝条，40fps，停笔后静止）；右上角按钮循环 `plum → dots → none` 并写入 `localStorage.home-background`；也可通过 `src/backgrounds/index.js` 的 `HOME_BACKGROUND` 切换默认值；背景层固定 `z-0`，内容 `z-10`；其他页面可直接引用 `<BackgroundLayer variant="dots" />`；`prefers-reduced-motion` 下关闭。
- “Find me on” 使用正文链接样式：16px / 400（`font-weight: inherit`），图标 1.2em（约 19px）、`inline-block`、75% 不透明度、`text-bottom` 对齐，图标与文字间隔 4px，链接间距 8px；链接常态有 1px `rgba(125,125,125,.3)` 下边框，hover 变为 `--link-underline`（#555/#BBB），`border 0.3s ease-in-out`，底线常驻不挤压布局。平台为 GitHub / Bilibili / Bluesky / WeChat；WeChat 在 hover/focus 时显示二维码气泡（触摸端点击切换），气泡桌面端位于按钮右侧并垂直居中、移动端位于按钮上方，以 `slide-enter` 1s 入场；关闭前先保留 0.5s，随后气泡像素分解为粒子并汇聚到 WeChat 按钮（`src/utils/dispersion.js`），reduced-motion 下 0.5s 后直接关闭。下方 `Or mail me at` + mono 邮箱。
- 区块之间使用 50px 居中短分割线，上下 `2em`（与 antfu 的 `.prose hr` 一致）。
- 页脚：`CC BY-NC-SA 4.0 2026 © STYLAN · 设计参考 antfu/antfu.me`，14px、50% 不透明度，与 65ch 正文对齐；链接使用同一 1px 底线规则；窄屏可换行，无边框、无社交图标（与 antfu 一致）。
- 移动端顶部为普通文档流，导航收进菜单面板。
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
- 主题与语言控制位于内容区右上角（`right: 32px; top: 24px`，随内容滚动），使用与首页相同的裸图标组（间距 4px、无边框、60% 不透明度、hover 100%）；移动端仍在 48px 顶栏右上角。
- 导航图标与 onur 一致：Home 房子、Projects 文件夹、Blog 钢笔、Stack 魔杖星光（WandSparkles）、Bookmarks 书签。
- Online 依次为 GitHub、Email、Bilibili、WeChat、Bluesky：前四项来自 `contactPage.contactMethods`，Bluesky 来自 `socialLinks` 且与联系方式去重；Email 右侧保持 ↗，点击后两张卡片叠放在同一位置，上层用 clip-path 从左往右擦除、露出下层邮箱卡（400ms），并可一键复制；WeChat 与其它项一样带右侧 ↗ 图标，点击打开二维码弹窗（页头图标 + 二维码卡片 + 微信号 `stylan-ai`）；不再显示 RSS。
- 侧栏 Home 指向子页 `/home`（onur 式首页）；顶部头像/姓名卡片是指向 `/`（antfu 首页）的唯一入口，头像读取 `personal.avatar`，当前为 GitHub 头像 URL。
- 内容：普通页面 `max-width: 768px`，`padding: 32px 24px`（桌面 `96px 32px 64px`）。
- 博客路由为 onur 式三栏：导航栏 + 320/384px 写作列表栏（`--bg-sidebar`、右边框、标题 + RSS/Search + 选择框 + 列表）+ 右侧内容区；`/blog` 内容区为空并显示 16px 点状底纹，中央居中随机显示一条双语语录（`src/content/quotes.yaml`，18px muted、600ms 入场）；`/blog/:slug` 为白底文章（`max-width: 768px`），列表栏常驻并高亮当前文章。
- 书签路由为 blog 同款三栏：导航栏 + 320/384px 分类栏（标题 + 总数 + 分类行：名称/数量，复用写作列表卡片的 60px 高度与 hover/active 样式）+ 右侧 24px 网格底纹内容区；`/bookmarks` 内容区为空并随机显示一条 `quotes.yaml` 语录；`/bookmarks/:slug` 为 onur 式 h1 + 双列书签卡（1200×630 封面、标题 18px/600、域名与描述 14px/20px，16px 内距与卡片间距、hover 底色；卡片高度随内容自适应），分类栏高亮当前分类；书签样式集中在 `src/styles/bookmarks.css`，分类与书签数据在 `src/content/bookmarks.yaml`。
- 移动：48px sticky 顶栏 + 底部抽屉菜单；博客为「列表页 → 文章页」两页。
- 子页无全站页脚。

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
- 首页导航：纯文本，60% 不透明度，hover 100%；无背景、无边框。
- 当前路由必须 `aria-current="page"`。

### 5.2 按钮

| 类型 | 规格 |
| --- | --- |
| Primary | 黑底白字（深色白底黑字），h-9、px-4、6px 圆角、14px/500 |
| Outline | 透明底、1px `--line`、`--ink` 文字、极轻阴影 |
| Ghost | 无边框、hover `--bg-subtle` |
| Icon | 32–36px 方形、居中 16px SVG |

- 按钮文字不使用蓝色；图标与文字间距 8px。
- 博客工具：`RSS feed` 为 Outline + 电台图标；搜索入口为字段式按钮（h-9、1px 描边、放大镜 + `Search posts…` + `⌘K` 徽标）。
- 禁用态 50% 不透明度，`cursor: not-allowed`。

### 5.3 列表与表格

- 博客行：onur writing 列表，标题 14px/500 + 元信息「日期 · 分类」；行 `rounded-lg p-2`、列表 `gap-1`，hover `--bg-hover`，当前文章 `bg-active` + `text-active-fg`（元信息 70%）；扁平列表，无年列与表头。
- 项目/后台表格：外层 `rounded-lg` 描边；表头 14px `--muted`、h-10；行 `border-top`；hover `--bg-subtle` 50%。
- 不使用斑马纹、彩色状态点。

### 5.4 表单

- label 14px/500；输入 h-9、6px 圆角、1px `--line`、白底；focus 2px `--accent` 环。
- 筛选下拉：触发器 h-9、圆角描边；菜单 `rounded-lg border border-line bg-page p-1 shadow-lg`，选项 hover `--bg-hover`，当前项加粗 + check；支持 ↑/↓/Home/End/Enter/Esc 与点击外部关闭。
- textarea 最小 96px；正文/代码类字段用 Mono。
- 双语字段成组排列，组间 16px。

### 5.5 对话框 / 抽屉

- 遮罩 `--overlay`；面板白底、1px 描边、8px 圆角、`shadow-xl`。
- 搜索面板 `max-width: 576px`、无内边距：h-14 输入行（放大镜 + 16px 输入 + ESC）、Posts 列表、底部快捷键提示条；打开 180ms 淡入 + 轻微缩放上移，reduced-motion 关闭。
- 预览抽屉 720px / 90vw，右侧滑入。
- 移动菜单从底部滑入，80vh，顶部 16px 圆角。
- Esc、遮罩点击、路由变化关闭；焦点锁定与归还。

### 5.6 代码、公式与媒体

- 行内码：`--code-bg`、6px 圆角、13px Mono，前后反引号装饰。
- 代码块：头部 `rounded-t-lg` 描边 + `--code-header`（#F9FAFB / #111113）+ 14px 中性灰点 + 语言标题 + h-7 Copy（固定 56px 文案宽度、300ms 淡入上移、hover `--code-bg`、复制后禁用 2s）；代码区 `rounded-b-lg border-x/b`、13px/1.7、行号 20px + 24px 间距、横向滚动；不使用彩色红绿灯。
- 公式：行内 KaTeX 1.08em；`$$...$$` 为居中卡片（`--code-header` 底、1px `--line`、8px 圆角、16px 内边距、横向滚动），字号 1.15em；KaTeX 仅在文章含公式时按需加载。
- 视频：` ```video ` 块（`url` + `title`）；16:9、圆角 12px + 1px 描边、黑底、进入视口再挂载 iframe/video；所有平台显式 `autoplay=0`，不自动播放；标题作为 12px muted 居中说明。
- 图集：` ```carousel ` 块，每行一张 Markdown 图片；Embla 单图轮播（`align: start` + `loop`，与 onur 一致，惯性拖拽后吸附），每张图放在独立卡片中（`rounded-xl`、1px `--line`、`--bg` 底、`shadow-sm`，图片 `object-cover` 铺满卡片），卡片铺满幻灯片、幻灯片之间 24px 间距，桌面相对正文左右各内缩 4px，接近满宽；桌面左右 h-8 圆形描边按钮位于图片外侧（4px 间距），移动端叠加在图片内；支持鼠标拖拽、触控滑动与键盘方向键，循环切换不置灰按钮，caption 随选中项更新并 `aria-live`。

### 5.7 徽标与空状态

- 徽标：12px、`--bg-subtle` 底、`--muted` 文字、4px 圆角；不用彩色。
- 空状态：14px `--muted`，句式简短（`{ nothing here yet }`）。

---

## 6. 页面构图

| 页面 | 构图 |
| --- | --- |
| `/` | Intro 三段 → hr → Find me on → hr → Stack → 页脚 |
| `/home` | 子页 Home（onur）：两段介绍（Hello + focus 链接）→ Writing 标题 → 年/日期/标题/分类表格；桌面无可见大标题 |
| `/blog` | 三栏：导航 + 写作列表栏（标题 + RSS/Search + 分类/标签选择框 + onur writing 行）+ 右侧点状空内容区（中央随机显示 `quotes.yaml` 的一条语录） |
| `/blog/:slug` | 三栏同 `/blog`，列表栏高亮当前文章，右侧白底文章（返回链接仅移动端显示，TOC 为移动端折叠块） |
| `/projects` | h1 + 说明 + GitHub → 项目表格（移动卡片） |
| `/skills` | h1 `Stack` + 说明 → onur 式分类 bullet 列表（蓝色分类链接 + ↗ + `—` + 技术项） |
| `/bookmarks` | 三栏：导航 + 书签分类栏（标题 + 总数 + 分类/数量）+ 右侧网格底纹空内容区（中央随机显示 `quotes.yaml` 的一条语录） |
| `/bookmarks/:slug` | 三栏同 `/bookmarks`，分类栏高亮当前分类，右侧 onur 式 h1 + 双列书签卡（封面 / 标题 / 域名 / 描述） |
| `404` | h1 `Not found` + 一句说明 + 返回链接 |
| `/admin.html` | 侧栏 + 操作栏 + 卡片表单 / 表格 / 预览抽屉 |

---

## 7. 动效

| 场景 | 规格 |
| --- | --- |
| 首页入场 | 1s、上移 10px、90ms 阶梯；仅 `/` |
| 链接/导航 hover | 颜色/背景 150–300ms |
| 抽屉/对话框 | 透明度 + 位移 300ms |
| 主题切换 | View Transition 圆形扩散（点击位置为圆心，400ms ease-out；切到深色反向）；不支持 API 或 reduced-motion 时即时换色 |
| 语言切换 | 重放首页加载效果：内容用 `key={lang}` 重挂载，`slide-enter` 1s + 90ms 阶梯；页脚 1.2s 入场；reduced-motion 下无动画 |
| 子页导航 / 加载 | 与首页相同：页面根节点使用 `.slide-enter-content`，`slide-enter` 1s + 90ms 阶梯；路由 key 重挂载；懒加载时居中 16px spinner（sr-only Loading）；reduced-motion 下无动画 |
| 二维码气泡关闭 | 关闭前保留 0.5s，随后气泡快照采样为 Canvas 粒子，立即散开并沿贝塞尔曲线汇聚到触发按钮，约 0.6s；reduced-motion 下 0.5s 后直接关闭 |
| Writing 列表 | 加载时骨架脉冲；卡片以 `slide-enter` 0.5s + 25ms 阶梯入场（筛选/语言切换重播，最多 12 张）；reduced-motion 下关闭 |
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
- 用描边和留白分层，而不是阴影和圆角卡片堆叠。
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
- [x] 子页为 240/288px 侧栏 + 768px 内容区；移动端 48px 顶栏 + 底部抽屉。
- [x] 浅色为纯白 / zinc-50 / gray-200 / 黑 / 蓝链接；深色为等价推导。
- [x] 全站 Geist Sans + Geist Mono，自托管，无第三方字体请求。
- [x] 博客为 onur 式三栏 master-detail：列表在写作栏，点击文章在右侧显示；移动端为列表页 → 文章页。
- [x] 博客列表为 onur writing 行（标题 + 日期 · 分类），当前文章黑底高亮；分类/标签为选择框，无摘要与年份列。
- [x] 文章页 onur 式正文（紧凑标题/列表/引用）+ 头部带灰点、语言与 Copy 的代码块 + KaTeX 行内/块级公式（按需加载） + `video`/`carousel` 媒体块 + 移动端折叠 TOC + 圆角描边图片。
- [x] 项目页为表格（移动卡片）；技能页为 onur 式 bullet 列表；书签页为分类栏 + 双列书签卡，空态显示双语语录。
- [x] 后台为 onur 式侧栏 + 卡片表单 + 表格 + 预览抽屉。
- [x] 首页背景为 antfu 式生成艺术，可通过 `src/backgrounds/index.js` 切换 `plum` / `dots` / `none`。
- [x] 移动端 Lighthouse：三条页面 Performance ≥ 90，其余 ≥ 95。
- [x] 双主题、双语、搜索、筛选、TOC、RSS、简历、二维码全部可用。
