/**
 * ContactPage — 编号联系列表 + 简历 + 微信浮层
 */

import { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import SubPageShell from '../components/shared/SubPageShell'
import ArrowIcon from '../components/shared/ArrowIcon'
import CopyButton from '../components/shared/CopyButton'
import config from '../config'

function ContactPage() {
  const { lang, t } = useLanguage()
  const { contactPage } = config
  const [hoveredWechat, setHoveredWechat] = useState(false)

  const methods = contactPage?.contactMethods || []

  return (
    <SubPageShell
      title={t({ en: 'STYLAN · Contact', zh: 'STYLAN · 联系' })}
      description={contactPage?.description}
      t={t}
      lang={lang}
    >
      <section className="pt-8 pb-10 border-b border-line bg-grid -mx-6 lg:-mx-10 px-6 lg:px-10">
        <p className="section-kicker mb-6">
          <span className="num">05</span>
          <span>CONTACT</span>
          <span className="opacity-60">/ {t({ en: '', zh: '联系' })}</span>
        </p>
        <h1
          className="font-display font-semibold text-ink leading-[1.05] tracking-tight"
          style={{ fontSize: 'clamp(2.25rem, 6vw, 4rem)' }}
        >
          {t(contactPage?.title) || 'CONTACT'}
        </h1>
        <p className="mt-4 max-w-xl text-muted leading-relaxed">
          {t(contactPage?.description)}
        </p>
      </section>

      <section className="py-10 flex-grow">
        <div className="border-t border-line relative row-link-list">
          {methods.map((method, index) => {
            const isEmail = method.icon === 'email'
            const isWechat = method.icon === 'wechat'
            const external = method.href?.startsWith('http')

            const body = (
              <>
                <span className="row-num">{String(index + 1).padStart(2, '0')}</span>
                <span className="min-w-0">
                  <span className="row-title block text-lg sm:text-xl">
                    {t(method.label)}
                  </span>
                  <span className="block mt-1 font-mono-ui text-xs text-muted truncate">
                    {method.value}
                  </span>
                </span>
              </>
            )

            const meta = (
              <span className="row-meta flex items-center justify-end gap-2 shrink-0">
                {isEmail && (
                  <CopyButton
                    value={method.value}
                    label={{
                      copy: t({ en: 'Copy', zh: '复制' }),
                      copied: t({ en: 'Copied', zh: '已复制' }),
                      failed: t({ en: 'Failed', zh: '失败' }),
                    }}
                  />
                )}
                {!isEmail &&
                  (method.href ? (
                    <ArrowIcon direction={external ? 'up-right' : 'right'} size={16} />
                  ) : (
                    <ArrowIcon direction="right" size={16} />
                  ))}
              </span>
            )

            return (
              <div
                key={method.icon || index}
                className="relative"
                onMouseEnter={() => isWechat && setHoveredWechat(true)}
                onMouseLeave={() => isWechat && setHoveredWechat(false)}
              >
                {method.href && !isEmail ? (
                  <a
                    href={method.href}
                    className="row-link"
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                  >
                    {body}
                    {meta}
                  </a>
                ) : (
                  <div className={`row-link ${isEmail ? '' : 'cursor-default'}`}>
                    {body}
                    {meta}
                  </div>
                )}

                {isWechat && method.qrcode && hoveredWechat && (
                  <div className="absolute right-0 top-full z-20 mt-2 p-3 rounded border border-line bg-elevated shadow-xl">
                    <img
                      src={method.qrcode}
                      alt="WeChat"
                      className="w-36 h-36 sm:w-40 sm:h-40 object-contain"
                    />
                    <p className="mt-2 text-center font-mono-ui text-[10px] text-muted">
                      {t({ en: 'Scan to add', zh: '扫码添加' })}
                    </p>
                  </div>
                )}
              </div>
            )
          })}

          <a href="/resume.pdf" download className="row-link">
            <span className="row-num">{String(methods.length + 1).padStart(2, '0')}</span>
            <span>
              <span className="row-title block text-lg sm:text-xl">
                {t({ en: 'Resume', zh: '简历' })}
              </span>
              <span className="block mt-1 font-mono-ui text-xs text-muted">
                {t({ en: 'Download PDF', zh: '下载 PDF' })}
              </span>
            </span>
            <span className="row-meta inline-flex items-center justify-end">
              <ArrowIcon direction="right" size={16} />
            </span>
          </a>
        </div>
      </section>

    </SubPageShell>
  )
}

export default ContactPage
