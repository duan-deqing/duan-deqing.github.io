import { useCallback } from 'react'
import { useLanguage } from '../hooks/useLanguage'

/**
 * 后台界面文案字典：以中文原文为键，避免为每个字符串再造一套 id。
 * 内容数据（如博客分类名）不走这里，按当前语言直接从双语对象取值。
 */
const EN = {
  Dashboard: 'Dashboard',
  总览: 'Overview',
  提交记录: 'Commit history',
  项目: 'Projects',
  博客: 'Blog',
  技术栈: 'Tech stack',
  书签: 'Bookmarks',
  更新日志: 'Changelog',
  设置: 'Settings',
  个人信息: 'Profile',
  打开个人信息: 'Open profile',
  个人资料: 'Personal details',
  联系方式: 'Contact',
  首页文案: 'Home copy',
  首页: 'Home',
  子页首页: 'Home subpage',
  项目分类: 'Project categories',
  项目列表: 'Projects',
  项目详情: 'Project detail',
  项目详情正文: 'Project detail copy',
  博客设置: 'Blog settings',
  分类与书签: 'Categories & bookmarks',
  书签页设置: 'Bookmark page settings',
  站点信息: 'Site info',
  页脚: 'Footer',
  '导航（只读）': 'Navigation (read-only)',
  导航: 'Navigation',
  文章: 'Posts',
  分类: 'Category',
  '网站项目、博客、技术栈与最近提交记录的总览，修改请进入对应页面。':
    'An overview of projects, blog, tech stack and recent commits. Edit content on its own page.',
  '维护头像、名字、角色、联系方式与首页文案，对应前台侧栏展示。':
    'Avatar, name, role, contact and home copy — mirrored in the site sidebar.',
  '维护项目分类、项目条目与详情正文，新增或删除项目后保存生效。':
    'Manage project categories, entries and detail copy. Add or remove projects, then save.',
  '维护博客设置与文章内容，文章写入本地 Markdown 文件。':
    'Blog settings and posts. Posts are written to local Markdown files.',
  '维护技术栈分类与每个分类下的技术条目。':
    'Manage tech-stack categories and the items inside them.',
  '维护书签页文案、分类与每个分类下的书签。':
    'Manage bookmark page copy, categories and the bookmarks inside them.',
  '浏览版本记录并编辑对应语言的中英文 Markdown。':
    'Browse releases and edit the Chinese / English Markdown of each version.',
  '站点级信息与页脚；导航由 site.yaml 维护，这里只读展示。':
    'Site-wide info and footer. Navigation stays in site.yaml and is shown read-only here.',

  站点标题: 'Site title',
  浏览器标题: 'Browser title',
  Favicon: 'Favicon',
  站点描述: 'Site description',
  'SEO 关键词': 'SEO keywords',
  站点地址: 'Site URL',
  分享图: 'Share image',
  名字: 'Name',
  头像: 'Avatar',
  角色: 'Role',
  导航链接: 'Navigation links',
  链接: 'URL',
  图标: 'Icon',
  文字: 'Label',
  技能分类: 'Stack categories',
  id: 'id',
  分类名: 'Name',
  技术项: 'Items',
  名称: 'Name',
  介绍: 'Description',
  '分类 id': 'Category id',
  描述: 'Description',
  技术标签: 'Tech tags',
  仓库链接: 'Repository',
  '详情页 slug': 'Detail slug',
  首页精选: 'Featured on home',
  显示值: 'Display value',
  二维码: 'QR code',
  版权信息: 'Copyright',
  博客页: 'Blog page',
  页面标题: 'Page title',
  副标题: 'Subtitle',
  书签页: 'Bookmark page',
  书签分类: 'Bookmark categories',
  slug: 'slug',
  分类介绍: 'Category intro',
  标题: 'Title',
  说明: 'Description',
  语言: 'Language',
  日期: 'Date',
  阅读时长: 'Reading time',
  '正文（Markdown）': 'Body (Markdown)',
  摘要: 'Excerpt',
  标签: 'Tags',

  未保存: 'Unsaved',
  撤销未保存修改: 'Discard unsaved changes',
  保存: 'Save',
  正在保存: 'Saving',
  预览: 'Preview',
  收起预览: 'Close preview',
  切换到浅色主题: 'Switch to light theme',
  切换到深色主题: 'Switch to dark theme',
  打开前台: 'Open site',
  已保存: 'Saved',
  已撤销未保存修改: 'Unsaved changes discarded',
  已加载磁盘版本: 'Loaded the on-disk version',
  改动需保存后生效: 'Changes take effect after saving',
  当前配置已同步: 'All changes are saved',
  重试: 'Retry',
  加载中: 'Loading',
  正在加载配置: 'Loading configuration',
  '正在加载配置…': 'Loading configuration…',
  已撤销该文件的修改: 'Discarded changes to this file',
  暂无导航项: 'No navigation links',
  未命名: 'Untitled',
  '由 content/site.yaml 维护，后台不再编辑':
    'Maintained in content/site.yaml; editing is no longer available here',
  配置已被外部修改: 'Configuration changed on disk',
  项已保存: 'saved',
  项失败: 'failed',
  失败项保留未保存状态: 'Failed items keep their unsaved changes.',
  '配置保存失败，请查看错误或冲突提示':
    'Configuration failed to save. Check the error or conflict prompt.',
  '有未保存的修改，确定关闭？': 'You have unsaved changes. Close anyway?',
  有未保存的修改: 'Unsaved changes',
  '维护头像、名字、角色与联系方式，并编辑首页文案。':
    'Maintain avatar, name, role and contacts, and edit home copy.',
  '保存会一并提交其他页面的未保存配置修改。':
    'Saving also submits unsaved configuration changes from other pages.',
  用我的版本覆盖: 'Overwrite with mine',
  加载磁盘版本: 'Load the on-disk version',
  取消: 'Cancel',
  删除: 'Delete',
  添加一项: 'Add item',
  上传: 'Upload',
  '上传中…': 'Uploading…',
  '保存中…': 'Saving…',
  保存文章: 'Save post',
  保存详情: 'Save detail',
  新建文章: 'New post',
  编辑文章: 'Edit post',
  返回列表: 'Back to list',
  请选择: 'Select…',
  改为单语: 'Use single language',
  改为双语: 'Use both languages',
  全部: 'All',
  按语言筛选: 'Filter by language',
  按版本筛选: 'Filter by version',
  操作: 'Actions',
  暂无文章: 'No posts yet',
  暂无内容: 'No content yet',
  查看: 'View',
  收起: 'Collapse',
  展开: 'Expand',
  正在读取本地git: 'Reading local git…',
  '正在读取本地 git…': 'Reading local git…',
  本地git不可用: 'Local git unavailable',
  '本地 git 不可用': 'Local git unavailable',
  正在读取: 'Loading…',
  还没有提交记录: 'No commits yet',
  文章列表读取失败: 'Failed to load posts',
  上一项: 'Move up',
  下一项: 'Move down',
  详情正文: 'Detail copy',
  编辑: 'Edit',
  已同步: 'Synced',
  共: 'of',
  个分类: 'categories',
  个技术条目: 'tech items',
  个文件: 'files',
  个版本: 'versions',
  篇: 'files',
  项: 'items',
  处未保存修改: 'unsaved changes',
  首页文案编辑: 'Home copy',
  根首页: 'Root home',
  项目详情按项目维护: 'Detail copy per project',
  '没有 slug，无法关联详情页': 'No slug, so there is no detail page to edit',
  无详情文件: 'No detail file',
  已加载: 'Loaded',
  读取失败: 'Failed to load',
  保存失败: 'Failed to save',
  文件已被外部修改: 'File changed on disk',
  点击重新加载: 'Reload',
  展开全部: 'Expand all',
  收起全部: 'Collapse all',
  选择分类: 'Choose category',
  当前语言: 'Current language',
  博客文章: 'Blog posts',
  中文: 'Chinese',
  英文: 'English',
  次提交: 'commits',
  本页分区: 'Page sections',
  后台导航: 'Admin navigation',
  内容后台: 'Content admin',
  '撤销所有未保存的更改？': 'Discard all unsaved changes?',
  '有未保存的修改，确定离开？': 'You have unsaved changes. Leave anyway?',
  版本记录: 'Releases',
  版本列表: 'Releases',
  最新: 'Latest',
  无法保存: 'Cannot save',
  文章已被外部修改: 'The post changed on disk',
  桌面: 'Desktop',
  平板: 'Tablet',
  手机: 'Mobile',
  站点预览: 'Site preview',
  预览页面: 'Preview page',
  预览设备: 'Preview device',
  刷新: 'Refresh',
  关闭: 'Close',
  上传配图: 'Upload image',
  '文件名：': 'File: ',
  '当前环境无法读取 git 日志': 'Git history is unavailable in this environment',
  '没有 slug，无法关联详情页。': 'No slug, so there is no detail page to edit.',
  '当前项目正文有未保存的修改，确定切换？':
    'This project detail has unsaved changes. Switch anyway?',
  '当前版本有未保存的修改，确定切换？': 'This version has unsaved changes. Switch anyway?',
  '项目详情正文，按项目与语言分别保存。':
    'Project detail pages are saved separately per project and language.',
  'content/home 下的 Markdown 会原样写入磁盘，编辑后按文件单独保存。':
    'Markdown files under content/home are written verbatim and saved per file.',

  // 字段帮助
  '例如 STYLAN · Portfolio': 'e.g. STYLAN · Portfolio',
  '可填 emoji、图片路径或头像 URL': 'An emoji, image path or avatar URL',
  '显示在移动菜单头像旁': 'Shown next to the sidebar avatar',
  'content/icons.yaml 中登记的图标名称': 'Icon name registered in content/icons.yaml',
  '小写，用于锚点': 'Lowercase, used as the anchor',
  '小写，需与项目的分类 id 一致': 'Lowercase and must match a project category id',
  '小写，需与文章 category 一致': 'Lowercase and must match a post category',
  '需与项目分类的 id 一致': 'Must match a project category id',
  '可选，小写字母/数字/连字符；填写后需在 content/projects 下提供同名 Markdown':
    'Optional lowercase slug. If set, add a matching Markdown file under content/projects',
  '关闭后不出现在首页': 'Hide from the home page when off',
  'content/icons.yaml 中登记的图标名称，如 github / email / bilibili / wechat / bluesky':
    'Icon name registered in content/icons.yaml, e.g. github / email / bilibili / wechat / bluesky',
  邮箱地址或微信号: 'Email address or WeChat id',
  '邮箱可留空，按 value 自动生成 mailto': 'Leave empty for email; mailto is generated from the value',
  'wechat 项使用': 'Used by wechat entries',
  '小写字母/数字/连字符，用于分类详情页地址':
    'Lowercase letters, digits or hyphens; used in the category page URL',
  '只显示在分类详情页': 'Only shown on the category detail page',
  例如8min: 'e.g. 8min',
  'content/home 下的 Markdown 会原样写入磁盘': 'Markdown under content/home is written to disk as-is',
  '编辑后按文件单独保存': 'Each file is saved on its own',
  '正文会原样写入 content/projects 下的 Markdown':
    'The body is written as-is to the Markdown file under content/projects',
  '更新日志按版本分组；中英文分别保存': 'Releases are grouped by version; Chinese and English are saved separately',
}

export function translate(text, lang) {
  if (typeof text !== 'string') return text
  if (lang !== 'en') return text
  return EN[text] || text
}

export function useAdminT() {
  const { lang } = useLanguage()
  return useCallback((text) => translate(text, lang), [lang])
}

export function useAdminLang() {
  const { lang } = useLanguage()
  return lang
}

/** 内容数据里的双语对象，按当前语言取值；单语内容原样返回 */
export function pickContent(value, lang, fallback = '') {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') return value[lang] || value.zh || value.en || fallback
  return fallback
}
