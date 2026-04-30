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
    // Hero 页面的主标题
    title: {
      en: "Hi, I'm STYLAN",
      zh: "你好，我是STYLAN",
    },
    // Hero 页面的个人简介
    bio: {
      en: "Full-stack developer passionate about building beautiful, performant web applications with modern technologies.",
      zh: "全栈开发者，热衷于使用现代技术构建美观、高性能的 Web 应用。",
    },
  },

  // ==================== 导航链接 ====================
  // href: 页面内锚点 id 或外部链接
  // label: 显示的文字（支持中英文）
  navLinks: [
    { href: "/blog", label: { en: "Blog", zh: "博客" } },
    { href: "#skills", label: { en: "Skills", zh: "技能" } },
    { href: "#projects", label: { en: "Projects", zh: "项目" } },
    { href: "#contact", label: { en: "Contact", zh: "联系" } },
  ],

  // ==================== 行动按钮 ====================
  // Hero 页面下方的两个按钮
  buttons: {
    primary: {
      text: { en: "Get in touch", zh: "联系我" },
      href: "#contact",
    },
    secondary: {
      text: { en: "View projects", zh: "查看项目" },
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
      category: { en: "Frontend", zh: "前端" },
      items: ["React", "Vue", "JavaScript", "HTML", "CSS", "Tailwind CSS"],
    },
    {
      category: { en: "Backend", zh: "后端" },
      items: ["Node.js", "Python", "SQLite", "PostgreSQL", "Redis"],
    },
    {
      category: { en: "Tools", zh: "工具" },
      items: ["Git", "Docker", "OpenCode", "pnpm", "VS Code"],
    },
    {
      category: { en: "Others", zh: "其他" },
      items: ["RAG", "LangChain", "Prompt", "Linux", "Flask", "FastAPI"],
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
      title: { en: "E-Commerce Platform", zh: "电商平台" },
      description: {
        en: "A modern e-commerce platform built with React and Node.js, featuring real-time inventory management.",
        zh: "使用 React 和 Node.js 构建的现代电商平台，具有实时库存管理功能。",
      },
      tags: ["React", "Node.js", "MongoDB"],
      link: "#",
    },
    {
      title: { en: "Task Management App", zh: "任务管理应用" },
      description: {
        en: "Collaborative task management tool with real-time updates and team workspaces.",
        zh: "协作任务管理工具，支持实时更新和团队工作空间。",
      },
      tags: ["Vue", "Firebase", "Tailwind"],
      link: "#",
    },
    {
      title: { en: "AI Dashboard", zh: "AI 仪表盘" },
      description: {
        en: "Analytics dashboard with machine learning insights and data visualization.",
        zh: "具有机器学习洞察和数据可视化的分析仪表盘。",
      },
      tags: ["Python", "TensorFlow", "D3.js"],
      link: "#",
    },
  ],

  // ==================== 联系区块 ====================
  contact: {
    title: { en: "Get in Touch", zh: "联系我" },
    description: {
      en: "I'm always open to new opportunities and collaborations. Feel free to reach out!",
      zh: "我始终对新的机会和合作持开放态度。欢迎联系我！",
    },
    // 邮箱地址
    email: "duan-deqing@foxmail.com",
    // 邮箱按钮文字
    emailButtonText: { en: "Email Me", zh: "发送邮件" },
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
    copyright: "© 2026 Developer. All rights reserved.",
  },
};

export default config;
