/**
 * ============================================================================
 *  SkillsPage.jsx - 技能与技术页面
 * ============================================================================
 *
 * 【功能说明】
 * 1. 展示技能分类和技术栈
 * 2. 响应式网格布局
 * 3. 支持深色/浅色模式
 * 4. 支持中英文切换
 *
 * 【布局结构】
 * ┌─────────────────────────────────────┐
 * │  PageHeader (导航栏)                 │
 * ├─────────────────────────────────────┤
 * │  Skills Hero (页面标题区域)          │
 * ├─────────────────────────────────────┤
 * │  Skills Grid (技能分类网格)          │
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

function SkillsPage() {
  const { isDark, toggle: toggleTheme } = useTheme();
  const { lang, toggle: toggleLang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors w-full flex flex-col">
      <PageTitle
        title={t({
          en: "Skills & Technologies | STYLAN",
          zh: "技能与技术 | STYLAN",
        })}
      />

      <PageHeader
        title={t({ en: "SKILLS", zh: "技能" })}
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
            <WaveAnimation color={isDark ? '#60a5fa' : '#3b82f6'} />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t({ en: "Skills & Technologies", zh: "技能与技术" })}
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t({
                en: "A collection of technologies and tools I work with",
                zh: "我使用的技术和工具集合",
              })}
            </p>
          </div>
        </section>

        {/* 技能分类网格 */}
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
                >
                  {/* 分类标题 */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-900/30">
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
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t(skill.category)}
                    </h2>
                  </div>

                  {/* 技能列表 */}
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item, itemIndex) => (
                      <span
                        key={itemIndex}
                        className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PageFooter t={t} />
    </div>
  );
}

export default SkillsPage;
