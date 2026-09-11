/**
 * Contact — 05 编号联系列表
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import config from '../../config'
import SectionKicker from '../shared/SectionKicker'
import MagneticButton from '../shared/MagneticButton'
import ArrowIcon from '../shared/ArrowIcon'

export default function Contact({ t }) {
  const { contact, contactPage, socialLinks } = config
  const [hoveredWechat, setHoveredWechat] = useState(false)

  const rows = [
    {
      label: { en: 'GitHub', zh: 'GitHub' },
      value: 'duan-deqing',
      href: 'https://github.com/duan-deqing',
    },
    {
      label: { en: 'Email', zh: '邮箱' },
      value: contact?.email || 'duan-deqing@foxmail.com',
      href: `mailto:${contact?.email || 'duan-deqing@foxmail.com'}`,
    },
    ...(socialLinks || [])
      .filter((s) => !/github/i.test(s.platform))
      .map((s) => ({
        label: { en: s.platform, zh: s.platform },
        value: s.platform,
        href: s.url,
      })),
    {
      label: { en: 'WeChat', zh: '微信' },
      value: '-stylan-',
      href: null,
      qrcode: contactPage?.contactMethods?.find((m) => m.icon === 'wechat')?.qrcode,
    },
    {
      label: { en: 'Resume', zh: '简历' },
      value: { en: 'Download PDF', zh: '下载 PDF' },
      href: '/resume.pdf',
    },
  ]

  return (
    <section className="py-14 sm:py-16 border-t border-line">
      <div className="section-inner">
        <SectionKicker num="05" en="CONTACT" zh="联系" t={t} id="contact" />

        <div className="mb-10 max-w-2xl prose-measure">
          <h2 className="font-display text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] font-semibold text-ink mb-4 tracking-[-0.02em] leading-[1.15]">
            {t(contact?.title) || t({ en: 'Get in touch', zh: '联系我' })}
          </h2>
          <p className="text-[15px] text-muted leading-[1.8]">
            {t(contact?.description)}
          </p>
        </div>

        <div className="border-t border-line relative row-link-list">
          {rows.map((row, index) => {
            const content = (
              <>
                <span className="row-num">{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <span className="row-title block !text-[1.15rem] sm:!text-[1.35rem]">
                    {t(row.label)}
                  </span>
                  <span className="block mt-1.5 font-mono-ui text-[11px] text-muted">
                    {t(row.value)}
                  </span>
                </span>
                <span className="row-meta inline-flex items-center justify-end">
                  <ArrowIcon direction="right" size={16} />
                </span>
              </>
            )

            if (row.href) {
              const external = row.href.startsWith('http')
              return (
                <a
                  key={t(row.label)}
                  href={row.href}
                  className="row-link"
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  download={row.href.endsWith('.pdf') ? true : undefined}
                >
                  {content}
                </a>
              )
            }

            return (
              <div
                key={t(row.label)}
                className="row-link cursor-default relative"
                onMouseEnter={() => row.qrcode && setHoveredWechat(true)}
                onMouseLeave={() => row.qrcode && setHoveredWechat(false)}
              >
                {content}
                {row.qrcode && hoveredWechat && (
                  <div className="absolute right-0 top-full z-20 mt-2 p-3 rounded border border-line bg-elevated shadow-xl">
                    <img
                      src={row.qrcode}
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
        </div>

        <div className="mt-12">
          <MagneticButton as={Link} to="/contact" strength={12} variant="secondary">
            <span className="btn-label">{t({ en: 'Open contact page', zh: '进入联系页' })}</span>
            <span className="btn-arrow">
              <ArrowIcon direction="right" size={15} />
            </span>
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
