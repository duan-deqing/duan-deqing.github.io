/**
 * ============================================================================
 *  Skills.jsx - 技能展示区块
 * ============================================================================
 * 
 * 【功能说明】
 * 1. 按分类展示技术栈
 * 2. 以卡片形式呈现
 * 3. 支持响应式布局（移动端单列，桌面端三列）
 * 
 * 【布局结构】
 * ┌─────────────────────────────────────┐
 * │       Skills & Technologies         │
 * ├───────────┬───────────┬─────────────┤
 * │ Frontend  │ Backend   │ Tools       │
 * │ [React]   │ [Node.js] │ [Git]       │
 * │ [Vue]     │ [Python]  │ [Docker]    │
 * └───────────┴───────────┴─────────────┘
 * 
 * 【Props】
 * - t: function - 翻译函数
 * 
 * 【自定义提示】
 * - 修改技能列表: 在 config.js 中修改 skills 数组
 * - 修改列数: 更改 grid 的 md:grid-cols-3
 * ============================================================================
 */

import config from '../../config'

export default function Skills({ t }) {
  return (
    // 浅灰色背景，与 Hero 区块区分
    <section id="skills" className="py-20 px-6 bg-gray-50 dark:bg-gray-800/50 min-h-[400px]">
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        
        {/* 区块标题 */}
        <div className="min-h-[48px] mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white" style={{ lineHeight: '1.3' }}>
            {t(config.skillsSection.title)}
          </h2>
        </div>
        
        {/* 技能卡片网格 */}
        <div className="grid md:grid-cols-3 gap-8">
          {config.skills.map((skill, index) => (
            <div 
              key={index} 
              className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow min-h-[160px]"
            >
              {/* 分类名称 */}
              <div className="min-h-[32px] mb-4">
                <h3 className="text-lg font-semibold text-blue-500" style={{ lineHeight: '1.4' }}>
                  {t(skill.category)}
                </h3>
              </div>
              
              {/* 技能标签列表 */}
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span 
                    key={item} 
                    className="px-3 py-1.5 text-sm rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
