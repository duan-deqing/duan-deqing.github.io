import config from '../../content/site.yaml'

const DEFAULT_FOCUS = [
  { en: 'LLM applications', zh: '大模型应用' },
  { en: 'RAG systems', zh: 'RAG 检索增强' },
  { en: 'Full-stack delivery', zh: '全栈交付' },
  { en: 'Design-aware engineering', zh: '有设计感的工程' },
]

export default function AboutSection({ t }) {
  const focus = config.about?.focus || DEFAULT_FOCUS

  return (
    <section id="about" className="border-t border-line py-12 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[15rem_1fr] lg:gap-12">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink">
            {t({ en: 'About', zh: '关于我' })}
          </h2>
          <ul className="mt-4 space-y-2">
            {focus.map((item) => (
              <li key={item.en} className="font-mono-ui text-[11px] uppercase tracking-[0.07em] text-muted">
                {t(item)}
              </li>
            ))}
          </ul>
        </div>

        <div className="max-w-[42rem] space-y-4 text-[15px] leading-[1.85] text-muted">
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
      </div>
    </section>
  )
}
