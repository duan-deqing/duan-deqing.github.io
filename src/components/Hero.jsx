/**
 * Hero.jsx - 首页主视觉区块
 * 
 * 高度为屏幕高度
 * 内容水平垂直居中
 */

import config from '../config'
import AnimatedText from './AnimatedText'

export default function Hero({ t }) {
  const { personal, buttons } = config

  return (
    <section className="px-6 flex items-center justify-center" style={{ height: '100vh' }}>
      <div style={{ maxWidth: '64rem', width: '100%' }}>
        
        {/* 主标题 */}
        <div className="min-h-[120px] md:min-h-[144px] lg:min-h-[168px]">
          <AnimatedText as="h1" className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white" style={{ lineHeight: '1.1' }}>
            {t(personal.title)}
          </AnimatedText>
        </div>
        
        {/* 个人简介 */}
        <div className="min-h-[80px] mb-10">
          <AnimatedText 
            as="p" 
            className="text-lg md:text-xl text-gray-500 dark:text-gray-400" 
            style={{ 
              lineHeight: '1.8', 
              whiteSpace: 'pre-wrap', 
              wordBreak: 'break-word' 
            }}
          >
            {t(personal.bio)}
          </AnimatedText>
        </div>
        
        {/* 行动按钮 - 小屏幕垂直排列，大屏幕水平排列 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a href={buttons.primary.href} className="btn btn-primary">
            {t(buttons.primary.text)}
          </a>
          <a href={buttons.secondary.href} className="btn btn-secondary">
            {t(buttons.secondary.text)}
          </a>
        </div>
      </div>
    </section>
  )
}
