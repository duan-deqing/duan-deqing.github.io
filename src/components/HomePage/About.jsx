/**
 * About — 右栏纯文字介绍（Brittany 式）+ 方向列表
 */

import config from '../../config'

const FOCUS = [
  { en: 'LLM applications', zh: '大模型应用' },
  { en: 'RAG systems', zh: 'RAG 检索增强' },
  { en: 'Full-stack delivery', zh: '全栈交付' },
  { en: 'Design-aware engineering', zh: '有设计感的工程' },
]

export default function About({ t }) {
  return (
    <section id="about" className="pt-8 sm:pt-0 pb-14 sm:pb-16 scroll-mt-20 lg:scroll-mt-8">
      <p className="section-kicker mb-5 sm:mb-6">
        <span className="num">01</span>
        <span>ABOUT</span>
        <span className="opacity-60">/ {t({ en: '', zh: '关于' })}</span>
      </p>

      <h2 className="font-display text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] font-semibold text-ink tracking-[-0.02em] leading-[1.15] mb-6 sm:mb-8">
        {t({
          en: 'About',
          zh: '关于我',
        })}
      </h2>

      <div className="space-y-5 text-[15px] sm:text-[17px] text-muted leading-[1.85] prose-measure">
        <p>
          {t({
            en: "I'm an AI application developer focused on turning large language models into reliable products. Most of my work sits at the intersection of RAG systems, agent workflows, and interfaces people actually enjoy using.",
            zh: '我是 AI 应用开发者，专注把大语言模型做成可靠的产品。日常工作主要在 RAG 系统、Agent 工作流，以及人们真正愿意用的界面之间展开。',
          })}
        </p>
        <p>
          {t({
            en: 'I care about structure: pipelines you can trust, code you can read, and UIs that stay calm under complexity. Clear interfaces are not decoration — they are how AI capability becomes usable.',
            zh: '我在意结构：可信任的管线、可读的代码，以及在复杂度下依然克制的界面。清晰的界面不是装饰，而是 AI 能力变得可用的方式。',
          })}
        </p>
        <p>
          {t({
            en: `Currently I build with ${config.personal?.tagDescription?.en || 'LangChain · RAG · LLM'}, and I'm always open to thoughtful collaborations.`,
            zh: `目前主要使用 ${config.personal?.tagDescription?.zh || 'LangChain · RAG · 大模型'} 进行构建，也欢迎认真的合作与交流。`,
          })}
        </p>
      </div>

      <div className="mt-12">
        <p className="font-mono-ui text-[11px] tracking-[0.14em] uppercase text-muted mb-5">
          {t({ en: 'Focus', zh: '方向' })}
        </p>
        <ul>
          {FOCUS.map((item) => (
            <li
              key={item.en}
              className="py-3 border-b border-line font-display text-[15px] sm:text-base text-ink tracking-tight"
            >
              {t(item)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
