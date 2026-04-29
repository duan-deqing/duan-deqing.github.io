/**
 * App.jsx - 应用主入口组件
 * 
 * 功能：
 * 1. 管理主题状态（深色/浅色模式）
 * 2. 管理语言状态（中/英文）
 * 3. 组合所有页面区块
 */

import { useTheme } from './hooks/useTheme'
import { useLanguage } from './hooks/useLanguage'
import Header from './components/Header'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  const { isDark, toggle: toggleTheme } = useTheme()
  const { lang, toggle: toggleLang, t } = useLanguage()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors w-full">
      <Header 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        lang={lang} 
        toggleLang={toggleLang} 
        t={t} 
      />
      <main className="w-full">
        <Hero t={t} />
        <Skills t={t} />
        <Projects t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </div>
  )
}

export default App
