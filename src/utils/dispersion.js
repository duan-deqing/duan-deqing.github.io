const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const SAMPLE_STEP = 3

function traceRoundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

// 把元素快照成粒子，再让粒子沿贝塞尔曲线汇聚到 target 中心
export function disperseTo(element, target) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null
  if (window.matchMedia(REDUCED_MOTION).matches) return null
  if (!element || !target || !element.isConnected) return null

  const rect = element.getBoundingClientRect()
  if (!rect.width || !rect.height) return null

  const targetRect = target.getBoundingClientRect()
  const targetX = targetRect.left + targetRect.width / 2
  const targetY = targetRect.top + targetRect.height / 2

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const snapshot = document.createElement('canvas')
  snapshot.width = Math.round(rect.width * dpr)
  snapshot.height = Math.round(rect.height * dpr)
  const snapshotCtx = snapshot.getContext('2d', { willReadFrequently: true })
  if (!snapshotCtx) return null

  snapshotCtx.scale(dpr, dpr)
  const style = getComputedStyle(element)
  snapshotCtx.fillStyle = style.backgroundColor
  traceRoundRect(snapshotCtx, 0.5, 0.5, rect.width - 1, rect.height - 1, 8)
  snapshotCtx.fill()
  snapshotCtx.strokeStyle = style.borderTopColor
  snapshotCtx.lineWidth = 1
  snapshotCtx.stroke()

  const image = element.querySelector('img')
  if (image?.complete && image.naturalWidth > 0) {
    const imageRect = image.getBoundingClientRect()
    const x = imageRect.left - rect.left
    const y = imageRect.top - rect.top
    snapshotCtx.save()
    traceRoundRect(snapshotCtx, x, y, imageRect.width, imageRect.height, 6)
    snapshotCtx.clip()
    snapshotCtx.drawImage(image, x, y, imageRect.width, imageRect.height)
    snapshotCtx.restore()
  }

  const pixels = snapshotCtx.getImageData(0, 0, snapshot.width, snapshot.height).data
  const stepPx = Math.max(1, Math.round(SAMPLE_STEP * dpr))
  const particles = []

  for (let y = 0; y < snapshot.height; y += stepPx) {
    for (let x = 0; x < snapshot.width; x += stepPx) {
      const index = (y * snapshot.width + x) * 4
      const alpha = pixels[index + 3]
      if (alpha < 20 || Math.random() < 0.2) continue

      const originX = rect.left + x / dpr + SAMPLE_STEP / 2
      const originY = rect.top + y / dpr + SAMPLE_STEP / 2
      const dx = targetX - originX
      const dy = targetY - originY
      const distance = Math.hypot(dx, dy) || 1
      const bow = (Math.random() - 0.5) * Math.min(90, distance * 0.9)

      particles.push({
        originX,
        originY,
        controlX: originX + dx * 0.35 - (dy / distance) * bow,
        controlY: originY + dy * 0.35 + (dx / distance) * bow,
        fill: `rgb(${pixels[index]}, ${pixels[index + 1]}, ${pixels[index + 2]})`,
        alpha: Math.min(1, alpha / 255),
        size: SAMPLE_STEP * (0.7 + Math.random() * 0.45),
        delay: Math.random() * 30,
        duration: 380 + Math.random() * 180,
      })
    }
  }

  if (!particles.length) return null

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(window.innerWidth * dpr)
  canvas.height = Math.round(window.innerHeight * dpr)
  canvas.setAttribute('aria-hidden', 'true')
  canvas.dataset.dispersion = 'true'
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:60;'
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.scale(dpr, dpr)
  document.body.appendChild(canvas)

  const start = performance.now()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  let raf = 0
  let cancelled = false

  const cleanup = () => {
    cancelAnimationFrame(raf)
    canvas.remove()
  }

  const draw = (now) => {
    const elapsed = now - start
    ctx.clearRect(0, 0, viewportWidth, viewportHeight)
    let alive = 0

    for (const particle of particles) {
      const local = (elapsed - particle.delay) / particle.duration
      if (local >= 1) continue
      alive += 1

      if (local <= 0) {
        ctx.globalAlpha = particle.alpha
        ctx.fillStyle = particle.fill
        ctx.fillRect(particle.originX, particle.originY, particle.size, particle.size)
        continue
      }

      const t = local
      const inv = 1 - t
      const x =
        inv * inv * particle.originX +
        2 * inv * t * particle.controlX +
        t * t * targetX
      const y =
        inv * inv * particle.originY +
        2 * inv * t * particle.controlY +
        t * t * targetY
      const fade = local < 0.5 ? 1 : Math.max(0, 1 - (local - 0.5) / 0.5)

      ctx.globalAlpha = particle.alpha * fade
      ctx.fillStyle = particle.fill
      const size = particle.size * (1 - 0.6 * t)
      ctx.fillRect(x, y, size, size)
    }

    if (alive > 0 && !cancelled) {
      raf = requestAnimationFrame(draw)
    } else {
      cleanup()
    }
  }

  raf = requestAnimationFrame(draw)

  return {
    cancel() {
      if (cancelled) return
      cancelled = true
      cleanup()
    },
  }
}
