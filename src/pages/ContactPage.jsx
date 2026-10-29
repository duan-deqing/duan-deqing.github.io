import { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import config from '../content/site.yaml'
import PageTitle from '../components/shared/PageTitle'
import PageHeader from '../components/shared/PageHeader'
import ArrowIcon from '../components/shared/ArrowIcon'
import CopyButton from '../components/shared/CopyButton'

export default function ContactPage() {
  const { lang, t } = useLanguage()
  const { contactPage } = config
  const [openQr, setOpenQr] = useState(false)
  const methods = contactPage?.contactMethods || []
  const emailMethod = methods.find((method) => method.icon === 'email')
  const emailValue = emailMethod?.value || config.contact?.email || ''

  return (
    <>
      <PageTitle
        title={t({ en: 'STYLAN · Contact', zh: 'STYLAN · 联系' })}
        description={t(contactPage?.description)}
        t={t}
        lang={lang}
      />
      <PageHeader
        kicker="CONTACT"
        title={t(contactPage?.title) || 'CONTACT'}
        description={t(contactPage?.description)}
      />

      <section className="grid gap-10 py-10 sm:py-12 lg:grid-cols-[1fr_20rem] lg:gap-12">
        <div>
          <a
            href={`mailto:${emailValue}`}
            className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-page transition-colors hover:bg-accent"
          >
            {t({ en: 'Email me', zh: '发送邮件' })}
            <ArrowIcon direction="up-right" size={14} />
          </a>

          <ul className="mt-8 border-t border-line">
            {methods.map((method) => {
              const isWechat = method.icon === 'wechat'
              const isEmail = method.icon === 'email'
              const external = method.href?.startsWith('http')

              return (
                <li key={method.icon || method.value} className="border-b border-line">
                  <div className="flex items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium text-ink">{t(method.label)}</p>
                      <p className="mt-0.5 truncate font-mono-ui text-[11px] text-muted">
                        {method.value}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {isEmail ? (
                        <CopyButton
                          value={method.value}
                          label={{
                            copy: t({ en: 'Copy', zh: '复制' }),
                            copied: t({ en: 'Copied', zh: '已复制' }),
                            failed: t({ en: 'Failed', zh: '失败' }),
                          }}
                        />
                      ) : null}

                      {isWechat ? (
                        <button
                          type="button"
                          onClick={() => setOpenQr((value) => !value)}
                          aria-expanded={openQr}
                          aria-label={t({ en: 'Show WeChat QR code', zh: '显示微信二维码' })}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-subtle hover:text-ink"
                        >
                          <ArrowIcon direction={openQr ? 'down' : 'right'} size={15} />
                        </button>
                      ) : method.href ? (
                        <a
                          href={method.href}
                          target={external ? '_blank' : undefined}
                          rel={external ? 'noopener noreferrer' : undefined}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-subtle hover:text-ink"
                          aria-label={t(method.label)}
                        >
                          <ArrowIcon direction={external ? 'up-right' : 'right'} size={15} />
                        </a>
                      ) : null}
                    </div>
                  </div>

                  {isWechat && openQr && method.qrcode ? (
                    <div className="pb-4">
                      <img
                        src={method.qrcode}
                        alt={t({ en: 'WeChat QR code', zh: '微信二维码' })}
                        width="160"
                        height="160"
                        loading="lazy"
                        decoding="async"
                        className="h-40 w-40 rounded-md border border-line bg-white object-contain p-2"
                      />
                      <p className="mt-2 font-mono-ui text-[10px] text-muted">
                        {t({ en: 'Scan to add', zh: '扫码添加' })}
                      </p>
                    </div>
                  ) : null}
                </li>
              )
            })}

            <li className="border-b border-line">
              <a
                href="/resume.pdf"
                download
                className="flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <p className="text-[15px] font-medium text-ink">
                    {t({ en: 'Resume', zh: '简历' })}
                  </p>
                  <p className="mt-0.5 font-mono-ui text-[11px] text-muted">
                    {t({ en: 'Download PDF', zh: '下载 PDF' })}
                  </p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center text-muted">
                  <ArrowIcon direction="down" size={15} />
                </span>
              </a>
            </li>
          </ul>
        </div>

        {contactPage?.image ? (
          <div>
            <img
              src={contactPage.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="aspect-[3/4] w-full rounded-lg border border-line object-cover"
            />
          </div>
        ) : null}
      </section>
    </>
  )
}
