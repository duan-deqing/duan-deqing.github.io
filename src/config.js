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
    // 浏览器标签页标题: 显示在浏览器标签上
    pageTitle: "STYLAN · 主页",
    // 浏览器标签页图标: 使用图片路径 '/favicon.svg' 或 '/favicon.ico'
    favicon: "/favicon.ico",
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
      { en: "AI Application Developer", zh: "AI 应用开发工程师" },
      { en: "LLM & RAG Practitioner", zh: "LLM & RAG 实践者" },
    ],
    // 标签描述（显示在标签下方）
    tagDescription: {
      en: "LangChain · Qwen · Vector Database",
      zh: "LangChain · 通义千问 · 向量数据库",
    },
    // Hero 页面的个人简介
    bio: {
      en: "Full-stack developer passionate about building beautiful, performant web applications with modern technologies.",
      zh: "全栈开发者，热衷于使用现代技术构建美观、高性能的 Web 应用。",
    },
    // Hero 右侧展示区域
    // type: 'image' | 'svg' | 'code' | 'wave' | 'rays'
    heroRight: {
      // Wave 动画（等高线效果）
      type: "wave",
      width: 500,
      height: 400,
      lines: 30,
      color: "#3b82f6", // 蓝色

      // 示例1: 图片（取消注释使用）
      // type: 'image',
      // src: '/images/hero-illustration.png',
      // alt: { en: 'Hero illustration', zh: '主视觉插图' },

      // 示例2: SVG 动画（取消注释使用）
      // type: 'svg',
      // content: `<svg>...</svg>`,

      // 示例3: 代码展示（取消注释使用）
      // type: 'code',
      // code: `console.log('Hello World')`,
      // language: 'javascript',

      // 示例4: Rays 光线动画（取消注释使用）
      // type: 'rays',
      // color: '#ffffff',
      // opacity: 0.1,
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
      items: ["RAG", "LangChain", "Prompt", "FAISS", "Flask", "FastAPI"],
    },
    {
      category: { en: "Frontend", zh: "前端" },
      items: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS"],
    },
    {
      category: { en: "Backend", zh: "后端" },
      items: ["Python", "Node.js", "SQLite", "PostgreSQL", "Redis"],
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
      title: { en: "LangChain RAG Project", zh: "LangChain RAG Demo" },
      description: {
        en: "LangChain + Tongyi Qianwen's RAG question-answering system supports intelligent question answering with local knowledge bases, automatic document refresh, and automatic vector library management.",
        zh: "LangChain + 通义千问打造的 RAG 问答系统，支持本地知识库智能问答、文档自动刷新与向量库自动管理。",
      },
      tags: ["Python", "LangChain", "Chroma"],
      link: "https://github.com/duan-deqing/langchain_rag_easy_demo",
    },
    {
      title: { en: "<project-title>", zh: "<项目名称>" },
      description: {
        en: "<project-intro>",
        zh: "<项目简介>",
      },
      tags: ["Python", "LangChain", "Chroma"],
      link: "<project-link>",
    },
  ],

  // ==================== 联系区块 ====================
  contact: {
    title: { en: "Get in Touch", zh: "联系我" },
    description: {
      en: "I am always open to new opportunities and look forward to hearing from you. Any ideas for collaboration are welcome.",
      zh: "持续拥抱新机遇，期待你的消息，任何合作想法都欢迎。",
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
    image: "/images/contact-illustration.png",
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
