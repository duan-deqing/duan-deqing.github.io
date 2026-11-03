import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createAdminRouter } from './admin/router.js'
import { sendError } from './admin/http.js'

const ROOT = path.resolve(fileURLToPath(new URL('./..', import.meta.url)))
const API_PREFIX = '/__admin/api'

export default function adminPlugin() {
  const handle = createAdminRouter(ROOT)

  return {
    name: 'stylan-admin',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/admin' || req.url === '/admin/') req.url = '/admin.html'
        next()
      })
      server.middlewares.use(API_PREFIX, (req, res) => {
        handle(req, res).catch((err) => sendError(res, err))
      })
    },
  }
}
