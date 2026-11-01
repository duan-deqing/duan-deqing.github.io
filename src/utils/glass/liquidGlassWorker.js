import { buildMapJobs } from './liquidGlassMaps'

async function encode(canvas, render) {
  if (!render(canvas)) return null
  return canvas.convertToBlob({ type: 'image/png' })
}

self.onmessage = async (event) => {
  const { id, params, glassThickness, ior, specularAngle } = event.data
  try {
    const jobs = buildMapJobs(params, glassThickness, ior, specularAngle)
    const { width, height } = jobs.size
    const dispCanvas = new OffscreenCanvas(width, height)
    const specCanvas = new OffscreenCanvas(width, height)
    const disp = await encode(dispCanvas, jobs.renderDisplacement)
    const spec = await encode(specCanvas, jobs.renderSpecular)
    if (!disp || !spec) {
      self.postMessage({ id, error: 'map-encode-failed' })
      return
    }
    self.postMessage({ id, disp, spec, maxDisp: jobs.maxDisp })
  } catch (error) {
    self.postMessage({ id, error: String(error?.message || error) })
  }
}
