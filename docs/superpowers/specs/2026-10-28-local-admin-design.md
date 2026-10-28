# 本地内容管理后台 · 设计规格

- 日期：2026-10-28
- 状态：待评审
- 分支：dev-redesign
- 目标仓库：STYLAN 个人主页（Vite 8 + React 19，部署到 GitHub Pages）

## 1. 背景与目标

站点内容目前分散在三处：

- `src/config.js`、`src/blogConfig.js`：结构化配置；
- 各组件内写死的中英文文案（约 67 处 `t({...})`）；
- `src/posts/**/*.md`：博客文章（YAML frontmatter + Markdown 正文）。

修改内容需要手工编辑源码，容易破坏结构。目标是提供一个**仅本地可用**的管理后台，通过表单快速编辑配置与文章，并即时预览，且**绝不进入部署产物**。

## 2. 范围

### 2.1 包含

- 把 `config.js` / `blogConfig.js` 的数据迁移为 YAML，并删除两个 JS 配置文件；
- 一个仅在 `vite dev` 可访问的后台页面，提供表单编辑 + iframe 实时预览；
- 编辑范围：站点信息、个人信息、导航、关于、技能、项目、联系、页脚、博客页设置；
- 文章管理：中英文文章的列表、新建、编辑、删除；
- 图片上传：站点图片进 `public/images/`，文章配图进 `src/posts/img/<文章目录>/`；
- 迁移脚本、单元测试、README 更新。

### 2.2 不包含

- 后台的部署、远程访问、多用户、登录鉴权；
- 组件内写死文案的抽取（属于后续独立改造）；
- 图片库管理（浏览、删除、重命名）；
- 文章文件名 / slug 修改；
- 版本历史与回滚（依赖 git）；
- 主题、字体、布局参数的编辑。

## 3. 已确认决策

| 决策点 | 结论 |
|---|---|
| 技术路线 | 方案 A：后台寄生在 Vite dev server，单进程、零额外服务 |
| 配置格式 | YAML，删除 `config.js` / `blogConfig.js`，引用改为直接导入 `.yaml` |
| 编辑体验 | 表单 + iframe 实时预览 |
| 图片 | 支持上传 |
| 内容范围 | 配置字段 + 博客文章 |
| 注释 | YAML 保存时不保留注释；字段说明由 `src/admin/schema.js` 与 README 承载 |

### 设计调整说明（相对前期讨论）

后台**不作为 SPA 内的 `/admin` 路由**，而是 dev-only 的独立 HTML 入口 `admin.html`，由 dev 中间件把 `/admin` 重写到它。原因有两点：

1. 站点入口 `App.jsx` 会导入 `site.yaml`，保存配置时 Vite HMR 会触发整页刷新；若后台与站点处于同一模块图，后台表单状态会被连带刷新。独立入口的模块图不包含站点配置，保存不会打断后台。
2. 构建隔离从“依赖 Rollup 消除死分支”变为**结构性保证**：`vite build` 的入口只有 `index.html`，`admin.html` 与 `src/admin/**` 从设计上就不会进入构建。

## 4. 总体架构

### 4.1 文件与职责

```
vite.config.js                    注册 yaml 插件与 admin 插件
scripts/vite-yaml-plugin.js       .yaml → ES 模块（dev/build 通用）
scripts/admin-plugin.js           dev-only：/admin 重写、/__admin/api/*、文件读写
scripts/lib/admin-validation.js   纯函数：文件名、路径、上传、Origin/回环校验
scripts/migrate-config-to-yaml.js 一次性迁移脚本（验证通过后删除）
admin.html                        dev-only 后台入口
src/admin/main.jsx                挂载 AdminApp
src/admin/AdminApp.jsx            三栏布局、导航、保存、提示
src/admin/schema.js               字段声明（类型、label、help、校验）
src/admin/api.js                  /__admin/api 客户端封装
src/admin/components/             表单渲染器、列表编辑器、图片字段、提示条
src/admin/sections/               各配置区块 + 文章管理
src/admin/admin.css               引入 ../index.css 复用 token，并追加后台专属样式
src/content/site.yaml             全站内容
src/content/blog.yaml             博客页配置
src/utils/postFilename.js         文件名解析/生成（站点与后台共用）
src/utils/markdown.js             改为复用 postFilename
src/config.js                     删除
src/blogConfig.js                 删除
src/App.jsx 等 17 个文件           18 处 import 改为导入 src/content/*.yaml
README.md                         更新配置与后台使用说明
```

### 4.2 运行方式

- 开发：`pnpm dev`，站点在 `/`，后台在 `/admin`（内部重写到 `/admin.html`）；API 在 `/__admin/api/*`。
- 构建：`pnpm build`，入口仅 `index.html`；`admin.html`、`src/admin/**`、`scripts/admin-plugin.js` 均不参与构建。
- 生产：GitHub Pages 只包含 `dist/`，任何 `/admin` 请求落到 `public/404.html`。

### 4.3 数据流

```
后台表单 (React state)
  → PUT /__admin/api/config
  → admin-plugin 校验 + 写 site.yaml / blog.yaml（tmp → rename）
  → Vite 检测到 YAML 变化，站点模块更新
  → 后台显式 reload 预览 iframe
```

## 5. 内容层：YAML 迁移

### 5.1 YAML 导入插件

`scripts/vite-yaml-plugin.js`：

- 对 `.yaml` / `.yml` 执行 `transform`：读取源码，`yaml.parse`，返回 `export default <JSON>`；
- 解析失败时把 `yaml` 的 `linePos` 信息拼进错误消息，便于定位；
- dev 与 build 都启用；解析发生在构建期，`yaml` 解析器**不进入客户端 bundle**；
- `yaml` 包加入 `devDependencies`（构建期依赖）。

### 5.2 迁移脚本

`scripts/migrate-config-to-yaml.js`（Node，一次性）：

1. 导入仍在的 `src/config.js`、`src/blogConfig.js`；
2. 校验顶层键与预期白名单完全一致，缺键、多键都直接报错退出；
3. 用 `yaml.stringify(obj, { lineWidth: 0 })` 写入 `src/content/site.yaml`、`src/content/blog.yaml`，文件头统一写入：
   `# 此文件由本地管理后台维护；字段说明见 src/admin/schema.js 与 README。`
4. 回读两个 YAML，用结构相等比较与源对象比对，不一致则非零退出；
5. 目标文件已存在时拒绝执行，仅 `--force` 覆盖；
6. 不自动删除源文件。删除 `config.js` / `blogConfig.js` 在校验通过后单独执行，并保留在 git 历史中。

验证通过后删除迁移脚本本身，不在仓库留下无法再次运行的死代码。

### 5.3 引用更新

17 个文件、18 处 import 改为直接导入（`src/pages/BlogPage.jsx` 同时引用两个配置）：

```js
import config from './content/site.yaml'        // src/App.jsx
import blogConfig from '../content/blog.yaml'   // src/pages/BlogPage.jsx
```

组件内部逻辑不改变。

### 5.4 写回规则

- 配置：`yaml.stringify(doc, { lineWidth: 0 })`，避免中文长句折行；文件头同上。
- 文章：frontmatter 用 `yaml.stringify(..., { lineWidth: 0 })` 序列化，包在 `---` 之间，正文原样拼接，文件以换行结尾。
- 读取沿用现有 `front-matter` 解析，不引入第二套读取逻辑。

## 6. 管理后台

### 6.1 入口与隔离

- `admin.html` 只包含一个 `#admin-root` 与 `/src/admin/main.jsx`；
- `admin-plugin` 在 `configureServer` 中把 `GET /admin` 重写为 `/admin.html`，交给 Vite 的 HTML 处理管线（保留 HMR）；
- 后台 `main.jsx` 读取 `localStorage.theme` 设置 `.dark`，保持与站点主题一致，但不依赖站点 Context；
- 后台不导入 `App.jsx`，不导入站点配置 YAML。

### 6.2 布局

- 顶栏：标题、未保存标记、保存按钮（Ctrl/Cmd+S）、错误提示；
- 左栏：区块导航（含“文章管理”）；
- 中栏：当前区块表单；
- 右栏：预览 iframe，可选页面：首页 / 技能 / 项目 / 博客 / 联系，带刷新按钮。

### 6.3 schema 与字段类型

`schema.js` 用声明式结构描述区块，表单渲染器只实现一次：

```js
{
  id: 'site',
  label: '站点信息',
  doc: 'site',          // 对应 site.yaml
  path: 'site',         // 区块编辑的根路径
  fields: [
    { key: 'title', label: '站点标题', type: 'text', required: true },
    { key: 'description', label: '站点描述', type: 'i18nText' },
  ],
}
```

字段类型：

- `text` / `textarea`
- `i18nText` / `i18nTextarea`（并排 EN / ZH）
- `stringList`（增删、上下移）
- `objectList`（子字段复用同一套字段类型，增删、上下移）
- `imagePath`（文本 + 上传按钮）
- `url`（相对路径 `/` 开头或 `http(s)://`）
- `toggle`

区块与覆盖字段：

| 区块 | 字段 |
|---|---|
| 站点信息 | site.title, pageTitle, favicon, description, keywords, url, ogImage |
| 个人信息 | personal.name, avatar, titlePrefix, titleName, tags, tagDescription, bio |
| 导航 | navLinks, homeSections |
| 关于 | about.focus |
| 技能 | skills |
| 项目 | projects |
| 联系 | contact, contactPage, socialLinks |
| 页脚 | footer |
| 博客设置 | blog.page, blog.categories |
| 文章管理 | 见 6.5 |

`personal.heroRight` 为遗留字段，组件不渲染；后台不展示，但**保存时必须原样保留**。

### 6.4 保存与校验

- 进入区块时由 API 拉取整份配置；表单持有整份文档，提交时回传整份文档，未展示字段因此不会丢失；
- 保存范围是整份配置的两个 YAML 文件，一次写两个文件；
- 客户端校验：必填、URL 格式、图片路径格式；有错误时高亮字段并禁用保存；
- 服务端复验：顶层键白名单、字段类型、必填项，失败返回 400 且不写盘；
- 并发保护：配置的 `revision` 为 `{ site: number, blog: number }`（两个文件各自的 `mtimeMs`）；文章的 `revision` 为单个 `mtimeMs`，新建时为 `null`。PUT 携带该值，服务端与当前文件比对，不一致返回 409，提示刷新后再改；
- 写盘采用 `.tmp` + `rename`，失败不破坏原文件。

### 6.5 文章管理

- 列表：按语言（zh / en）筛选，显示日期、标题、分类、featured，按日期降序；
- 新建：填写日期、slug、语言；文件名规则 `${date}-${slug}.md`，英文额外加 `-en` 后缀并写入 `src/posts/en/`；slug 限 `[a-z0-9-]+`，创建前查重；
- 编辑：
  - 标题、摘要、阅读时长支持“双语对象 / 纯字符串”两种形态，逐字段切换模式，默认值取自现有数据类型；新建文章默认双语；
  - 分类从 `blog.yaml` 的 categories 中选择（不含 `all`）；
  - tags 为字符串列表；featured 为开关；author 为文本；date 为 `YYYY-MM-DD`；
  - 正文为 Markdown 文本域，支持插入上传图片；
- 文件名即身份：编辑不改文件名；frontmatter 的 `date` 为排序依据，可与文件名日期不同；
- 删除需二次确认；删除文章**不**删除其配图目录；
- 预览：内嵌 `react-markdown` 渲染，或切到 iframe 打开 `/blog/<slug>`。

### 6.6 图片上传

- 客户端读取文件为 ArrayBuffer，POST 到上传接口；
- `target=site` → `public/images/`，返回 `/images/<name>`；
- `target=post&post=<filename>` → `src/posts/img/<postImageDirName(filename)>/<name>`，返回可直接写进 Markdown 的相对文件名；
- `postImageDirName` 去掉 `-en` 后缀，与 `src/utils/markdown.js` 现有图片匹配规则一致；
- 允许扩展名：站点为 jpg/jpeg/png/webp/gif/svg/ico，文章为 jpg/jpeg/png/webp/gif/svg；单文件上限 5MB；
- 同名文件自动追加 `-1`、`-2` 后缀，不覆盖已有文件。

### 6.7 预览

- iframe 与后台同源，保存后用 `contentWindow.location.reload()` 刷新；
- Vite HMR 可能已自动刷新，显式 reload 作为兜底；
- iframe 加载失败时显示重试提示。

### 6.8 未保存提醒

- 表单值与最近一次拉取的服务端文档做深比较，得出 dirty 状态；
- 区块切换、页面关闭（`beforeunload`）时提示未保存。

## 7. 本地 API

### 7.1 端点

所有端点仅在 dev server 存在，前缀 `/__admin/api`。

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/config` | 返回 `{ site, blog, revision }` |
| PUT | `/config` | 接收 `{ site, blog, revision }`，写两个 YAML |
| GET | `/posts` | 返回文章列表（含 frontmatter、lang、filename、slug） |
| GET | `/posts/:lang/:filename` | 返回 `{ frontmatter, body, revision }` |
| PUT | `/posts/:lang/:filename` | 保存或新建，接收 `{ frontmatter, body, revision }` |
| DELETE | `/posts/:lang/:filename` | 删除文章 |
| POST | `/upload?target=site&name=…` | 站点图片，body 为原始二进制 |
| POST | `/upload?target=post&post=…&name=…` | 文章配图，body 为原始二进制 |

`lang` 取 `zh` | `en`。

### 7.2 请求与响应约定

- 请求与响应均为 JSON（上传的响应也是 JSON：`{ path }`）；
- 所有写请求必须带 `X-Admin-Request: 1`；
- 错误响应：`{ error: string, details?: string }`，状态码 400 / 403 / 404 / 409 / 413 / 500；
- 上传响应：`{ path }`。

### 7.3 序列化

- 配置读取：`yaml.parse`；
- 配置写入：`yaml.stringify(doc, { lineWidth: 0 })` + 文件头；
- 文章读取：`front-matter`；
- 文章写入：`yaml.stringify(frontmatter, { lineWidth: 0 })` + 正文，正文不做任何格式化；
- 所有文件按 UTF-8 读写。

## 8. 安全与隔离

后台只面向本机，防线按顺序执行：

1. **仅回环**：`req.socket.remoteAddress` 必须是 `127.0.0.1`、`::1` 或 `::ffff:127.0.0.1`，否则 403；
2. **同源**：带 `Origin` 时，必须等于当前请求的 scheme + host，否则 403；
3. **自定义头**：写请求必须带 `X-Admin-Request: 1`，否则 403，避免普通网页表单直接提交；
4. **路径白名单**：文件名只允许 `[a-zA-Z0-9._-]+`，文章文件名为 `YYYY-MM-DD-<slug>(-en)?.md`；所有目标路径由固定常量目录 + 校验后的文件名拼出，并用 `path.resolve` 校验前缀，杜绝路径穿越；
5. **体积限制**：请求体上限 5MB，超限 413；
6. **构建隔离**：`admin.html` 不在构建入口中，`admin-plugin` 仅 `apply: 'serve'`。

不引入登录态：任何本机进程都能调用 API，这是本地工具的已知边界。

## 9. 错误处理

- YAML 解析失败：400，附带行号列号；
- 写盘失败：500，原文件保持不变；
- revision 不匹配：409，UI 提示“文件已被外部修改，请刷新”；
- 上传被拒（类型/大小/文件名）：400，提示原因；
- UI 用顶部提示条展示错误，表单值保留，可直接重试；
- 配置加载失败时后台显示错误页与重试按钮，不渲染空表单。

## 10. 测试

仓库暂无测试设施。不引入整套框架，使用 Node 内置 `node:test`：

- 新增脚本：`"test": "node --test tests/"`；
- 待测纯函数：
  - `postFilename`：文件名解析/生成，中英文、非法 slug、路径穿越输入；
  - `admin-validation`：上传扩展名与大小、目标目录推导、回环与同源判定；
  - frontmatter 序列化 → `front-matter` 解析的结构等价（双语与纯字符串两种形态）；
  - YAML 写入 → 解析的结构等价。
- React 表单与 iframe 预览不做自动化测试，走第 11 节的手工清单。

## 11. 验收标准

### A. 内容层

- 仓库中不再存在 `src/config.js`、`src/blogConfig.js`，17 个文件的 18 处 import 全部指向 `src/content/*.yaml`；
- 迁移脚本回读校验通过，输出记录在提交说明中；
- 首页、技能、项目、博客、联系五个页面与迁移前视觉一致；
- `pnpm lint`、`pnpm build`、`pnpm rss` 均成功；
- `dist/assets/*.js` 中搜索不到 `YAMLParseError`（解析器未进入客户端 bundle）。

### B. 后台功能

- `pnpm dev` 后打开 `/admin`，各区块表单预填当前内容；
- 修改任一字段并保存，`src/content/*.yaml` 对应位置变化，预览 iframe 显示新内容；
- 保存后 `personal.heroRight` 等未展示字段仍在；
- 文章：中英文各新建一篇 → 列表出现 → 编辑正文 → 删除，全部成功；
- 上传站点图片与文章配图，文件落在正确目录，返回路径可直接使用；
- 缺必填、非法 URL、超大文件、非法扩展名均被拒绝，源文件不变；
- 外部修改 YAML 后再从后台保存，得到 409 提示。

### C. 隔离与安全

- `pnpm build` 后 `dist/` 中不存在 `admin.html`，不存在含 `__admin` 的文件；
- `vite preview` 访问 `/admin` 得到 404 页面；
- 非回环地址请求 API 返回 403；
- 缺少 `X-Admin-Request`、跨源 `Origin` 均返回 403；
- 含 `../` 的文件名被拒绝。

### D. 自动化测试

- `pnpm test` 全部通过，覆盖第 10 节列出的纯函数。

### E. 文档

- README 的配置章节改为 YAML 结构说明，并补充后台启动与使用方式、后台不部署的说明；
- `schema.js` 中的字段说明与 YAML 实际字段一一对应。

## 12. 里程碑

1. **内容层迁移**
   - 交付：YAML 插件、迁移脚本、内容 YAML、17 处引用、删除旧配置；
   - 完成条件：验收 A 全部通过。
2. **后台骨架**
   - 交付：admin 插件与安全守卫、`/config` 读写（含 revision）、`admin.html` 与三栏布局、schema 渲染器、站点信息与个人信息区块、预览；
   - 完成条件：后台可启动，两类区块可读可存，预览刷新正常。
3. **完整编辑能力**
   - 交付：其余配置区块、文章管理、图片上传、revision 冲突处理；
   - 完成条件：验收 B、C 通过。
4. **收尾**
   - 交付：`node:test` 单测、README 更新、全量验收、删除迁移脚本；
   - 完成条件：验收 D、E 通过，A–C 复跑通过。

## 13. 风险与备选

| 风险 | 应对 |
|---|---|
| Vite 开发服务器对 `admin.html` 的 HTML 管线行为与预期不符 | 降级为直接访问 `/admin.html`，去掉 `/admin` 重写；不影响其余设计 |
| Tailwind 自动扫描会把少量后台专用工具类写进生产 CSS | 接受；产物中不含任何后台 JS/HTML，验收只检查代码与入口 |
| 保存配置触发站点整页 HMR 刷新 | 预览本来就是 iframe，后台独立入口不受影响 |
| 现有文章 frontmatter 有双语和纯字符串两种形态 | 编辑器逐字段提供模式切换，读入时按实际类型初始化 |
| 后台直接改写源文件 | 依赖 git 兜底；写盘用 tmp + rename，revision 检测外部修改 |

## 14. 文档更新

- `README.md`：目录树中的配置文件改为 `src/content/*.yaml`，新增“本地内容后台”章节（启动、访问、范围、不部署说明）；
- `config.js` 文件头中的字段说明迁入 `src/admin/schema.js` 的 label/help；
- 迁移脚本执行与删除的顺序记录在提交说明中。
