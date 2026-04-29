/**
 * config.js - 个人主页配置文件
 *
 * ============================================
 *  只需要修改这个文件即可自定义整个网站！
 * ============================================
 *
 * 使用方法：
 * 1. 修改下面的各项配置
 * 2. 保存文件后刷新页面即可看到效果
 *
 * 多语言配置：
 * - 使用 { en: 'English', zh: '中文' } 格式支持中英文切换
 * - 单语言内容可直接使用字符串
 */

const config = {
  // ========== 网站信息 ==========
  site: {
    title: "STYLAN", // 网站标题（不参与语言切换）
  },

  // ========== 个人信息 ==========
  personal: {
    name: {
      en: "Developer",
      zh: "开发者",
    },
    avatar: "👨‍💻", // 头像 emoji 或图片路径 '/avatar.jpg'
    title: {
      en: "Hi, I'm STYLAN",
      zh: "你好，我是STYLAN",
    },
    bio: {
      en: "Full-stack developer passionate about building beautiful, performant web applications with modern technologies.",
      zh: "全栈开发者，热衷于使用现代技术构建美观、高性能的 Web 应用。",
    },
  },

  // ========== 导航链接 ==========
  navLinks: [
    { href: "#skills", label: { en: "skills", zh: "技能" } },
    { href: "#projects", label: { en: "projects", zh: "项目" } },
    { href: "#contact", label: { en: "contact", zh: "联系" } },
  ],

  // ========== 行动按钮 ==========
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

  // ========== 技能列表 ==========
  skillsSection: {
    title: { en: "Skills & Technologies", zh: "技能与技术" },
  },
  skills: [
    {
      category: { en: "Frontend", zh: "前端" },
      items: ["React", "Vue", "TypeScript", "Tailwind CSS", "Next.js"],
    },
    {
      category: { en: "Backend", zh: "后端" },
      items: ["Node.js", "Python", "Go", "PostgreSQL", "Redis"],
    },
    {
      category: { en: "Tools", zh: "工具" },
      items: ["Git", "Docker", "AWS", "Figma", "VS Code"],
    },
  ],

  // ========== 项目列表 ==========
  projectsSection: {
    title: { en: "Featured Projects", zh: "精选项目" },
  },
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

  // ========== 联系信息 ==========
  contact: {
    title: { en: "Get in Touch", zh: "联系我" },
    description: {
      en: "I'm always open to new opportunities and collaborations. Feel free to reach out!",
      zh: "我始终对新的机会和合作持开放态度。欢迎联系我！",
    },
    email: "duan-deqing@foxmail.com",
    emailButtonText: { en: "Email Me", zh: "发送邮件" },
  },

  // ========== 社交链接 ==========
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/duan-deqing" },
    { platform: "Bilibili", url: "https://space.bilibili.com/18756460" },
    { platform: "Twitter", url: "https://twitter.com/yourusername" },
  ],

  // ========== 页脚信息（不参与语言切换）==========
  footer: {
    copyright: "© 2026 Developer. All rights reserved.",
  },
};

export default config;
