/**
 * 后台配置文档的唯一映射表。
 *
 * 这里同时描述：
 * - 虚拟文档由哪些磁盘文件组合而来（fields: 虚拟键 -> 物理键）
 * - 保存时如何拆回各文件（preserveUnknown 表示保留后台不管理的字段）
 * - 服务端与前端的顶层字段白名单都从这张表派生，避免多处手写漂移。
 *
 * 纯数据 + 纯函数，Node 与浏览器均可直接引用。
 */
export const ADMIN_DOCUMENTS = [
  {
    id: 'site',
    label: '站点内容',
    files: [
      {
        id: 'site',
        path: 'content/site.yaml',
        fields: {
          site: 'site',
          personal: 'personal',
          navLinks: 'navLinks',
          contacts: 'contacts',
          footer: 'footer',
        },
      },
      {
        id: 'stack',
        path: 'content/stack/stack.yaml',
        fields: { skills: 'categories' },
        preserveUnknown: true,
      },
      {
        id: 'projects',
        path: 'content/projects/projects.yaml',
        fields: { projectCategories: 'categories', projects: 'projects' },
        preserveUnknown: true,
      },
    ],
  },
  {
    id: 'blog',
    label: '博客设置',
    files: [
      {
        id: 'blog',
        path: 'content/blog/blog.yaml',
        fields: { page: 'page', categories: 'categories' },
      },
    ],
  },
]

export function getDocument(id) {
  const doc = ADMIN_DOCUMENTS.find((item) => item.id === id)
  if (!doc) throw new Error(`未知后台文档：${id}`)
  return doc
}

export function documentTopKeys(doc) {
  return doc.files.flatMap((file) => Object.keys(file.fields))
}

export function composeDocument(doc, fileData) {
  const result = {}
  for (const file of doc.files) {
    const data = fileData[file.id] || {}
    for (const [virtualKey, physicalKey] of Object.entries(file.fields)) {
      result[virtualKey] = data[physicalKey]
    }
  }
  return result
}

export function splitDocument(doc, document, fileData) {
  const writes = {}
  for (const file of doc.files) {
    const target = file.preserveUnknown ? { ...(fileData[file.id] || {}) } : {}
    for (const [virtualKey, physicalKey] of Object.entries(file.fields)) {
      if (Object.prototype.hasOwnProperty.call(document, virtualKey)) {
        target[physicalKey] = document[virtualKey]
      }
    }
    writes[file.id] = target
  }
  return writes
}

export function assertDocumentShape(doc, document) {
  if (!document || typeof document !== 'object' || Array.isArray(document)) {
    throw Object.assign(new Error(`${doc.label}必须是对象`), {
      status: 400,
      code: 'INVALID_DOCUMENT',
    })
  }
  const actual = Object.keys(document).sort().join('|')
  const expected = [...documentTopKeys(doc)].sort().join('|')
  if (actual !== expected) {
    throw Object.assign(new Error(`${doc.label}的顶层字段不合法`), {
      status: 400,
      code: 'INVALID_DOCUMENT',
    })
  }
}
