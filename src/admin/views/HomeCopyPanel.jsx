import { useEffect, useState } from 'react'
import MarkdownFilePanel from '../components/MarkdownFilePanel'
import { useHomeFiles } from '../hooks/contentFiles'
import { pickContent, useAdminLang, useAdminT } from '../i18n'

export default function HomeCopyPanel({ onDirtyChange }) {
  const t = useAdminT()
  const lang = useAdminLang()
  const files = useHomeFiles()
  const [activeKey, setActiveKey] = useState('index.zh')

  useEffect(() => {
    onDirtyChange?.(files.dirty)
  }, [files.dirty, onDirtyChange])

  const items = files.items.map((file) => ({
    ...file,
    label: pickContent(file.label, lang, file.id),
    hint: file.path,
  }))

  return (
    <MarkdownFilePanel
      id="panel-home"
      title={t('首页文案')}
      description={t('content/home 下的 Markdown 会原样写入磁盘，编辑后按文件单独保存。')}
      items={items}
      activeKey={activeKey}
      onSelect={setActiveKey}
      dirtyKeys={files.dirtyKeys}
      savingKey={files.savingKey}
      loading={files.loading}
      error={files.error}
      notice={files.notice}
      onUpdate={files.update}
      onSave={files.saveOne}
      onDiscard={files.discard}
      onReload={files.reload}
    />
  )
}
