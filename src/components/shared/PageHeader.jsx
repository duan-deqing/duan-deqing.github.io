/**
 * ============================================================================
 *  PageHeader.jsx - 通用页面导航栏组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 可复用的页面导航栏
 * 2. 支持首页模式（显示品牌标题和导航链接）
 * 3. 支持子页面模式（显示返回主页链接和页面标题）
 * 4. 主题切换和语言切换功能
 * 5. 滚动时自动隐藏/显示
 * 6. 响应式设计（移动端汉堡菜单）
 *
 * 【Props】
 * - isHome: boolean - 是否为首页模式（默认：false）
 * - title: string - 页面标题（子页面模式时显示）
 * - backToHome: object - 返回主页链接文字 { en, zh }（子页面模式时使用）
 * - navLinks: array - 导航链接数组
 * - showSearch: boolean - 是否显示搜索按钮（默认：false）
 * - onSearchClick: function - 搜索按钮点击事件
 * - isDark: boolean - 当前是否深色模式
 * - toggleTheme: function - 切换主题函数
 * - lang: string - 当前语言
 * - toggleLang: function - 切换语言函数
 * - t: function - 翻译函数
 * ============================================================================
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import theme from "../../theme";

export default function PageHeader({
  isHome = false,
  title,
  backToHome,
  navLinks = [],
  showSearch = false,
  onSearchClick,
  isDark,
  toggleTheme,
  lang,
  toggleLang,
  t,
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 10) {
        setIsExpanded(true);
      } else if (
        currentScrollY > lastScrollY &&
        currentScrollY - lastScrollY > 5
      ) {
        setIsExpanded(false);
      } else if (
        lastScrollY > currentScrollY &&
        lastScrollY - currentScrollY > 5
      ) {
        setIsExpanded(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // 点击链接后关闭菜单
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // 渲染导航链接
  const renderNavLink = (link, isMobile = false) => {
    const isAnchor = link.href.startsWith("#");
    const baseClass = isMobile
      ? `block py-2 px-4 text-sm transition-colors ${theme.nav.link.light} ${theme.nav.link.dark} ${theme.nav.link.hoverLight} ${theme.nav.link.hoverDark}`
      : `text-sm transition-colors ${theme.nav.link.light} ${theme.nav.link.dark} ${theme.nav.link.hoverLight} ${theme.nav.link.hoverDark}`;

    if (isAnchor) {
      return (
        <a
          key={link.href}
          href={link.href}
          className={baseClass}
          onClick={isMobile ? handleLinkClick : undefined}
        >
          {isHome && !isMobile ? (
            <>
              [ <span className="nav-link-text">{t(link.label)}</span> ]
            </>
          ) : (
            t(link.label)
          )}
        </a>
      );
    }

    return (
      <Link
        key={link.href}
        to={link.href}
        className={baseClass}
        onClick={isMobile ? handleLinkClick : undefined}
      >
        {isHome && !isMobile ? (
          <>
            [ <span className="nav-link-text">{t(link.label)}</span> ]
          </>
        ) : (
          t(link.label)
        )}
      </Link>
    );
  };

  return (
    <header
      style={{
        transform: isExpanded ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      className={`fixed top-0 left-0 right-0 z-50 ${theme.nav.background}`}
    >
      <div className="h-16 px-6 md:px-10 flex items-center justify-between">
        {/* 左侧 - 品牌标题或返回主页 */}
        {isHome ? (
          <a
            href="/"
            className={`text-lg font-semibold flex-shrink-0 ${theme.nav.brand.light} ${theme.nav.brand.dark}`}
            style={{ fontFamily: "monospace" }}
          >
            STYLAN
          </a>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={`text-sm transition-colors ${theme.nav.link.light} ${theme.nav.link.dark} ${theme.nav.link.hoverLight} ${theme.nav.link.hoverDark}`}
            >
              [<span className="nav-link-text">{t(backToHome)}</span>]
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span
              className={`text-lg font-semibold ${theme.nav.brand.light} ${theme.nav.brand.dark}`}
              style={{ fontFamily: "monospace" }}
            >
              {title}
            </span>
          </div>
        )}

        {/* 右侧 - 桌面端导航 */}
        <div className="hidden md:flex items-center gap-4">
          {/* 导航链接 */}
          {navLinks.length > 0 && (
            <nav className="flex items-center gap-4">
              {navLinks.map((link) => renderNavLink(link))}
            </nav>
          )}

          {/* 切换按钮组 */}
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
            {/* 搜索按钮 */}
            {showSearch && (
              <button
                onClick={onSearchClick}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-90"
                aria-label="Search"
              >
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            )}

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
        </div>

        {/* 右侧 - 移动端菜单按钮 */}
        <div className="flex md:hidden items-center gap-2">
          {/* 搜索按钮 */}
          {showSearch && (
            <button
              onClick={onSearchClick}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-90"
              aria-label="Search"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          )}

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
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {navLinks.length > 0 && (
        <div
          className={`md:hidden absolute top-full right-0 mt-2 mr-4 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
            isMenuOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
          style={{ width: "max-content" }}
        >
          <nav className="py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            {navLinks.map((link, index) => {
              const isAnchor = link.href.startsWith("#");
              const linkClass = `block py-2 px-4 text-sm text-right ${
                theme.nav.link.light
              } ${
                theme.nav.link.dark
              } hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${
                isMenuOpen ? "opacity-100" : "opacity-0"
              }`;

              return (
                <div
                  key={link.href}
                  style={{
                    transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms",
                  }}
                >
                  {isAnchor ? (
                    <a
                      href={link.href}
                      className={linkClass}
                      onClick={handleLinkClick}
                    >
                      [ <span className="nav-link-text">{t(link.label)}</span> ]
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className={linkClass}
                      onClick={handleLinkClick}
                    >
                      [ <span className="nav-link-text">{t(link.label)}</span> ]
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
