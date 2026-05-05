/**
 * ============================================================================
 *  Header.jsx - 顶部导航栏组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 响应式导航栏：大屏幕显示完整导航，小屏幕显示汉堡菜单
 * 2. 滚动行为：页面顶部始终显示，向下隐藏，向上显示
 * 3. 推入动画：导航栏从页面顶部边界整体推入/推出
 * 4. 导航链接带下划线悬浮效果
 * 5. 主题切换和语言切换按钮
 * 6. 点击空白处关闭下拉菜单
 *
 * 【布局结构】
 * ┌─────────────────────────────────────────────┐
 * │ Portfolio   [Skills] [Projects] [Contact]   │
 * │                        [☀️] [中文]          │
 * └─────────────────────────────────────────────┘
 *
 * 【Props】
 * - isDark: boolean - 当前是否深色模式
 * - toggleTheme: function - 切换主题函数
 * - lang: string - 当前语言
 * - toggleLang: function - 切换语言函数
 * - t: function - 翻译函数
 *
 * 【自定义提示】
 * - 修改网站标题: 在 config.js 中修改 site.title
 * - 修改导航链接: 在 config.js 中修改 navLinks
 * - 修改滚动阈值: 修改 handleScroll 中的数值
 * ============================================================================
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import config from "../../config";

export default function Header({ isDark, toggleTheme, lang, toggleLang, t }) {
  // 下拉菜单展开状态
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 导航栏显示状态
  const [isExpanded, setIsExpanded] = useState(true);
  // 是否移动端
  const [isMobile, setIsMobile] = useState(false);

  // Refs
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  // 点击链接后关闭菜单
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // 点击外部区域关闭菜单
  const handleClickOutside = useCallback((event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  }, []);

  // 监听点击外部事件
  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, handleClickOutside]);

  // 检测屏幕大小
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsExpanded(true); // 小屏幕始终显示
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 窗口大小变化时关闭下拉菜单
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * 滚动检测
   * - 页面顶部时始终显示
   * - 向下滚动时隐藏
   * - 向上滚动时显示
   */
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const lastScrollY = lastScrollYRef.current;

          // 页面在顶部附近时始终显示
          if (currentScrollY <= 10) {
            setIsExpanded(true);
          }
          // 向下滚动超过阈值时隐藏
          else if (
            currentScrollY > lastScrollY &&
            currentScrollY - lastScrollY > 5
          ) {
            setIsExpanded(false);
          }
          // 向上滚动超过阈值时显示
          else if (
            lastScrollY > currentScrollY &&
            lastScrollY - currentScrollY > 5
          ) {
            setIsExpanded(true);
          }

          lastScrollYRef.current = currentScrollY;
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <>
      {/* 导航栏主体 - 整体推入效果 */}
      <header
        ref={headerRef}
        style={{
          transform: isExpanded ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 dark:bg-gray-900/90"
      >
        <div className="h-16 px-6 md:px-10 flex items-center justify-between">
          {/* 左侧 - 网站标题 */}
          <a
            href="#"
            className="text-lg font-semibold text-black dark:text-white flex-shrink-0"
            style={{ fontFamily: '"Geist Pixel", monospace' }}
          >
            {config.site.title}
          </a>

          {/* 右侧 - 桌面端导航 */}
          <nav className="hidden md:flex items-center gap-6">
            {config.navLinks.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  [ <span className="nav-link-text">{t(link.label)}</span> ]
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  [ <span className="nav-link-text">{t(link.label)}</span> ]
                </Link>
              )
            )}

            {/* 切换按钮组 */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
              {/* 主题切换按钮 */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-90 relative"
                aria-label="Toggle theme"
              >
                {/* 太阳图标 - 深色模式时显示 */}
                <svg
                  className={`w-5 h-5 text-blue-500 transition-all duration-300 absolute ${
                    isDark ? "rotate-0 scale-100" : "rotate-90 scale-0"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                {/* 月亮图标 - 浅色模式时显示 */}
                <svg
                  className={`w-5 h-5 text-blue-500 dark:text-blue-400 transition-all duration-300 absolute ${
                    isDark ? "-rotate-90 scale-0" : "rotate-0 scale-100"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </button>

              {/* 语言切换按钮 */}
              <button
                onClick={toggleLang}
                className="h-9 w-12 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95 text-sm font-medium text-gray-600 dark:text-gray-400 relative overflow-hidden"
                aria-label="Toggle language"
              >
                <span
                  className={`inline-block transition-all duration-300 absolute ${
                    lang === "en"
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-full opacity-0"
                  }`}
                >
                  中文
                </span>
                <span
                  className={`inline-block transition-all duration-300 absolute ${
                    lang === "zh"
                      ? "translate-y-0 opacity-100"
                      : "translate-y-full opacity-0"
                  }`}
                >
                  EN
                </span>
              </button>
            </div>
          </nav>

          {/* 右侧 - 移动端菜单按钮 */}
          <div
            ref={menuRef}
            className="flex md:hidden items-center gap-2 relative"
          >
            {/* 主题切换按钮 */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-90 relative"
              aria-label="Toggle theme"
            >
              <svg
                className={`w-5 h-5 text-blue-500 transition-all duration-300 absolute ${
                  isDark ? "rotate-0 scale-100" : "rotate-90 scale-0"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <svg
                className={`w-5 h-5 text-blue-500 dark:text-blue-400 transition-all duration-300 absolute ${
                  isDark ? "-rotate-90 scale-0" : "rotate-0 scale-100"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>

            {/* 语言切换按钮 */}
            <button
              onClick={toggleLang}
              className="h-9 w-12 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95 text-sm font-medium text-gray-600 dark:text-gray-400 relative overflow-hidden"
              aria-label="Toggle language"
            >
              <span
                className={`inline-block transition-all duration-300 absolute ${
                  lang === "en"
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-full opacity-0"
                }`}
              >
                中文
              </span>
              <span
                className={`inline-block transition-all duration-300 absolute ${
                  lang === "zh"
                    ? "translate-y-0 opacity-100"
                    : "translate-y-full opacity-0"
                }`}
              >
                EN
              </span>
            </button>

            {/* 汉堡菜单按钮 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-5 bg-gray-600 dark:bg-gray-400 transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-gray-600 dark:bg-gray-400 transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-gray-600 dark:bg-gray-400 transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                  }`}
                />
              </div>
            </button>

            {/* 移动端下拉菜单 - 按钮下方，右对齐 */}
            <div
              className={`absolute top-full right-0 mt-2 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
                isMenuOpen
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
              style={{ width: "max-content" }}
            >
              <nav className="py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                {config.navLinks.map((link, index) =>
                  link.href.startsWith("#") ? (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={handleLinkClick}
                      className={`block py-2 px-4 text-sm text-right text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${
                        isMenuOpen ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms",
                      }}
                    >
                      [ <span className="nav-link-text">{t(link.label)}</span> ]
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={handleLinkClick}
                      className={`block py-2 px-4 text-sm text-right text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${
                        isMenuOpen ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms",
                      }}
                    >
                      [ <span className="nav-link-text">{t(link.label)}</span> ]
                    </Link>
                  )
                )}
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
