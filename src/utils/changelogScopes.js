export const CHANGELOG_SCOPES = {
  all: {
    label: { en: 'All pages', zh: '全部页面' },
    description: {
      en: 'A version history of updates across the site.',
      zh: '站点各页面的版本与功能更新记录。',
    },
    path: '/home',
    back: { en: 'Back to home', zh: '返回首页' },
  },
  home: {
    label: { en: 'Home', zh: '首页' },
    description: {
      en: 'Version history for the Home page.',
      zh: '首页的版本与功能更新记录。',
    },
    path: '/home',
    back: { en: 'Back to home', zh: '返回首页' },
  },
  projects: {
    label: { en: 'Projects', zh: '项目' },
    description: {
      en: 'Version history for the Projects page.',
      zh: '项目页面的版本与功能更新记录。',
    },
    path: '/projects',
    back: { en: 'Back to projects', zh: '返回项目' },
  },
  stack: {
    label: { en: 'Stack', zh: '技术栈' },
    description: {
      en: 'Version history for the Stack page.',
      zh: '技术栈页面的版本与功能更新记录。',
    },
    path: '/stack',
    back: { en: 'Back to stack', zh: '返回技术栈' },
  },
}

const PATH_SCOPES = [
  ['/projects', 'projects'],
  ['/stack', 'stack'],
  ['/home', 'home'],
]

export function normalizeChangelogScope(value) {
  return typeof value === 'string' && value in CHANGELOG_SCOPES ? value : 'all'
}

export function changelogScopeForPath(pathname) {
  const key = String(pathname || '').replace(/\/+$/, '') || '/'

  if (key === '/changelog' || key.startsWith('/changelog/')) {
    return normalizeChangelogScope(key.split('/')[2] || 'all')
  }

  for (const [prefix, scope] of PATH_SCOPES) {
    if (key === prefix || key.startsWith(`${prefix}/`)) return scope
  }

  return 'all'
}

export function changelogBackPath(scope) {
  return CHANGELOG_SCOPES[normalizeChangelogScope(scope)].path
}
