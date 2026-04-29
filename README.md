# 程序员个人主页

简约现代风格的程序员个人主页，支持浅色/深色主题切换和中英文切换。

## 技术栈

- React 19
- Vite
- Tailwind CSS v4
- Geist 字体（Geist Pixel + Geist Mono）

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
├── public/
│   └── fonts/                 # 字体文件
│       ├── GeistPixel-Square.woff2
│       ├── GeistMono-Regular.woff2
│       ├── GeistMono-Medium.woff2
│       └── GeistMono-Bold.woff2
├── src/
│   ├── config.js              # ⭐ 配置文件（修改这里自定义网站）
│   ├── index.css              # 全局样式、字体和主题配置
│   ├── App.jsx                # 主入口，组合所有区块
│   ├── hooks/
│   │   ├── useTheme.js        # 主题切换逻辑
│   │   └── useLanguage.js     # 语言切换逻辑
│   └── components/
│       ├── Header.jsx         # 顶部导航栏
│       ├── Hero.jsx           # 个人介绍区块
│       ├── Skills.jsx         # 技能展示区块
│       ├── Projects.jsx       # 项目作品区块
│       ├── Contact.jsx        # 联系方式区块
│       └── Footer.jsx         # 页脚
```

## 配置说明

**只需要修改 `src/config.js` 即可自定义整个网站！**

### 多语言配置

所有文本内容都支持中英文切换，使用对象格式：

```js
// 支持中英文
title: {
  en: 'Portfolio',
  zh: '作品集',
}

// 单语言内容可直接使用字符串
avatar: '👨‍💻'
```

### 网站信息

```js
site: {
  title: { en: 'Portfolio', zh: '作品集' },
}
```

### 个人信息

```js
personal: {
  name: { en: 'Developer', zh: '开发者' },
  avatar: '👨‍💻',  // 头像 emoji 或图片路径 '/avatar.jpg'
  title: { en: "Hi, I'm Developer", zh: '你好，我是开发者' },
  bio: { 
    en: 'Full-stack developer...', 
    zh: '全栈开发者...' 
  },
}
```

### 导航链接

```js
navLinks: [
  { href: '#skills', label: { en: 'Skills', zh: '技能' } },
  { href: '#projects', label: { en: 'Projects', zh: '项目' } },
  { href: '#contact', label: { en: 'Contact', zh: '联系' } },
]
```

### 行动按钮

```js
buttons: {
  primary: { text: { en: 'Get in touch', zh: '联系我' }, href: '#contact' },
  secondary: { text: { en: 'View projects', zh: '查看项目' }, href: '#projects' },
}
```

### 技能列表

```js
skillsSection: {
  title: { en: 'Skills & Technologies', zh: '技能与技术' },
},
skills: [
  {
    category: { en: 'Frontend', zh: '前端' },
    items: ['React', 'Vue', 'TypeScript', 'Tailwind CSS', 'Next.js'],
  },
  {
    category: { en: 'Backend', zh: '后端' },
    items: ['Node.js', 'Python', 'Go', 'PostgreSQL', 'Redis'],
  },
  // 添加新分类：
  // { category: { en: 'Mobile', zh: '移动端' }, items: ['React Native', 'Flutter'] }
]
```

### 项目列表

```js
projectsSection: {
  title: { en: 'Featured Projects', zh: '精选项目' },
},
projects: [
  {
    title: { en: 'E-Commerce Platform', zh: '电商平台' },
    description: { en: 'A modern...', zh: '使用 React 和 Node.js 构建的...' },
    tags: ['React', 'Node.js'],
    link: 'https://github.com/...',
  },
  // 添加新项目...
]
```

### 联系信息

```js
contact: {
  title: { en: 'Get in Touch', zh: '联系我' },
  description: { en: "I'm always open...", zh: '我始终对新的机会...' },
  email: 'hello@example.com',
  emailButtonText: { en: 'Email Me', zh: '发送邮件' },
}
```

### 社交链接

```js
socialLinks: [
  { platform: 'GitHub', url: 'https://github.com/yourusername' },
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/yourusername' },
  { platform: 'Twitter', url: 'https://twitter.com/yourusername' },
]
```

### 页脚信息

```js
footer: {
  copyright: { en: '© 2024 Developer. All rights reserved.', zh: '© 2024 开发者。保留所有权利。' },
  builtWith: { en: 'Built with React & Tailwind CSS', zh: '使用 React 和 Tailwind CSS 构建' },
}
```

## 功能特性

### 主题切换

- 点击导航栏右侧的太阳/月亮图标切换主题
- 主题偏好自动保存到 localStorage
- 首次访问时跟随系统主题

### 语言切换

- 点击导航栏右侧的「中文」/「EN」按钮切换语言
- 语言偏好自动保存到 localStorage
- 默认使用英文

## 字体说明

本项目使用 [Geist 字体](https://vercel.com/font)，由 Vercel 开发：

- **Geist Pixel**：像素风格字体，用于网站标题和主要显示
- **Geist Mono**：等宽字体，用于正文和代码显示

字体文件位于 `public/fonts/` 目录，已在 `src/index.css` 中通过 `@font-face` 引入。

### 修改字体

如需修改字体，编辑 `src/index.css`：

```css
body {
  font-family: "Geist Pixel", "Geist Mono", monospace;
}
```

可选的 Geist Pixel 变体（位于 `public/fonts/`）：
- `GeistPixel-Square.woff2` - 方形像素（默认）
- `GeistPixel-Circle.woff2` - 圆形像素
- `GeistPixel-Grid.woff2` - 网格像素
- `GeistPixel-Line.woff2` - 线条像素
- `GeistPixel-Triangle.woff2` - 三角像素

## 自定义样式

如需修改颜色主题，编辑 `src/index.css`：

```css
body {
  background-color: #ffffff;  /* 浅色模式背景 */
  color: #111827;             /* 浅色模式文字 */
}

.dark body {
  background-color: #0f172a;  /* 深色模式背景 */
  color: #f1f5f9;             /* 深色模式文字 */
}

::selection {
  background-color: #3b82f6;  /* 选中文字高亮色 */
}
```

## License

MIT
