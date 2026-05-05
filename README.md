# STYLAN Developer Portfolio

简约现代风格的程序员个人主页，支持浅色/深色主题切换、中英文切换，以及 Markdown 博客系统。

![主页图片](./public/images/1_1_main-page.png)

## 技术栈

- **前端框架**：React 19
- **构建工具**：Vite
- **样式方案**：Tailwind CSS v4
- **路由**：React Router v7
- **字体**：Noto Sans SC + Roboto + Fira Code
- **Markdown**：react-markdown + rehype-highlight + remark-gfm
- **动画**：自定义 Wave、Dots、Rays 动画组件

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build

# 预览生产版本
pnpm run preview
```

## 项目结构

```txt
├── public/
│   ├── fonts/                    # 字体文件
│   ├── images/                   # 图片资源
│   ├── favicon.ico               # 网站图标
│   └── rss.xml                   # RSS 订阅
├── src/
│   ├── config.js                 # 主站配置文件
│   ├── blogConfig.js             # 博客配置文件
│   ├── theme.js                  # 主题颜色配置
│   ├── index.css                 # 全局样式和主题
│   ├── App.jsx                   # 路由配置
│   ├── main.jsx                  # 应用入口
│   ├── pages/                    # 页面组件
│   │   ├── HomePage.jsx          # 主页
│   │   ├── SkillsPage.jsx        # 技能页面
│   │   ├── ProjectsPage.jsx      # 项目页面
│   │   ├── BlogPage.jsx          # 博客列表页
│   │   ├── BlogPostPage.jsx      # 博客文章详情页
│   │   ├── ContactPage.jsx       # 联系页面
│   │   └── NotFoundPage.jsx      # 404 页面
│   ├── components/               # 组件
│   │   ├── shared/               # 通用组件
│   │   │   ├── PageHeader.jsx    # 通用导航栏
│   │   │   ├── PageFooter.jsx    # 通用页脚
│   │   │   ├── PageTitle.jsx     # 页面标题
│   │   │   └── Loading.jsx       # 加载动画
│   │   ├── HomePage/             # 主页组件
│   │   │   ├── Hero.jsx          # 个人介绍（含打字机效果）
│   │   │   ├── Skills.jsx        # 技能展示
│   │   │   ├── Projects.jsx      # 项目展示
│   │   │   ├── BlogSection.jsx   # 博客精选
│   │   │   ├── Contact.jsx       # 联系方式
│   │   │   ├── AnimatedText.jsx  # 动画文字
│   │   │   ├── TypewriterText.jsx # 打字机效果
│   │   │   ├── WaveAnimation.jsx # 波浪动画
│   │   │   ├── DotsAnimation.jsx # 点阵动画
│   │   │   └── RaysAnimation.jsx # 光线动画
│   │   └── BlogPage/             # 博客组件
│   │       ├── BlogHero.jsx      # 博客标题
│   │       ├── BlogSearch.jsx    # 博客搜索
│   │       ├── CategoryFilter.jsx # 分类筛选
│   │       ├── BlogList.jsx      # 文章列表
│   │       ├── BlogPost.jsx      # 文章卡片
│   │       └── TableOfContents.jsx # 目录导航
│   ├── posts/                    # 博客文章（中文）
│   │   ├── en/                   # 博客文章（英文）
│   │   └── img/                  # 文章图片
│   ├── hooks/                    # 自定义 Hooks
│   │   ├── useTheme.js           # 主题切换
│   │   └── useLanguage.js        # 语言切换
│   └── utils/                    # 工具函数
│       └── markdown.js           # Markdown 解析
└── vite.config.js                # Vite 配置
```

## 配置说明

### 主站配置（src/config.js）

```js
const config = {
  site: {
    title: "STYLAN",
    pageTitle: "STYLAN · 主页",
    favicon: "/favicon.ico",
  },
  personal: {
    name: { en: "STYLAN", zh: "STYLAN" },
    avatar: "👨‍💻",
    titlePrefix: { en: "Hi, I'm", zh: "你好，我是" },
    titleName: { en: "STYLAN", zh: "STYLAN" },
    bio: { en: "Full-stack developer...", zh: "全栈开发者..." },
    tags: [
      { en: "AI Application Developer", zh: "AI 应用开发工程师" },
      { en: "LLM & RAG Practitioner", zh: "LLM & RAG 实践者" },
    ],
    tagDescription: {
      en: "LangChain · Qwen · Vector Database",
      zh: "LangChain · 通义千问 · 向量数据库",
    },
    heroRight: {
      type: "wave",  // 'image' | 'svg' | 'code' | 'wave' | 'dots' | 'rays'
      width: 500,
      height: 500,
      color: "#3b82f6",
    },
  },
  navLinks: [
    { href: "/skills", label: { en: "skills", zh: "技能" } },
    { href: "/projects", label: { en: "projects", zh: "项目" } },
    { href: "/blog", label: { en: "blog", zh: "博客" } },
    { href: "/contact", label: { en: "contact", zh: "联系" } },
  ],
  // ... 更多配置
};
```

### 主题配置（src/theme.js）

```js
const theme = {
  nav: {
    brand: { light: 'text-black', dark: 'dark:text-white' },
    link: { light: 'text-gray-700', dark: 'dark:text-gray-300' },
  },
  // ... 更多颜色配置
};
```

## 页面结构

| 页面 | 路由 | 说明 |
|------|------|------|
| 主页 | `/` | 个人介绍、技能、项目、博客精选、联系 |
| 技能 | `/skills` | 技能分类和技术栈展示 |
| 项目 | `/projects` | 项目作品展示 |
| 博客 | `/blog` | 博客文章列表，支持搜索和分类筛选 |
| 联系 | `/contact` | 联系方式和简历下载 |
| 404 | `*` | 404 错误页面 |

## 博客系统

### 创建新文章

在 `src/posts/` 目录下创建 Markdown 文件：

**文件命名规范**：`yyyy-mm-dd-post-title.md`

**中文文章**：`src/posts/2026-05-01-my-new-post.md`
**英文文章**：`src/posts/en/2026-05-01-my-new-post-en.md`

### 文章格式

```markdown
---
title:
  en: "English Title"
  zh: "中文标题"
excerpt:
  en: "English excerpt"
  zh: "中文摘要"
category: "tutorial"
readTime:
  en: "5 min read"
  zh: "5 分钟阅读"
author:
  en: "Author Name"
  zh: "作者名称"
tags: ["React", "JavaScript"]
featured: true
---

## 文章正文内容

这里是 Markdown 格式的正文内容...
```

### 支持的分类

- `tech` - 技术文章
- `tutorial` - 教程
- `thoughts` - 想法/随笔
- `project` - 项目相关

## 功能特性

### 主题切换

- 点击导航栏右侧的太阳/月亮图标切换主题
- 主题偏好自动保存到 localStorage
- 首次访问时跟随系统主题

### 语言切换

- 点击导航栏右侧的「中文」/「EN」按钮切换语言
- 语言偏好自动保存到 localStorage
- 博客文章根据语言自动切换中英文版本

### 动画效果

- **Wave 动画**：使用 Perlin 噪声生成的波浪效果，支持鼠标交互
- **Dots 动画**：点阵效果，鼠标靠近时点会被推开
- **Rays 动画**：彩色渐变光线效果
- **打字机效果**：标题逐字显示，每 5 秒循环

### 博客功能

- Markdown 渲染（支持 GFM 语法）
- 代码语法高亮
- Mac 风格代码块
- 文章分类筛选
- 博客搜索（Ctrl+K）
- 响应式布局

## 自定义

### 修改颜色

编辑 `src/theme.js` 修改各组件颜色：

```js
const theme = {
  nav: {
    brand: { light: 'text-black', dark: 'dark:text-white' },
    // ...
  },
  // ...
};
```

### 修改 Hero 右侧展示

编辑 `src/config.js` 中的 `heroRight` 配置：

```js
heroRight: {
  type: "wave",  // 可选: 'image' | 'svg' | 'code' | 'wave' | 'dots' | 'rays'
  // 根据 type 设置相应参数
}
```

## 部署

### Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### Netlify

1. 将代码推送到 GitHub
2. 在 Netlify 中导入项目
3. 设置构建命令：`pnpm run build`
4. 设置发布目录：`dist`

### GitHub Pages

```bash
# 构建
pnpm run build

# 部署到 GitHub Pages
# 将 dist 目录推送到 gh-pages 分支
```

## License

MIT
