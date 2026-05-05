/**
 * ============================================================================
 *  Hero.jsx - 首页主视觉区块
 * ============================================================================
 * 
 * 【功能说明】
 * 1. 高度为屏幕高度 (100vh)
 * 2. 左右两栏布局（移动端单栏）
 * 3. 左侧：标题、简介、标签、按钮
 * 4. 右侧：可自定义展示区域（图片/SVG/代码等）
 * 5. 主标题和简介带逐字出现动画
 * 
 * 【Props】
 * - t: function - 翻译函数
 * 
 * 【自定义提示】
 * - 修改标题: 在 config.js 中修改 personal.titlePrefix/titleName
 * - 修改简介: 在 config.js 中修改 personal.bio
 * - 修改按钮: 在 config.js 中修改 buttons
 * - 修改右侧内容: 在 config.js 中修改 personal.heroRight
 * ============================================================================
 */

import { Link } from 'react-router-dom'
import config from '../../config'
import AnimatedText from './AnimatedText'
import WaveAnimation from './WaveAnimation'

// 渲染右侧内容
function HeroRightContent({ heroRight, t }) {
  if (!heroRight) return null

  switch (heroRight.type) {
    case 'image':
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={heroRight.src}
            alt={t(heroRight.alt)}
            className="max-w-full max-h-[500px] object-contain rounded-2xl"
          />
        </div>
      )

    case 'svg':
      return (
        <div 
          className="w-full h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: heroRight.content }} 
        />
      )

    case 'wave':
      return (
        <div className="w-full rounded-2xl overflow-hidden border-0" style={{ height: '500px' }}>
          <WaveAnimation
            width={heroRight.width || 500}
            height={heroRight.height || 500}
            color={heroRight.color || '#3b82f6'}
          />
        </div>
      )

    case 'code':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full max-w-md rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
            {/* 代码块标题栏 */}
            <div className="px-4 py-3 flex items-center gap-2 bg-gray-100 dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              {heroRight.language && (
                <span className="ml-2 text-xs font-mono text-gray-500 dark:text-gray-400">
                  {heroRight.language}
                </span>
              )}
            </div>
            {/* 代码内容 */}
            <pre className="p-4 bg-gray-50 dark:bg-gray-900 overflow-x-auto">
              <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                {heroRight.code}
              </code>
            </pre>
          </div>
        </div>
      )

    default:
      return null
  }
}

export default function Hero({ t }) {
  const { personal, buttons } = config
  const hasHeroRight = personal.heroRight && personal.heroRight.type

  return (
    <section className="px-6 flex items-center justify-center" style={{ height: '100vh' }}>
      <div className="max-w-7xl w-full mx-auto">
        <div className={`grid gap-12 items-center ${hasHeroRight ? 'lg:grid-cols-2' : 'grid-cols-1 justify-items-center'}`}>
          
          {/* 左侧内容 */}
          <div className={hasHeroRight ? '' : 'max-w-3xl'}>
            {/* 主标题 - 前缀小字 + 名字大字（渐变下划线） */}
            <div className="mb-6">
              <AnimatedText 
                as="p" 
                className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-2" 
                style={{ lineHeight: '1.4' }}
              >
                {t(personal.titlePrefix)}
              </AnimatedText>
              <div className="inline-block">
                <AnimatedText 
                  as="h1" 
                  className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white" 
                  style={{ lineHeight: '1.1' }}
                >
                  {t(personal.titleName)}
                </AnimatedText>
                <div className="h-2 mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-gradient-x" />
              </div>
            </div>
            
            {/* 个人简介 */}
            <div className="min-h-[80px] mb-8">
              <div className={hasHeroRight ? '' : 'inline-block'}>
                <AnimatedText 
                  as="p" 
                  className={`text-lg md:text-xl text-gray-500 dark:text-gray-400 ${hasHeroRight ? '' : 'text-center'}`}
                  style={{ lineHeight: '1.8' }}
                >
                  {t(personal.bio)}
                </AnimatedText>
              </div>
            </div>
            
            {/* 个人标签卡片 */}
            {personal.tags && personal.tags.length > 0 && (
              <div className="mb-10">
                <div className={`relative p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x ${hasHeroRight ? 'inline-block' : 'inline-block'}`}>
                  <div className="bg-white dark:bg-gray-900 rounded-2xl px-6 py-4">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {personal.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-lg text-gray-700 dark:text-gray-200 border border-gray-200/50 dark:border-gray-700/50"
                        >
                          {t(tag)}
                        </span>
                      ))}
                    </div>
                    {personal.tagDescription && (
                      <p className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50 text-sm text-gray-500 dark:text-gray-400 text-center">
                        {t(personal.tagDescription)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* 行动按钮 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={buttons.primary.href} className="btn btn-primary">
                {t(buttons.primary.text)}
              </Link>
              <a href={buttons.secondary.href} className="btn btn-secondary">
                {t(buttons.secondary.text)}
              </a>
            </div>
          </div>

          {/* 右侧展示区域 */}
          {hasHeroRight && (
            <div className="hidden lg:block">
              <HeroRightContent heroRight={personal.heroRight} t={t} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
