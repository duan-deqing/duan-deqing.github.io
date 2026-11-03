import { guard } from './guard.js'
import { createError, readBody, readJson, sendJson } from './http.js'
import { createConfigStore } from './config-store.js'
import { createGitStore } from './git-store.js'
import { createMarkdownStore } from './markdown-store.js'
import { createPostStore } from './posts-store.js'
import { createUploadStore } from './uploads-store.js'

function methodNotAllowed(res, allow) {
  res.setHeader('Allow', allow.join(', '))
  sendJson(res, 405, { error: '方法不支持', code: 'METHOD_NOT_ALLOWED' })
}

export function createAdminRouter(root) {
  const configStore = createConfigStore(root)
  const gitStore = createGitStore(root)
  const markdownStore = createMarkdownStore(root)
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

    if (route === '/markdown/home') {
      if (method === 'GET') return sendJson(res, 200, markdownStore.readHome())
      return methodNotAllowed(res, ['GET'])
    }

    const homeFileMatch = route.match(/^\/markdown\/home\/([^/]+)$/)
    if (homeFileMatch) {
      if (method !== 'PUT') return methodNotAllowed(res, ['PUT'])
      let id
      try {
        id = decodeURIComponent(homeFileMatch[1])
      } catch {
        throw createError('非法的首页文件名', 400, 'INVALID_FILE')
      }
      return sendJson(res, 200, markdownStore.saveHome(id, await readJson(req)))
    }

    if (route === '/markdown/changelog') {
      if (method === 'GET') return sendJson(res, 200, markdownStore.listChangelog())
      return methodNotAllowed(res, ['GET'])
    }

    const changelogMatch = route.match(/^\/markdown\/changelog\/([^/]+)$/)
    if (changelogMatch) {
      if (method !== 'PUT') return methodNotAllowed(res, ['PUT'])
      let filename
      try {
        filename = decodeURIComponent(changelogMatch[1])
      } catch {
        throw createError('非法的更新日志文件名', 400, 'INVALID_FILE')
      }
      return sendJson(res, 200, markdownStore.saveChangelog(filename, await readJson(req)))
    }

    if (route === '/markdown/projects') {
      if (method === 'GET') return sendJson(res, 200, markdownStore.listProjectDetails())
      return methodNotAllowed(res, ['GET'])
    }

    const projectDetailMatch = route.match(/^\/markdown\/projects\/(zh|en)\/([^/]+)$/)
    if (projectDetailMatch) {
      if (method !== 'PUT') return methodNotAllowed(res, ['PUT'])
      let slug
      try {
        slug = decodeURIComponent(projectDetailMatch[2])
      } catch {
        throw createError('非法的项目详情路径', 400, 'INVALID_FILE')
      }
      return sendJson(
        res,
        200,
        markdownStore.saveProjectDetail(projectDetailMatch[1], slug, await readJson(req))
      )
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
