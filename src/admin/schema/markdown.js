/**
 * 后台托管的 Markdown 文件白名单。
 * 服务端与前端共用，避免路径校验和界面文案两处漂移。
 */
export const HOME_FILES = [
  {
    id: 'index.zh',
    path: 'content/home/index.zh.md',
    lang: 'zh',
    label: { zh: '首页 · 中文', en: 'Home · Chinese' },
  },
  {
    id: 'index.en',
    path: 'content/home/index.en.md',
    lang: 'en',
    label: { zh: '首页 · English', en: 'Home · English' },
  },
  {
    id: 'home.zh',
    path: 'content/home/home.zh.md',
    lang: 'zh',
    label: { zh: '子页首页 · 中文', en: 'Home subpage · Chinese' },
  },
  {
    id: 'home.en',
    path: 'content/home/home.en.md',
    lang: 'en',
    label: { zh: '子页首页 · English', en: 'Home subpage · English' },
  },
]

export const CHANGELOG = {
  dir: 'content/changelog',
  file: /^v\d+\.\d+\.\d+-[0-9]{4}-[0-9]{2}-[0-9]{2}\.(zh|en)\.md$/,
}

export const PROJECT_DETAIL = {
  dirs: { zh: 'content/projects/zh', en: 'content/projects/en' },
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
}

export function homeFileById(id) {
  return HOME_FILES.find((file) => file.id === id) || null
}
