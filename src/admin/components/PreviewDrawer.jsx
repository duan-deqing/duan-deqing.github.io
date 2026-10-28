import { useEffect } from 'react'

const PAGES = [
  { path: '/', label: '首页' },
  { path: '/skills', label: '技能' },
  { path: '/projects', label: '项目' },
  { path: '/blog', label: '博客' },
  { path: '/contact', label: '联系' },
]

const DEVICES = [
  { id: 'desktop', label: '桌面', width: '100%' },
  { id: 'tablet', label: '平板', width: '768px' },
  { id: 'mobile', label: '手机', width: '390px' },
]

export default function PreviewDrawer({
  open,
  onClose,
  page,
  onPageChange,
  device,
  onDeviceChange,
  iframeRef,
}) {
  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  const width = DEVICES.find((item) => item.id === device)?.width || '100%'

  return (
    <div className="preview-backdrop" onClick={onClose}>
      <div
        className="preview-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="站点预览"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="preview-head">
          <div className="preview-head-group">
            <span className="admin-label-text">站点预览</span>
            <select
              className="admin-input preview-page-select"
              aria-label="预览页面"
              value={page}
              onChange={(event) => onPageChange(event.target.value)}
            >
              {PAGES.map((item) => (
                <option key={item.path} value={item.path}>{item.label}</option>
              ))}
            </select>
          </div>

          <div className="preview-head-group">
            <div className="preview-devices" role="group" aria-label="预览设备">
              {DEVICES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`admin-tab ${device === item.id ? 'is-active' : ''}`}
                  aria-pressed={device === item.id}
                  onClick={() => onDeviceChange(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="admin-btn"
              onClick={() => iframeRef.current?.contentWindow?.location.reload()}
            >
              刷新
            </button>
            <button type="button" className="admin-btn" onClick={onClose}>关闭</button>
          </div>
        </header>

        <div className="preview-stage">
          <iframe
            ref={iframeRef}
            src={page}
            title="站点预览"
            style={{ width }}
          />
        </div>
      </div>
    </div>
  )
}
