/**
 * ============================================================================
 *  ContactPage.jsx - 联系页面
 * ============================================================================
 *
 * 【功能说明】
 * 1. 展示联系信息
 * 2. 提供联系表单
 * 3. 右侧展示自定义图片
 * 4. 支持深色/浅色模式
 * 5. 支持中英文切换
 *
 * 【布局结构】
 * ┌─────────────────────────────────────────────┐
 * │  PageHeader (通用导航栏)                     │
 * ├─────────────────────────────────────────────┤
 * │  Contact Hero (页面标题)                     │
 * ├─────────────────────────────────────────────┤
 * │  Contact Info (联系方式)     │  Image        │
 * │  Contact Form (发送消息)     │  (自定义图片)  │
 * ├─────────────────────────────────────────────┤
 * │  PageFooter (通用页脚)                       │
 * └─────────────────────────────────────────────┘
 *
 * 【自定义提示】
 * - 修改联系信息: 在 config.js 中修改 contactPage
 * - 修改图片: 在 config.js 中修改 contactPage.image
 * ============================================================================
 */

import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import PageHeader from "../components/shared/PageHeader";
import PageFooter from "../components/shared/PageFooter";
import config from "../config";

function ContactPage() {
  const { isDark, toggle: toggleTheme } = useTheme();
  const { lang, toggle: toggleLang, t } = useLanguage();
  const { contactPage } = config;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  const getIcon = (icon) => {
    switch (icon) {
      case "email":
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "github":
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        );
      case "bilibili":
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors w-full flex flex-col">
      <title>{t(contactPage.title)} | STYLAN</title>

      <PageHeader
        title={t(contactPage.title)}
        backToHome={t(contactPage.backToHome)}
        isDark={isDark}
        toggleTheme={toggleTheme}
        lang={lang}
        toggleLang={toggleLang}
        t={t}
      />

      <main className="w-full pt-16 flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
              style={{ lineHeight: "1.3" }}
            >
              {t(contactPage.title)}
            </h1>
            <p
              className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
              style={{ lineHeight: "1.8" }}
            >
              {t(contactPage.description)}
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Contact Info + Form */}
            <div>
              <h2
                className="text-2xl font-bold text-gray-900 dark:text-white mb-8"
                style={{ lineHeight: "1.3" }}
              >
                {lang === "en" ? "Contact Information" : "联系方式"}
              </h2>

              <div className="space-y-6 mb-12">
                {contactPage.contactMethods.map((method) => (
                  <a
                    key={method.label.en}
                    href={method.href}
                    target={method.href.startsWith("http") ? "_blank" : undefined}
                    rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                      {getIcon(method.icon)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t(method.label)}
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {method.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              <h2
                className="text-2xl font-bold text-gray-900 dark:text-white mb-8"
                style={{ lineHeight: "1.3" }}
              >
                {lang === "en" ? "Send a Message" : "发送消息"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t(contactPage.form.nameLabel)}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t(contactPage.form.namePlaceholder)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t(contactPage.form.emailLabel)}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t(contactPage.form.emailPlaceholder)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t(contactPage.form.messageLabel)}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t(contactPage.form.messagePlaceholder)}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                >
                  {t(contactPage.form.submitButton)}
                </button>

                {isSubmitted && (
                  <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    {t(contactPage.form.successMessage)}
                  </div>
                )}
              </form>
            </div>

            {/* Right: Image */}
            <div className="hidden lg:flex items-start justify-center">
              <div className="sticky top-24 w-full">
                {contactPage.image ? (
                  <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
                    <img
                      src={contactPage.image.src}
                      alt={t(contactPage.image.alt)}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[4/5] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v15a1.5 1.5 0 001.5 1.5z" />
                    </svg>
                    <p className="text-sm">
                      {lang === "en" ? "Add an image in config.js" : "在 config.js 中添加图片"}
                    </p>
                    <p className="text-xs mt-2 text-gray-400 dark:text-gray-600">
                      contactPage.image.src
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <PageFooter t={t} />
    </div>
  );
}

export default ContactPage;
