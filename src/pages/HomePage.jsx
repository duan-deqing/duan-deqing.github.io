/**
 * ============================================================================
 *  HomePage.jsx - 主页面组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 管理主题状态（深色/浅色模式）
 * 2. 管理语言状态（中/英文）
 * 3. 组合所有页面区块
 *
 * 【组件结构】
 * ┌─────────────────────────────────────┐
 * │  PageHeader (导航栏)                 │
 * ├─────────────────────────────────────┤
 * │  Hero (个人介绍)                     │
 * ├─────────────────────────────────────┤
 * │  Skills (技能展示)                   │
 * ├─────────────────────────────────────┤
 * │  Projects (项目作品)                 │
 * ├─────────────────────────────────────┤
 * │  Blog (精选博客)                     │
 * ├─────────────────────────────────────┤
 * │  Contact (联系方式)                  │
 * ├─────────────────────────────────────┤
 * │  PageFooter (页脚)                   │
 * └─────────────────────────────────────┘
 *
 * 【自定义提示】
 * - 添加新区块: 创建组件后在 <main> 中引入
 * - 修改页面顺序: 调整组件位置
 * ============================================================================
 */

import { useState, useEffect } from "react";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { getAllPosts } from "../utils/markdown";
import PageTitle from "../components/shared/PageTitle";
import PageHeader from "../components/shared/PageHeader";
import Hero from "../components/HomePage/Hero";
import Skills from "../components/HomePage/Skills";
import Projects from "../components/HomePage/Projects";
import BlogSection from "../components/HomePage/BlogSection";
import Contact from "../components/HomePage/Contact";
import PageFooter from "../components/shared/PageFooter";
import config from "../config";

function HomePage() {
  // 获取主题状态和切换函数
  const { isDark, toggle: toggleTheme } = useTheme();

  // 获取语言状态、切换函数和翻译函数
  const { lang, toggle: toggleLang, t } = useLanguage();

  // 文章列表状态
  const [posts, setPosts] = useState([]);

  // 加载文章列表
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const allPosts = await getAllPosts(lang);
        setPosts(allPosts);
      } catch (error) {
        console.error('[HomePage] Failed to load posts:', error);
      }
    };

    loadPosts();
  }, [lang]);

  return (
    // 最外层容器：最小屏幕高度、背景色、主题切换过渡
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors w-full">
      {/* 设置浏览器标签页标题和图标 */}
      <PageTitle />

      {/* 导航栏：传递主题和语言相关 props */}
      <PageHeader
        isHome={true}
        navLinks={config.navLinks}
        isDark={isDark}
        toggleTheme={toggleTheme}
        lang={lang}
        toggleLang={toggleLang}
        t={t}
      />

      {/* 主要内容区域 */}
      <main className="w-full">
        {/* 个人介绍区块 - 带逐字出现动画 */}
        <Hero t={t} />

        {/* 技能展示区块 */}
        <Skills t={t} />

        {/* 项目作品区块 */}
        <Projects t={t} />

        {/* 博客精选区块 */}
        <BlogSection posts={posts} t={t} />

        {/* 联系方式区块 */}
        <Contact t={t} />
      </main>

      {/* 页脚 */}
      <PageFooter t={t} showBackToTop={false} />
    </div>
  );
}

export default HomePage;