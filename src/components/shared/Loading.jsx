/**
 * Loading — Neo Editorial 首屏
 * 进度走完且首页资源就绪后由父级卸载；leaving 时淡出
 */

import { useState, useEffect, useRef } from 'react'

export default function Loading({ fullScreen = true, onComplete, leaving = false }) {
  const [progress, setProgress] = useState(0)
  const firedRef = useRef(false)

  useEffect(() => {
    const startTime = Date.now()
    const duration = 320
    let raf = 0

    const animate = () => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / duration) * 100, 100)
      setProgress(newProgress)

      if (newProgress < 100) {
        raf = requestAnimationFrame(animate)
      } else if (!firedRef.current) {
        firedRef.current = true
        onComplete?.()
      }
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  return (
    <div
      className={`loading-screen ${leaving ? 'is-leaving' : ''} ${
        fullScreen ? 'min-h-screen' : 'min-h-[400px]'
      }`}
    >
      <div className="text-center px-6">
        <p className="font-display text-2xl font-semibold text-ink tracking-tight mb-8">
          STYLAN
        </p>
        <div className="w-40 mx-auto h-px overflow-hidden" style={{ background: 'var(--line)' }}>
          <div
            className="h-full"
            style={{ width: `${progress}%`, background: 'var(--accent)' }}
          />
        </div>
        <p className="mt-4 font-mono-ui text-[10px] tracking-[0.14em] uppercase text-muted">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  )
}
