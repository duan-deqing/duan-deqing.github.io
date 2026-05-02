/**
 * ============================================================================
 *  BlogFooter.jsx - 博客页面页脚组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 与主站页脚风格一致
 * 2. 显示版权信息
 * 3. 简洁的设计
 *
 * 【Props】
 * - t: function - 翻译函数
 * ============================================================================
 */

export default function BlogFooter({ t }) {
  return (
    <footer className="py-8 px-6 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* 版权信息 */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2026 STYLAN. All rights reserved.
        </p>

        {/* 返回顶部 */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {t({ en: "BACK TO TOP ↑", zh: "返回顶部 ↑" })}
        </button>
      </div>
    </footer>
  );
}
