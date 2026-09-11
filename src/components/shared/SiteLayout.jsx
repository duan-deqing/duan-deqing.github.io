/**
 * SiteLayout — 首页用；子页由 App 的 Subpage 壳提供
 * 保留 PageTitle，便于子页仍可设置 SEO
 */

import PageTitle from './PageTitle'

export default function SiteLayout({
  title,
  description,
  t,
  lang,
  children,
  showFooter = true,
  footerExtra = null,
}) {
  return (
    <>
      <PageTitle title={title} description={description} t={t} lang={lang} />
      {children}
      {showFooter && (
        <footer className="site-footer">
          <p className="font-mono-ui text-[11px] text-muted tracking-wider">
            © {new Date().getFullYear()} STYLAN
          </p>
          {footerExtra}
        </footer>
      )}
    </>
  )
}
