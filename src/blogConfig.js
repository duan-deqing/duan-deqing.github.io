/**
 * ============================================================================
 *  blogConfig.js - 博客页面配置文件
 * ============================================================================
 *
 * 【使用说明】
 * 修改此文件自定义博客页面的内容和样式
 *
 * 【多语言配置】
 * - 支持中英文的对象格式: { en: 'English', zh: '中文' }
 * - 不参与语言切换的内容直接使用字符串
 *
 * 【配置项说明】
 * - page: 博客页面基本信息
 * - categories: 文章分类
 *
 * 【文章管理】
 * 博客文章现在存储在 src/posts/ 文件夹中，使用 markdown 格式
 * 文件命名规范: yyyy-mm-dd-post-title.md
 * ============================================================================
 */

const blogConfig = {
  // ==================== 页面信息 ====================
  page: {
    // 博客页面标题
    title: { en: "Blog", zh: "博客" },
    // 博客页面副标题
    subtitle: { en: "Thoughts, tutorials and insights", zh: "想法、教程与见解" },
    // 返回主页链接
    backToHome: { en: "Back to Home", zh: "返回主页" },
  },

  // ==================== 文章分类 ====================
  categories: [
    { id: "all", label: { en: "All", zh: "全部" } },
    { id: "tech", label: { en: "Technology", zh: "技术" } },
    { id: "tutorial", label: { en: "Tutorials", zh: "教程" } },
    { id: "thoughts", label: { en: "Thoughts", zh: "想法" } },
    { id: "project", label: { en: "Projects", zh: "项目" } },
  ],
};

export default blogConfig;
