/**
 * ============================================================================
 *  Contact.jsx - 联系方式区块
 * ============================================================================
 *
 * 【功能说明】
 * 1. 展示联系信息和描述
 * 2. 提供邮箱联系按钮
 * 3. 显示社交媒体链接
 *
 * 【布局结构】
 * ┌─────────────────────────────────────┐
 * │          Get in Touch               │
 * │    I'm always open to new...        │
 * │                                     │
 * │          [Email Me]                 │
 * │                                     │
 * │     GitHub   LinkedIn   Twitter     │
 * └─────────────────────────────────────┘
 *
 * 【Props】
 * - t: function - 翻译函数
 *
 * 【自定义提示】
 * - 修改联系信息: 在 config.js 中修改 contact
 * - 修改社交链接: 在 config.js 中修改 socialLinks
 * - 修改邮箱: 在 config.js 中修改 contact.email
 * ============================================================================
 */

import config from "../../config";

export default function Contact({ t }) {
  const { contact, socialLinks } = config;

  return (
    // 浅灰色背景
    <section
      id="contact"
      className="py-20 px-6 bg-gray-50 dark:bg-gray-800/50 min-h-[360px]"
    >
      <div
        style={{ maxWidth: "42rem", margin: "0 auto" }}
        className="text-center"
      >
        {/* 区块标题 */}
        <div className="min-h-[48px] mb-4">
          <h2
            className="text-3xl font-bold text-gray-900 dark:text-white"
            style={{ lineHeight: "1.3" }}
          >
            {t(contact.title)}
          </h2>
        </div>

        {/* 描述文字 */}
        <div className="min-h-[60px] mb-8">
          <p
            className="text-gray-500 dark:text-gray-400"
            style={{ lineHeight: "1.8" }}
          >
            {t(contact.description)}
          </p>
        </div>

        {/* 邮箱按钮 */}
        <div className="flex justify-center">
          <a href={`mailto:${contact.email}`} className="btn btn-primary">
            {t(contact.emailButtonText)}
          </a>
        </div>

        {/* 社交链接 */}
        <div className="flex justify-center gap-6 mt-8">
          {socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {link.platform}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
