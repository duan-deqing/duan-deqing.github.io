/**
 * ============================================================================
 *  App.jsx - 应用主入口组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 管理主题状态（深色/浅色模式）
 * 2. 管理语言状态（中/英文）
 * 3. 组合所有页面区块
 *
 * 【组件结构】
 * ┌─────────────────────────────────────┐
 * │  Header (导航栏)                     │
 * ├─────────────────────────────────────┤
 * │  Hero (个人介绍)                     │
 * ├─────────────────────────────────────┤
 * │  Skills (技能展示)                   │
 * ├─────────────────────────────────────┤
 * │  Projects (项目作品)                 │
 * ├─────────────────────────────────────┤
 * │  Contact (联系方式)                  │
 * ├─────────────────────────────────────┤
 * │  Footer (页脚)                       │
 * └─────────────────────────────────────┘
 *
 * 【自定义提示】
 * - 添加新区块: 创建组件后在 <main> 中引入
 * - 修改页面顺序: 调整组件位置
 * ============================================================================
 */

import { useTheme } from "./hooks/useTheme";
import { useLanguage } from "./hooks/useLanguage";
import PageTitle from "./components/PageTitle";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  // 获取主题状态和切换函数
  const { isDark, toggle: toggleTheme } = useTheme();

  // 获取语言状态、切换函数和翻译函数
  const { lang, toggle: toggleLang, t } = useLanguage();

  return (
    // 最外层容器：最小屏幕高度、背景色、主题切换过渡
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors w-full">
      {/* 设置浏览器标签页标题和图标 */}
      <PageTitle />

      {/* 导航栏：传递主题和语言相关 props */}
      <Header
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

        {/* 联系方式区块 */}
        <Contact t={t} />
      </main>

      {/* 页脚 */}
      <Footer />
    </div>
  );
}

export default App;
