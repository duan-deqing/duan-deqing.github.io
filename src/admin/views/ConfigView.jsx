import ConfigSection from '../sections/ConfigSection'
import ConflictDialog from '../components/ConflictDialog'
import { getIn } from '../lib/objectPath'

export default function ConfigView({ section, draft }) {
  const value = getIn(draft.documents[section.doc], section.path)
  const status = draft.error || draft.notice

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1 className="admin-page-title">{section.label}</h1>
        <p className="admin-page-desc">修改后点击右上角「保存」写入本地 YAML 配置。</p>
      </div>

      <section className="admin-panel">
        <header className="admin-panel-head">
          <span className="admin-panel-title">字段设置</span>
          {status ? (
            <span className={draft.error ? 'admin-error' : 'admin-ok'}>{status}</span>
          ) : (
            <span className="admin-panel-note">
              {draft.dirty ? `${draft.dirtyCount} 处未保存修改` : '改动需保存后生效'}
            </span>
          )}
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
