/**
 * ============================================================================
 *  Hero.jsx - 首页主视觉区块
 * ============================================================================
 * 
 * 【功能说明】
 * 1. 高度为屏幕高度 (100vh)
 * 2. 内容水平垂直居中
 * 3. 主标题和简介带逐字出现动画
 * 4. 按钮直接显示，无动画
 * 5. 小屏幕时按钮垂直排列
 * 
 * 【布局结构】
 * ┌─────────────────────────────────────┐
 * │                                     │
 * │    Hi, I'm Developer  (主标题)       │
 * │    Full-stack developer... (简介)    │
 * │                                     │
 * │    [Get in touch] [View projects]   │
 * │                                     │
 * └─────────────────────────────────────┘
 * 
 * 【Props】
 * - t: function - 翻译函数
 * 
 * 【自定义提示】
 * - 修改标题: 在 config.js 中修改 personal.title
 * - 修改简介: 在 config.js 中修改 personal.bio
 * - 修改按钮: 在 config.js 中修改 buttons
 * ============================================================================
 */

import { Link } from 'react-router-dom'
import config from '../../config'
import AnimatedText from './AnimatedText'

export default function Hero({ t }) {
  const { personal, buttons } = config

  return (
    // 高度为屏幕高度，内容居中
    <section className="px-6 flex items-center justify-center" style={{ height: '100vh' }}>
      <div style={{ maxWidth: '64rem', width: '100%' }}>
        
        {/* 主标题 - 前缀小字 + 名字大字 */}
        <div className="mb-6">
          <AnimatedText 
            as="p" 
            className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-2" 
            style={{ lineHeight: '1.4' }}
          >
            {t(personal.titlePrefix)}
          </AnimatedText>
          <AnimatedText 
            as="h1" 
            className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white" 
            style={{ lineHeight: '1.1' }}
          >
            {t(personal.titleName)}
          </AnimatedText>
        </div>
        
        {/* 个人标签卡片 - 渐变边框动画 */}
        {personal.tags && personal.tags.length > 0 && (
          <div className="mb-8">
            <div className="relative inline-block p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x">
              <div className="bg-white dark:bg-gray-900 rounded-2xl px-6 py-4">
                {/* 标签列表 */}
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
                {/* 描述文字 */}
                {personal.tagDescription && (
                  <p className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50 text-sm text-gray-500 dark:text-gray-400 text-center">
                    {t(personal.tagDescription)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* 个人简介 - 带逐字动画 */}
        <div className="min-h-[80px] mb-10">
          <AnimatedText 
            as="p" 
            className="text-lg md:text-xl text-gray-500 dark:text-gray-400" 
            style={{ lineHeight: '1.8' }}
          >
            {t(personal.bio)}
          </AnimatedText>
        </div>
        
        {/* 行动按钮 - 无动画，小屏幕垂直排列 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to={buttons.primary.href} className="btn btn-primary">
            {t(buttons.primary.text)}
          </Link>
          <a href={buttons.secondary.href} className="btn btn-secondary">
            {t(buttons.secondary.text)}
          </a>
        </div>
      </div>
    </section>
  )
}
