export const MAX_BODY = 5 * 1024 * 1024

export function createError(message, status, code, extra = {}) {
  return Object.assign(new Error(message), { status, code, ...extra })
}

export function sendJson(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

export function readBody(req, limit = MAX_BODY) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    let settled = false

    const fail = (error) => {
      if (settled) return
      settled = true
      req.resume()
      reject(error)
    }

    req.on('data', (chunk) => {
      if (settled) return
      size += chunk.length
      if (size > limit) {
        fail(createError('请求体超过 5MB', 413, 'PAYLOAD_TOO_LARGE'))
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (settled) return
      settled = true
      resolve(Buffer.concat(chunks))
    })
    req.on('error', (error) => {
      if (settled) return
      settled = true
      reject(error)
    })
  })
}

export async function readJson(req) {
  const buffer = await readBody(req)
  try {
    return JSON.parse(buffer.toString('utf8') || '{}')
  } catch {
    throw createError('JSON 格式错误', 400, 'INVALID_JSON')
  }
}

export function sendError(res, err) {
  const isYaml = err?.name === 'YAMLParseError'
  const status = err?.status || (isYaml ? 400 : 500)
  const code = err?.code || (isYaml ? 'YAML_PARSE' : 'INTERNAL')
  if (status >= 500) console.error('[admin]', err)

  const payload = {
    error: status >= 500 ? '服务器错误' : err.message,
    code,
  }
  if (err?.current !== undefined) payload.current = err.current
  if (err?.revision !== undefined) payload.revision = err.revision

  sendJson(res, status, payload)
}
