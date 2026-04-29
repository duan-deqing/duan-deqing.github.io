/**
 * Skills.jsx - 技能展示区块
 * 
 * 不使用动画，直接显示文字
 */

import config from '../config'

export default function Skills({ t }) {
  return (
    <section id="skills" className="py-20 px-6 bg-gray-50 dark:bg-gray-800/50 min-h-[400px]">
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        
        <div className="min-h-[48px] mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white" style={{ lineHeight: '1.3' }}>
            {t(config.skillsSection.title)}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {config.skills.map((skill, index) => (
            <div key={index} className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow min-h-[160px]">
              
              <div className="min-h-[32px] mb-4">
                <h3 className="text-lg font-semibold text-blue-500" style={{ lineHeight: '1.4' }}>
                  {t(skill.category)}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span key={item} className="px-3 py-1.5 text-sm rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" style={{ lineHeight: '1.5' }}>
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
