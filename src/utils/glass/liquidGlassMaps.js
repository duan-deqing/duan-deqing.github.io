/*
 * Refraction and specular map rasterisation adapted from archisvaze/liquid-glass.
 * MIT License, Copyright (c) 2026 Archis Vaze.
 * https://github.com/archisvaze/liquid-glass
 *
 * Environment agnostic: runs on the main thread and inside a worker, so it only
 * touches a canvas-like object (HTMLCanvasElement or OffscreenCanvas).
 */

const MAP_SCALE = 0.5

function convexHeight(x) {
  return Math.pow(1 - Math.pow(1 - x, 4), 0.25)
}

function calculateRefractionProfile(glassThickness, bezelWidth, ior, samples = 128) {
  const eta = 1 / ior

  function refract(nx, ny) {
    const dot = ny
    const k = 1 - eta * eta * (1 - dot * dot)
    if (k < 0) return null
    const sq = Math.sqrt(k)
    return [-(eta * dot + sq) * nx, eta - (eta * dot + sq) * ny]
  }

  const profile = new Float64Array(samples)
  for (let i = 0; i < samples; i++) {
    const x = i / samples
    const y = convexHeight(x)
    const dx = x < 1 ? 0.001 : -0.001
    const y2 = convexHeight(x + dx)
    const deriv = (y2 - y) / dx
    const mag = Math.sqrt(deriv * deriv + 1)
    const ref = refract(-deriv / mag, -1 / mag)
    if (!ref) {
      profile[i] = 0
      continue
    }
    profile[i] = ref[0] * ((y * bezelWidth + glassThickness) / ref[1])
  }
  return profile
}

function fillDisplacementMap(canvas, radius, bezelWidth, profile, maxDisp) {
  const width = canvas.width
  const height = canvas.height
  const ctx = canvas.getContext('2d')
  if (!ctx) return false

  const image = ctx.createImageData(width, height)
  const data = image.data
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 128
    data[i + 1] = 128
    data[i + 2] = 0
    data[i + 3] = 255
  }

  const rSq = radius * radius
  const r1Sq = (radius + 1) ** 2
  const rBSq = Math.max(radius - bezelWidth, 0) ** 2
  const wB = width - radius * 2
  const hB = height - radius * 2
  const samples = profile.length

  for (let y1 = 0; y1 < height; y1++) {
    for (let x1 = 0; x1 < width; x1++) {
      const x =
        x1 < radius ? x1 - radius : x1 >= width - radius ? x1 - radius - wB : 0
      const y =
        y1 < radius ? y1 - radius : y1 >= height - radius ? y1 - radius - hB : 0
      const dSq = x * x + y * y
      if (dSq > r1Sq || dSq < rBSq) continue
      const dist = Math.sqrt(dSq)
      const fromSide = radius - dist
      const op =
        dSq < rSq
          ? 1
          : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq))
      if (op <= 0 || dist === 0) continue
      const cos = x / dist
      const sin = y / dist
      const bi = Math.min(((fromSide / bezelWidth) * samples) | 0, samples - 1)
      const disp = profile[bi] || 0
      const dX = (-cos * disp) / maxDisp
      const dY = (-sin * disp) / maxDisp
      const idx = (y1 * width + x1) * 4
      data[idx] = (128 + dX * 127 * op + 0.5) | 0
      data[idx + 1] = (128 + dY * 127 * op + 0.5) | 0
    }
  }

  ctx.putImageData(image, 0, 0)
  return true
}

function fillSpecularMap(canvas, radius, bezelWidth, angle) {
  const width = canvas.width
  const height = canvas.height
  const ctx = canvas.getContext('2d')
  if (!ctx) return false

  const image = ctx.createImageData(width, height)
  const data = image.data
  data.fill(0)

  const rSq = radius * radius
  const r1Sq = (radius + 1) ** 2
  const rBSq = Math.max(radius - bezelWidth, 0) ** 2
  const wB = width - radius * 2
  const hB = height - radius * 2
  const lightX = Math.cos(angle)
  const lightY = Math.sin(angle)

  for (let y1 = 0; y1 < height; y1++) {
    for (let x1 = 0; x1 < width; x1++) {
      const x =
        x1 < radius ? x1 - radius : x1 >= width - radius ? x1 - radius - wB : 0
      const y =
        y1 < radius ? y1 - radius : y1 >= height - radius ? y1 - radius - hB : 0
      const dSq = x * x + y * y
      if (dSq > r1Sq || dSq < rBSq) continue
      const dist = Math.sqrt(dSq)
      const fromSide = radius - dist
      const op =
        dSq < rSq
          ? 1
          : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq))
      if (op <= 0 || dist === 0) continue
      const cos = x / dist
      const sin = -y / dist
      const dot = Math.abs(cos * lightX + sin * lightY)
      const edge = Math.sqrt(Math.max(0, 1 - (1 - fromSide) ** 2))
      const coef = dot * edge
      const col = (255 * coef) | 0
      const alpha = (col * coef * op) | 0
      const idx = (y1 * width + x1) * 4
      data[idx] = col
      data[idx + 1] = col
      data[idx + 2] = col
      data[idx + 3] = alpha
    }
  }

  ctx.putImageData(image, 0, 0)
  return true
}

export function normalizeParams(width, height, radius, bezelWidth) {
  const w = Math.max(2, Math.round(width))
  const h = Math.max(2, Math.round(height))
  const r = Math.max(0, Math.min(Math.round(radius), Math.floor(Math.min(w, h) / 2)))
  const bezel = Math.max(
    1,
    Math.min(Math.round(bezelWidth), Math.max(r - 1, 1), Math.round(Math.min(w, h) / 2 - 1))
  )
  return { w, h, r, bezel }
}

export function assetKey(params, glassThickness, ior, specularAngle) {
  return `${params.w}x${params.h}x${params.r}x${params.bezel}x${glassThickness}x${ior}x${specularAngle}`
}

export function buildMapJobs(params, glassThickness, ior, specularAngle) {
  const { w, h, r, bezel } = params
  const profile = calculateRefractionProfile(glassThickness, bezel, ior)
  let maxDisp = 0
  for (let i = 0; i < profile.length; i++) {
    maxDisp = Math.max(maxDisp, Math.abs(profile[i]))
  }
  if (!maxDisp) maxDisp = 1

  const mw = Math.max(2, Math.round(w * MAP_SCALE))
  const mh = Math.max(2, Math.round(h * MAP_SCALE))
  const ratio = mw / w
  const mr = Math.max(1, Math.round(r * ratio))
  const mb = Math.max(1, Math.round(bezel * ratio))
  const specBezel = Math.max(1, Math.round(mb * 2.5))

  return {
    maxDisp,
    size: { width: mw, height: mh },
    renderDisplacement(canvas) {
      return fillDisplacementMap(canvas, mr, mb, profile, maxDisp)
    },
    renderSpecular(canvas) {
      return fillSpecularMap(canvas, mr, specBezel, specularAngle)
    },
  }
}
