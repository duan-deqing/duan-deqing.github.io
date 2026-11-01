import iconsConfig from '@content/icons.yaml'
import { getProjectInitial, resolveIconEntry as resolveEntry, resolveIconName } from './iconRegistry'

const ICONS = iconsConfig.icons || {}

export { getProjectInitial }

export function resolveIcon(value) {
  return resolveIconName(value, ICONS)
}

export function resolveIconEntry(value) {
  return resolveEntry(value, ICONS)
}
