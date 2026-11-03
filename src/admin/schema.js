const bilingual = (key, label, type = 'i18nText', extra = {}) => ({
  key, label, type, ...extra,
})

export const adminPages = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: '网站项目、博客、技术栈与最近提交记录的总览。',
  },
  {
    id: 'profile',
    label: '个人信息',
    description: '维护头像、名字、角色、联系方式与首页文案，对应前台侧栏展示。',
    sections: [
      { id: 'personal', title: '个人资料' },
      { id: 'contact', title: '联系方式' },
    ],
    homeCopy: true,
  },
  {
    id: 'projects',
    label: '项目',
    description: '维护项目分类、项目条目与详情正文，新增或删除项目后保存生效。',
    sections: [
      { id: 'projectCategories', title: '项目分类', collapsible: true, defaultOpen: false },
      { id: 'projects', title: '项目列表' },
    ],
    projectDetails: true,
  },
  {
    id: 'blog',
    label: '博客',
    description: '维护博客设置与文章内容，文章写入本地 Markdown 文件。',
    sections: [{ id: 'blog', title: '博客设置' }],
    posts: true,
  },
  {
    id: 'stack',
    label: '技术栈',
    description: '维护技术栈分类与每个分类下的技术条目。',
    sections: [{ id: 'skills', title: '技术栈' }],
  },
  {
    id: 'bookmarks',
    label: '书签',
    description: '维护书签页文案、分类与每个分类下的书签。',
    sections: [
      { id: 'bookmarkPage', title: '书签页设置', collapsible: true, defaultOpen: false },
      { id: 'bookmarkCategories', title: '分类与书签' },
    ],
  },
  {
    id: 'changelog',
    label: '更新日志',
    description: '浏览版本记录并编辑对应语言的中英文 Markdown。',
    kind: 'changelog',
  },
  {
    id: 'settings',
    label: '设置',
    description: '站点级信息与页脚；导航由 site.yaml 维护，这里只读展示。',
    sections: [
      { id: 'site', title: '站点信息' },
      { id: 'footer', title: '页脚', collapsible: true, defaultOpen: false },
    ],
    readonlyNav: true,
  },
]

export const adminPageIds = adminPages.map(({ id }) => id)

export function getContentSection(id) {
  return contentSchema.find((section) => section.id === id) || null
}

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
      { key: 'avatar', label: '头像', type: 'text', upload: true, help: '可填 emoji、图片路径或头像 URL' },
      bilingual('role', '角色', 'i18nText', { help: '显示在移动菜单头像旁' }),
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
          { key: 'icon', label: '图标', type: 'text', help: 'content/icons.yaml 中登记的图标名称' },
          bilingual('label', '文字', 'i18nText', { required: true }),
        ],
      },
    ],
  },
  {
    id: 'skills',
    label: '技能',
    doc: 'site',
    path: ['skills'],
    list: {
      type: 'objectList',
      label: '技能分类',
      fields: [
        { key: 'id', label: 'id', type: 'text', required: true, help: '小写，用于锚点' },
        bilingual('label', '分类名', 'i18nText', { required: true }),
        {
          key: 'items', label: '技术项', type: 'objectList',
          fields: [
            { key: 'name', label: '名称', type: 'text', required: true },
            bilingual('description', '介绍', 'i18nTextarea'),
          ],
        },
      ],
    },
  },
  {
    id: 'projectCategories',
    label: '项目分类',
    doc: 'site',
    path: ['projectCategories'],
    list: {
      type: 'objectList',
      label: '项目分类',
      fields: [
        { key: 'id', label: 'id', type: 'text', required: true, help: '小写，需与项目的分类 id 一致' },
        bilingual('label', '名称', 'i18nText', { required: true }),
      ],
    },
  },
  {
    id: 'projects',
    label: '项目',
    doc: 'site',
    path: ['projects'],
    list: {
      type: 'objectList',
      label: '项目',
      fields: [
        bilingual('title', '名称', 'i18nText', { required: true }),
        { key: 'category', label: '分类 id', type: 'text', help: '需与项目分类的 id 一致' },
        bilingual('description', '描述', 'i18nTextarea'),
        { key: 'tags', label: '技术标签', type: 'stringList' },
        { key: 'link', label: '链接', type: 'url' },
        { key: 'repo', label: '仓库链接', type: 'url' },
        { key: 'icon', label: '图标', type: 'text', help: 'content/icons.yaml 中登记的图标名称；留空用英文首字母' },
        { key: 'slug', label: '详情页 slug', type: 'text', help: '可选，小写字母/数字/连字符；填写后需在 content/projects 下提供同名 Markdown' },
        { key: 'featured', label: '首页精选', type: 'toggle', defaultTrue: true, help: '关闭后不出现在首页' },
      ],
    },
  },
  {
    id: 'contact',
    label: '联系方式',
    doc: 'site',
    path: ['contacts'],
    list: {
      type: 'objectList',
      label: '联系方式',
      fields: [
        { key: 'icon', label: '图标', type: 'text', required: true, help: 'content/icons.yaml 中登记的图标名称，如 github / email / bilibili / wechat / bluesky' },
        bilingual('label', '名称', 'i18nText', { required: true }),
        { key: 'value', label: '显示值', type: 'text', help: '邮箱地址或微信号' },
        { key: 'href', label: '链接', type: 'url', help: '邮箱可留空，按 value 自动生成 mailto' },
        { key: 'qrcode', label: '二维码', type: 'imagePath', help: 'wechat 项使用' },
      ],
    },
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
  {
    id: 'bookmarkPage',
    label: '书签页设置',
    doc: 'bookmarks',
    path: ['page'],
    fields: [
      bilingual('title', '页面标题', 'i18nText', { required: true }),
      bilingual('subtitle', '副标题', 'i18nTextarea'),
    ],
  },
  {
    id: 'bookmarkCategories',
    label: '分类与书签',
    doc: 'bookmarks',
    path: ['categories'],
    list: {
      type: 'objectList',
      label: '书签分类',
      fields: [
        { key: 'slug', label: 'slug', type: 'text', required: true, help: '小写字母/数字/连字符，用于分类详情页地址' },
        bilingual('title', '分类名', 'i18nText', { required: true }),
        bilingual('description', '分类介绍', 'i18nTextarea', { help: '只显示在分类详情页' }),
        { key: 'icon', label: '图标', type: 'text', help: 'content/icons.yaml 中登记的图标名称' },
        {
          key: 'bookmarks', label: '书签', type: 'objectList',
          fields: [
            { key: 'title', label: '标题', type: 'text', required: true },
            { key: 'url', label: '链接', type: 'url', required: true },
            bilingual('description', '说明', 'i18nTextarea'),
          ],
        },
      ],
    },
  },
]
