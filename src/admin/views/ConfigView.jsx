import ConfigSection from '../sections/ConfigSection'
import ConflictDialog from '../components/ConflictDialog'
import { getIn } from '../lib/objectPath'
import { displayText } from '../lib/display'
import { getContentSection } from '../schema'

function ReadonlyNavPanel({ links }) {
  return (
    <section className="admin-panel">
      <header className="admin-panel-head">
        <span className="admin-panel-title">导航（只读）</span>
        <span className="admin-panel-note">由 content/site.yaml 维护，后台不再编辑</span>
      </header>
      <div className="admin-panel-body">
        {links.length === 0 ? (
          <p className="text-sm text-muted">暂无导航项</p>
        ) : (
          <ul className="space-y-2">
            {links.map((link, index) => (
              <li
                key={`${link.href || 'link'}-${index}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-subtle px-3 py-2"
              >
                <span className="text-sm font-medium text-heading">
                  {displayText(link.label, '未命名')}
                </span>
                <span className="font-mono text-[11px] text-muted">{link.href || '—'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default function ConfigView({ page, draft, extra = null }) {
  const sections = page.sections || []
  const navLinks = draft.documents.site?.navLinks

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1 className="admin-page-title">{page.label}</h1>
        <p className="admin-page-desc">{page.description}</p>
      </div>

      <div className="mb-4">
        {draft.error ? (
          <span className="admin-error">{draft.error}</span>
        ) : draft.notice ? (
          <span className="admin-ok">{draft.notice}</span>
        ) : (
          <span className="admin-panel-note">
            {draft.dirty ? `${draft.dirtyCount} 处未保存修改` : '改动需保存后生效'}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {sections.map((definition) => {
          const section = getContentSection(definition.id)
          if (!section) return null
          const value = getIn(draft.documents[section.doc], section.path)
          return (
            <section className="admin-panel" key={definition.id}>
              <header className="admin-panel-head">
                <span className="admin-panel-title">{definition.title || section.label}</span>
              </header>
              <div className="admin-panel-body">
                <ConfigSection
                  section={section}
                  value={value}
                  onFieldChange={(key, next) =>
                    draft.update(section.doc, [...section.path, key], next)
                  }
                  onListChange={(next) => draft.update(section.doc, section.path, next)}
                />
              </div>
            </section>
          )
        })}

        {page.readonlyNav && Array.isArray(navLinks) ? (
          <ReadonlyNavPanel links={navLinks} />
        ) : null}

        {extra}
      </div>

      <ConflictDialog
        open={Boolean(draft.conflict)}
        title="配置已被外部修改"
        message={draft.conflict?.message}
        primaryLabel="用我的版本覆盖"
        onPrimary={() => draft.resolveConflict('local')}
        secondaryLabel="加载磁盘版本"
        onSecondary={() => draft.resolveConflict('server')}
        onCancel={() => draft.resolveConflict('cancel')}
      />
    </div>
  )
}
