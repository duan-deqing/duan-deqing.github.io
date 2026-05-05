/**
 * ============================================================================
 *  theme.js - 网站主题颜色配置
 * ============================================================================
 *
 * 【使用说明】
 * 修改此文件即可自定义网站各位置的字体颜色
 *
 * 【颜色格式】
 * - 支持 Tailwind CSS 类名（如 'text-black', 'dark:text-white'）
 * - 支持 CSS 颜色值（如 '#111827', 'rgb(17, 24, 39)'）
 *
 * 【配置项说明】
 * - nav: 导航栏相关颜色
 * - hero: 首页主视觉区域颜色
 * - body: 页面正文颜色
 * - heading: 标题颜色
 * - link: 链接颜色
 * - button: 按钮颜色
 * - footer: 页脚颜色
 * ============================================================================
 */

const theme = {
  // ==================== 导航栏 ====================
  nav: {
    // 左侧网站标题
    brand: {
      light: 'text-black',
      dark: 'dark:text-white',
    },
    // 导航链接
    link: {
      light: 'text-gray-700',
      dark: 'dark:text-gray-300',
      hoverLight: 'hover:text-black',
      hoverDark: 'dark:hover:text-white',
    },
    // 背景
    background: 'backdrop-blur-md bg-white/90 dark:bg-gray-900/90',
  },

  // ==================== 首页主视觉区域 ====================
  hero: {
    // 主标题
    title: {
      light: 'text-gray-900',
      dark: 'dark:text-white',
    },
    // 副标题/简介
    subtitle: {
      light: 'text-gray-500',
      dark: 'dark:text-gray-400',
    },
  },

  // ==================== 页面正文 ====================
  body: {
    // 主要文字
    primary: {
      light: 'text-gray-900',
      dark: 'dark:text-white',
    },
    // 次要文字
    secondary: {
      light: 'text-gray-600',
      dark: 'dark:text-gray-400',
    },
    // 辅助文字
    muted: {
      light: 'text-gray-500',
      dark: 'dark:text-gray-400',
    },
  },

  // ==================== 标题 ====================
  heading: {
    // 一级标题
    h1: {
      light: 'text-gray-900',
      dark: 'dark:text-white',
    },
    // 二级标题
    h2: {
      light: 'text-gray-900',
      dark: 'dark:text-white',
    },
    // 三级标题
    h3: {
      light: 'text-gray-900',
      dark: 'dark:text-white',
    },
  },

  // ==================== 链接 ====================
  link: {
    // 默认链接颜色
    default: {
      light: 'text-blue-600',
      dark: 'dark:text-blue-400',
      hoverLight: 'hover:text-blue-800',
      hoverDark: 'dark:hover:text-blue-300',
    },
    // 导航链接（带下划线效果）
    nav: {
      light: 'text-gray-500',
      dark: 'dark:text-gray-400',
      hoverLight: 'hover:text-gray-900',
      hoverDark: 'dark:hover:text-white',
    },
  },

  // ==================== 按钮 ====================
  button: {
    // 主按钮
    primary: {
      background: 'bg-blue-700 dark:bg-blue-600',
      text: 'text-white',
      hoverBackground: 'hover:bg-blue-800 dark:hover:bg-blue-700',
    },
    // 次按钮
    secondary: {
      background: 'bg-transparent',
      text: 'text-gray-700 dark:text-gray-300',
      border: 'border border-gray-300 dark:border-gray-600',
      hoverBackground: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    },
  },

  // ==================== 页脚 ====================
  footer: {
    // 版权信息
    text: {
      light: 'text-gray-500',
      dark: 'dark:text-gray-400',
    },
    // 返回顶部按钮
    link: {
      light: 'text-gray-500',
      dark: 'dark:text-gray-400',
      hoverLight: 'hover:text-gray-900',
      hoverDark: 'dark:hover:text-white',
    },
    // 边框
    border: 'border-gray-200 dark:border-gray-800',
  },

  // ==================== 背景色 ====================
  background: {
    // 页面背景
    page: 'bg-white dark:bg-gray-900',
    // 卡片背景
    card: 'bg-white dark:bg-gray-800',
    // 代码块背景
    code: 'bg-gray-100 dark:bg-gray-800',
  },

  // ==================== 边框色 ====================
  border: {
    default: 'border-gray-200 dark:border-gray-700',
    light: 'border-gray-100 dark:border-gray-800',
  },
}

export default theme
