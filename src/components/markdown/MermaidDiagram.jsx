import { useEffect, useId, useRef, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

let mermaidLoader
let renderQueue = Promise.resolve()

function loadMermaid() {
  if (!mermaidLoader) {
    mermaidLoader = import('mermaid').then((module) => module.default)
  }
  return mermaidLoader
}

function cssVar(styles, name, fallback) {
  return styles.getPropertyValue(name).trim() || fallback
}

function readThemeVariables() {
  const styles = getComputedStyle(document.documentElement)
  const colors = {
    bg: cssVar(styles, '--bg', '#ffffff'),
    subtle: cssVar(styles, '--bg-subtle', '#f4f4f5'),
    codeHeader: cssVar(styles, '--code-header', '#f9fafb'),
    line: cssVar(styles, '--line', '#e5e7eb'),
    lineStrong: cssVar(styles, '--line-strong', '#d1d5db'),
    heading: cssVar(styles, '--heading', '#000000'),
    ink: cssVar(styles, '--ink', '#111827'),
    muted: cssVar(styles, '--muted', '#6b7280'),
  }
  const dark = document.documentElement.classList.contains('dark')
  const fontFamily = getComputedStyle(document.body).fontFamily

  return {
    darkMode: dark,
    background: colors.bg,
    primaryColor: colors.subtle,
    primaryTextColor: colors.ink,
    primaryBorderColor: colors.lineStrong,
    secondaryColor: colors.codeHeader,
    tertiaryColor: colors.subtle,
    lineColor: colors.muted,
    textColor: colors.ink,
    mainBkg: colors.subtle,
    nodeBorder: colors.lineStrong,
    clusterBkg: colors.codeHeader,
    clusterBorder: colors.line,
    titleColor: colors.ink,
    edgeLabelBackground: colors.bg,
    fontFamily,
    fontSize: '14px',
    actorBkg: colors.subtle,
    actorBorder: colors.lineStrong,
    actorTextColor: colors.ink,
    actorLineColor: colors.lineStrong,
    signalColor: colors.ink,
    signalTextColor: colors.ink,
    labelBoxBkgColor: colors.subtle,
    labelBoxBorderColor: colors.lineStrong,
    labelTextColor: colors.ink,
    loopTextColor: colors.ink,
    noteBkgColor: colors.codeHeader,
    noteTextColor: colors.ink,
    noteBorderColor: colors.lineStrong,
    activationBkgColor: colors.subtle,
    activationBorderColor: colors.lineStrong,
    sequenceNumberColor: colors.bg,
    classText: colors.ink,
    labelColor: colors.ink,
    altBackground: colors.codeHeader,
  }
}

function renderMermaid(id, source) {
  const task = renderQueue.then(async () => {
    const mermaid = await loadMermaid()
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      themeVariables: readThemeVariables(),
    })
    return mermaid.render(id, source)
  })
  renderQueue = task.catch(() => {})
  return task
}

function useDocumentDark() {
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const root = document.documentElement
    const sync = () => setDark(root.classList.contains('dark'))
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return dark
}

export default function MermaidDiagram({ source }) {
  const { t } = useLanguage()
  const dark = useDocumentDark()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [svg, setSvg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const hostRef = useRef(null)
  const renderCount = useRef(0)
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, '')

  useEffect(() => {
    setMounted(true)
    const el = hostRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!mounted || !visible) return undefined
    let cancelled = false
    setLoading(true)
    setError('')

    const frame = requestAnimationFrame(() => {
      const renderId = `mermaid-${reactId}-${renderCount.current++}`
      renderMermaid(renderId, source)
        .then((result) => {
          if (cancelled) return
          setSvg(result.svg)
          setLoading(false)
        })
        .catch((reason) => {
          if (cancelled) return
          setSvg('')
          setError(String(reason?.message || reason || 'Mermaid render failed'))
          setLoading(false)
        })
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [dark, mounted, reactId, source, visible])

  return (
    <div
      ref={hostRef}
      className="mermaid-diagram"
      data-loading={loading ? 'true' : undefined}
      aria-busy={loading}
    >
      {svg ? (
        <div
          className="mermaid-diagram-output"
          // Mermaid 以 strict securityLevel 生成并自行转义文本。
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : null}
      {!svg && !error ? (
        <p className="mermaid-diagram-status" role="status">
          {t({ en: 'Rendering diagram…', zh: '正在渲染图表…' })}
        </p>
      ) : null}
      {error ? (
        <div className="mermaid-diagram-error" role="alert">
          <p>{t({ en: 'Diagram failed to render', zh: '图表渲染失败' })}</p>
          <pre>
            <code>{source}</code>
          </pre>
        </div>
      ) : null}
    </div>
  )
}
