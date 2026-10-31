# 项目详情页 · 设计（2026-11-01）

## 意图

`/projects` 的项目条目目前整卡外链到 `link` / `repo`。本次让“有详情的项目”先进入站内 `/projects/<slug>` 详情页，正文用 Markdown 编写，并完全复用博客的 `BlogMarkdown` 渲染链路；页面视觉沿用现有 onur 式子页与文章排版。首份详情内容为 **Orbit Desk**，中英文成对提供；其余项目在补 Markdown 前继续保持外链。

## 目标

- 新增 `/projects/:slug` 路由，仍挂在 `SubpageLayout` 下，保留侧栏、`dots` 背景与移动端壳。
- `projects.yaml` 增加可选 `slug`；只有存在对应 Markdown 的项目，卡片才走站内详情，否则维持原外链，避免空页与 404。
- 详情页头部显示项目图标、标题、描述、分类、标签，以及“访问项目 / 源码仓库”外链按钮；正文沿用 768px 文章宽度。
- Markdown 放在 `content/pages/projects/{zh,en}/<slug>.md`，配图放在 `content/pages/projects/img/<slug>/`；中英文缺一侧时回退到另一侧，并显示一条低调的语言提示。
- 正文渲染与博客完全一致：GFM、代码高亮、表格、GitHub Alerts、Mermaid、KaTeX、图集/视频、脚注等全部可用；宽屏复用文章 TOC，移动端保留 `> cd ..` 返回。
- 同步更新 `README.md`、`DESIGN.md`，让内容维护方式有据可查。

## 非目标

- 本次不为其余 5 个项目补详情内容（机制先就绪，后续逐个加）。
- 不把项目详情混入博客列表、搜索、RSS 或更新日志。
- 不新增后台 Markdown 编辑器；`/admin` 只补 `slug` 字段。
- 不改项目列表本身的视觉与分组。

## 反目标

- 不把长正文塞进 `projects.yaml`。
- 不另建一套 Markdown 渲染器或复制博客样式。
- 不让没有详情 Markdown 的项目出现空白详情页。

## 约束

- 遵循 `DESIGN.md` v4：中性色、Geist、768px 正文、文章级排版，不引入新强调色或新字体。
- `BlogMarkdown` 的数学/图表等重型依赖保持按需加载；详情页路由懒加载。
- GitHub Pages 的 `/projects/<slug>` 深链由现有 `404.html` SPA 重定向兜底。
- 当前工作区有大量未提交改动，本次只做增量修改，不整理、不回滚无关文件。

## 方案（已选 A）

- **A. 独立项目内容目录（选用）**：`content/pages/projects/{zh,en}/<slug>.md` + 独立详情加载器；YAML 只保留列表元数据。与 `posts` 结构同构，长文与配图好维护，渲染链路可直接复用。
- **B. 正文写进 `projects.yaml`**：文件更少，但长 Markdown 与双语正文在 YAML 中难维护，后台表单也会变重。
- **C. 复用博客文章**：把详情写成博客文章并链接 `/blog/<slug>`；实现快，但会污染博客列表、搜索与 RSS，语义也不对。

选择 A：边界最清晰，后续新增项目只需加一份 Markdown 和一个 `slug`。

## 实现决定

1. **数据**：`content/pages/projects.yaml` 为 Orbit Desk 增加 `slug: orbit-desk`；`slug` 可选，格式为小写字母/数字/连字符，且在列表中唯一。
2. **加载器**：新增 `src/utils/projectDetail.js`
   - 用 `import.meta.glob` 建立 `zh/en → slug → raw loader` 映射；
   - `hasProjectDetail(slug)` 同步判断是否存在详情；
   - `getProjectDetail(slug, lang)` 返回正文、实际语言与是否回退；优先当前语言，缺失时回退另一侧；
   - 去掉正文第一个一级标题（与博客一致），解析 `./img/<slug>/...` 等本地图片路径；
   - 不引入 frontmatter：标题、描述、标签等均来自 `projects.yaml`。
3. **卡片**：`ProjectCard` 在 `hasProjectDetail(project.slug)` 为真时传 `to`，否则维持外链；不改 `ProjectGrid` 的视觉。
4. **详情页**：新增懒加载的 `src/pages/ProjectDetailPage.jsx`
   - `PageTitle` 使用项目标题与描述，`type="article"`；
   - 顶部 `ParentLink to="/projects"`，随后是项目图标 + 标题 + 描述 + 分类/标签 + 两个 `QuietActionLink`（访问项目、源码仓库）；
   - 正文区 `article-content` + `BlogMarkdown`，宽屏复用 `article-layout has-toc` 与 `TableOfContents`；
   - 底部复用 `QuoteFooter`，与 `/projects` 收尾一致；
   - 无效 slug 显示“项目未找到”与返回链接。
5. **路由与背景**：`App.jsx` 增加 `/projects/:slug`；`backgrounds/index.js` 让 `/projects/` 前缀继续使用 `dots`。
6. **内容**：新增 `content/pages/projects/zh/orbit-desk.md` 与 `en/orbit-desk.md`，依据仓库 README 的真实信息写：项目概述、核心能力、架构图（Mermaid）、评测基线（表格）、快速开始（代码块）、技术栈、仓库链接。两版内容对应，不虚构指标。
7. **后台**：`src/admin/schema.js` 的项目字段增加可选 `slug` 文本项，便于后续维护。
8. **测试**：扩展现有 `tests/unit/projects.test.js`，校验 `slug` 格式/唯一性，以及每个带 `slug` 的项目都存在中英文 Markdown、正文非空。

## 留给实现者

- 头部图标沿用项目列表的遮罩渲染方式，尺寸与间距按 4px 网格自行落位。
- TOC 宽度不足时自动隐藏；详情页正文最大宽度与文章页一致。
- 语言回退提示使用 12px `--muted` 文案，不新增组件或颜色。

## 验收

- 点击 Orbit Desk 进入 `/projects/orbit-desk`，不再直接打开外链；其余项目仍打开原地址。
- 直接访问详情页深链可用；切换中英文时正文与头部同步更新，缺失语言时正确回退。
- 正文中的代码块、表格、Mermaid、徽章与链接按博客样式渲染。
- `pnpm test` 与 `pnpm build` 通过。
