/**
 * Projects.jsx - 项目作品展示区块
 * 
 * 固定高度卡片
 * 图标和标题水平排列
 */

import config from '../config'

export default function Projects({ t }) {
  return (
    <section id="projects" className="py-20 px-6">
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        
        <div className="min-h-[48px] mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white" style={{ lineHeight: '1.3' }}>
            {t(config.projectsSection.title)}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.projects.map((project, index) => (
            <a key={index} href={project.link}
              className="group p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all flex flex-col"
              style={{ height: '280px' }}>
              
              {/* 图标和标题 - 水平排列 */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 group-hover:scale-110 transition-transform flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white" style={{ lineHeight: '1.4' }}>
                  {t(project.title)}
                </h3>
              </div>
              
              {/* 项目描述 */}
              <div className="flex-grow mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400" style={{ lineHeight: '1.7' }}>
                  {t(project.description)}
                </p>
              </div>
              
              {/* 技术标签 */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
