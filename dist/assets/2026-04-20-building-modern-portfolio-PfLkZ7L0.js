var e=`---\r
title:\r
  en: "Building a Modern Portfolio Website"\r
  zh: "构建现代个人主页"\r
excerpt:\r
  en: "A step-by-step guide to creating a stunning developer portfolio with React and Tailwind CSS."\r
  zh: "使用 React 和 Tailwind CSS 创建精美开发者主页的分步指南。"\r
category: "tech"\r
readTime:\r
  en: "8 min read"\r
  zh: "8 分钟阅读"\r
author:\r
  en: "STYLAN"\r
  zh: "STYLAN"\r
tags: ["React", "Tailwind CSS", "Portfolio"]\r
featured: true\r
---\r
\r
# 构建现代个人主页\r
\r
## 为什么需要个人主页？\r
\r
作为一名开发者，拥有一个个人主页是展示你技能和项目的最佳方式。它可以帮助你：\r
\r
1. **展示你的作品**：让潜在雇主或客户看到你的实际项目\r
2. **建立个人品牌**：在技术社区中建立你的专业形象\r
3. **记录学习历程**：作为你技术成长的记录\r
\r
## 技术栈选择\r
\r
### React\r
\r
React 是目前最流行的前端框架之一，它提供了：\r
\r
- 组件化的开发模式\r
- 虚拟 DOM 的高效渲染\r
- 丰富的生态系统\r
\r
### Tailwind CSS\r
\r
Tailwind CSS 是一个实用优先的 CSS 框架，它的优势在于：\r
\r
- 快速开发：无需编写自定义 CSS\r
- 高度可定制：通过配置文件定制设计系统\r
- 响应式设计：内置响应式断点\r
\r
## 项目结构\r
\r
\`\`\`txt\r
portfolio/\r
├── src/\r
│   ├── components/\r
│   │   ├── Header.jsx\r
│   │   ├── Hero.jsx\r
│   │   ├── Skills.jsx\r
│   │   ├── Projects.jsx\r
│   │   ├── Contact.jsx\r
│   │   └── Footer.jsx\r
│   ├── App.jsx\r
│   └── index.css\r
├── public/\r
│   └── favicon.svg\r
└── package.json\r
\`\`\`\r
\r
## 核心组件实现\r
\r
### Header 组件\r
\r
Header 组件负责导航栏的显示和交互：\r
\r
\`\`\`jsx\r
function Header() {\r
  const [isMenuOpen, setIsMenuOpen] = useState(false);\r
\r
  return (\r
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md">\r
      <nav className="max-w-6xl mx-auto px-6 py-4">{/* 导航内容 */}</nav>\r
    </header>\r
  );\r
}\r
\`\`\`\r
\r
### Hero 组件\r
\r
Hero 组件是页面的第一屏，需要吸引用户的注意力：\r
\r
\`\`\`jsx\r
function Hero() {\r
  return (\r
    <section className="min-h-screen flex items-center">\r
      <div className="max-w-4xl mx-auto px-6">\r
        <h1 className="text-5xl font-bold">Hi, I'm Developer</h1>\r
        <p className="text-xl text-gray-600 mt-4">\r
          Full-stack developer passionate about building beautiful web\r
          applications\r
        </p>\r
      </div>\r
    </section>\r
  );\r
}\r
\`\`\`\r
\r
## 响应式设计\r
\r
使用 Tailwind CSS 的响应式工具类：\r
\r
\`\`\`jsx\r
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\r
  {/* 内容 */}\r
</div>\r
\`\`\`\r
\r
## 深色模式\r
\r
添加深色模式支持：\r
\r
\`\`\`jsx\r
<div className="bg-white dark:bg-gray-900">\r
  <h1 className="text-gray-900 dark:text-white">Hello World</h1>\r
</div>\r
\`\`\`\r
\r
## 部署\r
\r
推荐使用以下平台部署：\r
\r
1. **Vercel**：零配置部署，支持自动 HTTPS\r
2. **Netlify**：免费托管，支持表单处理\r
3. **GitHub Pages**：适合静态站点\r
\r
## 总结\r
\r
构建一个现代个人主页并不复杂，关键是：\r
\r
- 选择合适的技术栈\r
- 注重用户体验\r
- 保持代码简洁可维护\r
- 定期更新内容\r
\r
希望这篇文章对你有所帮助！\r
![娜娜莉](./img/2026-04-20-building-modern-portfolio/138765453_p0.jpg)\r
`;export{e as default};
//# sourceMappingURL=2026-04-20-building-modern-portfolio-PfLkZ7L0.js.map