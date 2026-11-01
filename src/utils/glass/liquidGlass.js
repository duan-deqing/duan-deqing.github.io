/*
 * Liquid-glass SVG filter assembly. Map rasterisation runs in a worker so the
 * dialog's entry animation is never blocked; see src/utils/liquidGlassMaps.js
 * for the archisvaze/liquid-glass derived generation (MIT licensed).
 */

import { assetKey, buildMapJobs, normalizeParams } from './liquidGlassMaps'

const MAX_CACHE = 4
const assetCache = new Map()
const waiters = new Map()

let worker = null
let workerBroken = false
let nextRequestId = 1

function createSyncAssets(params, glassThickness, ior, specularAngle) {
  if (typeof document === 'undefined') return null
  const jobs = buildMapJobs(params, glassThickness, ior, specularAngle)
  const { width, height } = jobs.size
  const dispCanvas = document.createElement('canvas')
  dispCanvas.width = width
  dispCanvas.height = height
  const specCanvas = document.createElement('canvas')
  specCanvas.width = width
  specCanvas.height = height
  if (!jobs.renderDisplacement(dispCanvas) || !jobs.renderSpecular(specCanvas)) return null
  return {
    dispUrl: dispCanvas.toDataURL(),
    specUrl: specCanvas.toDataURL(),
    maxDisp: jobs.maxDisp,
  }
}

function failWorker() {
  workerBroken = true
  if (worker) {
    worker.terminate()
    worker = null
  }
  const pending = Array.from(waiters.values())
  waiters.clear()
  for (const settle of pending) settle(null)
}

function ensureWorker() {
  if (worker) return worker
  if (workerBroken) return null
  if (typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined') {
    failWorker()
    return null
  }
  try {
    worker = new Worker(new URL('./liquidGlassWorker.js', import.meta.url), {
      type: 'module',
    })
  } catch {
    failWorker()
    return null
  }
  worker.addEventListener('message', (event) => {
    const { id, error, disp, spec, maxDisp } = event.data || {}
    const settle = waiters.get(id)
    if (!settle) return
    waiters.delete(id)
    if (error || !disp || !spec) {
      settle(null)
      return
    }
    settle({
      dispUrl: URL.createObjectURL(disp),
      specUrl: URL.createObjectURL(spec),
      maxDisp,
    })
  })
  worker.addEventListener('error', failWorker)
  return worker
}

function requestWorkerAssets(params, glassThickness, ior, specularAngle) {
  const activeWorker = ensureWorker()
  if (!activeWorker) return Promise.resolve(null)
  const id = nextRequestId++
  return new Promise((resolve) => {
    waiters.set(id, resolve)
    activeWorker.postMessage({
      id,
      params,
      glassThickness,
      ior,
      specularAngle,
    })
  })
}

function remember(key, assets) {
  assetCache.set(key, assets)
  if (assetCache.size <= MAX_CACHE) return
  const oldestKey = assetCache.keys().next().value
  if (oldestKey === key) return
  const oldest = assetCache.get(oldestKey)
  assetCache.delete(oldestKey)
  // Superseded filters are unmounted with the previous markup, so the blobs
  // are no longer referenced once their entry leaves the cache.
  if (oldest) {
    URL.revokeObjectURL(oldest.dispUrl)
    URL.revokeObjectURL(oldest.specUrl)
  }
}

function getAssets(params, glassThickness, ior, specularAngle) {
  const key = assetKey(params, glassThickness, ior, specularAngle)
  const cached = assetCache.get(key)
  if (cached) return Promise.resolve(cached)
  const pending = requestWorkerAssets(params, glassThickness, ior, specularAngle).then(
    (assets) => {
      if (assets) remember(key, assets)
      return assets
    }
  )
  assetCache.set(key, pending)
  if (assetCache.size > MAX_CACHE) {
    const oldestKey = assetCache.keys().next().value
    if (oldestKey !== key) assetCache.delete(oldestKey)
  }
  return pending.then((assets) => {
    if (assets) return assets
    assetCache.delete(key)
    const sync = createSyncAssets(params, glassThickness, ior, specularAngle)
    if (sync) remember(key, sync)
    return sync
  })
}

export function buildLiquidGlassFilter({
  width,
  height,
  radius,
  bezelWidth,
  filterId,
  glassThickness = 80,
  ior = 2.6,
  scaleRatio = 0.9,
  blur = 1.1,
  specularOpacity = 0.55,
  specularSaturation = 1.8,
  specularAngle = Math.PI / 3,
}) {
  const params = normalizeParams(width, height, radius, bezelWidth)
  const safeId = String(filterId || 'liquid-glass-filter').replace(
    /[^a-zA-Z0-9_-]/g,
    ''
  )

  return getAssets(params, glassThickness, ior, specularAngle).then((assets) => {
    if (!assets) return null
    const { w, h, r } = params
    const scale = assets.maxDisp * scaleRatio
    const markup = `<filter id="${safeId}" x="0%" y="0%" width="100%" height="100%">
  <feGaussianBlur in="SourceGraphic" stdDeviation="${blur}" result="blurred_source" />
  <feImage href="${assets.dispUrl}" x="0" y="0" width="${w}" height="${h}" result="disp_map" />
  <feDisplacementMap in="blurred_source" in2="disp_map" scale="${scale}" xChannelSelector="R" yChannelSelector="G" result="displaced" />
  <feColorMatrix in="displaced" type="saturate" values="${specularSaturation}" result="displaced_sat" />
  <feImage href="${assets.specUrl}" x="0" y="0" width="${w}" height="${h}" result="spec_layer" />
  <feComposite in="displaced_sat" in2="spec_layer" operator="in" result="spec_masked" />
  <feComponentTransfer in="spec_layer" result="spec_faded">
    <feFuncA type="linear" slope="${specularOpacity}" />
  </feComponentTransfer>
  <feBlend in="spec_masked" in2="displaced" mode="normal" result="with_sat" />
  <feBlend in="spec_faded" in2="with_sat" mode="normal" />
</filter>`
    return { markup, width: w, height: h, radius: r, scale }
  })
}
