import { useEffect, useId, useRef, useState } from 'react'
import { buildLiquidGlassFilter } from '../../utils/liquidGlass'

const TUNING = {
  glassThickness: 80,
  ior: 2.6,
  scaleRatio: 0.85,
  blur: 1.1,
  specularOpacity: 0.72,
  specularSaturation: 1.6,
  specularAngle: Math.PI / 3,
}

const RESIZE_DEBOUNCE = 120

export default function LiquidGlassLens() {
  const lensRef = useRef(null)
  const appliedRef = useRef('')
  const filterId = `liquid-glass-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const [markup, setMarkup] = useState('')

  useEffect(() => {
    const lens = lensRef.current
    if (!lens) return undefined

    let cancelled = false
    let timer = 0
    let pendingKey = ''

    const request = () => {
      const width = lens.offsetWidth
      const height = lens.offsetHeight
      if (width < 2 || height < 2) return
      const radius = parseFloat(getComputedStyle(lens).borderTopLeftRadius) || 0
      const bezelWidth = Math.max(18, Math.round(Math.min(width, height) * 0.12))
      const key = `${width}x${height}x${radius}`
      if (key === appliedRef.current || key === pendingKey) return
      pendingKey = key
      buildLiquidGlassFilter({
        ...TUNING,
        width,
        height,
        radius,
        bezelWidth,
        filterId,
      }).then((filter) => {
        if (cancelled || !filter || pendingKey !== key) return
        appliedRef.current = key
        setMarkup(filter.markup)
      })
    }

    request()

    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(request, RESIZE_DEBOUNCE)
    })
    observer.observe(lens)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      observer.disconnect()
    }
  }, [filterId])

  return (
    <>
      <div
        ref={lensRef}
        aria-hidden="true"
        className={markup ? 'wechat-glass-lens is-ready' : 'wechat-glass-lens'}
        style={
          markup
            ? {
                backdropFilter: `url(#${filterId})`,
                WebkitBackdropFilter: `url(#${filterId})`,
              }
            : undefined
        }
      />
      {markup ? (
        <svg
          className="wechat-glass-defs"
          aria-hidden="true"
          focusable="false"
          colorInterpolationFilters="sRGB"
        >
          {/* Generated off the main thread; hrefs are blob URLs owned by the worker client. */}
          <defs dangerouslySetInnerHTML={{ __html: markup }} />
        </svg>
      ) : null}
    </>
  )
}
