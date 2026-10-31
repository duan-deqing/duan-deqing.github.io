# STYLAN 站点优化分析与设计方案

> 版本：v1 · 2026-10-24
> 范围：性能 / 静态资源 / 启动链路 / 代码结构 / SEO / 设计系统
> 配套：`DESIGN.md`（视觉契约）、`public/site-structure.svg`（结构图）

---

## 0. 结论摘要（TL;DR）

站点功能与视觉完成度高（历史 Lighthouse 的 SEO / A11y / Best-Practices 均 1.0），**真正的优化空间集中在「静态资源重量」与「首屏启动链路」**，其次是少量代码结构与设计 token 漂移。

按「收益 / 成本」排序的三件事：

| 优先级 | 事项 | 现状 | 目标 | 预期收益 |
|---|---|---|---|---|
| **P0** | 字体子集化 + woff2 | 运行时下载 ~5.8 MB（FiraCode Nerd 2×2.6 MB TTF + Roboto 4×~124 KB TTF） | < 200 KB | 首屏字节降 ~96%，LCP 显著前移 |
| **P0** | 删除/隔离死资源 | `public/fonts` 内 Merriweather 5 个 TTF（~2.9 MB）无任何 `@font-face` 引用 | 0 | 仓库与 GitHub Pages 体积 -2.9 MB |
| **P1** | 首屏启动链路去阻塞 | `Boot` 的 loading→leaving→ready 人工闸门 + 320 ms 进度动画延迟真实内容绘制 | 内容直出 | LCP / TTI 前移，弱网体验改善 |
| **P1** | 图片现代化 | 文章配图 140–224 KB JPG、二维码 75 KB PNG，无尺寸/懒加载 | AVIF/WebP + srcset + 显式宽高 | 单图 -60~80%，CLS 稳定 |
| **P2** | 度量与结构清理 | LHCI 配置打到 `/index.html`、`/404.html`（均落入 `*` 路由），产物为 5 月旧数据；`ThemeLangControls` 重复定义；NotFound 用裸 `text-blue-500` | 真实路由度量 + 组件去重 + token 归一 | 可度量、可维护 |

---

## 1. 现状证据

### 1.1 字体（最大头）

`src/index.css` 当前仅声明 6 个 `@font-face`，全部指向 **未压缩的 TTF**：

| 字体 | 文件 | 单文件体积 | 是否被引用 |
|---|---|---|---|
| FiraCode Nerd Font | Regular / Bold `.ttf` | ~2.6 MB × 2 | ✅ `--font-mono`（kicker / 导航 / 标签大量使用） |
| Roboto | 300/400/500/700 `.ttf` | ~124 KB × 4 | ✅ `--font-display` / `--font-heading` |
| Merriweather | 5 个 `.ttf` | ~586 KB × 5 ≈ 2.9 MB | ❌ **无任何引用，纯死资源** |

问题拆解：

1. **Nerd Font 是「全字符集 + 图标」字体**，2.6 MB/字重对只用到 ASCII 与少量符号的 mono UI 是极端浪费；TTF 无压缩、无子集、无 `unicode-range`。
2. **Roboto 用 TTF 而非 woff2**，且 4 个字重全量加载；实际 300/500 使用面窄。
3. **`--font-body` / `--font-post` 声明了 `"Noto Sans SC", "Inter"`，但二者既无 `@font-face` 也无外链** → 静默回退到系统字体。中文正文在不同平台渲染不一致，且栈里留着「幽灵字体名」误导维护者。（历史上 5 月构建曾真实下载过 `NotoSansSC-400/500.woff2` 各 ~10.3 MB，见 `.lighthouseci` 旧报告——该问题已通过移除 webfont 解决，但栈声明未清理。）
4. `font-display: swap` 已设置（好），但 TTF 体积使 swap 的「回退期」在弱网下过长，造成明显字体跳变。

### 1.2 首屏启动链路

`src/App.jsx` 的 `Boot` 状态机：`loading → leaving → ready`，其中

- `Loading` 组件跑 **320 ms** 进度动画才 `onComplete`；
- `ready` 前再等 **200 ms** 淡出；
- 真实路由内容被 `Suspense` 闸在 `phase === 'ready'` 之后。

即：**即使所有 chunk 已就绪，用户仍被人工延迟 ≥ 520 ms 才看到真实内容**。在 CPU 降节流（Lighthouse 4×）与弱网下该闸门放大为可感知的白屏/占位屏。首屏防主题闪烁的内联脚本（`index.html`）是正确实践，应保留。

### 1.3 图片

| 资源 | 体积 | 问题 |
|---|---|---|
| `src/posts/img/**/…jpg` ×3 | 140–224 KB | JPG 无 AVIF/WebP 备选、无 `srcset`、无显式宽高 |
| `public/images/contact-illustration.jpg` | 164 KB | 同上 |
| `public/images/wechat-qrcode.png` | 75 KB | PNG 适合二维码但可转 WebP 无损/近无损更小 |
| `public/images/1_1_main-page.jpg` | 16 KB | OG 图，可接受 |

### 1.4 构建与部署

- `vite.config.js`：`sourcemap: true` → `.map` 随构建进入 `dist` 并部署到 GitHub Pages（用户不下载，但**公开暴露源码**且撑大部署体积）。个人站建议生产关闭或改为 `hidden`。
- `manualChunks` 已拆 `react-vendor` / `markdown-vendor`（好）；`markdown-vendor` 仅 BlogPost 需要，已隔离（好）。
- 子页 `requestIdleCallback` 预取（好），保留。

### 1.5 度量失真（重要）

`.lighthouseci/*.json`（2026-05，**重构前旧数据**）中：

- 被测 URL 为 `/index.html` 与 `/404.html`；在 `BrowserRouter` 下二者都落入 `*` → **渲染的是 NotFoundPage**，LCP 元素即 NotFound 的 `<h1 class="text-8xl … text-blue-500">`。
- 因此 `perf 0.73 / LCP 53.7s` **不代表真实首页**，且 53.7s 主要由旧构建下载 ~20.6 MB Noto Sans SC woff2 造成（该字体现已移除）。
- 结论：**当前没有一份针对真实路由的有效性能基线**，优化前必须先重建度量。

### 1.6 代码结构 / 设计 token

- `ThemeLangControls` 在 `SiteRail.jsx` 与 `SubpageHeader.jsx` **重复实现**（仅尺寸差异）。
- `HomePage` 的 `MobileIntro` 与 `SiteRail` 的身份信息块语义重复。
- `NotFoundPage` 使用裸 Tailwind 色 `text-blue-500` / `text-8xl`，**偏离 `DESIGN.md` 的双主题 token**（暗色下对比度不可控）。
- `config.js` 为「god-object」（personal / navLinks / sections / social / footer 全在内），个人站可接受，但新增字段易冲突。

---

## 2. 设计方案

### 2.1 P0 · 字体管线（目标：运行时 < 200 KB）

**设计原则：子集化 + woff2 + 按需字重 + 显式 CJK 系统栈。**

1. **FiraCode Nerd Font → 子集 woff2**
   - 用 `pyftsubset`（fonttools）或 `glyphhanger` 按实际使用字符集子集化：ASCII 可打印字符 + 常用标点 + 站点出现的符号（`→ · ☾ ☀ / : %` 等）。
   - 输出 `FiraCode-subset-400.woff2` / `-700.woff2`，预期 **各 15–30 KB**。
   - 若不需要 Nerd 图标，直接换用普通 **Fira Code / JetBrains Mono** woff2（@fontsource 提供已子集包），更省事。
2. **Roboto → woff2 + 精简字重**
   - 仅保留 **400 / 700**（300/500 若确无视觉必要则删）；latin 子集 woff2 各 ~15–20 KB。
   - 加 `unicode-range: U+0000-00FF, U+0131, …`（latin），避免为 CJK 触发下载。
3. **CJK 正文：不加载 webfont，改为显式系统栈**
   - 将 `--font-body` / `--font-post` 改为：
     `"Roboto", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif`
   - 移除幽灵的 `"Noto Sans SC", "Inter"`，消除跨平台不一致与误导。
4. **删除死资源**：`public/fonts/Merriweather-*.ttf`（-2.9 MB）。同步更新 `DESIGN.md` 字体条款。
5. **加载策略**
   - 关键首屏字重（Roboto 400/700、mono 400）在 `index.html` 用 `<link rel="preload" as="font" type="font/woff2" crossorigin>` 预载；
   - 其余 `font-display: swap`；非关键字重可 `optional` 进一步避免跳变。

**验收**：DevTools Network 中 font 传输总量 < 200 KB；无 `Noto Sans SC` 请求；Lighthouse `font-display` 通过。

### 2.2 P0 · 死资源与部署卫生

- 删除 Merriweather TTF（见上）。
- `vite.config.js`：`sourcemap: false`（或 `'hidden'` 仅本地调试用环境变量开启）。
- 将 `public/` 大二进制纳入体积预算检查（见 §3）。

### 2.3 P1 · 启动链路重设计（目标：内容直出）

**现状问题**：人工闸门（320 ms 进度 + 200 ms 淡出）把「资源就绪」与「内容可见」解耦成串行延迟。

**重设计方案（渐进、可回退）**：

- **方案 A（推荐，最小改动）**：保留 `Loading` 视觉，但改为「**资源就绪即提前结束**」——进度动画取 `min(320ms, 资源就绪时刻)`，资源先就绪则立即 `onComplete`；去掉固定 200 ms，淡出用 CSS `transition` 与内容挂载并行（内容先挂载、遮罩淡出覆盖其上），消除串行等待。
- **方案 B（彻底）**：移除全屏 `Loading` 闸门，首页内容直接渲染；用 `index.html` 内联的极简骨架（已有防闪烁脚本位置）承担首帧，`Loading` 仅保留为路由级 `Suspense` fallback（`ContentFallback` 已存在）。
- 无论 A/B：**为首页 chunk 增加 `<link rel="modulepreload">`**（Vite 可用 `modulePreload` 或手写），减少发现延迟。
- 保留：`ScrollToTop`、子页 idle 预取、防主题闪烁内联脚本。

**验收**：本地 4× CPU + Slow-4G 下，真实首页 LCP < 2.5 s；无 ≥500 ms 的人工空白期。

### 2.4 P1 · 图片管线

- 引入构建期转换（`vite-imagetools` 或一次性 `sharp` 脚本）：对 `src/posts/img/**` 与 `public/images/*` 生成 **AVIF + WebP + 原格式回退** 与多档宽度（480/960/1440）。
- 渲染侧统一 `<picture>` + `srcset/sizes` + **显式 `width/height`**（防 CLS）+ 非首屏 `loading="lazy" decoding="async"`。
- 二维码保留 PNG 或转 WebP 无损；OG 图维持 JPG ≤100 KB。
- 文章 front-matter 增加 `cover.width/height` 或由脚本注入，避免布局抖动。

**验收**：单张配图 ≤60 KB（WebP）/ ≤40 KB（AVIF）；CLS ≤0.05。

### 2.5 P2 · 度量重建（先于一切优化验证）

- 修正 LHCI 配置 URL 为真实路由：`/`、`/blog`、`/skills`、`/projects`、`/contact`（**不要** `/index.html`）。
- 设置性能预算断言（`assertions`）：
  - `categories:performance ≥ 0.9`
  - `total-byte-weight ≤ 1,000,000`（1 MB）
  - `largest-contentful-paint ≤ 2500`
- 在 CI（`.github`）对 `main` 跑 LHCI 并上传报告，防止回退。
- 删除/归档 5 月旧 `lhr-*.json`，避免误读基线。

### 2.6 P2 · 代码结构与 token 归一

- 抽取 `components/shared/ThemeLangControls.jsx`（`size: 'rail' | 'header'` 一个 prop 消化差异），删除两处重复实现。
- `MobileIntro` 复用 `SiteRail` 的身份信息子组件（同一 config 源），减少双份维护。
- `NotFoundPage`：移除 `text-blue-500` / `text-8xl`，改用 token（`var(--accent)` / `font-display` + clamp 字号），对齐 `DESIGN.md`。
- `config.js` 按域拆为 `config/{personal,nav,sections,social}.js` 再聚合导出（可选，收益中等）。

### 2.7 P2 · SEO / 可发现性补强

- 新增 `public/sitemap.xml`（构建期由路由表 + 文章 slug 生成，与 `generate-rss.js` 同管线）。
- 路由级更新 `canonical` 与 OG（`PageTitle` 已管 title/description，扩展 canonical + `og:url` + 文章 `og:image`）。
- 文章页补 `article:published_time` / `modified_time` meta。

---

## 3. 实施路线图

| 阶段 | 内容 | 估时 | 风险 |
|---|---|---|---|
| **Phase 1（P0）** | 字体子集/woff2、删 Merriweather、清幽灵字体栈、关 sourcemap | 0.5–1 d | 低（纯资源替换，视觉需回归 mono/display） |
| **Phase 2（P1）** | 启动链路方案 A、modulepreload、图片管线 | 1–2 d | 中（首屏时序改动，需真机+弱网回归） |
| **Phase 3（P2）** | LHCI 重建 + 预算、组件去重、token 归一、sitemap/OG | 1 d | 低 |

**总体验收门槛**：真实首页 4× CPU + Slow-4G 下 `performance ≥ 0.9`、`total-byte-weight ≤ 1 MB`、`LCP ≤ 2.5 s`、`CLS ≤ 0.05`；SEO/A11y/BP 保持 1.0。

---

## 4. 明确「不做」的项（避免过度优化）

- **不**为 CJK 加载 webfont（体积/收益比极差，系统栈足够）。
- **不**引入 SSR/SSG 框架重构（个人站流量规模下，静态 SPA + 正确资源策略已足够；若未来 SEO 诉求升级再评估 Astro/Next 导出）。
- **不**拆更细的 manualChunks（当前两chunk划分已合理，过度拆分增加请求数）。
- **不**做 service worker / 离线缓存（GitHub Pages + 个人站收益有限，维护成本高）。
