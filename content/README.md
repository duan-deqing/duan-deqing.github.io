# content 目录内容说明

本目录是站点的唯一内容源：前台页面直接读取这些文件，本机后台（`/admin`，仅 dev）负责编辑其中一部分。

## 1. YAML 会被规范化重写

后台保存 YAML 时，会把整份文件重新序列化（`yaml` 库的 `stringify`）后写回，因此：

- 手写注释、空行、键顺序、引号风格都可能变化；
- 注释会**永久丢失**，后台保存过一次就无法恢复；
- 后台只改写发生变化的文件，未改动的文件保持原样。

Markdown 文件（`content/home/`、`content/changelog/`、`content/projects/{zh,en}/`、`content/blog/posts/`）由后台**原样写入**，不会重新格式化，frontmatter 与正文都按输入内容保存。

## 2. 字段托管与保留

| 文件 | 后台托管（会被改写） | 保留未知字段 |
| --- | --- | --- |
| `site.yaml` | `site`、`personal`、`navLinks`、`contacts`、`footer` | 否 |
| `stack/stack.yaml` | `categories` | 是（`preserveUnknown`） |
| `projects/projects.yaml` | `categories`、`projects` | 是（`preserveUnknown`） |
| `blog/blog.yaml` | `page`、`categories` | 否 |
| `bookmarks/bookmarks.yaml` | `page`、`categories` | 否 |

- “保留未知字段”指后台保存时会把文件里不属于托管字段的顶层键原样写回（例如 `stack.yaml` / `projects.yaml` 里的 `page`、`buttons`）。
- 其余文件保存时只写托管字段，**未托管的自定义顶层键会被丢弃**，请不要在这些文件里添加后台不认识的键。
- 字段的唯一定义在 `src/admin/schema.js` 与 `src/admin/schema/documents.js`，界面与保存链路都从这里派生。

## 3. 想保留注释怎么办

1. 优先用后台编辑，注释交给后台维护（后台保存后重写为无注释的规范格式）。
2. 需要保留手写注释时，**不要通过后台保存该文件**；直接在编辑器里改文件，后台只读展示不会写盘。
3. 如需长期保留说明，把说明写在本文档或代码 schema 里，而不是写在会被后台保存的 YAML 中。
4. 提交前用 `git diff` 确认：若只想改注释却出现了大面积格式变化，说明该文件刚被后台保存过。

## 4. 后台入口与文件/字段对应

| 后台页面 | 文件 | 字段 / 范围 |
| --- | --- | --- |
| 个人信息 `#/profile` | `site.yaml` | `personal`（名字、头像、角色） |
| 个人信息 `#/profile` → 联系方式 | `site.yaml` | `contacts[]` |
| 个人信息 `#/profile` → 首页文案 | `home/index.{zh,en}.md`、`home/home.{zh,en}.md` | Markdown 正文（无 frontmatter） |
| 项目 `#/projects` → 项目分类 | `projects/projects.yaml` | `categories[]` |
| 项目 `#/projects` → 项目列表 | `projects/projects.yaml` | `projects[]` |
| 项目 `#/projects` → 详情正文 | `projects/{zh,en}/<slug>.md` | Markdown 正文（无 frontmatter） |
| 博客 `#/blog` → 博客设置 | `blog/blog.yaml` | `page`、`categories[]` |
| 博客 `#/blog` → 文章 | `blog/posts/{zh,en}/…md` | 文章 frontmatter 与正文 |
| 技术栈 `#/stack` | `stack/stack.yaml` | `categories[]` |
| 书签 `#/bookmarks` → 书签页设置 | `bookmarks/bookmarks.yaml` | `page`（标题、副标题） |
| 书签 `#/bookmarks` → 分类与书签 | `bookmarks/bookmarks.yaml` | `categories[]`（`slug`、`title`、`description`、`icon`、`bookmarks[]`） |
| 更新日志 `#/changelog` | `changelog/*.md` | 按版本分组，中英文分别编辑 |
| 设置 `#/settings` | `site.yaml` | `site`、`footer`；`navLinks` 只读 |

## 5. 保存冲突

后台保存 YAML 与 Markdown 前都会校验文件内容哈希（revision）。若磁盘文件在后台打开后被其他方式修改，保存会返回冲突，界面提供“覆盖 / 加载磁盘版本 / 取消”三种处理，不会静默覆盖。

## 6. 文件命名约定

- 文章：`blog/posts/{zh,en}/yyyy-mm-dd-slug[-en].md`，配图放 `blog/posts/img/<slug>/`。
- 更新日志：`changelog/vX.Y.Z-YYYY-MM-DD.{zh,en}.md`，frontmatter 使用 `version`、`date`、`latest`、`pages`。
- 项目详情：`projects/{zh,en}/<slug>.md`，slug 需与 `projects.yaml` 中项目的 `slug` 一致。
