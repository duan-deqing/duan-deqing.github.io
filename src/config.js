/**
 * ============================================================================
 *  config.js - 个人主页配置文件
 * ============================================================================
 *
 * 【使用说明】
 * 只需要修改这个文件即可自定义整个网站的内容！
 *
 * 【多语言配置】
 * - 支持中英文的对象格式: { en: 'English', zh: '中文' }
 * - 不参与语言切换的内容直接使用字符串
 *
 * 【配置项说明】
 * - site: 网站基本信息（标题等）
 * - personal: 个人资料（名字、头像、标题、简介）
 * - navLinks: 导航栏链接列表
 * - buttons: Hero 页面的行动按钮
 * - skillsSection: 技能区块的标题
 * - skills: 技能分类和技能项列表
 * - projectsSection: 项目区块的标题
 * - projects: 项目作品列表
 * - contact: 联系方式区块的内容
 * - socialLinks: 社交媒体链接
 * - footer: 页脚信息
 * ============================================================================
 */

const config = {
  // ==================== 网站信息 ====================
  // 网站标题，显示在导航栏左侧，不参与语言切换
  site: {
    title: "STYLAN",
    // 浏览器标签页标题（统一使用 “STYLAN · ” 前缀）
    pageTitle: "STYLAN · Portfolio",
    // 浏览器标签页图标: 使用图片路径 '/favicon.svg' 或 '/favicon.ico'
    favicon: "/favicon.ico",
    // SEO：站点描述与关键词（会写入 meta description / keywords / OG）
    description: {
      en: "STYLAN's portfolio: AI application developer focused on LLM and RAG. Skills, projects, blog, and contact.",
      zh: "STYLAN 的个人主页：AI 应用开发工程师，专注 LLM 落地与 RAG 系统。技能、项目、技术博客与联系方式。",
    },
    keywords:
      "STYLAN, 个人主页, Portfolio, AI, LLM, RAG, LangChain, React, 全栈开发, 博客",
    url: "https://duan-deqing.github.io",
    ogImage: "/images/1_1_main-page.jpg",
  },

  // ==================== 个人信息 ====================
  personal: {
    // 你的名字
    name: {
      en: "STYLAN",
      zh: "STYLAN",
    },
    // 头像: 使用 emoji 或图片路径 '/avatar.jpg'
    avatar: "👨‍💻",
    // Hero 页面的主标题 - 前缀（小字）
    titlePrefix: {
      en: "Hi, I'm",
      zh: "你好，我是",
    },
    // Hero 页面的主标题 - 名字（大字）
    titleName: {
      en: "STYLAN",
      zh: "STYLAN",
    },
    // 个人标签卡片（显示在简介上方）
    // 每个标签支持中英文，用 | 分隔不同标签组
    tags: [
      { en: "AI Application Developer", zh: "AI 应用开发" },
      { en: "LLM & RAG", zh: "LLM & RAG" },
    ],
    // 标签描述（显示在标签下方）
    tagDescription: {
      en: "LangChain · Vector DB · Full-stack",
      zh: "LangChain · 向量库 · 全栈",
    },
    // Hero 页面的个人简介
    bio: {
      en: "AI application developer focused on LLM products and RAG systems. I turn models into reliable tools with clear interfaces.",
      zh: "AI 应用开发，专注大模型产品与 RAG 系统。用清晰的界面，把模型做成可靠的工具。",
    },
    // Hero 右侧展示区域（legacy：当前首页由 SiteRail 承担身份区，此项暂不渲染）
    // type: 'image' | 'svg' | 'code' | 'wave' | 'dots' | 'rays'
    heroRight: {
      // Wave 动画（legacy）
      type: "wave",
      width: 500,
      height: 500,
      color: "#3b82f6",

      // 示例1: 图片（取消注释使用）
      // type: 'image',
      // src: '/images/hero-illustration.png',
      // alt: { en: 'Hero illustration', zh: '主视觉插图' },

      // 示例2: 光线动画（取消注释使用）
      // type: "rays",
      // colors: ['#00F8F1', '#FFBD1E', '#FE848F', '#FFBD1E', '#00F8F1'],
      // opacity: 1,
      // speed: 0.5,

      // 示例3: 点阵动画（取消注释使用）
      // type: "dots",
      // color: "#9ca3af",
      // radius: 3,
      // margin: 20,

      // 示例4: SVG 动画（取消注释使用）
      // type: 'svg',
      // content: `<svg>...</svg>`,

      // 示例5: 代码展示（取消注释使用）
      // type: 'code',
      // code: `console.log('Hello World')`,
      // language: 'javascript',
    },
  },

  // ==================== 导航链接 ====================
  // href: 页面路由路径或页面内锚点 id
  // label: 显示的文字（支持中英文）
  navLinks: [
    { href: "/skills", label: { en: "skills", zh: "技能" } },
    { href: "/projects", label: { en: "projects", zh: "项目" } },
    { href: "/blog", label: { en: "blog", zh: "博客" } },
    { href: "/contact", label: { en: "contact", zh: "联系" } },
  ],

  // 首页左轨锚点（Neo Editorial 编号章节）
  homeSections: [
    { id: "about", num: "01", label: { en: "About", zh: "关于" } },
    { id: "work", num: "02", label: { en: "Work", zh: "项目" } },
    { id: "writing", num: "03", label: { en: "Writing", zh: "文章" } },
    { id: "skills", num: "04", label: { en: "Skills", zh: "技能" } },
    { id: "contact", num: "05", label: { en: "Contact", zh: "联系" } },
  ],

  // ==================== About 方向列表 ====================
  about: {
    focus: [
      { en: "LLM applications", zh: "大模型应用" },
      { en: "RAG systems", zh: "RAG 检索增强" },
      { en: "Full-stack delivery", zh: "全栈交付" },
      { en: "Design-aware engineering", zh: "有设计感的工程" },
    ],
  },

  // ==================== 行动按钮 ====================
  // Hero 页面下方的两个按钮
  buttons: {
    primary: {
      text: { en: "CONTACT", zh: "联系" },
      href: "/contact",
    },
    secondary: {
      text: { en: "PROJECTS", zh: "项目" },
      href: "#projects",
    },
  },

  // ==================== 技能区块 ====================
  // 区块标题
  skillsSection: {
    title: { en: "Skills & Technologies", zh: "技能与技术" },
  },
  // 技能列表: 按分类展示技术栈
  // category: 分类名称
  // items: 技术栈数组
  skills: [
    {
      category: { en: "AI", zh: "人工智能" },
      items: ["RAG", "LangChain", "Prompt"],
    },
    {
      category: { en: "Frontend", zh: "前端" },
      items: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS"],
    },
    {
      category: { en: "Backend", zh: "后端" },
      items: ["Python", "Flask", "FastAPI", "Node.js"],
    },
    {
      category: { en: "Data", zh: "数据" },
      items: ["SQLite", "FAISS", "Vector DB"],
    },
    {
      category: { en: "Tools", zh: "工具" },
      items: ["OpenCode", "Git", "Docker", "pnpm", "VS Code", "Markdown"],
    },
    {
      category: { en: "Hobbies", zh: "爱好" },
      items: ["Gaming", "Music", "Animation", "Computer", "Tech", "ACG"],
    },
  ],

  // ==================== 项目区块 ====================
  // 区块标题
  projectsSection: {
    title: { en: "Featured Projects", zh: "精选项目" },
  },
  // 项目列表
  // title: 项目名称
  // description: 项目描述
  // tags: 技术标签数组
  // link: 项目链接（GitHub 或在线演示）
  projects: [
    {
      title: { en: "ZensheetCV", zh: "ZensheetCV" },
      description: {
        en: "Online Markdown resume editor with live preview — write a clean CV in Markdown and export it anytime.",
        zh: "在线 Markdown 简历编辑器，支持实时预览，用 Markdown 写出干净利落的简历并随时导出。",
      },
      tags: ["React", "Markdown", "Tailwind CSS"],
      link: "https://duan-deqing.github.io/zensheetCV/#/",
    },
    {
      title: { en: "ArtVault", zh: "ArtVault" },
      description: {
        en: "A personal art vault for collecting and showcasing works — browse, organize, and present creative pieces in a calm gallery UI.",
        zh: "个人艺术作品库：收集与展示作品，用克制的画廊界面浏览、整理与呈现创作内容。",
      },
      tags: ["React", "Vite", "Tailwind CSS"],
      link: "https://stylan-artvault.vercel.app/",
    },
  ],

  // ==================== 联系区块 ====================
  contact: {
    title: { en: "Get in touch", zh: "联系我" },
    description: {
      en: "Open to new opportunities and collaborations. Drop a line anytime.",
      zh: "持续拥抱新机会，欢迎随时联系，聊聊合作或想法。",
    },
    // 邮箱地址
    email: "duan-deqing@foxmail.com",
    // 邮箱按钮文字
    emailButtonText: { en: "Email Me", zh: "发送邮件" },
  },

  // ==================== 联系页面 ====================
  contactPage: {
    // 页面标题
    title: { en: "CONTACT", zh: "联系" },
    // 返回主页链接文字
    backToHome: { en: "BACK TO HOME", zh: "返回主页" },
    // 页面描述
    description: {
      en: "I'd love to hear from you! Whether you have a question, a project idea, or just want to say hello, feel free to reach out.",
      zh: "很高兴收到你的来信！无论你有问题、项目想法，还是只想打个招呼，都欢迎联系我。",
    },
    // 联系方式列表
    contactMethods: [
      {
        icon: "email",
        label: { en: "Email", zh: "邮箱" },
        value: "duan-deqing@foxmail.com",
        href: "mailto:duan-deqing@foxmail.com",
      },
      {
        icon: "github",
        label: { en: "GitHub", zh: "GitHub" },
        value: "duan-deqing",
        href: "https://github.com/duan-deqing",
      },
      {
        icon: "bilibili",
        label: { en: "Bilibili", zh: "B站" },
        value: "-stylan-",
        href: "https://space.bilibili.com/18756460",
      },
      {
        icon: "wechat",
        label: { en: "WeChat", zh: "微信" },
        value: "-stylan-",
        href: null,
        qrcode: "/images/wechat-qrcode.png",
      },
    ],
    image: "/images/contact-illustration.jpg",
  },

  // ==================== 社交链接 ====================
  // 显示在联系区块下方
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/duan-deqing" },
    { platform: "Bilibili", url: "https://space.bilibili.com/18756460" },
    // { platform: "Twitter", url: "https://twitter.com/yourusername" },
  ],

  // ==================== 页脚信息 ====================
  // 不参与语言切换
  footer: {
    copyright: "© 2026 STYLAN. All rights reserved.",
  },
};

export default config;
