import ConfigSection from '../sections/ConfigSection'
import ConflictDialog from '../components/ConflictDialog'
import AdminPanel from '../components/AdminPanel'
import { getIn } from '../lib/objectPath'
import { getContentSection } from '../schema'
import { displayText } from '../lib/display'
import { useAdminT } from '../i18n'

function ReadonlyNavPanel({ links }) {
  const t = useAdminT()
  return (
    <AdminPanel
      id="panel-nav"
      title={t('导航（只读）')}
      note={t('由 content/site.yaml 维护，后台不再编辑')}
      collapsible
      defaultOpen={false}
    >
      {links.length === 0 ? (
        <p className="text-sm text-muted">{t('暂无导航项')}</p>
      ) : (
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li
              key={`${link.href || 'link'}-${index}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-subtle px-3 py-2"
            >
              <span className="text-sm font-medium text-heading">
                {displayText(link.label, t('未命名'))}
              </span>
              <span className="font-mono text-[11px] text-muted">{link.href || '—'}</span>
            </li>
          ))}
        </ul>
      )}
    </AdminPanel>
  )
}

function sectionNote(value, t) {
  if (Array.isArray(value)) return `${value.length} ${t('项')}`
  if (value && typeof value === 'object') return `${Object.keys(value).length} ${t('项')}`
  return ''
}

export default function ConfigView({
  page,
  draft,
  extra = null,
  extraTitle = '',
  itemActions = null,
}) {
  const t = useAdminT()
  const sections = page.sections || []
  const navLinks = draft.documents.site?.navLinks
  const labels = sections.map((definition) => ({
    id: `panel-${definition.id}`,
    title: t(definition.title),
  }))
  if (page.readonlyNav) labels.push({ id: 'panel-nav', title: t('导航（只读）') })
  if (extra) labels.push({ id: 'panel-extra', title: t(extraTitle) })

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1 className="admin-page-title">{t(page.label)}</h1>
        <p className="admin-page-desc">{t(page.description)}</p>
      </div>

      {labels.length > 1 ? (
        <nav className="admin-subnav" aria-label={t('本页分区')}>
          {labels.map((item) => (
            <button
              key={item.id}
              type="button"
              className="admin-subnav-btn"
              onClick={() => scrollTo(item.id)}
            >
              {item.title}
            </button>
          ))}
        </nav>
      ) : null}

      {draft.error ? (
        <p className="admin-alert is-error">{draft.error}</p>
      ) : draft.notice ? (
        <p className="admin-alert is-ok">{t(draft.notice)}</p>
      ) : null}

      <div className="admin-sections">
        {sections.map((definition) => {
          const section = getContentSection(definition.id)
          if (!section) return null
          const value = getIn(draft.documents[section.doc], section.path)
          return (
            <AdminPanel
              key={definition.id}
              id={`panel-${definition.id}`}
              title={t(definition.title || section.label)}
              note={sectionNote(value, t)}
              collapsible={Boolean(definition.collapsible)}
              defaultOpen={definition.defaultOpen !== false}
            >
              <ConfigSection
                section={section}
                value={value}
                itemActions={definition.id === 'projects' ? itemActions : null}
                onFieldChange={(key, next) =>
                  draft.update(section.doc, [...section.path, key], next)
                }
                onListChange={(next) => draft.update(section.doc, section.path, next)}
              />
            </AdminPanel>
          )
        })}

        {page.readonlyNav && Array.isArray(navLinks) ? (
          <ReadonlyNavPanel links={navLinks} />
        ) : null}

        {extra ? (
          <div id="panel-extra" className="scroll-mt-4">
            {extra}
          </div>
        ) : null}
      </div>

      <ConflictDialog
        open={Boolean(draft.conflict)}
        title={t('配置已被外部修改')}
        message={draft.conflict?.message}
        primaryLabel={t('用我的版本覆盖')}
        onPrimary={() => draft.resolveConflict('local')}
        secondaryLabel={t('加载磁盘版本')}
        onSecondary={() => draft.resolveConflict('server')}
        onCancel={() => draft.resolveConflict('cancel')}
      />
    </div>
  )
}
