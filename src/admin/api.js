const BASE = '/__admin/api'

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
    throw Object.assign(new Error(data.error || `请求失败 (${res.status})`), {
      status: res.status,
    })
  }
  return data
}

export const adminApi = {
  getConfig: () => request('/config'),
  saveConfig: (payload) => request('/config', { method: 'PUT', json: payload }),
  listPosts: () => request('/posts'),
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

function safeUploadName(name) {
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
