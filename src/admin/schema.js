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
      type: 'objectList',
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
      type: 'objectList',
      label: '项目',
      fields: [
        bilingual('title', '名称', 'i18nText', { required: true }),
        bilingual('description', '描述', 'i18nTextarea'),
        { key: 'tags', label: '技术标签', type: 'stringList' },
        { key: 'link', label: '链接', type: 'url' },
        { key: 'repo', label: '仓库链接', type: 'url' },
        { key: 'icon', label: '图标', type: 'text', help: '可填一个 emoji' },
        { key: 'featured', label: '首页精选', type: 'toggle', defaultTrue: true, help: '关闭后不出现在首页' },
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
