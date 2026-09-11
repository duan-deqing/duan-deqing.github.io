/**
 * SectionKicker — 编号章节头：01 / ABOUT / 关于
 */

export default function SectionKicker({ num, en, zh, t, id }) {
  return (
    <div id={id} className="section-kicker scroll-mt-8 mb-8">
      <span className="num">{num}</span>
      <span>{en}</span>
      {zh ? <span className="opacity-60">/ {t ? t({ en: '', zh }) || zh : zh}</span> : null}
      <span
        className="flex-1 h-px ml-2"
        style={{ background: 'var(--line)', alignSelf: 'center' }}
        aria-hidden
      />
    </div>
  )
}
