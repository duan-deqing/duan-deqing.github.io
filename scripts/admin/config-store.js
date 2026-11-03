import fs from 'node:fs'
import path from 'node:path'
import {
  ADMIN_DOCUMENTS,
  assertDocumentShape,
  composeDocument,
  splitDocument,
} from '../../src/admin/schema/documents.js'
import { contentSchema } from '../../src/admin/schema.js'
import { validateDoc } from '../../src/admin/lib/validate.js'
import { stringifyYamlDoc, parseYamlDoc, contentHash } from '../lib/yaml-config.js'
import { writeFileAtomic } from '../lib/fs-atomic.js'
import { createError } from './http.js'

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') return null
    throw err
  }
}

export function createConfigStore(root) {
  const filePath = (relative) => path.join(root, relative)

  function readDocumentFiles(doc) {
    const texts = {}
    const fileData = {}
    const revision = {}
    for (const file of doc.files) {
      const filePathValue = filePath(file.path)
      const text = readText(filePathValue)
      texts[file.id] = text
      fileData[file.id] = text == null ? {} : parseYamlDoc(text) || {}
      revision[file.id] = text == null ? null : contentHash(text)
    }
    return { texts, fileData, revision }
  }

  function readConfig() {
    const documents = {}
    const revision = {}
    for (const doc of ADMIN_DOCUMENTS) {
      const snapshot = readDocumentFiles(doc)
      documents[doc.id] = composeDocument(doc, snapshot.fileData)
      revision[doc.id] = snapshot.revision
    }
    return { documents, revision }
  }

  function writePending(pending) {
    const written = []
    try {
      for (const item of pending) {
        writeFileAtomic(item.path, item.text)
        written.push(item)
      }
    } catch (err) {
      for (const item of written.reverse()) {
        try {
          if (item.previous == null) fs.unlinkSync(item.path)
          else writeFileAtomic(item.path, item.previous)
        } catch (rollbackError) {
          console.error('[admin] 回滚失败', item.path, rollbackError)
        }
      }
      throw createError('写入配置失败，已回滚', 500, 'WRITE_FAILED')
    }
  }

  function saveConfig(body) {
    const documents = body?.documents
    const revision = body?.revision
    if (!documents || typeof documents !== 'object') {
      throw createError('documents 必须是对象', 400, 'INVALID_DOCUMENT')
    }
    for (const doc of ADMIN_DOCUMENTS) {
      assertDocumentShape(doc, documents[doc.id])
    }

    const errors = validateDoc(contentSchema, documents)
    if (errors.length) {
      throw createError(errors.join('；'), 400, 'VALIDATION_FAILED')
    }

    const current = readConfig()
    for (const doc of ADMIN_DOCUMENTS) {
      const provided = revision?.[doc.id] || {}
      for (const file of doc.files) {
        const currentRevision = current.revision[doc.id][file.id]
        const clientRevision = provided[file.id] ?? null
        if (clientRevision !== currentRevision) {
          throw createError('文件已被外部修改，请刷新后再保存', 409, 'REVISION_CONFLICT', {
            current,
            revision: current.revision,
          })
        }
      }
    }

    const pending = []
    for (const doc of ADMIN_DOCUMENTS) {
      const snapshot = readDocumentFiles(doc)
      const writes = splitDocument(doc, documents[doc.id], snapshot.fileData)
      for (const file of doc.files) {
        const nextText = stringifyYamlDoc(writes[file.id])
        const previous = snapshot.texts[file.id]
        if (nextText === previous) continue
        pending.push({
          path: filePath(file.path),
          previous,
          text: nextText,
        })
      }
    }

    writePending(pending)
    return readConfig()
  }

  return { readConfig, saveConfig }
}
