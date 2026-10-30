# STYLAN Developer Portfolio

简约现代风格的程序员个人主页：支持浅色/深色主题、中英文切换，以及基于 Markdown 文件的博客系统。

- **线上地址**：https://duan-deqing.github.io
- **当前版本**：1.5.4

![主页图片](./public/images/1_1_main-page.jpg)

## 技术栈

| 类别 | 选型 |
|------|------|
| 前端框架 | React 19 |
| 构建工具 | Vite 8 |
| 样式方案 | Tailwind CSS v4（`@tailwindcss/vite`） |
| 路由 | React Router v7 |
| Markdown | react-markdown + remark-gfm + rehype-highlight |
| 图集轮播 | embla-carousel-react |
| Frontmatter | front-matter |
| RSS | feed（`scripts/generate-rss.js`） |
| 包管理 | pnpm |
| 部署 | GitHub Pages（Actions 自动构建） |

字体：自托管 [Geist Sans / Geist Mono](https://vercel.com/font)（`public/fonts/*.woff2`，SIL OFL 1.1），中文回退到 `PingFang SC` / `Microsoft YaHei` 等系统字体；不请求第三方字体服务。

设计：首页参考 [antfu.me](https://github.com/antfu/antfu.me) 的 65ch 文本流，博客/项目/技能/书签与后台参考 [onur.dev](https://github.com/suyalcinkaya/onur.dev) 的侧栏与表格体系；完整令牌与规则见 `DESIGN.md`。

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 生成 RSS（也会在 build 时自动执行）
pnpm run rss

# 构建生产版本（先生成 rss.xml，再 vite build）
pnpm run build

# 预览生产版本
pnpm run preview
```

## 项目结构

```txt
├── .github/workflows/deploy.yml  # GitHub Pages 自动部署
├── public/
│   ├── fonts/                    # Geist 字体与许可
│   ├── images/                   # 图片资源
│   ├── favicon.ico
│   ├── 404.html                  # GitHub Pages SPA 重定向兜底
│   ├── .nojekyll
│   └── rss.xml                   # RSS（由脚本生成，勿手改）
├── scripts/
│   └── generate-rss.js           # 构建时生成 RSS
├── content/                      # 所有可编辑内容（对标 antfu.me 的 pages 结构）
│   ├── site.yaml                 # 全站共享：站点信息、个人、导航、联系、社交、页脚
│   └── pages/
│       ├── home.yaml             # 首页 / 与 Home 子页共用的介绍重点
│       ├── projects.yaml         # 项目页文案与项目列表
│       ├── stack.yaml            # Stack 页文案与技能分类
│       ├── blog.yaml             # 博客页与分类
│       ├── bookmarks.yaml        # 书签页、分类与书签
│       ├── quotes.yaml           # 博客/书签空态随机语录
│       └── posts/
│           ├── zh/               # 中文文章 Markdown
│           ├── en/               # 英文文章 Markdown
│           └── img/<文章名>/      # 文章配图
├── src/
│   ├── main.jsx                  # 入口（BrowserRouter）
│   ├── App.jsx                   # 路由与预加载（仅文章页懒加载）
│   ├── admin/                    # 本地内容后台（仅 dev，不参与构建）
│   ├── index.css                 # 全局样式、字体、深色模式
│   ├── pages/                    # 页面组件
│   ├── layouts/                  # HomeLayout（antfu 首页）/ SubpageLayout（onur 子页）/ BlogLayout / BookmarksLayout
│   ├── components/
│   │   ├── site/                 # 侧栏、移动抽屉、按钮、图标、主题语言
│   │   ├── blog/                 # 文章表格、筛选、搜索、骨架
│   │   ├── BlogPage/             # 文章 TOC 与 Markdown 渲染组件
│   │   ├── bookmarks/            # 书签分类栏、卡片与网格
│   │   ├── projects/             # 项目表格
│   │   └── shared/               # PageTitle / SocialIcon / ArrowIcon / ScrollToTop
│   ├── hooks/                    # useTheme / useLanguage
│   ├── styles/                   # blog-post.css / bookmarks.css
│   └── utils/markdown.js         # 读取/解析 Markdown
├── index.html                    # 含 SPA 重定向脚本
└── vite.config.js
```

## 路由

| 页面 | 路由 | 说明 |
|------|------|------|
| 主页 | `/` | 个人介绍、技能、项目、博客精选、联系 |
| 技能 | `/skills` | 技能分类与技术栈 |
| 项目 | `/projects` | 项目作品 |
| 博客 | `/blog` | 文章列表（搜索 Ctrl/Cmd+K、分类 + 标签筛选） |
| 文章详情 | `/blog/:slug` | Markdown 渲染 + 侧边目录 |
| 书签 | `/bookmarks` | 分类列表；桌面右侧空态语录 |
| 书签分类 | `/bookmarks/:slug` | onur 式双列书签卡片 |
| 404 | `*` | 未匹配路径 |

## 配置说明

日常维护**只需要改 `content/` 下的配置和文章**，一般不用动组件代码。内容结构参考 antfu.me 的 `pages/` 组织方式，统一放在 `content/`：

| 文件 | 内容 |
|------|------|
| `content/site.yaml` | 站点信息、个人信息、导航、联系方式、社交链接、页脚（全站共享） |
| `content/pages/home.yaml` | 首页 `/` 与 Home 子页 `/home` 共用的介绍重点 |
| `content/pages/projects.yaml` | `/projects` 页头文案、GitHub 按钮与项目列表 |
| `content/pages/stack.yaml` | `/skills`（Stack）页头文案与技能分类 |
| `content/pages/blog.yaml` | `/blog` 页头与分类 |
| `content/pages/bookmarks.yaml` | `/bookmarks` 页头、分类与书签 |
| `content/pages/quotes.yaml` | 博客/书签空态随机语录 |
| `content/pages/posts/` | 中英文文章与配图 |

多语言字段写成 `{ en: "...", zh: "..." }`；不参与切换的写普通字符串。字段说明见 `src/admin/schema.js`；项目页、Stack 页的 `page` 字段用于页面标题/描述/按钮文案。

### 博客配置 `content/pages/blog.yaml`

分类 id 必须与文章 frontmatter 的 `category` 完全一致（小写）：

| id | 中文标签 | 英文标签 |
|----|----------|----------|
| `tech` | 技术 | Technology |
| `tutorial` | 教程 | Tutorials |
| `thoughts` | 想法 | Thoughts |
| `project` | 项目 | Projects |

> 注意：文章里不要写 `Tutorials`、`Technology` 这类展示文案，要写 id（如 `tutorial`），否则分类筛选点不出来。

### 博客空态语录 `content/pages/quotes.yaml`

`quotes` 下每条包含 `en` / `zh`；进入 `/blog` 或 `/bookmarks` 且未选择条目时，桌面右侧空态会随机显示其中一条，切换语言时显示同一条的对应语言版本。

### 书签配置 `content/pages/bookmarks.yaml`

分类和书签都直接写在这个文件里；改完即生效，无需改组件：

```yaml
page:
  title: { en: Bookmarks, zh: 书签 }
  subtitle: { en: "...", zh: "..." }

categories:
  - slug: frontend            # URL: /bookmarks/frontend
    title: { en: Frontend, zh: 前端 }
    bookmarks:
      - title: MDN Web Docs
        url: https://developer.mozilla.org
        description: { en: "...", zh: "..." }
        cover: /images/bookmarks/mdn.jpg   # 可选，建议 1200×630
```

- `slug` 只能用小写字母、数字和 `-`，且不能重复；
- `title` / `description` 可写双语对象，也可直接写普通字符串；
- 不填 `cover` 或图片加载失败时，卡片会显示域名首字母占位封面；
- 分类列表、右侧书签网格与桌面空态语录都会自动更新。

### 本地内容后台

```bash
pnpm dev
```

打开 http://localhost:5173/admin ，可按区块编辑配置、管理文章、上传图片，右侧实时预览。

- 后台只在 `vite dev` 存在，`pnpm build` 的产物不包含 `admin.html` 与 `src/admin/**`；
- 保存会直接改写 `content/` 下的 YAML 与 `content/pages/posts/**/*.md`，用 git 查看和回滚改动；
- 接口只监听本机回环地址。

## 写博客

### 文件命名

- 中文：`content/pages/posts/zh/yyyy-mm-dd-post-title.md`
- 英文：`content/pages/posts/en/yyyy-mm-dd-post-title-en.md`
- 配图：`content/pages/posts/img/<folder>/<file>`；Markdown 可写 `./img/<folder>/<file>`，会优先按该路径精确匹配；只写文件名时回退到与文章同名的图片文件夹

### Frontmatter 模板

中文和英文分别只写本语言内容，字段与英文版保持一致（字符串，不写 `en/zh` 对象）：

```markdown
---
title: "构建现代个人主页"
excerpt: "使用 React 和 Tailwind CSS 创建精美开发者主页的分步指南。"
category: "tech"              # 必须是 content/pages/blog.yaml categories 里的 id
readTime: "8 分钟阅读"
author: "STYLAN"
tags: ["React", "Tailwind CSS", "Portfolio"]
featured: true                # true 会在文章页显示「精选」标记
---

# 正文从这里开始

支持 GFM 表格、任务列表、代码块语法高亮。
```

英文版放在 `content/pages/posts/en/`，使用相同字段的英文值，例如 `title: "Building a Modern Portfolio Website"`、`readTime: "8 min read"`。

正文里的第一个 `# 一级标题` 会被自动去掉，避免和页面标题重复。

正文支持 LaTeX 公式：行内 `$E = mc^2$`，块级使用 `$$ ... $$`（KaTeX 渲染，仅在含公式的文章按需加载）。

### 视频与图集

````markdown
```video
url: https://www.youtube.com/watch?v=xxxxxxxx
title: 视频标题
```

```carousel
![第一张](./img/my-post/a.jpg "第一张说明")
![第二张](./img/my-post/b.jpg "第二张说明")
```
````

- 视频支持 YouTube / Vimeo / Bilibili / 直链 mp4、webm、ogg；其他地址会回退为普通链接。视频进入视口后才加载，避免阻塞首屏；各平台均显式关闭自动播放。
- 图集每行一张 Markdown 图片，图片路径规则与普通图片一致；`title` 会作为该图说明，滑动/切换时更新。
- 图集为单图循环轮播（Embla，`align: start` + `loop`，与 onur 一致）：每张图片为独立圆角描边卡片，卡片铺满可用宽度、只留 24px 幻灯片间距，接近正文满宽；桌面按钮在图片外侧、移动端叠加在图片内；支持惯性拖拽、触控滑动与键盘方向键，首尾循环切换；后台预览同样支持这两种块。

## 功能特性

- **主题切换**：导航栏太阳/月亮按钮；偏好写入 `localStorage`，首次访问跟随系统
- **语言切换**：导航栏地球图标按钮（侧栏菜单显示图标 + 文字）；博客与书签内容均支持中英文，切换语言会重新加载对应版本
- **博客搜索与筛选**：博客页 `Ctrl/Cmd + K` 按标题/摘要/标签/分类过滤；分类 + 标签文本筛选可组合生效
- **文章目录**：移动端折叠为正文上方的 `<details>`；桌面三栏布局与 onur 一致不显示 TOC
- **LaTeX 公式**：文章支持行内 `$...$` 与块级 `$$...$$`（KaTeX），仅在含公式的文章按需加载
- **书签**：`/bookmarks` 分类栏 + 双列书签卡，空态显示语录；分类与书签在 `bookmarks.yaml` 维护
- **侧栏联系方式**：Online 依次为 GitHub / Email / Bilibili / WeChat / Bluesky；邮箱右侧保持箭头，点击后两张卡片原位叠放、以从左往右的遮罩擦除切换并支持复制，微信带右侧箭头并显示二维码与微信号 `stylan-ai`；不再显示 RSS
- **侧栏页脚**：桌面侧栏底部固定显示 CC BY-NC-SA 4.0、版权与设计参考 `onur.dev`；首页页脚仍指向 antfu/antfu.me
- **移动端首页导航**：右上 Stack/Bookmarks 图标与背景、主题、语言同组；汉堡按钮打开右上浮动选项框，仅列出项目与博客
- **首页签名**：左上 `deqing` 单笔画 SVG，沿用 antfu 的 grow 关键帧，10s 循环按字母路径绘制/擦除；键盘聚焦时完整显示
- **视频与图集**：` ```video ` 支持 YouTube / Vimeo / Bilibili / 直链，` ```carousel ` 支持同位置多图轮播
- **代码块**：rehype-highlight 高亮 + 行号 + 语言标签与 Copy，13px Mono、横向滚动；文章正文容器 768px / 16px / 1.75
- **布局与动效**：首页 antfu 式 65ch 文本流；子页 onur 式侧栏（240/288px）；博客为写作列表栏 + 右侧文章；文章 768px。仅颜色/边框 150ms 过渡，无滚动 Reveal、无磁吸按钮（仅文章页懒加载并空闲预取）
- **RSS**：`pnpm run rss` 或 build 时生成 `public/rss.xml`
- **GitHub Pages SPA**：`public/404.html` + `index.html` 内重定向脚本（spa-github-pages 方案）

## 部署

### GitHub Pages（仓库已配置）

推送 `main` 后，`.github/workflows/deploy.yml` 会：

1. 安装 pnpm 9 + Node 20  
2. `pnpm install --frozen-lockfile`  
3. `pnpm run build`（含 RSS）  
4. 上传 `dist/` 并发布到 GitHub Pages  

本地不要提交 `dist/`（构建产物由 CI 生成）。若工作区里已有被跟踪的 `dist`，建议：

```bash
git rm -r --cached dist
```

并在 `.gitignore` 中增加 `dist`。

### Vercel / Netlify

- 构建命令：`pnpm run build`
- 输出目录：`dist`

## 可用脚本

| 命令 | 作用 |
|------|------|
| `pnpm dev` | 开发服务器 |
| `pnpm build` | 生成 RSS + 生产构建 |
| `pnpm preview` | 预览 `dist` |
| `pnpm rss` | 仅重新生成 `public/rss.xml` |
| `pnpm lint` | ESLint（仓库目前**未附带** eslint 配置与依赖，需自行补上才能用） |

## License

MIT
