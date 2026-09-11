/**
 * SubPageShell — 子页元信息壳（布局由 App 提供）
 */

import SiteLayout from './SiteLayout'

export default function SubPageShell({ title, description, t, lang, children, showFooter = false }) {
  return (
    <SiteLayout
      title={title}
      description={description}
      t={t}
      lang={lang}
      showFooter={showFooter}
    >
      {children}
    </SiteLayout>
  )
}
