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
]
