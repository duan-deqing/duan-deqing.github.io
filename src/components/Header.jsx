/**
 * Header.jsx - 顶部导航栏组件
 *
 * 功能：
 * - 页面顶部时始终显示
 * - 向下滑动时隐藏
 * - 向上滑动时显示
 * - 动画效果：从上方推入/推出
 * - 小屏幕：始终显示
 */

import { useState, useEffect, useRef, useCallback } from "react";
import config from "../config";

export default function Header({ isDark, toggleTheme, lang, toggleLang, t }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // 点击外部区域关闭菜单
  const handleClickOutside = useCallback((event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  }, []);

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
        setIsExpanded(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 滚动检测 - 页面顶部时始终显示，向下隐藏，向上显示
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
            className="text-lg font-semibold text-gray-900 dark:text-white flex-shrink-0"
            style={{ fontFamily: '"Geist Pixel", monospace' }}
          >
            {config.site.title}
          </a>

          {/* 右侧 - 桌面端导航 */}
          <nav className="hidden md:flex items-center gap-6">
            {config.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                [ <span className="nav-link-text">{t(link.label)}</span> ]
              </a>
            ))}

            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
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

            {/* 移动端下拉菜单 */}
            <div
              className={`absolute top-full right-0 mt-2 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
                isMenuOpen
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
              style={{ width: 'max-content' }}
            >
              <nav className="py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                {config.navLinks.map((link, index) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    className={`block py-2 px-4 text-sm text-right text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${
                      isMenuOpen ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms",
                    }}
                  >
                    [ <span className="nav-link-text">{t(link.label)}</span> ]
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
