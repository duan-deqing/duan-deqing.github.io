import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { isPostFileName, assertInside, isAllowedImage } from '../lib/admin-validation.js'
import { postImageDirName } from '../../src/utils/blog/postFilename.js'
import { createError } from './http.js'

export function createUploadStore(root) {
  const postImages = path.join(root, 'content', 'blog', 'posts', 'img')
  const publicImages = path.join(root, 'public', 'images')

  function uniqueName(dir, name) {
    const ext = path.extname(name)
    const base = name.slice(0, -ext.length)
    let candidate = name
    let index = 1
    while (fs.existsSync(path.join(dir, candidate))) {
      candidate = `${base}-${index}${ext}`
      index += 1
    }
    return candidate
  }

  async function saveUpload(target, name, post, buffer) {
    if (!isAllowedImage(name, target)) {
      throw createError('不支持的图片类型或文件名', 400, 'INVALID_IMAGE')
    }
    let dir
    let urlPrefix
    if (target === 'post') {
      if (!post || !isPostFileName(post)) {
        throw createError('缺少有效的文章文件名', 400, 'INVALID_POST_FILENAME')
      }
      dir = path.join(postImages, postImageDirName(post))
      urlPrefix = ''
    } else {
      dir = publicImages
      urlPrefix = '/images/'
    }
    await fsp.mkdir(dir, { recursive: true })
    const finalName = uniqueName(dir, name)
    const file = assertInside(dir, path.join(dir, finalName))
    await fsp.writeFile(file, buffer)
    return { path: `${urlPrefix}${finalName}` }
  }

  return { saveUpload }
}
