---
title:
  en: "Building a Modern Portfolio Website"
  zh: "构建现代个人主页"
excerpt:
  en: "A step-by-step guide to creating a stunning developer portfolio with React and Tailwind CSS."
  zh: "使用 React 和 Tailwind CSS 创建精美开发者主页的分步指南。"
category: "tech"
readTime:
  en: "8 min read"
  zh: "8 分钟阅读"
author:
  en: "STYLAN"
  zh: "STYLAN"
tags: ["React", "Tailwind CSS", "Portfolio"]
featured: true
---

# 构建现代个人主页

## 为什么需要个人主页？

作为一名开发者，拥有一个个人主页是展示你技能和项目的最佳方式。它可以帮助你：

1. **展示你的作品**：让潜在雇主或客户看到你的实际项目
2. **建立个人品牌**：在技术社区中建立你的专业形象
3. **记录学习历程**：作为你技术成长的记录

## 技术栈选择

### React

React 是目前最流行的前端框架之一，它提供了：

- 组件化的开发模式
- 虚拟 DOM 的高效渲染
- 丰富的生态系统

### Tailwind CSS

Tailwind CSS 是一个实用优先的 CSS 框架，它的优势在于：

- 快速开发：无需编写自定义 CSS
- 高度可定制：通过配置文件定制设计系统
- 响应式设计：内置响应式断点

## 项目结构

```txt
portfolio/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   └── index.css
├── public/
│   └── favicon.svg
└── package.json
```

## 核心组件实现

### Header 组件

Header 组件负责导航栏的显示和交互：

```jsx
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-6 py-4">{/* 导航内容 */}</nav>
    </header>
  );
}
```

### Hero 组件

Hero 组件是页面的第一屏，需要吸引用户的注意力：

```jsx
function Hero() {
  return (
    <section className="min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold">Hi, I'm Developer</h1>
        <p className="text-xl text-gray-600 mt-4">
          Full-stack developer passionate about building beautiful web
          applications
        </p>
      </div>
    </section>
  );
}
```

## 响应式设计

使用 Tailwind CSS 的响应式工具类：

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 内容 */}
</div>
```

## 深色模式

添加深色模式支持：

```jsx
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">Hello World</h1>
</div>
```

## 部署

推荐使用以下平台部署：

1. **Vercel**：零配置部署，支持自动 HTTPS
2. **Netlify**：免费托管，支持表单处理
3. **GitHub Pages**：适合静态站点

## 总结

构建一个现代个人主页并不复杂，关键是：

- 选择合适的技术栈
- 注重用户体验
- 保持代码简洁可维护
- 定期更新内容

希望这篇文章对你有所帮助！
![娜娜莉](./img/2026-04-20-building-modern-portfolio/138765453_p0.jpg)
