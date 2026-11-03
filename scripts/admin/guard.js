import { isLoopback, isSameOrigin, isAllowedHost } from '../lib/admin-validation.js'
import { createError } from './http.js'

export function guard(req) {
  if (!isAllowedHost(req.headers.host)) {
    throw createError('非法的 Host', 403, 'FORBIDDEN_HOST')
  }
  if (!isLoopback(req.socket.remoteAddress)) {
    throw createError('仅允许本机访问', 403, 'FORBIDDEN_REMOTE')
  }
  if (!isSameOrigin(req.headers.origin, req.headers.host)) {
    throw createError('跨源请求已拒绝', 403, 'FORBIDDEN_ORIGIN')
  }
  if (req.method !== 'GET' && req.headers['x-admin-request'] !== '1') {
    throw createError('缺少管理请求头', 403, 'FORBIDDEN_HEADER')
  }
}
