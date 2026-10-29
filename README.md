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
| Frontmatter | front-matter |
| RSS | feed（`scripts/generate-rss.js`） |
| 包管理 | pnpm |
| 部署 | GitHub Pages（Actions 自动构建） |

字体：自托管 [Geist Sans / Geist Mono](https://vercel.com/font)（`public/fonts/*.woff2`，SIL OFL 1.1），中文回退到 `PingFang SC` / `Microsoft YaHei` 等系统字体；不请求第三方字体服务。

设计：首页参考 [antfu.me](https://github.com/antfu/antfu.me) 的 65ch 文本流，博客/项目/技能/联系与后台参考 [onur.dev](https://github.com/suyalcinkaya/onur.dev) 的侧栏与表格体系；完整令牌与规则见 `DESIGN.md`。

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
├── src/
│   ├── main.jsx                  # 入口（BrowserRouter）
│   ├── App.jsx                   # 路由与懒加载
│   ├── content/
│   │   ├── site.yaml             # 全站内容配置
│   │   ├── blog.yaml             # 博客页面与分类配置
│   │   └── quotes.yaml           # 博客空态随机语录（中英双语）
│   ├── admin/                    # 本地内容后台（仅 dev，不参与构建）
│   ├── index.css                 # 全局样式、字体、深色模式
│   ├── pages/                    # 页面组件
│   ├── layouts/                  # HomeLayout（antfu 首页）/ SubpageLayout（onur 子页）
│   ├── components/
│   │   ├── site/                 # 侧栏、移动抽屉、按钮、图标、主题语言
│   │   ├── blog/                 # 文章表格、筛选、搜索、骨架
│   │   ├── BlogPage/             # 文章 TOC 与 Markdown 渲染组件
│   │   ├── projects/             # 项目表格
│   │   ├── contact/              # 微信二维码弹窗
│   │   └── shared/               # PageTitle / SocialIcon / ArrowIcon / ScrollToTop
│   ├── posts/                    # 中文文章 Markdown
│   │   ├── en/                   # 英文文章
│   │   └── img/<文章名>/          # 文章配图
│   ├── hooks/                    # useTheme / useLanguage
│   ├── styles/blog-post.css      # 文章页专属样式
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
| 联系 | `/contact` | 联系方式、微信二维码、简历下载 |
| 404 | `*` | 未匹配路径 |

## 配置说明

日常维护**只需要改配置文件和文章**，一般不用动组件代码。

### 内容配置 `src/content/site.yaml`

可改内容：站点信息、个人信息、导航、关于、技能、项目、联系、社交链接、页脚。

多语言字段写成 `{ en: "...", zh: "..." }`；不参与切换的写普通字符串。字段说明见 `src/admin/schema.js`。

### 博客配置 `src/content/blog.yaml`

分类 id 必须与文章 frontmatter 的 `category` 完全一致（小写）：

| id | 中文标签 | 英文标签 |
|----|----------|----------|
| `tech` | 技术 | Technology |
| `tutorial` | 教程 | Tutorials |
| `thoughts` | 想法 | Thoughts |
| `project` | 项目 | Projects |

> 注意：文章里不要写 `Tutorials`、`Technology` 这类展示文案，要写 id（如 `tutorial`），否则分类筛选点不出来。

### 博客空态语录 `src/content/quotes.yaml`

`quotes` 下每条包含 `en` / `zh`；进入 `/blog` 且未选择文章时，桌面右侧空态会随机显示其中一条，切换语言时显示同一条的对应语言版本。

### 本地内容后台

```bash
pnpm dev
```

打开 http://localhost:5173/admin ，可按区块编辑配置、管理文章、上传图片，右侧实时预览。

- 后台只在 `vite dev` 存在，`pnpm build` 的产物不包含 `admin.html` 与 `src/admin/**`；
- 保存会直接改写 `src/content/*.yaml` 与 `src/posts/**/*.md`，用 git 查看和回滚改动；
- 接口只监听本机回环地址。

## 写博客

### 文件命名

- 中文：`src/posts/zh/yyyy-mm-dd-post-title.md`
- 英文：`src/posts/en/yyyy-mm-dd-post-title-en.md`
- 配图：`src/posts/img/<folder>/<file>`；Markdown 可写 `./img/<folder>/<file>`，会优先按该路径精确匹配；只写文件名时回退到与文章同名的图片文件夹

### Frontmatter 模板

中文和英文分别只写本语言内容，字段与英文版保持一致（字符串，不写 `en/zh` 对象）：

```markdown
---
title: "构建现代个人主页"
excerpt: "使用 React 和 Tailwind CSS 创建精美开发者主页的分步指南。"
category: "tech"              # 必须是 blog.yaml categories 里的 id
readTime: "8 分钟阅读"
author: "STYLAN"
tags: ["React", "Tailwind CSS", "Portfolio"]
featured: true                # true 会在文章页显示「精选」标记
---

# 正文从这里开始

支持 GFM 表格、任务列表、代码块语法高亮。
```

英文版放在 `src/posts/en/`，使用相同字段的英文值，例如 `title: "Building a Modern Portfolio Website"`、`readTime: "8 min read"`。

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

- 视频支持 YouTube / Vimeo / Bilibili / 直链 mp4、webm、ogg；其他地址会回退为普通链接。视频进入视口后才加载，避免阻塞首屏。
- 图集每行一张 Markdown 图片，图片路径规则与普通图片一致；`title` 会作为该图说明，滑动/切换时更新。
- 图集为单图轮播：每张图片为独立圆角描边卡片，卡片铺满可用宽度、只留 24px 幻灯片间距，接近正文满宽；桌面按钮在图片外侧、移动端叠加在图片内；支持鼠标拖拽、触控滑动与键盘方向键；后台预览同样支持这两种块。

## 功能特性

- **主题切换**：导航栏太阳/月亮按钮；偏好写入 `localStorage`，首次访问跟随系统
- **语言切换**：导航栏「中文 / EN」；博客中英文分目录存放，切换语言会重新加载对应版本
- **博客搜索与筛选**：博客页 `Ctrl/Cmd + K` 按标题/摘要/标签/分类过滤；分类 + 标签文本筛选可组合生效
- **文章目录**：移动端折叠为正文上方的 `<details>`；桌面三栏布局与 onur 一致不显示 TOC
- **LaTeX 公式**：文章支持行内 `$...$` 与块级 `$$...$$`（KaTeX），仅在含公式的文章按需加载
- **视频与图集**：` ```video ` 支持 YouTube / Vimeo / Bilibili / 直链，` ```carousel ` 支持同位置多图轮播
- **代码块**：rehype-highlight 高亮 + 行号 + 语言标签与 Copy，13px Mono、横向滚动；文章正文容器 768px / 16px / 1.75
- **布局与动效**：首页 antfu 式 65ch 文本流；子页 onur 式侧栏（240/288px）；博客为写作列表栏 + 右侧文章；文章 768px。仅颜色/边框 150ms 过渡，无滚动 Reveal、无磁吸按钮（子页懒加载）
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
