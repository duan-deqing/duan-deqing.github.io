import { useLanguage } from '../hooks/useLanguage'
import PageTitle from '../components/shared/PageTitle'
import PageHeading from '../components/site/PageHeading'
import ParentLink from '../components/site/ParentLink'

export default function NotFoundPage() {
  const { lang, t } = useLanguage()

  return (
    <div className="slide-enter-content mx-auto w-full max-w-3xl">
      <PageTitle
        title={`STYLAN · ${t({ en: 'Not found', zh: '页面未找到' })}`}
        description={t({
          en: 'This link might be broken, deleted, or moved.',
          zh: '这个链接可能已损坏、被删除或移动。',
        })}
        t={t}
        lang={lang}
        noindex
      />
      <PageHeading title={t({ en: 'Not found', zh: '页面未找到' })} />
      <p className="max-w-prose text-base leading-[1.75] text-muted">
        {t({
          en: 'This link might be broken, deleted, or moved. Nevertheless, there’s nothing to see here…',
          zh: '这个链接可能已损坏、被删除或移动。总之，这里没有内容可看…',
        })}
      </p>
      <ParentLink
        to="/"
        label={t({ en: 'Back home', zh: '返回首页' })}
        className="mt-6"
      />
    </div>
  )
}
