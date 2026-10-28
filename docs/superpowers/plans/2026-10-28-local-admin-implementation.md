# 本地内容管理后台 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为站点增加一个只在 `vite dev` 可用的内容后台，可表单编辑 YAML 配置与 Markdown 文章并实时预览，构建产物中不包含任何后台代码。

**Architecture:** 站点配置从 JS 迁移为 YAML，由自定义 Vite 插件在构建期转成 ES 模块；后台是独立的 dev-only HTML 入口 `admin.html`，通过 Vite 中间件提供 `/__admin/api/*` 读写源文件，后台前端只加载自己的模块图，不导入站点入口。

**Tech Stack:** Vite 8、React 19、Tailwind CSS v4、`yaml`（devDependency）、`front-matter`、Node `node:test`。

**Spec:** `docs/superpowers/specs/2026-10-28-local-admin-design.md`

## Global Constraints

- Node 24.18、pnpm 11.7；不要升级 Vite / React 主版本。
- 新增依赖只有 `yaml`，且必须放在 `devDependencies`；不得新增运行时依赖。
- 配置文件统一 YAML，写入文件头的精确文本：
  `# 此文件由本地管理后台维护；字段说明见 src/admin/schema.js 与 README。`
- 后台 API 只在回环地址可用；写请求必须带 `X-Admin-Request: 1`；请求体上限 5MB。
- 保存配置时必须保留表单未展示的字段（如 `personal.heroRight`）。
- 后台 UI 文案使用中文。
- 后台源码不得被 `src/main.jsx` / `src/App.jsx` 导入；构建入口只有 `index.html`。
- 仓库未安装 ESLint 且没有配置文件，`pnpm lint` 在本改动前后都不可用；验收使用 `pnpm build`、`pnpm test` 和各任务的验证命令，不把 `pnpm lint` 作为门槛。
- 测试命令：`pnpm test`（等价于 `node --test tests/`）。

---

### Task 1: YAML 导入插件

**Files:**
- Create: `scripts/vite-yaml-plugin.js`
- Create: `tests/unit/yaml-plugin.test.js`
- Modify: `package.json`（新增 `yaml` devDependency）
- Modify: `vite.config.js`

**Interfaces:**
- Produces: `scripts/vite-yaml-plugin.js` 默认导出 `yamlPlugin()`，返回 Vite 插件对象，`transform(code, id)` 对 `.yaml` / `.yml` 返回 `{ code: 'export default <JSON>', map: null }`，其他文件返回 `null`。

- [ ] **Step 1: 安装 `yaml`**

```bash
pnpm add -D yaml
```

预期：`package.json` 的 `devDependencies` 出现 `yaml`。

- [ ] **Step 2: 写失败测试**

创建 `tests/unit/yaml-plugin.test.js`：

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import yamlPlugin from '../../scripts/vite-yaml-plugin.js'

test('transform 把 YAML 转成 ES 默认导出', () => {
  const plugin = yamlPlugin()
  const out = plugin.transform('site:\n  title: STYLAN\n', '/abs/src/content/site.yaml')
  assert.equal(out.code, 'export default {"site":{"title":"STYLAN"}}')
  assert.equal(out.map, null)
})

test('非 yaml 文件不处理', () => {
  const plugin = yamlPlugin()
  assert.equal(plugin.transform('const a = 1', '/abs/src/a.js'), null)
})

test('yaml 解析失败时抛出错误', () => {
  const plugin = yamlPlugin()
  assert.throws(() => plugin.transform('site: [', '/abs/src/content/site.yaml'), /YAML 解析失败/)
})
```

- [ ] **Step 3: 运行测试确认失败**

Run: `node --test tests/unit/yaml-plugin.test.js`
Expected: FAIL，`Cannot find module .../scripts/vite-yaml-plugin.js`

- [ ] **Step 4: 实现插件**

创建 `scripts/vite-yaml-plugin.js`：

```js
import YAML from 'yaml'

export default function yamlPlugin() {
  return {
    name: 'stylan-yaml',
    enforce: 'pre',
    transform(code, id) {
      const clean = id.split('?')[0]
      if (!clean.endsWith('.yaml') && !clean.endsWith('.yml')) return null
      try {
        const data = YAML.parse(code)
        return { code: `export default ${JSON.stringify(data)}`, map: null }
      } catch (err) {
        const message = `YAML 解析失败: ${clean}\n${err.message}`
        if (typeof this?.error === 'function') this.error(message)
        throw new Error(message)
      }
    },
  }
}
```

- [ ] **Step 5: 运行测试确认通过**

Run: `node --test tests/unit/yaml-plugin.test.js`
Expected: 3 tests passing

- [ ] **Step 6: 注册插件**

修改 `vite.config.js` 全文为：

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import yamlPlugin from "./scripts/vite-yaml-plugin.js";

export default defineConfig({
  plugins: [yamlPlugin(), react(), tailwindcss()],
  base: "/",
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/react-markdown') || id.includes('node_modules/remark-gfm') || id.includes('node_modules/rehype-highlight')) {
            return 'markdown-vendor';
          }
        }
      }
    }
  },
});
```

- [ ] **Step 7: 提交**

```bash
git add package.json pnpm-lock.yaml scripts/vite-yaml-plugin.js tests/unit/yaml-plugin.test.js vite.config.js
git commit -m "feat: 支持在 Vite 中直接导入 YAML"
```

---

### Task 2: YAML 序列化库与配置迁移

**Files:**
- Create: `scripts/lib/fs-atomic.js`
- Create: `scripts/lib/yaml-config.js`
- Create: `scripts/migrate-config-to-yaml.js`
- Create: `src/content/site.yaml`
- Create: `src/content/blog.yaml`
- Create: `tests/unit/yaml-config.test.js`

**Interfaces:**
- Produces:
  - `writeFileAtomic(file: string, content: string): void`
  - `YAML_HEADER: string`
  - `stringifyYamlDoc(data: object): string`
  - `parseYamlDoc(text: string): object`
  - `writeYamlFile(file: string, data: object): void`
  - `readYamlFile(file: string): object`
  - `fileRevision(file: string): number`

- [ ] **Step 1: 写失败测试**

创建 `tests/unit/yaml-config.test.js`：

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  YAML_HEADER,
  stringifyYamlDoc,
  parseYamlDoc,
  writeYamlFile,
  readYamlFile,
  fileRevision,
} from '../../scripts/lib/yaml-config.js'

const sample = {
  site: { title: 'STYLAN', description: { en: 'EN', zh: '中文' } },
  list: [{ en: 'A', zh: '甲' }, { en: 'B', zh: '乙' }],
}

test('stringify 带文件头且可回读', () => {
  const text = stringifyYamlDoc(sample)
  assert.ok(text.startsWith(YAML_HEADER))
  assert.deepEqual(parseYamlDoc(text), sample)
})

test('中文长句不被折行', () => {
  const long = { text: '这是一段很长很长的中文说明，用来确认 YAML 输出不会在中途自动折行，否则后台保存会不断产生无意义 diff。' }
  const text = stringifyYamlDoc(long)
  const body = text.split('\n').filter((line) => line.includes('text:'))
  assert.equal(body.length, 1)
})

test('writeYamlFile 写入临时目录后可读回，revision 为数字', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stylan-yaml-'))
  const file = path.join(dir, 'site.yaml')
  writeYamlFile(file, sample)
  assert.deepEqual(readYamlFile(file), sample)
  assert.equal(typeof fileRevision(file), 'number')
  fs.rmSync(dir, { recursive: true, force: true })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `node --test tests/unit/yaml-config.test.js`
Expected: FAIL，模块不存在

- [ ] **Step 3: 实现原子写入与 YAML 库**

创建 `scripts/lib/fs-atomic.js`：

```js
import fs from 'node:fs'

export function writeFileAtomic(file, content) {
  const tmp = `${file}.${process.pid}.tmp`
  fs.writeFileSync(tmp, content, 'utf8')
  fs.renameSync(tmp, file)
}
```

创建 `scripts/lib/yaml-config.js`：

```js
import fs from 'node:fs'
import YAML from 'yaml'
import { writeFileAtomic } from './fs-atomic.js'

export const YAML_HEADER =
  '# 此文件由本地管理后台维护；字段说明见 src/admin/schema.js 与 README。\n'

export function stringifyYamlDoc(data) {
  return YAML_HEADER + YAML.stringify(data, { lineWidth: 0 })
}

export function parseYamlDoc(text) {
  return YAML.parse(text)
}

export function writeYamlFile(file, data) {
  writeFileAtomic(file, stringifyYamlDoc(data))
}

export function readYamlFile(file) {
  return parseYamlDoc(fs.readFileSync(file, 'utf8'))
}

export function fileRevision(file) {
  return fs.statSync(file).mtimeMs
}
```

- [ ] **Step 4: 运行确认通过**

Run: `node --test tests/unit/yaml-config.test.js`
Expected: 3 tests passing

- [ ] **Step 5: 写迁移脚本**

创建 `scripts/migrate-config-to-yaml.js`：

```js
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import config from '../src/config.js'
import blogConfig from '../src/blogConfig.js'
import { writeYamlFile, readYamlFile } from './lib/yaml-config.js'

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const force = process.argv.includes('--force')

const EXPECTED = {
  'src/content/site.yaml': {
    data: config,
    keys: [
      'site', 'personal', 'navLinks', 'homeSections', 'about', 'buttons',
      'skillsSection', 'skills', 'projectsSection', 'projects', 'contact',
      'contactPage', 'socialLinks', 'footer',
    ],
  },
  'src/content/blog.yaml': {
    data: blogConfig,
    keys: ['page', 'categories'],
  },
}

for (const [rel, { data, keys }] of Object.entries(EXPECTED)) {
  const actual = Object.keys(data).sort()
  const expected = [...keys].sort()
  if (!isDeepStrictEqual(actual, expected)) {
    console.error(`顶层键不一致: ${rel}`)
    console.error('实际:', actual)
    console.error('预期:', expected)
    process.exit(1)
  }

  const file = path.join(ROOT, rel)
  if (fs.existsSync(file) && !force) {
    console.error(`目标已存在，未覆盖: ${rel}（需要覆盖请加 --force）`)
    process.exit(1)
  }
  fs.mkdirSync(path.dirname(file), { recursive: true })
  writeYamlFile(file, data)

  const roundTrip = readYamlFile(file)
  if (!isDeepStrictEqual(roundTrip, data)) {
    console.error(`回读校验失败: ${rel}`)
    process.exit(1)
  }
  console.log(`已写入并校验: ${rel}`)
}
```

- [ ] **Step 6: 执行迁移**

Run: `node scripts/migrate-config-to-yaml.js`
Expected 输出：

```
已写入并校验: src/content/site.yaml
已写入并校验: src/content/blog.yaml
```

- [ ] **Step 7: 确认生成文件**

Run: `head -20 src/content/site.yaml && head -10 src/content/blog.yaml`
Expected：第一行是 `# 此文件由本地管理后台维护；字段说明见 src/admin/schema.js 与 README。`，其后是完整配置；中文没有被折行。

- [ ] **Step 8: 提交**

```bash
git add scripts/lib/fs-atomic.js scripts/lib/yaml-config.js scripts/migrate-config-to-yaml.js src/content tests/unit/yaml-config.test.js
git commit -m "feat: 生成站点 YAML 配置与迁移脚本"
```

---

### Task 3: 切换配置引用并删除旧 JS 配置

**Files:**
- Modify: `src/App.jsx:15`
- Modify: `src/components/BlogPage/BlogHero.jsx:5`
- Modify: `src/components/BlogPage/BlogPost.jsx:7`
- Modify: `src/components/BlogPage/BlogSearch.jsx:7`
- Modify: `src/components/HomePage/About.jsx:5`
- Modify: `src/components/HomePage/Contact.jsx:7`
- Modify: `src/components/HomePage/Projects.jsx:5`
- Modify: `src/components/HomePage/Skills.jsx:6`
- Modify: `src/components/shared/PageTitle.jsx:20`
- Modify: `src/components/shared/SiteRail.jsx:7`
- Modify: `src/components/shared/SubpageHeader.jsx:6`
- Modify: `src/pages/BlogPage.jsx:8,15`
- Modify: `src/pages/BlogPostPage.jsx:13`
- Modify: `src/pages/ContactPage.jsx:10`
- Modify: `src/pages/HomePage.jsx:16`
- Modify: `src/pages/ProjectsPage.jsx:8`
- Modify: `src/pages/SkillsPage.jsx:7`
- Delete: `src/config.js`
- Delete: `src/blogConfig.js`
- Delete: `scripts/migrate-config-to-yaml.js`

**Interfaces:**
- Produces：站点代码全部从 `src/content/site.yaml` / `src/content/blog.yaml` 导入配置，导入形式不变（默认导出对象）。

- [ ] **Step 1: 替换导入路径**

按下列对应关系逐条修改（旧 → 新）：

```text
src/App.jsx:15                          './config'                -> './content/site.yaml'
src/pages/HomePage.jsx:16               '../config'               -> '../content/site.yaml'
src/pages/SkillsPage.jsx:7              '../config'               -> '../content/site.yaml'
src/pages/ProjectsPage.jsx:8            '../config'               -> '../content/site.yaml'
src/pages/ContactPage.jsx:10            '../config'               -> '../content/site.yaml'
src/pages/BlogPage.jsx:15               '../config'               -> '../content/site.yaml'
src/pages/BlogPage.jsx:8                '../blogConfig'           -> '../content/blog.yaml'
src/pages/BlogPostPage.jsx:13           '../blogConfig'           -> '../content/blog.yaml'
src/components/HomePage/About.jsx:5     '../../config'            -> '../../content/site.yaml'
src/components/HomePage/Contact.jsx:7   '../../config'            -> '../../content/site.yaml'
src/components/HomePage/Projects.jsx:5  '../../config'            -> '../../content/site.yaml'
src/components/HomePage/Skills.jsx:6    '../../config'            -> '../../content/site.yaml'
src/components/BlogPage/BlogHero.jsx:5  '../../blogConfig'        -> '../../content/blog.yaml'
src/components/BlogPage/BlogPost.jsx:7  '../../blogConfig'        -> '../../content/blog.yaml'
src/components/BlogPage/BlogSearch.jsx:7 '../../blogConfig'       -> '../../content/blog.yaml'
src/components/shared/PageTitle.jsx:20  '../../config'            -> '../../content/site.yaml'
src/components/shared/SiteRail.jsx:7    '../../config'            -> '../../content/site.yaml'
src/components/shared/SubpageHeader.jsx:6 '../../config'          -> '../../content/site.yaml'
```

- [ ] **Step 2: 删除旧配置与一次性脚本**

```bash
git rm src/config.js src/blogConfig.js scripts/migrate-config-to-yaml.js
```

- [ ] **Step 3: 确认没有残留引用**

Run: `grep -rn "from ['\"].*\(config\|blogConfig\)['\"]" src --include=*.jsx --include=*.js || true`
Expected：无输出。

Run: `grep -rn "content/\(site\|blog\)\.yaml" src --include=*.jsx | wc -l`
Expected：18（17 个文件，`src/pages/BlogPage.jsx` 两次）。

- [ ] **Step 4: 构建验证**

Run: `pnpm build`
Expected：构建成功，无 YAML 解析错误；`dist/` 生成。

- [ ] **Step 5: 启动开发服务器抽查**

Run: `pnpm dev`
用浏览器打开 `/`、`/skills`、`/projects`、`/blog`、`/contact`，确认文案与图标正常、控制台无报错。

- [ ] **Step 6: 提交**

```bash
git add -A src
git commit -m "refactor: 站点配置切换为 YAML 并移除 JS 配置"
```

---

### Task 4: 安全校验纯函数与测试基础设施

**Files:**
- Modify: `package.json`（新增 `"test": "node --test tests/"`）
- Create: `scripts/lib/admin-validation.js`
- Create: `tests/unit/admin-validation.test.js`

**Interfaces:**
- Produces:
  - `isLoopback(address: string|undefined): boolean`
  - `isSameOrigin(origin: string|undefined, host: string|undefined): boolean`
  - `isSafeFileName(name: unknown): boolean`
  - `isPostFileName(name: unknown): boolean`
  - `assertInside(baseDir: string, targetPath: string): string`（越界抛 `{ status: 400 }`）
  - `SITE_IMAGE_EXTENSIONS: Set<string>`、`POST_IMAGE_EXTENSIONS: Set<string>`
  - `isAllowedImage(name: string, target: 'site'|'post'): boolean`

- [ ] **Step 1: 添加测试脚本**

修改 `package.json` 的 `scripts`，加入：

```json
"test": "node --test tests/"
```

- [ ] **Step 2: 写失败测试**

创建 `tests/unit/admin-validation.test.js`：

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import {
  isLoopback,
  isSameOrigin,
  isSafeFileName,
  isPostFileName,
  assertInside,
  isAllowedImage,
} from '../../scripts/lib/admin-validation.js'

test('只接受回环地址', () => {
  assert.equal(isLoopback('127.0.0.1'), true)
  assert.equal(isLoopback('::1'), true)
  assert.equal(isLoopback('::ffff:127.0.0.1'), true)
  assert.equal(isLoopback('192.168.1.10'), false)
  assert.equal(isLoopback(undefined), false)
})

test('Origin 必须与 Host 同源，缺省允许', () => {
  assert.equal(isSameOrigin(undefined, 'localhost:5173'), true)
  assert.equal(isSameOrigin('http://localhost:5173', 'localhost:5173'), true)
  assert.equal(isSameOrigin('http://evil.test', 'localhost:5173'), false)
  assert.equal(isSameOrigin('not a url', 'localhost:5173'), false)
})

test('文件名白名单拒绝路径穿越与隐藏文件', () => {
  assert.equal(isSafeFileName('avatar.png'), true)
  assert.equal(isSafeFileName('../secret.txt'), false)
  assert.equal(isSafeFileName('.env'), false)
  assert.equal(isSafeFileName('a/b.png'), false)
  assert.equal(isSafeFileName(''), false)
})

test('文章文件名必须符合约定', () => {
  assert.equal(isPostFileName('2026-04-20-building-modern-portfolio.md'), true)
  assert.equal(isPostFileName('2023-07-23-markdown-tutorial-en.md'), true)
  assert.equal(isPostFileName('2026-04-20-BadSlug.md'), false)
  assert.equal(isPostFileName('../posts/x.md'), false)
  assert.equal(isPostFileName('2026-04-20-ok.txt'), false)
})

test('assertInside 拒绝越界路径', () => {
  const base = path.resolve('/tmp/base')
  assert.equal(assertInside(base, path.join(base, 'a.png')), path.join(base, 'a.png'))
  assert.throws(() => assertInside(base, path.resolve('/tmp/base/../x')), /非法路径/)
})

test('图片扩展名按目标目录区分', () => {
  assert.equal(isAllowedImage('a.PNG', 'site'), true)
  assert.equal(isAllowedImage('favicon.ico', 'site'), true)
  assert.equal(isAllowedImage('favicon.ico', 'post'), false)
  assert.equal(isAllowedImage('a.pdf', 'site'), false)
  assert.equal(isAllowedImage('../a.png', 'site'), false)
})
```

- [ ] **Step 3: 运行确认失败**

Run: `pnpm test`
Expected: FAIL，模块不存在

- [ ] **Step 4: 实现校验库**

创建 `scripts/lib/admin-validation.js`：

```js
import path from 'node:path'

const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1'])

export function isLoopback(address) {
  return typeof address === 'string' && LOOPBACK.has(address)
}

export function isSameOrigin(origin, host) {
  if (!origin) return true
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export function isSafeFileName(name) {
  return (
    typeof name === 'string' &&
    name.length > 0 &&
    name.length <= 120 &&
    /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(name) &&
    !name.includes('..')
  )
}

export function isPostFileName(name) {
  return (
    typeof name === 'string' &&
    /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*(?:-en)?\.md$/.test(name)
  )
}

export function assertInside(baseDir, targetPath) {
  const rel = path.relative(baseDir, targetPath)
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) {
    throw Object.assign(new Error('非法路径'), { status: 400 })
  }
  return targetPath
}

export const SITE_IMAGE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.ico',
])

export const POST_IMAGE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg',
])

export function isAllowedImage(name, target) {
  if (!isSafeFileName(name)) return false
  const ext = path.extname(name).toLowerCase()
  const allowed = target === 'post' ? POST_IMAGE_EXTENSIONS : SITE_IMAGE_EXTENSIONS
  return allowed.has(ext)
}
```

- [ ] **Step 5: 运行确认通过**

Run: `pnpm test`
Expected: 全部通过（含 Task 1、Task 2 的测试）

- [ ] **Step 6: 提交**

```bash
git add package.json scripts/lib/admin-validation.js tests/unit/admin-validation.test.js
git commit -m "test: 添加后台安全校验纯函数"
```

---

### Task 5: 文章文件名工具与 Markdown 复用

**Files:**
- Create: `src/utils/postFilename.js`
- Create: `tests/unit/postFilename.test.js`
- Modify: `src/utils/markdown.js`

**Interfaces:**
- Produces:
  - `parsePostFilename(filename: string): { date: string, slug: string, isEnglish: boolean }`
  - `buildPostFilename({ date, slug, lang }): string`
  - `postImageDirName(filename: string): string`
  - `isValidPostSlug(slug: string): boolean`
  - `isValidPostDate(date: string): boolean`

- [ ] **Step 1: 写失败测试**

创建 `tests/unit/postFilename.test.js`：

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  parsePostFilename,
  buildPostFilename,
  postImageDirName,
  isValidPostSlug,
  isValidPostDate,
} from '../../src/utils/postFilename.js'

test('解析中文与英文文章文件名', () => {
  assert.deepEqual(parsePostFilename('2026-04-20-building-modern-portfolio.md'), {
    date: '2026-04-20', slug: 'building-modern-portfolio', isEnglish: false,
  })
  assert.deepEqual(parsePostFilename('2023-07-23-markdown-tutorial-en.md'), {
    date: '2023-07-23', slug: 'markdown-tutorial', isEnglish: true,
  })
  assert.deepEqual(parsePostFilename('weird-name.md'), {
    date: '', slug: 'weird-name', isEnglish: false,
  })
})

test('生成文件名', () => {
  assert.equal(buildPostFilename({ date: '2026-10-28', slug: 'hello', lang: 'zh' }), '2026-10-28-hello.md')
  assert.equal(buildPostFilename({ date: '2026-10-28', slug: 'hello', lang: 'en' }), '2026-10-28-hello-en.md')
})

test('配图目录名去掉扩展名与 -en 后缀', () => {
  assert.equal(postImageDirName('2026-04-20-building-modern-portfolio.md'), '2026-04-20-building-modern-portfolio')
  assert.equal(postImageDirName('2023-07-23-markdown-tutorial-en.md'), '2023-07-23-markdown-tutorial')
})

test('slug 与日期校验', () => {
  assert.equal(isValidPostSlug('hello-world-2'), true)
  assert.equal(isValidPostSlug('Hello-World'), false)
  assert.equal(isValidPostSlug('hello_world'), false)
  assert.equal(isValidPostSlug('-hello'), false)
  assert.equal(isValidPostDate('2026-10-28'), true)
  assert.equal(isValidPostDate('2026-02-31'), false)
  assert.equal(isValidPostDate('2026-1-1'), false)
})
```

- [ ] **Step 2: 运行确认失败**

Run: `pnpm test`
Expected: FAIL，`src/utils/postFilename.js` 不存在

- [ ] **Step 3: 实现文件名工具**

创建 `src/utils/postFilename.js`：

```js
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function parsePostFilename(filename) {
  const base = String(filename).replace(/\.md$/, '')
  const isEnglish = base.endsWith('-en')
  const clean = isEnglish ? base.slice(0, -3) : base
  const match = clean.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/)
  return match
    ? { date: match[1], slug: match[2], isEnglish }
    : { date: '', slug: clean, isEnglish }
}

export function buildPostFilename({ date, slug, lang }) {
  return `${date}-${slug}${lang === 'en' ? '-en' : ''}.md`
}

export function postImageDirName(filename) {
  return String(filename).replace(/\.md$/, '').replace(/-en$/, '')
}

export function isValidPostSlug(slug) {
  return SLUG_RE.test(String(slug))
}

export function isValidPostDate(date) {
  if (!DATE_RE.test(String(date))) return false
  const parsed = new Date(`${date}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date
}
```

- [ ] **Step 4: 运行确认通过**

Run: `pnpm test`
Expected: 全部通过

- [ ] **Step 5: 让 markdown.js 复用**

在 `src/utils/markdown.js` 中：

1. 在 `import fm from 'front-matter'` 后加入：

```js
import { parsePostFilename } from './postFilename'
```

2. 删除本地 `function parseFilename(filename) { ... }` 整段（第 55-74 行附近）。
3. 将 4 处 `parseFilename(...)` 调用替换为 `parsePostFilename(...)`（`getAllPosts`、`getPostBySlug`、`getPostByFilename`、`getAllSlugs`），其余解构不变。

- [ ] **Step 6: 构建验证**

Run: `pnpm build`
Expected：构建成功。

- [ ] **Step 7: 提交**

```bash
git add src/utils/postFilename.js src/utils/markdown.js tests/unit/postFilename.test.js
git commit -m "refactor: 抽取文章文件名工具供站点与后台共用"
```

---

### Task 6: admin 插件与配置读写 API

**Files:**
- Create: `scripts/admin-plugin.js`
- Modify: `vite.config.js`

**Interfaces:**
- Consumes: `writeYamlFile`、`readYamlFile`、`fileRevision`（Task 2）；`isLoopback`、`isSameOrigin`（Task 4）。
- Produces:
  - `GET /__admin/api/config` → `{ site, blog, revision: { site: number, blog: number } }`
  - `PUT /__admin/api/config` ← `{ site, blog, revision }` → `{ revision }`
  - `scripts/admin-plugin.js` 默认导出 `adminPlugin()`；同时把 `/admin`、`/admin/` 重写到 `/admin.html`。

- [ ] **Step 1: 实现插件（配置接口）**

创建 `scripts/admin-plugin.js`：

```js
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  writeYamlFile,
  readYamlFile,
  fileRevision,
} from './lib/yaml-config.js'
import { isLoopback, isSameOrigin } from './lib/admin-validation.js'

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const SITE_FILE = path.join(ROOT, 'src/content/site.yaml')
const BLOG_FILE = path.join(ROOT, 'src/content/blog.yaml')
const MAX_BODY = 5 * 1024 * 1024
const API_PREFIX = '/__admin/api'

function sendJson(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

function readBody(req, limit = MAX_BODY) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    let tooLarge = false
    req.on('data', (chunk) => {
      if (tooLarge) return
      size += chunk.length
      if (size > limit) {
        tooLarge = true
        reject(Object.assign(new Error('请求体超过 5MB'), { status: 413 }))
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (!tooLarge) resolve(Buffer.concat(chunks))
    })
    req.on('error', reject)
  })
}

async function readJson(req) {
  const buf = await readBody(req)
  try {
    return JSON.parse(buf.toString('utf8') || '{}')
  } catch {
    throw Object.assign(new Error('JSON 格式错误'), { status: 400 })
  }
}

function guard(req) {
  if (!isLoopback(req.socket.remoteAddress)) {
    throw Object.assign(new Error('仅允许本机访问'), { status: 403 })
  }
  if (!isSameOrigin(req.headers.origin, req.headers.host)) {
    throw Object.assign(new Error('跨源请求已拒绝'), { status: 403 })
  }
  if (req.method !== 'GET' && req.headers['x-admin-request'] !== '1') {
    throw Object.assign(new Error('缺少管理请求头'), { status: 403 })
  }
}

function readConfig() {
  return {
    site: readYamlFile(SITE_FILE),
    blog: readYamlFile(BLOG_FILE),
    revision: { site: fileRevision(SITE_FILE), blog: fileRevision(BLOG_FILE) },
  }
}

const SITE_TOP_KEYS = [
  'site', 'personal', 'navLinks', 'homeSections', 'about', 'buttons',
  'skillsSection', 'skills', 'projectsSection', 'projects', 'contact',
  'contactPage', 'socialLinks', 'footer',
]

const BLOG_TOP_KEYS = ['page', 'categories']

function assertShape(doc, allowedKeys, label) {
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    throw Object.assign(new Error(`${label} 必须是对象`), { status: 400 })
  }
  const actual = Object.keys(doc).sort()
  const expected = [...allowedKeys].sort()
  if (actual.join('|') !== expected.join('|')) {
    throw Object.assign(new Error(`${label} 的顶层字段不合法`), { status: 400 })
  }
}

function saveConfig(body) {
  const { site, blog, revision } = body || {}
  if (!site || typeof site !== 'object' || !blog || typeof blog !== 'object') {
    throw Object.assign(new Error('site 与 blog 必须是对象'), { status: 400 })
  }
  assertShape(site, SITE_TOP_KEYS, 'site')
  assertShape(blog, BLOG_TOP_KEYS, 'blog')
  if (typeof site.site?.title !== 'string' || !site.site.title.trim()) {
    throw Object.assign(new Error('site.title 必须是非空字符串'), { status: 400 })
  }
  if (!Array.isArray(site.navLinks) || !Array.isArray(site.skills) || !Array.isArray(site.projects)) {
    throw Object.assign(new Error('导航、技能、项目必须是数组'), { status: 400 })
  }
  if (!Array.isArray(blog.categories)) {
    throw Object.assign(new Error('博客分类必须是数组'), { status: 400 })
  }
  const current = { site: fileRevision(SITE_FILE), blog: fileRevision(BLOG_FILE) }
  if (
    !revision ||
    Math.round(revision.site) !== Math.round(current.site) ||
    Math.round(revision.blog) !== Math.round(current.blog)
  ) {
    throw Object.assign(new Error('文件已被外部修改，请刷新后再保存'), { status: 409 })
  }
  writeYamlFile(SITE_FILE, site)
  writeYamlFile(BLOG_FILE, blog)
  return { revision: { site: fileRevision(SITE_FILE), blog: fileRevision(BLOG_FILE) } }
}

async function handle(req, res) {
  guard(req)
  const url = new URL(req.url, 'http://localhost')
  const route = url.pathname
  const method = req.method

  if (route === '/config' && method === 'GET') {
    return sendJson(res, 200, readConfig())
  }
  if (route === '/config' && method === 'PUT') {
    return sendJson(res, 200, saveConfig(await readJson(req)))
  }

  return sendJson(res, 404, { error: '未知接口' })
}

export default function adminPlugin() {
  return {
    name: 'stylan-admin',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/admin' || req.url === '/admin/') req.url = '/admin.html'
        next()
      })
      server.middlewares.use(API_PREFIX, (req, res) => {
        handle(req, res).catch((err) => {
          sendJson(res, err.status || 500, { error: err.message || '服务器错误' })
        })
      })
    },
  }
}
```

- [ ] **Step 2: 只在 dev 注册插件**

修改 `vite.config.js`：把 `defineConfig({...})` 改为函数形式，并导入 `adminPlugin`。

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import yamlPlugin from "./scripts/vite-yaml-plugin.js";
import adminPlugin from "./scripts/admin-plugin.js";

export default defineConfig(({ command }) => ({
  plugins: [
    yamlPlugin(),
    react(),
    tailwindcss(),
    ...(command === 'serve' ? [adminPlugin()] : []),
  ],
  base: "/",
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/react-markdown') || id.includes('node_modules/remark-gfm') || id.includes('node_modules/rehype-highlight')) {
            return 'markdown-vendor';
          }
        }
      }
    }
  },
}));
```

- [ ] **Step 3: 启动 dev server 验证**

Run: `pnpm dev`（保持运行）

在另一个终端执行：

```bash
curl -s http://localhost:5173/__admin/api/config -H 'X-Admin-Request: 1' | head -c 200
```
Expected：JSON，包含 `"site"`、`"blog"`、`"revision"`。

```bash
curl -s -X PUT http://localhost:5173/__admin/api/config
```
Expected：403，`{"error":"缺少管理请求头"}`。

- [ ] **Step 4: 验证 revision 冲突**

```bash
mkdir -p .admin-test
curl -s http://localhost:5173/__admin/api/config -H 'X-Admin-Request: 1' > .admin-test/cfg.json
node -e "const c=require('./.admin-test/cfg.json'); c.revision.site = 0; require('fs').writeFileSync('.admin-test/bad.json', JSON.stringify(c))"
curl -s -X PUT http://localhost:5173/__admin/api/config -H 'Content-Type: application/json' -H 'X-Admin-Request: 1' --data-binary @.admin-test/bad.json
rm -rf .admin-test
```
Expected：409，`{"error":"文件已被外部修改，请刷新后再保存"}`。

- [ ] **Step 5: 验证构建隔离**

Run: `pnpm build`
Expected：成功。

Run: `grep -r "__admin" dist || true`
Expected：无输出。

- [ ] **Step 6: 提交**

```bash
git add scripts/admin-plugin.js vite.config.js
git commit -m "feat: 添加本地后台配置读写 API"
```

---

### Task 7: 文章 API

**Files:**
- Create: `scripts/lib/post-content.js`
- Create: `tests/unit/post-content.test.js`
- Modify: `scripts/admin-plugin.js`

**Interfaces:**
- Consumes: `parsePostFilename`（Task 5）；`isPostFileName`（Task 4）；`decodeURIComponent` 后的文件名。
- Produces:
  - `GET /__admin/api/posts` → 数组，元素含 `lang, filename, slug, date, title, excerpt, category, tags, featured, mtime`
  - `GET /__admin/api/posts/:lang/:filename` → `{ frontmatter, body, revision }`
  - `PUT /__admin/api/posts/:lang/:filename` ← `{ frontmatter, body, revision }` → `{ revision }`
  - `DELETE /__admin/api/posts/:lang/:filename` → `{ ok: true }`

- [ ] **Step 1: 写失败测试**

创建 `tests/unit/post-content.test.js`：

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { parsePost, serializePost, validateFrontmatter } from '../../scripts/lib/post-content.js'

test('序列化后再解析，frontmatter 与正文保持一致', () => {
  const frontmatter = {
    title: { en: 'Hello', zh: '你好' },
    excerpt: { en: 'Intro', zh: '简介' },
    category: 'tech',
    tags: ['React', 'YAML'],
    featured: true,
    date: '2026-10-28',
  }
  const body = '# 标题\n\n正文内容\n'
  const text = serializePost(frontmatter, body)
  const parsed = parsePost(text)
  assert.deepEqual(parsed.frontmatter, frontmatter)
  assert.equal(parsed.body.trimEnd(), '# 标题\n\n正文内容')
})

test('正文中的空行与代码块原样保留', () => {
  const body = '段落一\n\n```js\nconsole.log(1)\n```\n\n段落二'
  const text = serializePost({ title: 'A', category: 'tech', date: '2026-10-28' }, body)
  assert.equal(parsePost(text).body.trimEnd(), body)
})

test('frontmatter 日期被规范化为 YYYY-MM-DD', () => {
  const text = '---\ntitle: A\ndate: 2026-10-28\ncategory: tech\n---\n\n正文\n'
  assert.equal(parsePost(text).frontmatter.date, '2026-10-28')
})

test('校验必填与分类', () => {
  const categories = [{ id: 'tech' }, { id: 'thoughts' }]
  assert.deepEqual(validateFrontmatter({ title: 'A', category: 'tech', date: '2026-10-28' }, categories), [])
  assert.ok(validateFrontmatter({}, categories).length >= 1)
  assert.ok(validateFrontmatter({ title: { en: '', zh: '你好' }, category: 'tech', date: '2026-10-28' }, categories).some((m) => m.includes('标题')))
  assert.ok(validateFrontmatter({ title: 'A', category: 'nope', date: '2026-10-28' }, categories).some((m) => m.includes('分类')))
  assert.ok(validateFrontmatter({ title: 'A', category: 'tech', date: '2026-13-01' }, categories).some((m) => m.includes('日期')))
})
```

- [ ] **Step 2: 运行确认失败**

Run: `pnpm test`
Expected: FAIL，`scripts/lib/post-content.js` 不存在

- [ ] **Step 3: 实现文章序列化库**

创建 `scripts/lib/post-content.js`：

```js
import fm from 'front-matter'
import YAML from 'yaml'
import { isValidPostDate } from '../../src/utils/postFilename.js'

export function normalizePostDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  return typeof value === 'string' ? value : ''
}

export function parsePost(text) {
  const { attributes, body } = fm(text)
  const frontmatter = attributes || {}
  const date = normalizePostDate(frontmatter.date)
  if (date) frontmatter.date = date
  return { frontmatter, body: String(body || '').replace(/^\n/, '') }
}

export function serializePost(frontmatter, body) {
  const yaml = YAML.stringify(frontmatter, { lineWidth: 0 })
  const cleanBody = String(body ?? '').replace(/\s+$/, '')
  return `---\n${yaml}---\n\n${cleanBody}\n`
}

export function validateFrontmatter(frontmatter, categories = []) {
  const errors = []
  if (!frontmatter || typeof frontmatter !== 'object') return ['frontmatter 必须是对象']
  const title = frontmatter.title
  const titleOk =
    (typeof title === 'string' && title.trim().length > 0) ||
    Boolean(
      title &&
        typeof title === 'object' &&
        String(title.en || '').trim() &&
        String(title.zh || '').trim()
    )
  if (!titleOk) errors.push('标题必填（单语需非空；双语需两种语言都填写）')
  if (!isValidPostDate(frontmatter.date)) errors.push('日期格式应为 YYYY-MM-DD')
  if (!frontmatter.category) errors.push('分类必填')
  if (categories.length && !categories.some((item) => item.id === frontmatter.category)) {
    errors.push('分类不在博客分类列表中')
  }
  if (frontmatter.tags != null && !Array.isArray(frontmatter.tags)) {
    errors.push('tags 必须是数组')
  }
  return errors
}
```

- [ ] **Step 4: 运行确认通过**

Run: `pnpm test`
Expected: 全部通过

- [ ] **Step 5: 在插件中实现文章接口**

把 `scripts/admin-plugin.js` 顶部的导入替换为以下完整列表（Task 8 会再补 `isAllowedImage` 与 `postImageDirName`）：

```js
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fm from 'front-matter'
import { writeYamlFile, readYamlFile, fileRevision } from './lib/yaml-config.js'
import { isLoopback, isSameOrigin, isPostFileName, assertInside } from './lib/admin-validation.js'
import { parsePost, serializePost, validateFrontmatter, normalizePostDate } from './lib/post-content.js'
import { parsePostFilename } from '../src/utils/postFilename.js'
```

在常量区加入：

```js
const POSTS_ZH = path.join(ROOT, 'src/posts')
const POSTS_EN = path.join(ROOT, 'src/posts/en')
```

在 `handle` 之前加入：

```js
function postsDir(lang) {
  if (lang !== 'zh' && lang !== 'en') {
    throw Object.assign(new Error('未知语言'), { status: 400 })
  }
  return lang === 'en' ? POSTS_EN : POSTS_ZH
}

async function listPosts() {
  const out = []
  for (const [lang, dir] of [['zh', POSTS_ZH], ['en', POSTS_EN]]) {
    const entries = await fsp.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue
      const file = path.join(dir, entry.name)
      const text = await fsp.readFile(file, 'utf8')
      const { attributes } = fm(text)
      const meta = parsePostFilename(entry.name)
      const stat = await fsp.stat(file)
      out.push({
        lang,
        filename: entry.name,
        slug: meta.slug,
        date: normalizePostDate(attributes.date) || meta.date,
        title: attributes.title ?? '',
        excerpt: attributes.excerpt ?? '',
        category: attributes.category ?? '',
        tags: attributes.tags ?? [],
        featured: Boolean(attributes.featured),
        mtime: stat.mtimeMs,
      })
    }
  }
  return out.sort((a, b) => new Date(b.date) - new Date(a.date))
}

async function getPost(lang, filename) {
  const dir = postsDir(lang)
  if (!isPostFileName(filename)) {
    throw Object.assign(new Error('非法文章文件名'), { status: 400 })
  }
  const file = assertInside(dir, path.join(dir, filename))
  const text = await fsp.readFile(file, 'utf8')
  const { frontmatter, body } = parsePost(text)
  const stat = await fsp.stat(file)
  return { frontmatter, body, revision: stat.mtimeMs }
}

async function savePost(lang, filename, payload) {
  const dir = postsDir(lang)
  if (!isPostFileName(filename)) {
    throw Object.assign(new Error('非法文章文件名'), { status: 400 })
  }
  const { frontmatter, body, revision } = payload || {}
  const blog = readYamlFile(BLOG_FILE)
  const errors = validateFrontmatter(frontmatter, blog?.categories || [])
  if (errors.length) {
    throw Object.assign(new Error(errors.join('；')), { status: 400 })
  }
  const file = assertInside(dir, path.join(dir, filename))
  const exists = fs.existsSync(file)
  if (exists) {
    if (revision === null || revision === undefined) {
      throw Object.assign(new Error('同名文章已存在'), { status: 409 })
    }
    if (typeof revision !== 'number' || Math.round(fs.statSync(file).mtimeMs) !== Math.round(revision)) {
      throw Object.assign(new Error('文件已被外部修改，请刷新后再保存'), { status: 409 })
    }
  } else if (typeof revision === 'number') {
    throw Object.assign(new Error('文章已被删除，请刷新列表'), { status: 409 })
  }
  await fsp.writeFile(file, serializePost(frontmatter, body), 'utf8')
  return { revision: fs.statSync(file).mtimeMs }
}

async function deletePost(lang, filename) {
  const dir = postsDir(lang)
  if (!isPostFileName(filename)) {
    throw Object.assign(new Error('非法文章文件名'), { status: 400 })
  }
  const file = assertInside(dir, path.join(dir, filename))
  try {
    await fsp.unlink(file)
    return { ok: true }
  } catch (err) {
    if (err.code === 'ENOENT') throw Object.assign(new Error('文章不存在'), { status: 404 })
    throw err
  }
}
```

在 `handle` 的 `/config` 分支后加入：

```js
  if (route === '/posts' && method === 'GET') {
    return sendJson(res, 200, await listPosts())
  }

  const postMatch = route.match(/^\/posts\/(zh|en)\/([^/]+)$/)
  if (postMatch) {
    const [, lang, rawName] = postMatch
    const filename = decodeURIComponent(rawName)
    if (method === 'GET') return sendJson(res, 200, await getPost(lang, filename))
    if (method === 'PUT') return sendJson(res, 200, await savePost(lang, filename, await readJson(req)))
    if (method === 'DELETE') return sendJson(res, 200, await deletePost(lang, filename))
  }
```

- [ ] **Step 6: curl 验证文章接口**

保持 `pnpm dev` 运行，执行：

```bash
curl -s http://localhost:5173/__admin/api/posts -H 'X-Admin-Request: 1' | head -c 300
```
Expected：文章数组。

```bash
mkdir -p .admin-test
curl -s http://localhost:5173/__admin/api/posts/zh/2026-04-20-building-modern-portfolio.md -H 'X-Admin-Request: 1' > .admin-test/post.json
node -e "const p=require('./.admin-test/post.json'); p.frontmatter.title.zh='构建现代个人主页（测试）'; require('fs').writeFileSync('.admin-test/post-save.json', JSON.stringify(p))"
curl -s -X PUT http://localhost:5173/__admin/api/posts/zh/2026-04-20-building-modern-portfolio.md -H 'Content-Type: application/json' -H 'X-Admin-Request: 1' --data-binary @.admin-test/post-save.json
rm -rf .admin-test
```
Expected：`{"revision":...}`，且文件 frontmatter 保持双语结构。

```bash
git diff --stat src/posts
git checkout -- src/posts
```

- [ ] **Step 7: 提交**

```bash
git add scripts/lib/post-content.js scripts/admin-plugin.js tests/unit/post-content.test.js
git commit -m "feat: 添加本地后台文章读写 API"
```

---

### Task 8: 图片上传 API

**Files:**
- Modify: `scripts/admin-plugin.js`

**Interfaces:**
- Consumes: `isAllowedImage`、`isPostFileName`、`assertInside`（Task 4）；`postImageDirName`（Task 5）。
- 把 `scripts/admin-plugin.js` 顶部的导入替换为以下完整列表：

```js
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fm from 'front-matter'
import { writeYamlFile, readYamlFile, fileRevision } from './lib/yaml-config.js'
import { isLoopback, isSameOrigin, isPostFileName, assertInside, isAllowedImage } from './lib/admin-validation.js'
import { parsePost, serializePost, validateFrontmatter, normalizePostDate } from './lib/post-content.js'
import { parsePostFilename, postImageDirName } from '../src/utils/postFilename.js'
```

- Produces: `POST /__admin/api/upload?target=site|post&name=<文件名>&post=<文章文件名>`，body 为原始二进制，返回 `{ path }`。
  - `target=site` → 写入 `public/images/`，返回 `/images/<name>`
  - `target=post` → 写入 `src/posts/img/<postImageDirName(post)>/`，返回 `<name>`

- [ ] **Step 1: 增加上传实现**

在 `scripts/admin-plugin.js` 常量区加入：

```js
const POST_IMG = path.join(ROOT, 'src/posts/img')
const PUBLIC_IMAGES = path.join(ROOT, 'public/images')
```

在 `deletePost` 之后加入：

```js
async function uniqueName(dir, name) {
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
    throw Object.assign(new Error('不支持的图片类型或文件名'), { status: 400 })
  }
  let dir
  let urlPrefix
  if (target === 'post') {
    if (!post || !isPostFileName(post)) {
      throw Object.assign(new Error('缺少有效的文章文件名'), { status: 400 })
    }
    dir = path.join(POST_IMG, postImageDirName(post))
    urlPrefix = ''
  } else {
    dir = PUBLIC_IMAGES
    urlPrefix = '/images/'
  }
  await fsp.mkdir(dir, { recursive: true })
  const finalName = await uniqueName(dir, name)
  const file = assertInside(dir, path.join(dir, finalName))
  await fsp.writeFile(file, buffer)
  return { path: `${urlPrefix}${finalName}` }
}
```

导入列表按本任务 Interfaces 中的完整版本替换，`isAllowedImage` 与 `postImageDirName` 在其中。

在 `handle` 的文章路由后加入：

```js
  if (route === '/upload' && method === 'POST') {
    const target = url.searchParams.get('target') === 'post' ? 'post' : 'site'
    const name = url.searchParams.get('name') || ''
    const post = url.searchParams.get('post') || ''
    const buffer = await readBody(req)
    return sendJson(res, 200, await saveUpload(target, name, post, buffer))
  }
```

- [ ] **Step 2: curl 验证站点图片上传**

保持 `pnpm dev` 运行：

```bash
mkdir -p .admin-test
printf 'fake-image' > .admin-test/test.png
curl -s -X POST "http://localhost:5173/__admin/api/upload?target=site&name=test.png" -H 'X-Admin-Request: 1' --data-binary @.admin-test/test.png
```
Expected：`{"path":"/images/test.png"}`，且 `public/images/test.png` 存在。

再次执行同一命令，Expected：`{"path":"/images/test-1.png"}`（同名自动加后缀）。

清理：

```bash
rm -f public/images/test.png public/images/test-1.png
```

- [ ] **Step 3: 验证拒绝场景**

```bash
curl -s -X POST "http://localhost:5173/__admin/api/upload?target=site&name=evil.pdf" -H 'X-Admin-Request: 1' --data-binary @.admin-test/test.png
```
Expected：400，`不支持的图片类型或文件名`。

```bash
curl -s -X POST "http://localhost:5173/__admin/api/upload?target=post&name=a.png" -H 'X-Admin-Request: 1' --data-binary @.admin-test/test.png
```
Expected：400，`缺少有效的文章文件名`。

- [ ] **Step 4: 验证文章配图目录**

```bash
curl -s -X POST "http://localhost:5173/__admin/api/upload?target=post&post=2026-04-20-building-modern-portfolio.md&name=cover.png" -H 'X-Admin-Request: 1' --data-binary @.admin-test/test.png
```
Expected：`{"path":"cover.png"}`，且文件位于 `src/posts/img/2026-04-20-building-modern-portfolio/cover.png`。

清理：

```bash
rm -rf "src/posts/img/2026-04-20-building-modern-portfolio" .admin-test
```

- [ ] **Step 5: 构建验证**

Run: `pnpm build`
Expected：成功，且 `grep -r "__admin" dist || true` 无输出。

- [ ] **Step 6: 提交**

```bash
git add scripts/admin-plugin.js
git commit -m "feat: 添加本地后台图片上传 API"
```

---

### Task 9: 后台独立入口与配置读写

**Files:**
- Create: `admin.html`
- Create: `src/admin/main.jsx`
- Create: `src/admin/AdminApp.jsx`
- Create: `src/admin/api.js`
- Create: `src/admin/admin.css`
- Modify: `package.json`（无需改动，确认 `dev` 脚本可直接访问 `/admin`）

**Interfaces:**
- Consumes: `GET/PUT /__admin/api/config`（Task 6）。
- Produces: `adminApi` 对象，方法签名：
  - `getConfig(): Promise<{ site, blog, revision }>`
  - `saveConfig(payload): Promise<{ revision }>`
  - `listPosts()`、`getPost(lang, filename)`、`savePost(lang, filename, payload)`、`deletePost(lang, filename)`
  - `upload(target, file, post?)`

- [ ] **Step 1: 创建后台入口 HTML**

创建 `admin.html`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>STYLAN · 内容后台</title>
  </head>
  <body>
    <div id="admin-root"></div>
    <script type="module" src="/src/admin/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 2: 创建 API 客户端**

创建 `src/admin/api.js`：

```js
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
```

- [ ] **Step 3: 创建后台样式**

创建 `src/admin/admin.css`：

```css
.admin-shell {
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
  background: var(--bg);
  color: var(--ink);
}

.admin-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--line);
  background: var(--bg-elevated);
}

.admin-body {
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr) minmax(340px, 40%);
  overflow: hidden;
}

.admin-nav {
  border-right: 1px solid var(--line);
  padding: 12px 8px;
  overflow-y: auto;
}

.admin-main {
  padding: 20px 24px 60px;
  overflow-y: auto;
}

.admin-preview {
  border-left: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-preview iframe {
  flex: 1;
  width: 100%;
  border: 0;
  background: #fff;
}

.admin-nav-btn {
  width: 100%;
  text-align: left;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--ink-muted);
}

.admin-nav-btn:hover {
  background: var(--accent-soft);
  color: var(--ink);
}

.admin-nav-btn.is-active {
  background: var(--accent-soft);
  color: var(--accent);
}

.admin-label-text {
  display: block;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-muted);
}

.admin-sub {
  display: block;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--ink-muted);
  margin-bottom: 4px;
}

.admin-input {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--bg-elevated);
  color: var(--ink);
  padding: 7px 10px;
  font-size: 13px;
  outline: none;
}

.admin-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-soft);
}

.admin-help {
  margin-top: 4px;
  font-size: 11px;
  color: var(--ink-muted);
}

.admin-btn {
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  color: var(--ink);
  background: var(--bg-elevated);
}

.admin-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.admin-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.admin-btn-primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.admin-btn-primary:hover {
  color: #fff;
  filter: brightness(1.05);
}

.admin-btn-danger:hover {
  border-color: #dc2626;
  color: #dc2626;
}

.admin-tab {
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid var(--line);
  font-size: 12px;
  color: var(--ink-muted);
}

.admin-tab.is-active {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-soft);
}

.admin-badge {
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 2px 5px;
  color: var(--ink-muted);
}

.admin-error {
  color: #dc2626;
  font-size: 12px;
}

.admin-link {
  font-size: 11px;
  color: var(--accent);
}

.prose-admin {
  font-size: 14px;
  line-height: 1.75;
  color: var(--ink);
}

.prose-admin h1,
.prose-admin h2,
.prose-admin h3 {
  font-family: var(--font-display);
  margin: 1.2em 0 0.5em;
}

.prose-admin pre {
  background: #0b0c0e;
  color: #f2f3f5;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 12px;
}

@media (max-width: 1100px) {
  .admin-body {
    grid-template-columns: 160px minmax(0, 1fr);
  }
  .admin-preview {
    display: none;
  }
}
```

- [ ] **Step 4: 创建入口**

创建 `src/admin/main.jsx`：

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import './admin.css'
import AdminApp from './AdminApp'

try {
  const saved = localStorage.getItem('theme')
  const dark =
    saved === 'dark' ||
    (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
} catch {
  // 忽略隐私模式下的 localStorage 异常
}

createRoot(document.getElementById('admin-root')).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>
)
```

- [ ] **Step 5: 创建 AdminApp（先显示原始 JSON）**

创建 `src/admin/AdminApp.jsx`：

```jsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { adminApi } from './api'

const PREVIEW_PAGES = [
  ['/', '首页'],
  ['/skills', '技能'],
  ['/projects', '项目'],
  ['/blog', '博客'],
  ['/contact', '联系'],
]

const NAV = [
  ['site', '站点信息'],
  ['personal', '个人信息'],
  ['nav', '导航'],
  ['about', '关于'],
  ['skills', '技能'],
  ['projects', '项目'],
  ['contact', '联系'],
  ['footer', '页脚'],
  ['blog', '博客设置'],
  ['posts', '文章管理'],
]

export default function AdminApp() {
  const [docs, setDocs] = useState(null)
  const [revision, setRevision] = useState(null)
  const [baseline, setBaseline] = useState(null)
  const [activeId, setActiveId] = useState(
    () => sessionStorage.getItem('stylan-admin-section') || 'site'
  )
  const [previewPath, setPreviewPath] = useState('/')
  const [status, setStatus] = useState({ kind: '', text: '' })
  const [saving, setSaving] = useState(false)
  const iframeRef = useRef(null)

  const dirty = useMemo(
    () => Boolean(docs && baseline && JSON.stringify(docs) !== JSON.stringify(baseline)),
    [docs, baseline]
  )

  const load = useCallback(async () => {
    setStatus({ kind: '', text: '' })
    try {
      const data = await adminApi.getConfig()
      setDocs({ site: data.site, blog: data.blog })
      setBaseline({ site: data.site, blog: data.blog })
      setRevision(data.revision)
    } catch (err) {
      setStatus({ kind: 'error', text: err.message })
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    sessionStorage.setItem('stylan-admin-section', activeId)
  }, [activeId])

  useEffect(() => {
    if (!dirty) return undefined
    const handler = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const save = useCallback(async () => {
    if (!docs) return
    setSaving(true)
    setStatus({ kind: '', text: '' })
    try {
      const result = await adminApi.saveConfig({ ...docs, revision })
      setRevision(result.revision)
      setBaseline(JSON.parse(JSON.stringify(docs)))
      setStatus({ kind: 'ok', text: '已保存' })
      iframeRef.current?.contentWindow?.location.reload()
    } catch (err) {
      setStatus({ kind: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }, [docs, revision])

  useEffect(() => {
    const handler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        save()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [save])

  if (!docs) {
    return (
      <div className="admin-shell">
        <div className="admin-topbar">
          <strong>STYLAN · 内容后台</strong>
          <button className="admin-btn" onClick={load}>重试</button>
        </div>
        <div className="admin-main">
          <p className="text-sm text-muted">
            {status.text || '正在加载配置…'}
          </p>
        </div>
      </div>
    )
  }

  const doc = activeId === 'blog' || activeId === 'posts' ? docs.blog : docs.site

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="flex items-center gap-3">
          <strong className="font-display">STYLAN · 内容后台</strong>
          {dirty && <span className="admin-badge">未保存</span>}
        </div>
        <div className="flex items-center gap-3">
          {status.text && (
            <span className={status.kind === 'error' ? 'admin-error' : 'text-[12px] text-muted'}>
              {status.text}
            </span>
          )}
          <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving || !dirty}>
            {saving ? '保存中…' : '保存更改'}
          </button>
        </div>
      </header>

      <div className="admin-body">
        <nav className="admin-nav">
          {NAV.map(([id, label]) => (
            <button
              key={id}
              className={`admin-nav-btn ${activeId === id ? 'is-active' : ''}`}
              onClick={() => setActiveId(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <main className="admin-main">
          <h2 className="font-display text-xl mb-4">
            {NAV.find(([id]) => id === activeId)?.[1]}
          </h2>
          <pre className="text-[11px] text-muted overflow-auto">
            {JSON.stringify(activeId === 'posts' ? { note: '文章管理将在后续任务接入' } : doc, null, 2)}
          </pre>
        </main>

        <aside className="admin-preview">
          <div className="flex items-center gap-2 p-2 border-b" style={{ borderColor: 'var(--line)' }}>
            <select
              className="admin-input"
              value={previewPath}
              onChange={(event) => setPreviewPath(event.target.value)}
            >
              {PREVIEW_PAGES.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <button
              className="admin-btn"
              onClick={() => iframeRef.current?.contentWindow?.location.reload()}
            >
              刷新
            </button>
          </div>
          <iframe ref={iframeRef} src={previewPath} title="站点预览" />
        </aside>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: 验证入口与读写**

Run: `pnpm dev`

浏览器打开 `http://localhost:5173/admin`：
- 顶栏显示“STYLAN · 内容后台”；
- 左侧导航可切换，中间显示对应 JSON；
- 右侧 iframe 显示站点，可切换页面；
- 控制台无报错。

再执行构建隔离检查：

```bash
pnpm build
test ! -e dist/admin.html && echo "admin.html 未进入 dist"
grep -r "__admin" dist || true
ls dist/assets | grep -i admin || true
```
Expected：输出 `admin.html 未进入 dist`，其余两条无输出。

- [ ] **Step 7: 提交**

```bash
git add admin.html src/admin
git commit -m "feat: 添加仅本地可用的后台入口与配置读写"
```

---

### Task 10: schema 驱动的配置表单

**Files:**
- Create: `src/admin/schema.js`
- Create: `src/admin/lib/objectPath.js`
- Create: `src/admin/lib/validate.js`
- Create: `src/admin/components/Field.jsx`
- Create: `src/admin/sections/ConfigSection.jsx`
- Create: `tests/unit/objectPath.test.js`
- Create: `tests/unit/admin-validate.test.js`
- Modify: `src/admin/AdminApp.jsx`

**Interfaces:**
- Consumes: `adminApi`（Task 9）；`getIn` / `setIn`（本任务）。
- Produces:
  - `contentSchema: Array<{ id, label, doc: 'site'|'blog', path: string[], fields?, list?, description? }>`
  - `getIn(obj, path)`、`setIn(obj, path, value)`、`clone(value)`
  - `validateValue(field, value): string`、`validateSection(section, value): string[]`、`validateDoc(sections, docs): string[]`
  - `<Field field value onChange />` 支持 `text | textarea | url | imagePath | toggle | i18nText | i18nTextarea | stringList | i18nList | objectList | object`

- [ ] **Step 1: 写对象路径失败测试**

创建 `tests/unit/objectPath.test.js`：

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { getIn, setIn } from '../../src/admin/lib/objectPath.js'

test('getIn 读取嵌套路径与根对象', () => {
  const doc = { site: { title: 'A' }, arr: [] }
  assert.equal(getIn(doc, []), doc)
  assert.equal(getIn(doc, ['site', 'title']), 'A')
  assert.equal(getIn(doc, ['missing', 'x']), undefined)
})

test('setIn 不可变更新并自动补全对象', () => {
  const doc = { site: { title: 'A' } }
  const next = setIn(doc, ['site', 'title'], 'B')
  assert.equal(next.site.title, 'B')
  assert.equal(doc.site.title, 'A')
  assert.deepEqual(setIn({}, ['about', 'focus'], []), { about: { focus: [] } })
  assert.deepEqual(setIn(doc, [], { x: 1 }), { x: 1 })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `pnpm test`
Expected: FAIL，模块不存在

- [ ] **Step 3: 实现对象路径工具**

创建 `src/admin/lib/objectPath.js`：

```js
export function getIn(obj, path) {
  return path.reduce((acc, key) => (acc == null ? undefined : acc[key]), obj)
}

export function setIn(obj, path, value) {
  if (path.length === 0) return value
  const [head, ...rest] = path
  const base = obj && typeof obj === 'object' ? obj : {}
  return { ...base, [head]: setIn(base[head], rest, value) }
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value))
}
```

- [ ] **Step 4: 写校验失败测试**

创建 `tests/unit/admin-validate.test.js`：

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { validateValue, validateDoc } from '../../src/admin/lib/validate.js'

test('必填与格式校验', () => {
  assert.equal(validateValue({ type: 'text', required: true }, ''), '必填')
  assert.equal(validateValue({ type: 'text', required: true }, 'A'), '')
  assert.equal(validateValue({ type: 'i18nText', required: true }, { en: 'A', zh: '甲' }), '')
  assert.match(validateValue({ type: 'url' }, 'not-a-url'), /http/)
  assert.equal(validateValue({ type: 'url' }, '/contact'), '')
  assert.equal(validateValue({ type: 'url' }, 'mailto:duan-deqing@foxmail.com'), '')
  assert.equal(validateValue({ type: 'url' }, '#projects'), '')
  assert.match(validateValue({ type: 'imagePath' }, 'avatar.png'), /路径/)
  assert.equal(validateValue({ type: 'imagePath' }, '/images/a.png'), '')
})

test('validateDoc 覆盖嵌套对象与列表', () => {
  const sections = [
    {
      id: 'site', label: '站点', doc: 'site', path: [],
      fields: [
        { key: 'title', label: '标题', type: 'text', required: true },
        { key: 'contact', label: '联系', type: 'object', fields: [
          { key: 'email', label: '邮箱', type: 'text', required: true },
        ] },
      ],
    },
    {
      id: 'skills', label: '技能', doc: 'site', path: ['skills'],
      list: { label: '技能项', fields: [{ key: 'name', label: '名称', type: 'text', required: true }] },
    },
  ]
  const errors = validateDoc(sections, {
    site: { title: '', contact: { email: '' }, skills: [{ name: '' }] },
    blog: {},
  })
  assert.ok(errors.some((message) => message.includes('标题')))
  assert.ok(errors.some((message) => message.includes('邮箱')))
  assert.ok(errors.some((message) => message.includes('技能')))
})
```

- [ ] **Step 5: 运行确认失败**

Run: `pnpm test`
Expected: FAIL，`validate.js` 不存在

- [ ] **Step 6: 实现校验**

创建 `src/admin/lib/validate.js`：

```js
import { getIn } from './objectPath.js'

export function validateValue(field, value) {
  const empty =
    value === undefined ||
    value === null ||
    (typeof value === 'string' && !value.trim()) ||
    (Array.isArray(value) && value.length === 0)

  if (field.required && empty) return '必填'
  if (field.required && field.type === 'i18nText') {
    const both = value && typeof value === 'object' && String(value.en || '').trim() && String(value.zh || '').trim()
    if (!both) return '两种语言都需填写'
  }
  if (typeof value === 'string' && value.trim()) {
    if (field.type === 'url' && !/^(https?:\/\/|\/|#|mailto:|tel:)/.test(value.trim())) {
      return '需为 http(s)、mailto、tel 链接、站内路径或锚点'
    }
    if (field.type === 'imagePath' && !/^(https?:\/\/|\/)/.test(value.trim())) {
      return '需为 / 开头的路径或 http(s) 链接'
    }
  }
  return ''
}

function validateFields(fields, value, labelPrefix = '') {
  const errors = []
  for (const field of fields) {
    const fieldValue = value?.[field.key]
    const message = validateValue(field, fieldValue)
    if (message) errors.push(`${labelPrefix}${field.label}：${message}`)
    if (field.type === 'object' && field.fields) {
      errors.push(...validateFields(field.fields, fieldValue, `${labelPrefix}${field.label} / `))
    }
    if (field.type === 'objectList' && Array.isArray(fieldValue)) {
      fieldValue.forEach((item, index) => {
        errors.push(...validateFields(field.fields || [], item, `${labelPrefix}${field.label} #${index + 1} / `))
      })
    }
  }
  return errors
}

export function validateSection(section, value) {
  return validateFields(section.fields || [], value)
}

export function validateDoc(sections, docs) {
  const errors = []
  for (const section of sections) {
    const value = getIn(docs[section.doc], section.path)
    if (section.list) {
      const items = Array.isArray(value) ? value : []
      items.forEach((item, index) => {
        errors.push(...validateFields(section.list.fields || [], item, `${section.label} #${index + 1} / `))
      })
      continue
    }
    errors.push(...validateSection(section, value || {}))
  }
  return errors
}
```

- [ ] **Step 7: 运行确认通过**

Run: `pnpm test`
Expected: 全部通过

- [ ] **Step 8: 写 schema**

创建 `src/admin/schema.js`。字段说明以 YAML 实际键为准：

```js
const bilingual = (key, label, type = 'i18nText', extra = {}) => ({
  key, label, type, ...extra,
})

export const contentSchema = [
  {
    id: 'site',
    label: '站点信息',
    doc: 'site',
    path: ['site'],
    fields: [
      { key: 'title', label: '站点标题', type: 'text', required: true },
      { key: 'pageTitle', label: '浏览器标题', type: 'text', help: '例如 STYLAN · Portfolio' },
      { key: 'favicon', label: 'Favicon', type: 'imagePath' },
      bilingual('description', '站点描述', 'i18nTextarea'),
      { key: 'keywords', label: 'SEO 关键词', type: 'textarea' },
      { key: 'url', label: '站点地址', type: 'url' },
      { key: 'ogImage', label: '分享图', type: 'imagePath' },
    ],
  },
  {
    id: 'personal',
    label: '个人信息',
    doc: 'site',
    path: ['personal'],
    fields: [
      bilingual('name', '名字', 'i18nText', { required: true }),
      { key: 'avatar', label: '头像', type: 'text', upload: true, help: '可填 emoji，或上传图片得到路径' },
      bilingual('titlePrefix', '标题前缀'),
      bilingual('titleName', '标题名字'),
      { key: 'tags', label: '身份标签', type: 'i18nList' },
      bilingual('tagDescription', '标签描述'),
      bilingual('bio', '个人简介', 'i18nTextarea'),
    ],
  },
  {
    id: 'nav',
    label: '导航',
    doc: 'site',
    path: [],
    fields: [
      {
        key: 'navLinks', label: '导航链接', type: 'objectList',
        fields: [
          { key: 'href', label: '链接', type: 'url', required: true },
          bilingual('label', '文字', 'i18nText', { required: true }),
        ],
      },
      {
        key: 'homeSections', label: '首页章节', type: 'objectList',
        fields: [
          { key: 'id', label: '锚点 id', type: 'text', required: true },
          { key: 'num', label: '编号', type: 'text' },
          bilingual('label', '文字', 'i18nText', { required: true }),
        ],
      },
    ],
  },
  {
    id: 'about',
    label: '关于',
    doc: 'site',
    path: ['about'],
    fields: [{ key: 'focus', label: '方向列表', type: 'i18nList' }],
  },
  {
    id: 'skills',
    label: '技能',
    doc: 'site',
    path: ['skills'],
    list: {
      label: '技能分类',
      fields: [
        bilingual('category', '分类名', 'i18nText', { required: true }),
        { key: 'items', label: '技术项', type: 'stringList' },
      ],
    },
  },
  {
    id: 'projects',
    label: '项目',
    doc: 'site',
    path: ['projects'],
    list: {
      label: '项目',
      fields: [
        bilingual('title', '名称', 'i18nText', { required: true }),
        bilingual('description', '描述', 'i18nTextarea'),
        { key: 'tags', label: '技术标签', type: 'stringList' },
        { key: 'link', label: '链接', type: 'url' },
      ],
    },
  },
  {
    id: 'contact',
    label: '联系',
    doc: 'site',
    path: [],
    fields: [
      {
        key: 'contact', label: '首页联系区块', type: 'object',
        fields: [
          bilingual('title', '标题'),
          bilingual('description', '描述', 'i18nTextarea'),
          { key: 'email', label: '邮箱', type: 'text' },
          bilingual('emailButtonText', '按钮文字'),
        ],
      },
      {
        key: 'contactPage', label: '联系页', type: 'object',
        fields: [
          bilingual('title', '页面标题'),
          bilingual('backToHome', '返回文字'),
          bilingual('description', '页面描述', 'i18nTextarea'),
          {
            key: 'contactMethods', label: '联系方式', type: 'objectList',
            fields: [
              { key: 'icon', label: '图标', type: 'text', help: 'email / github / bilibili / wechat' },
              bilingual('label', '名称'),
              { key: 'value', label: '显示值', type: 'text' },
              { key: 'href', label: '链接', type: 'url', help: '可留空' },
              { key: 'qrcode', label: '二维码', type: 'imagePath' },
            ],
          },
          { key: 'image', label: '页面插图', type: 'imagePath' },
        ],
      },
      {
        key: 'socialLinks', label: '社交链接', type: 'objectList',
        fields: [
          { key: 'platform', label: '平台', type: 'text', required: true },
          { key: 'url', label: '链接', type: 'url', required: true },
        ],
      },
    ],
  },
  {
    id: 'footer',
    label: '页脚',
    doc: 'site',
    path: ['footer'],
    fields: [{ key: 'copyright', label: '版权信息', type: 'text' }],
  },
  {
    id: 'blog',
    label: '博客设置',
    doc: 'blog',
    path: [],
    fields: [
      {
        key: 'page', label: '博客页', type: 'object',
        fields: [
          bilingual('title', '页面标题'),
          bilingual('subtitle', '副标题'),
          bilingual('backToHome', '返回文字'),
        ],
      },
      {
        key: 'categories', label: '分类', type: 'objectList',
        fields: [
          { key: 'id', label: 'id', type: 'text', required: true, help: '小写，需与文章 category 一致' },
          bilingual('label', '名称', 'i18nText', { required: true }),
        ],
      },
    ],
  },
]
```

- [ ] **Step 9: 实现字段渲染器**

创建 `src/admin/components/Field.jsx`：

```jsx
import { useState } from 'react'
import { adminApi } from '../api'
import { validateValue } from '../lib/validate'

function FieldLabel({ field, error }) {
  return (
    <div className="mb-1.5">
      <span className="admin-label-text">
        {field.label}
        {field.required ? ' *' : ''}
      </span>
      {error && <span className="admin-error ml-2">{error}</span>}
    </div>
  )
}

function Help({ text }) {
  return text ? <p className="admin-help">{text}</p> : null
}

export default function Field({ field, value, onChange }) {
  if (field.type === 'object') {
    return (
      <div className="soft-card p-4 space-y-4">
        <p className="admin-label-text">{field.label}</p>
        <Fields fields={field.fields} value={value || {}} onChange={onChange} />
      </div>
    )
  }
  if (field.type === 'objectList') {
    return <ObjectList field={field} value={value} onChange={onChange} />
  }
  if (field.type === 'stringList') {
    return <StringList field={field} value={value} onChange={onChange} />
  }
  if (field.type === 'i18nList') {
    return <I18nList field={field} value={value} onChange={onChange} />
  }
  if (field.type === 'toggle') {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />
        {field.label}
      </label>
    )
  }
  if (field.type === 'i18nText' || field.type === 'i18nTextarea') {
    return <I18nInput field={field} value={value} onChange={onChange} />
  }
  return <TextInput field={field} value={value} onChange={onChange} />
}

export function Fields({ fields, value, onChange }) {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <Field
          key={field.key}
          field={field}
          value={value?.[field.key]}
          onChange={(next) => onChange({ ...(value || {}), [field.key]: next })}
        />
      ))}
    </div>
  )
}

function TextInput({ field, value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const error = validateValue(field, value)
  const multiline = field.type === 'textarea'
  const Input = multiline ? 'textarea' : 'input'

  async function handleFile(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const result = await adminApi.upload('site', file)
      onChange(result.path)
    } catch (err) {
      window.alert(err.message)
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div>
      <FieldLabel field={field} error={error} />
      <div className="flex gap-2">
        <Input
          className="admin-input"
          rows={multiline ? 3 : undefined}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
        />
        {(field.upload || field.type === 'imagePath') && (
          <label className="admin-btn cursor-pointer whitespace-nowrap">
            {uploading ? '上传中…' : '上传'}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
        )}
      </div>
      <Help text={field.help} />
    </div>
  )
}

function I18nInput({ field, value, onChange }) {
  const safe = value && typeof value === 'object' && !Array.isArray(value) ? value : { en: '', zh: '' }
  const error = validateValue(field, safe)
  const multiline = field.type === 'i18nTextarea'
  const Input = multiline ? 'textarea' : 'input'

  return (
    <div>
      <FieldLabel field={field} error={error} />
      <div className="grid sm:grid-cols-2 gap-3">
        {['en', 'zh'].map((lang) => (
          <label key={lang} className="block">
            <span className="admin-sub">{lang.toUpperCase()}</span>
            <Input
              className="admin-input"
              rows={multiline ? 3 : undefined}
              value={safe[lang] || ''}
              onChange={(event) => onChange({ ...safe, [lang]: event.target.value })}
            />
          </label>
        ))}
      </div>
      <Help text={field.help} />
    </div>
  )
}

function StringList({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : []
  return (
    <div>
      <FieldLabel field={field} error={validateValue(field, items)} />
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              className="admin-input"
              value={item}
              onChange={(event) => onChange(items.map((v, i) => (i === index ? event.target.value : v)))}
            />
            <button type="button" className="admin-btn" onClick={() => onChange(items.filter((_, i) => i !== index))}>
              删除
            </button>
          </div>
        ))}
        <button type="button" className="admin-btn" onClick={() => onChange([...items, ''])}>
          添加一项
        </button>
      </div>
      <Help text={field.help} />
    </div>
  )
}

function I18nList({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : []
  return (
    <div>
      <FieldLabel field={field} />
      <div className="space-y-2">
        {items.map((item, index) => {
          const safe = item && typeof item === 'object' ? item : { en: '', zh: '' }
          return (
            <div key={index} className="flex gap-2 items-start">
              {['en', 'zh'].map((lang) => (
                <input
                  key={lang}
                  className="admin-input"
                  placeholder={lang.toUpperCase()}
                  value={safe[lang] || ''}
                  onChange={(event) =>
                    onChange(items.map((v, i) => (i === index ? { ...safe, [lang]: event.target.value } : v)))
                  }
                />
              ))}
              <button type="button" className="admin-btn" onClick={() => onChange(items.filter((_, i) => i !== index))}>
                删除
              </button>
            </div>
          )
        })}
        <button type="button" className="admin-btn" onClick={() => onChange([...items, { en: '', zh: '' }])}>
          添加一项
        </button>
      </div>
      <Help text={field.help} />
    </div>
  )
}

function ObjectList({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : []
  const move = (index, delta) => {
    const target = index + delta
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }
  return (
    <div>
      <FieldLabel field={field} />
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="soft-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="admin-sub">#{index + 1}</span>
              <div className="flex gap-2">
                <button type="button" className="admin-btn" onClick={() => move(index, -1)}>↑</button>
                <button type="button" className="admin-btn" onClick={() => move(index, 1)}>↓</button>
                <button type="button" className="admin-btn admin-btn-danger" onClick={() => onChange(items.filter((_, i) => i !== index))}>
                  删除
                </button>
              </div>
            </div>
            <Fields
              fields={field.fields || []}
              value={item || {}}
              onChange={(next) => onChange(items.map((v, i) => (i === index ? next : v)))}
            />
          </div>
        ))}
        <button type="button" className="admin-btn" onClick={() => onChange([...items, {}])}>
          添加一项
        </button>
      </div>
      <Help text={field.help} />
    </div>
  )
}
```

- [ ] **Step 10: 创建区块表单**

创建 `src/admin/sections/ConfigSection.jsx`：

```jsx
import Field from '../components/Field'

export default function ConfigSection({ section, value, onChange }) {
  if (section.list) {
    return (
      <div className="space-y-4">
        <Field
          field={{ ...section.list, key: 'items' }}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {section.description && <p className="text-sm text-muted">{section.description}</p>}
      {section.fields.map((field) => (
        <Field
          key={field.key}
          field={field}
          value={value?.[field.key]}
          onChange={(next) => onChange({ ...(value || {}), [field.key]: next })}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 11: 接入 AdminApp**

在 `src/admin/AdminApp.jsx` 中：

1. 新增导入：

```jsx
import { contentSchema } from './schema'
import ConfigSection from './sections/ConfigSection'
import { getIn, setIn } from './lib/objectPath'
import { validateDoc } from './lib/validate'
```

2. 把本地 `NAV` 常量替换为 `contentSchema` 加“文章管理”：

```jsx
const NAV = [...contentSchema.map(({ id, label }) => ({ id, label })), { id: 'posts', label: '文章管理' }]
```

4. `save` 开始时加入校验：

```jsx
const errors = validateDoc(contentSchema, docs)
if (errors.length) {
  setStatus({ kind: 'error', text: errors[0] })
  return
}
```

5. 中间区域渲染改为：

```jsx
{activeId === 'posts' ? (
  <p className="text-sm text-muted">文章管理将在后续任务接入。</p>
) : (
  (() => {
    const section = contentSchema.find((item) => item.id === activeId)
    if (!section) return null
    return (
      <ConfigSection
        section={section}
        value={getIn(docs[section.doc], section.path)}
        onChange={(next) =>
          setDocs((prev) => ({
            ...prev,
            [section.doc]: setIn(prev[section.doc], section.path, next),
          }))
        }
      />
    )
  })()
)}
```

6. 把原来渲染 JSON 的 `<pre>` 整段删除。
7. 删除 `const doc = activeId === 'blog' || activeId === 'posts' ? docs.blog : docs.site` 这一行（不再使用）。

- [ ] **Step 12: 手动验证配置编辑**

Run: `pnpm dev`

浏览器打开 `/admin`：
- 每个区块都渲染表单，并预填 `src/content/site.yaml` / `blog.yaml` 的当前值；
- 修改“站点信息 → 站点标题”，顶栏出现“未保存”，Ctrl+S 保存后提示“已保存”，`src/content/site.yaml` 对应值变化，右侧预览刷新；
- 保存后 `src/content/site.yaml` 中 `personal.heroRight` 仍存在；
- 技能、项目、导航列表可增删与上下移动；
- 图片字段“上传”可选择图片并回填路径。

验证 heroRight：

```bash
grep -n "heroRight" src/content/site.yaml
```
Expected：存在。

- [ ] **Step 13: 提交**

```bash
git add src/admin tests/unit/objectPath.test.js tests/unit/admin-validate.test.js
git commit -m "feat: schema 驱动的后台配置表单"
```

---

### Task 11: 文章管理界面

**Files:**
- Create: `src/admin/sections/PostsSection.jsx`
- Create: `src/admin/sections/PostEditor.jsx`
- Modify: `src/admin/AdminApp.jsx`

**Interfaces:**
- Consumes: `adminApi.listPosts/getPost/savePost/deletePost/upload/getConfig`（Task 9）；`buildPostFilename`、`parsePostFilename`、`isValidPostDate`、`isValidPostSlug`（Task 5）；`<Field>`（Task 10）。
- Produces: `<PostsSection />`，在 `activeId === 'posts'` 时由 `AdminApp` 渲染。

- [ ] **Step 1: 创建文章列表**

创建 `src/admin/sections/PostsSection.jsx`：

```jsx
import { useEffect, useMemo, useState } from 'react'
import { adminApi } from '../api'
import PostEditor from './PostEditor'

function displayTitle(title) {
  if (typeof title === 'string') return title
  return title?.zh || title?.en || '（无标题）'
}

export default function PostsSection() {
  const [posts, setPosts] = useState([])
  const [lang, setLang] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    adminApi
      .listPosts()
      .then((data) => {
        if (cancelled) return
        setPosts(data)
        setError('')
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [reloadToken])

  const visible = useMemo(
    () => posts.filter((post) => lang === 'all' || post.lang === lang),
    [posts, lang]
  )

  async function handleDelete(post) {
    if (!window.confirm(`删除《${displayTitle(post.title)}》？此操作不会删除配图目录。`)) return
    try {
      await adminApi.deletePost(post.lang, post.filename)
      setReloadToken((value) => value + 1)
    } catch (err) {
      setError(err.message)
    }
  }

  if (editing) {
    return (
      <PostEditor
        state={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null)
          setReloadToken((value) => value + 1)
        }}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          {['all', 'zh', 'en'].map((value) => (
            <button
              key={value}
              className={`admin-tab ${lang === value ? 'is-active' : ''}`}
              onClick={() => setLang(value)}
            >
              {value === 'all' ? '全部' : value.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => setEditing({ isNew: true, lang: 'zh', filename: '' })}
        >
          新建文章
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted">加载中…</p>
      ) : (
        <div>
          {visible.map((post) => (
            <div
              key={`${post.lang}:${post.filename}`}
              className="flex items-center gap-3 py-3 border-b"
              style={{ borderColor: 'var(--line)' }}
            >
              <span className="admin-badge">{post.lang}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink">{displayTitle(post.title)}</p>
                <p className="font-mono-ui text-[11px] text-muted">
                  {post.date} · {post.category}{post.featured ? ' · 精选' : ''}
                </p>
              </div>
              <button
                className="admin-btn"
                onClick={() => setEditing({ isNew: false, lang: post.lang, filename: post.filename })}
              >
                编辑
              </button>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(post)}>
                删除
              </button>
            </div>
          ))}
          {visible.length === 0 && <p className="text-sm text-muted py-6">暂无文章</p>}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 创建文章编辑器**

创建 `src/admin/sections/PostEditor.jsx`：

```jsx
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { adminApi } from '../api'
import {
  buildPostFilename,
  parsePostFilename,
  isValidPostDate,
  isValidPostSlug,
} from '../../utils/postFilename'
import Field from '../components/Field'

const EMPTY = {
  title: { en: '', zh: '' },
  excerpt: { en: '', zh: '' },
  readTime: '',
  author: 'STYLAN',
  category: '',
  tags: [],
  featured: false,
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function BiTextField({ label, value, onChange, multiline = false, help = '' }) {
  const isBi = value && typeof value === 'object' && !Array.isArray(value)
  const Input = multiline ? 'textarea' : 'input'
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="admin-label-text">{label}</span>
        <button
          type="button"
          className="admin-link"
          onClick={() =>
            onChange(isBi ? value.zh || value.en || '' : { en: value || '', zh: value || '' })
          }
        >
          {isBi ? '改为单语' : '改为双语'}
        </button>
      </div>
      {isBi ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {['en', 'zh'].map((lang) => (
            <label key={lang} className="block">
              <span className="admin-sub">{lang.toUpperCase()}</span>
              <Input
                className="admin-input"
                rows={multiline ? 3 : undefined}
                value={value?.[lang] || ''}
                onChange={(event) => onChange({ ...value, [lang]: event.target.value })}
              />
            </label>
          ))}
        </div>
      ) : (
        <Input
          className="admin-input"
          rows={multiline ? 3 : undefined}
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {help && <p className="admin-help">{help}</p>}
    </div>
  )
}

function titleIsValid(title) {
  return typeof title === 'string'
    ? title.trim().length > 0
    : Boolean(title && String(title.en || '').trim() && String(title.zh || '').trim())
}

export default function PostEditor({ state, onClose, onSaved }) {
  const isNew = Boolean(state.isNew)
  const [lang, setLang] = useState(state.lang || 'zh')
  const [date, setDate] = useState(today())
  const [slug, setSlug] = useState('')
  const [frontmatter, setFrontmatter] = useState({ ...EMPTY, date: today() })
  const [body, setBody] = useState('')
  const [revision, setRevision] = useState(null)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    adminApi
      .getConfig()
      .then((config) => {
        if (cancelled) return
        setCategories((config.blog?.categories || []).filter((item) => item.id !== 'all'))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (isNew) return undefined
    let cancelled = false
    adminApi
      .getPost(state.lang, state.filename)
      .then((post) => {
        if (cancelled) return
        const meta = parsePostFilename(state.filename)
        setFrontmatter({ ...EMPTY, ...post.frontmatter, date: post.frontmatter.date || meta.date })
        setDate(String(post.frontmatter.date || meta.date || today()))
        setSlug(meta.slug)
        setBody(post.body)
        setRevision(post.revision)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [isNew, state.lang, state.filename])

  const filename = isNew ? buildPostFilename({ date, slug, lang }) : state.filename

  async function handleSave() {
    setError('')
    if (isNew) {
      if (!isValidPostDate(date)) return setError('日期需为 YYYY-MM-DD')
      if (!isValidPostSlug(slug)) return setError('slug 只能包含小写字母、数字和连字符')
    }
    if (!titleIsValid(frontmatter.title)) return setError('标题不能为空')
    setSaving(true)
    try {
      const payload = {
        frontmatter: { ...frontmatter, date },
        body,
        revision,
      }
      const result = await adminApi.savePost(lang, filename, payload)
      setRevision(result.revision)
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const result = await adminApi.upload('post', file, filename)
      setBody((prev) => `${prev}${prev && !prev.endsWith('\n') ? '\n' : ''}\n![${file.name}](${result.path})\n`)
    } catch (err) {
      setError(err.message)
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <button className="admin-btn" onClick={onClose}>← 返回列表</button>
        <div className="flex items-center gap-3">
          {error && <span className="admin-error">{error}</span>}
          <button className="admin-btn admin-btn-primary" disabled={saving} onClick={handleSave}>
            {saving ? '保存中…' : '保存文章'}
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="admin-label-text">语言</span>
          <select className="admin-input" value={lang} disabled={!isNew} onChange={(event) => setLang(event.target.value)}>
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        </label>
        <label className="block">
          <span className="admin-label-text">日期</span>
          <input className="admin-input" placeholder="2026-10-28" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        {isNew && (
          <label className="block">
            <span className="admin-label-text">slug</span>
            <input className="admin-input" placeholder="my-new-post" value={slug} onChange={(event) => setSlug(event.target.value)} />
          </label>
        )}
        <label className="block">
          <span className="admin-label-text">分类</span>
          <select
            className="admin-input"
            value={frontmatter.category || ''}
            onChange={(event) => setFrontmatter({ ...frontmatter, category: event.target.value })}
          >
            <option value="">请选择</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>{item.label?.zh || item.id}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="font-mono-ui text-[11px] text-muted">文件名：{filename}</p>

      <BiTextField
        label="标题"
        value={frontmatter.title}
        onChange={(next) => setFrontmatter({ ...frontmatter, title: next })}
      />
      <BiTextField
        label="摘要"
        multiline
        value={frontmatter.excerpt}
        onChange={(next) => setFrontmatter({ ...frontmatter, excerpt: next })}
      />
      <BiTextField
        label="阅读时长"
        value={frontmatter.readTime}
        help="例如 8 min read / 8 分钟阅读"
        onChange={(next) => setFrontmatter({ ...frontmatter, readTime: next })}
      />
      <BiTextField
        label="作者"
        value={frontmatter.author}
        onChange={(next) => setFrontmatter({ ...frontmatter, author: next })}
      />

      <Field
        field={{ key: 'tags', label: '标签', type: 'stringList' }}
        value={frontmatter.tags}
        onChange={(next) => setFrontmatter({ ...frontmatter, tags: next })}
      />
      <Field
        field={{ key: 'featured', label: '精选', type: 'toggle' }}
        value={Boolean(frontmatter.featured)}
        onChange={(next) => setFrontmatter({ ...frontmatter, featured: next })}
      />

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="admin-label-text">正文（Markdown）</span>
          <label className="admin-btn cursor-pointer">
            上传配图
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
        <textarea
          className="admin-input font-mono-ui text-[12px] leading-[1.7]"
          rows={16}
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
      </div>

      <div className="soft-card p-5">
        <p className="admin-label-text mb-3">预览</p>
        <div className="prose-admin">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {body || '（暂无正文）'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 接入 AdminApp**

在 `src/admin/AdminApp.jsx` 顶部加入：

```jsx
import PostsSection from './sections/PostsSection'
```

把中间区域的：

```jsx
{activeId === 'posts' ? (
  <p className="text-sm text-muted">文章管理将在后续任务接入。</p>
) : (
```

替换为：

```jsx
{activeId === 'posts' ? (
  <PostsSection />
) : (
```

- [ ] **Step 4: 手动验证文章流程**

Run: `pnpm dev`，打开 `/admin` → 文章管理：

1. 中英文各新建一篇：日期 `2026-10-28`，slug `admin-smoke-zh` / `admin-smoke-en`，标题双语，分类任选，保存；
2. 列表出现两篇，站点 `/blog` 可见；
3. 编辑其中一篇正文，保存后 `/blog/<slug>` 显示新内容；
4. 删除两篇，列表消失，文件从 `src/posts/` 与 `src/posts/en/` 移除；
5. 上传一张配图，正文出现 `![...](...)`，预览可显示。

清理 smoke 文件：

```bash
git status --short src/posts
```
Expected：无遗留改动（若步骤 3 修改了已有文章，用 `git checkout -- src/posts` 还原）。

- [ ] **Step 5: 提交**

```bash
git add src/admin
git commit -m "feat: 后台文章管理界面"
```

---

### Task 12: README 更新与最终验收

**Files:**
- Modify: `README.md`
- Modify: `DESIGN.md`

**Interfaces:**
- Consumes: 前 11 个任务的全部产出。
- Produces: 文档与验收记录。

- [ ] **Step 1: 更新目录树与配置章节**

修改 `README.md`：

1. 目录树中：

```text
│   ├── config.js                 # 主站内容配置（改这里自定义站点）
│   ├── blogConfig.js             # 博客页面与分类配置
```

替换为：

```text
│   ├── content/
│   │   ├── site.yaml             # 全站内容配置
│   │   └── blog.yaml             # 博客页面与分类配置
│   ├── admin/                    # 本地内容后台（仅 dev，不参与构建）
```

2. 把 `### 主站配置 src/config.js` 与 `### 博客配置 src/blogConfig.js` 两节改为：

````markdown
### 内容配置 `src/content/site.yaml`

可改内容：站点信息、个人信息、导航、关于、技能、项目、联系、社交链接、页脚。

多语言字段写成 `{ en: "...", zh: "..." }`；不参与切换的写普通字符串。字段说明见 `src/admin/schema.js`。

### 博客配置 `src/content/blog.yaml`

分类 id 必须与文章 frontmatter 的 `category` 完全一致（小写）：
````

3. 在“配置说明”章节末尾追加：

````markdown
### 本地内容后台

```bash
pnpm dev
```

打开 http://localhost:5173/admin ，可按区块编辑配置、管理文章、上传图片，右侧实时预览。

- 后台只在 `vite dev` 存在，`pnpm build` 的产物不包含 `admin.html` 与 `src/admin/**`；
- 保存会直接改写 `src/content/*.yaml` 与 `src/posts/**/*.md`，用 git 查看和回滚改动；
- 接口只监听本机回环地址。
````

4. 把 README 第 144 行注释 `# 必须是 blogConfig 里的 id` 改为 `# 必须是 blog.yaml categories 里的 id`。
5. 同步 `DESIGN.md` 中的旧路径：`config.js` → `content/site.yaml`，`blogConfig.js` → `content/blog.yaml`，`blogConfig.categories` → `blog.yaml` 的 `categories`（涉及第 187、294、295、319、321、334、351 行附近）。

- [ ] **Step 2: 构建隔离验收**

```bash
pnpm build
test ! -e dist/admin.html && echo "OK: admin.html 未进入 dist"
grep -r "__admin" dist && echo "FAIL: dist 含 __admin" || echo "OK: dist 无 __admin"
ls dist/assets | grep -i admin && echo "FAIL: 存在 admin chunk" || echo "OK: 无 admin chunk"
grep -r "YAMLParseError" dist/assets && echo "FAIL: yaml 解析器进入 bundle" || echo "OK: 客户端无 yaml 解析器"
```
Expected：四行均为 OK。

- [ ] **Step 3: 跑自动化测试**

Run: `pnpm test`
Expected：全部通过。

- [ ] **Step 4: 逐项走验收清单**

按规格第 11 节：

**A. 内容层**
- [ ] 仓库无 `src/config.js`、`src/blogConfig.js`
- [ ] 18 处 import 指向 `src/content/*.yaml`
- [ ] 首页、技能、项目、博客、联系视觉与迁移前一致
- [ ] `pnpm build`、`pnpm rss` 成功

**B. 后台功能**
- [ ] `/admin` 各区块预填当前内容
- [ ] 修改并保存后 YAML 变化、预览刷新
- [ ] `personal.heroRight` 保存后仍在
- [ ] 中英文文章新建、编辑、删除成功
- [ ] 站点图片与文章配图上传落在正确目录
- [ ] 缺必填、非法 URL、超大文件、非法扩展名被拒绝
- [ ] 外部修改 YAML 后保存返回 409

**C. 隔离与安全**
- [ ] `dist/` 无 `admin.html`、无 `__admin`
- [ ] `vite preview` 访问 `/admin` 落到 404
- [ ] 非回环地址请求 API 返回 403
- [ ] 缺少 `X-Admin-Request`、跨源 Origin 返回 403
- [ ] 含 `../` 的文件名被拒绝

**D. 测试**
- [ ] `pnpm test` 通过

**E. 文档**
- [ ] README 配置章节为 YAML 说明，并含本地后台章节

- [ ] **Step 5: 提交**

```bash
git add README.md DESIGN.md
git commit -m "docs: 更新 YAML 配置与本地后台说明"
```

---

## 自检结果

- **Spec 覆盖**：YAML 迁移（Task 1–3）、安全边界（Task 4、6）、后台入口与隔离（Task 6、9）、配置表单与预览（Task 10）、文章管理（Task 7、11）、图片上传（Task 8）、错误与 revision（Task 6、7）、测试（Task 1、2、4、5、7、10）、验收与文档（Task 12）。组件内硬编码文案按规格明确不在范围内。
- **占位符**：无 TBD/TODO；“文章管理将在后续任务接入”文本在 Task 11 被替换。
- **类型一致性**：`adminApi` 方法名在 Task 9 定义，Task 10、11 使用一致；`parsePostFilename` / `buildPostFilename` / `postImageDirName` 在 Task 5 定义，Task 7、8、11 使用一致；`getIn` / `setIn` 在 Task 10 定义并使用。
- **与规格的偏差**：规格第 11 节把 `pnpm lint` 列为验收项，但仓库未安装 ESLint、也没有配置文件，该命令在改动前后都不可用；本计划改用 `pnpm build`、`pnpm test` 与隔离检查作为门槛，建议同步修订规格该行。
