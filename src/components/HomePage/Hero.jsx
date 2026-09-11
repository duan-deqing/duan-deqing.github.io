/**
 * Hero — 右栏开场（Brittany 式内容栏内的介绍区）
 */

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import config from '../../config'
import MagneticButton from '../shared/MagneticButton'
import ArrowIcon from '../shared/ArrowIcon'

function SplitChars({ text }) {
  const chars = useMemo(() => Array.from(text || ''), [text])
  return (
    <span aria-label={text}>
      {chars.map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="char-split"
          style={{ animationDelay: `${0.08 + i * 0.055}s` }}
          aria-hidden
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  )
}

export default function Hero({ t }) {
  const { personal } = config
  const name = t(personal.titleName) || 'STYLAN'

  return (
    <section id="hero" className="relative py-16 sm:py-20 lg:py-24 bg-grid -mx-6 lg:-mx-10 px-6 lg:px-10">
      <div className="section-inner">
        <p
          className="font-mono-ui text-[11px] sm:text-xs tracking-[0.16em] uppercase mb-6 rise-in"
          style={{ color: 'var(--accent)' }}
        >
          {t(personal.titlePrefix)}
        </p>

        <h1
          className="font-display font-semibold text-ink leading-[0.95] tracking-[-0.035em] rise-in"
          style={{ fontSize: 'clamp(2.75rem, 10vw, 4.5rem)' }}
        >
          <SplitChars text={name} />
        </h1>

        <div
          className="mt-6 h-px w-16 rise-in rise-in-delay-1"
          style={{ background: 'var(--accent)' }}
        />

        <p className="mt-7 max-w-xl text-[15px] sm:text-base text-muted leading-[1.75] rise-in rise-in-delay-2">
          {t(personal.bio)}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2 rise-in rise-in-delay-3">
          {(personal.tags || []).map((tag) => (
            <span
              key={t(tag)}
              className="font-mono-ui text-[10px] sm:text-[11px] tracking-[0.08em] uppercase px-2.5 py-1 rounded-sm border border-line text-muted"
            >
              {t(tag)}
            </span>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3 rise-in rise-in-delay-4">
          <MagneticButton as="a" href="#work" strength={10} variant="primary">
            <span className="btn-label">{t({ en: 'View work', zh: '查看项目' })}</span>
            <span className="btn-arrow">
              <ArrowIcon direction="down" size={15} />
            </span>
          </MagneticButton>
          <Link to="/contact" className="btn btn-secondary">
            <span className="btn-label">{t({ en: 'Contact', zh: '联系我' })}</span>
            <span className="btn-arrow">
              <ArrowIcon direction="right" size={15} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
