/**
 * ============================================================================
 *  ContactPage.jsx - 联系页面
 * ============================================================================
 *
 * 【功能说明】
 * 1. 展示联系信息
 * 2. 右侧展示自定义图片
 * 3. 支持深色/浅色模式
 * 4. 支持中英文切换
 *
 * 【布局结构】
 * ┌─────────────────────────────────────────────┐
 * │  PageHeader (通用导航栏)                     │
 * ├─────────────────────────────────────────────┤
 * │  Contact Hero (页面标题)                     │
 * ├─────────────────────────────────────────────┤
 * │  Contact Info (联系方式)     │  Image        │
 * │                             │  (自定义图片)  │
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
import WaveAnimation from "../components/HomePage/WaveAnimation";
import config from "../config";

function ContactPage() {
  const { isDark, toggle: toggleTheme } = useTheme();
  const { lang, toggle: toggleLang, t } = useLanguage();
  const { contactPage } = config;
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [hoveredWechat, setHoveredWechat] = useState(false);

  const handleCopyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const getContactIcon = (icon) => {
    switch (icon) {
      case "email":
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "wechat":
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zM14.87 13.04c.535 0 .969.44.969.983a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.544.434-.983.97-.983zm4.842 0c.535 0 .969.44.969.983a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.544.434-.983.97-.983z"/>
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
        <section className="relative py-16 px-6 bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
          {/* Wave 动画背景 */}
          <div className="absolute inset-0 opacity-30">
            <WaveAnimation color={isDark ? '#34d399' : '#10b981'} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
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
        <section className="py-16 px-6 flex-grow">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Contact Info */}
            <div className="flex flex-col">
              <div className="space-y-6 flex-1">
                {contactPage.contactMethods.map((method) => (
                  <div
                    key={method.label.en}
                    className="relative"
                    onMouseEnter={() => method.icon === "wechat" && setHoveredWechat(true)}
                    onMouseLeave={() => method.icon === "wechat" && setHoveredWechat(false)}
                  >
                    <div className="flex items-center gap-4 p-4 rounded-full border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group">
                      {method.href ? (
                        <a
                          href={method.href}
                          target={method.href.startsWith("http") ? "_blank" : undefined}
                          rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="flex items-center gap-4 flex-1"
                        >
                          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                            {getContactIcon(method.icon)}
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
                      ) : (
                        <div className="flex items-center gap-4 flex-1 cursor-default">
                          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                            {getContactIcon(method.icon)}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {t(method.label)}
                            </p>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {method.value}
                            </p>
                          </div>
                        </div>
                      )}
                      {method.icon === "email" && (
                        <button
                          onClick={() => handleCopyEmail(method.value)}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95"
                          title={copiedEmail ? (lang === "en" ? "Copied!" : "已复制！") : (lang === "en" ? "Copy email" : "复制邮箱")}
                        >
                          {copiedEmail ? (
                            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>

                    {/* WeChat QR Code Tooltip */}
                    {method.icon === "wechat" && method.qrcode && (
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 mt-3 transition-all duration-300 ${
                          hoveredWechat
                            ? "opacity-100 visible translate-y-0"
                            : "opacity-0 invisible -translate-y-2"
                        }`}
                      >
                        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4">
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 rotate-45" />
                          <img
                            src={method.qrcode}
                            alt={lang === "en" ? "WeChat QR Code" : "微信二维码"}
                            className="w-48 h-48 object-contain"
                          />
                          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                            {lang === "en" ? "Scan to add WeChat" : "扫码添加微信"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* 简历下载按钮 */}
                <a
                  href="/resume.pdf"
                  download
                  className="flex items-center gap-4 p-4 rounded-full border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t({ en: "Resume", zh: "简历" })}
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {t({ en: "Download PDF", zh: "下载 PDF" })}
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Right: Image */}
            <div className="hidden lg:flex">
              <div className="w-full">
                {contactPage.image ? (
                  <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg h-full">
                    <img
                      src={typeof contactPage.image === 'string' ? contactPage.image : contactPage.image.src}
                      alt={typeof contactPage.image === 'string' ? 'Contact illustration' : t(contactPage.image.alt)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full min-h-[400px] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
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
