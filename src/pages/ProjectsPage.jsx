/**
 * ============================================================================
 *  ProjectsPage.jsx - 项目页面
 * ============================================================================
 *
 * 【功能说明】
 * 1. 展示项目作品集
 * 2. 响应式网格布局
 * 3. 支持深色/浅色模式
 * 4. 支持中英文切换
 *
 * 【布局结构】
 * ┌─────────────────────────────────────┐
 * │  PageHeader (导航栏)                 │
 * ├─────────────────────────────────────┤
 * │  Projects Hero (页面标题区域)        │
 * ├─────────────────────────────────────┤
 * │  Projects Grid (项目卡片网格)        │
 * ├─────────────────────────────────────┤
 * │  PageFooter (页脚)                   │
 * └─────────────────────────────────────┘
 * ============================================================================
 */

import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import PageHeader from "../components/shared/PageHeader";
import PageFooter from "../components/shared/PageFooter";
import PageTitle from "../components/shared/PageTitle";
import WaveAnimation from "../components/HomePage/WaveAnimation";
import config from "../config";

function ProjectsPage() {
  const { isDark, toggle: toggleTheme } = useTheme();
  const { lang, toggle: toggleLang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors w-full flex flex-col">
      <PageTitle title={t({ en: "Projects | STYLAN", zh: "项目 | STYLAN" })} />

      <PageHeader
        title={t({ en: "PROJECTS", zh: "项目" })}
        backToHome={{ en: "BACK TO HOME", zh: "返回主页" }}
        isDark={isDark}
        toggleTheme={toggleTheme}
        lang={lang}
        toggleLang={toggleLang}
        t={t}
      />

      <main className="w-full pt-16 flex-grow">
        {/* 页面标题区域 */}
        <section className="relative px-6 py-16 bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
          {/* Wave 动画背景 */}
          <div className="absolute inset-0 opacity-30">
            <WaveAnimation color={isDark ? '#a78bfa' : '#8b5cf6'} />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t({ en: "Featured Projects", zh: "精选项目" })}
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t({
                en: "A showcase of my recent work and personal projects",
                zh: "项目展示",
              })}
            </p>
          </div>
        </section>

        {/* 项目卡片网格 */}
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.projects.map((project, index) => (
                <a
                  key={index}
                  href={project.link}
                  className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] dark:hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 flex flex-col"
                  style={{ minHeight: "280px" }}
                >
                  {/* 图标和标题 */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 group-hover:scale-110 transition-transform flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {t(project.title)}
                    </h2>
                  </div>

                  {/* 项目描述 */}
                  <div className="flex-grow mb-4">
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400"
                      style={{ lineHeight: "1.7" }}
                    >
                      {t(project.description)}
                    </p>
                  </div>

                  {/* 技术标签 */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PageFooter t={t} />
    </div>
  );
}

export default ProjectsPage;
