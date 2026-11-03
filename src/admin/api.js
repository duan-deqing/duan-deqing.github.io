const BASE = '/__admin/api'

export class AdminApiError extends Error {
  constructor(message, { status = 0, code = 'REQUEST_FAILED', payload = {} } = {}) {
    super(message)
    this.name = 'AdminApiError'
    this.status = status
    this.code = code
    this.payload = payload
  }
}

async function request(path, { method = 'GET', json, body } = {}) {
  const headers = {}
  if (method !== 'GET') headers['X-Admin-Request'] = '1'
  if (json !== undefined) headers['Content-Type'] = 'application/json'
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: json !== undefined ? JSON.stringify(json) : body,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new AdminApiError(data.error || `请求失败 (${res.status})`, {
      status: res.status,
      code: data.code || 'REQUEST_FAILED',
      payload: data,
    })
  }
  return data
}

export function safeUploadName(name) {
  const match = String(name).match(/\.([A-Za-z0-9]+)$/)
  if (!match) {
    throw new Error('图片文件名需要包含扩展名')
  }
  const ext = `.${match[1].toLowerCase()}`
  const base = String(name)
    .replace(/\.[^.]+$/, '')
    .replace(/[^A-Za-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return `${base || 'image'}${ext}`
}

export const adminApi = {
  getConfig: () => request('/config'),
  saveConfig: (documents, revision) =>
    request('/config', { method: 'PUT', json: { documents, revision } }),
  listPosts: () => request('/posts'),
  getGitLog: (limit = 20) => request(`/git-log?limit=${limit}`),
  getPost: (lang, filename) =>
    request(`/posts/${lang}/${encodeURIComponent(filename)}`),
  savePost: (lang, filename, payload) =>
    request(`/posts/${lang}/${encodeURIComponent(filename)}`, {
      method: 'PUT',
      json: payload,
    }),
  deletePost: (lang, filename) =>
    request(`/posts/${lang}/${encodeURIComponent(filename)}`, { method: 'DELETE' }),
  upload: (target, file, post) => {
    const query = new URLSearchParams({ target, name: safeUploadName(file.name) })
    if (post) query.set('post', post)
    return request(`/upload?${query.toString()}`, { method: 'POST', body: file })
  },
}
