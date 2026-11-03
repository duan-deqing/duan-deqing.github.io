import { adminApi } from '../api'
import { useMarkdownFiles } from './useMarkdownFiles'

const loadHome = () => adminApi.getHomeFiles()
const saveHome = (key, item) =>
  adminApi.saveHomeFile(key, { content: item.content, revision: item.revision })
const homeKey = (item) => item.id

const loadChangelog = () => adminApi.listChangelog()
const saveChangelog = (key, item) =>
  adminApi.saveChangelog(key, { content: item.content, revision: item.revision })
const changelogKey = (item) => item.filename

const loadProjects = () => adminApi.listProjectDetails()
const saveProject = (key, item) => {
  const [lang, slug] = key.split(':')
  return adminApi.saveProjectDetail(lang, slug, {
    content: item.content,
    revision: item.revision,
  })
}
const projectKey = (item) => `${item.lang}:${item.slug}`

export function useHomeFiles() {
  return useMarkdownFiles({ load: loadHome, save: saveHome, keyOf: homeKey })
}

export function useChangelogFiles() {
  return useMarkdownFiles({ load: loadChangelog, save: saveChangelog, keyOf: changelogKey })
}

export function useProjectDetailFiles() {
  return useMarkdownFiles({ load: loadProjects, save: saveProject, keyOf: projectKey })
}
