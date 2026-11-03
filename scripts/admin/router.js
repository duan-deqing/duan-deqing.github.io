import { guard } from './guard.js'
import { createError, readBody, readJson, sendJson } from './http.js'
import { createConfigStore } from './config-store.js'
import { createGitStore } from './git-store.js'
import { createPostStore } from './posts-store.js'
import { createUploadStore } from './uploads-store.js'

function methodNotAllowed(res, allow) {
  res.setHeader('Allow', allow.join(', '))
  sendJson(res, 405, { error: '方法不支持', code: 'METHOD_NOT_ALLOWED' })
}

export function createAdminRouter(root) {
  const configStore = createConfigStore(root)
  const gitStore = createGitStore(root)
  const postStore = createPostStore(root)
  const uploadStore = createUploadStore(root)

  return async function handle(req, res) {
    guard(req)
    const url = new URL(req.url, 'http://localhost')
    const route = url.pathname
    const method = req.method

    if (route === '/config') {
      if (method === 'GET') return sendJson(res, 200, configStore.readConfig())
      if (method === 'PUT') return sendJson(res, 200, configStore.saveConfig(await readJson(req)))
      return methodNotAllowed(res, ['GET', 'PUT'])
    }

    if (route === '/git-log') {
      if (method === 'GET') {
        return sendJson(
          res,
          200,
          await gitStore.readLog(url.searchParams.get('limit'))
        )
      }
      return methodNotAllowed(res, ['GET'])
    }

    if (route === '/posts') {
      if (method === 'GET') return sendJson(res, 200, await postStore.listPosts())
      return methodNotAllowed(res, ['GET'])
    }

    const postMatch = route.match(/^\/posts\/(zh|en)\/([^/]+)$/)
    if (postMatch) {
      const [, lang, rawName] = postMatch
      let filename
      try {
        filename = decodeURIComponent(rawName)
      } catch {
        throw createError('非法文章文件名', 400, 'INVALID_FILENAME')
      }
      if (method === 'GET') return sendJson(res, 200, await postStore.getPost(lang, filename))
      if (method === 'PUT') {
        return sendJson(res, 200, await postStore.savePost(lang, filename, await readJson(req)))
      }
      if (method === 'DELETE') return sendJson(res, 200, await postStore.deletePost(lang, filename))
      return methodNotAllowed(res, ['GET', 'PUT', 'DELETE'])
    }

    if (route === '/upload') {
      if (method !== 'POST') return methodNotAllowed(res, ['POST'])
      const target = url.searchParams.get('target') === 'post' ? 'post' : 'site'
      const name = url.searchParams.get('name') || ''
      const post = url.searchParams.get('post') || ''
      const buffer = await readBody(req)
      return sendJson(res, 200, await uploadStore.saveUpload(target, name, post, buffer))
    }

    return sendJson(res, 404, { error: '未知接口', code: 'NOT_FOUND' })
  }
}
