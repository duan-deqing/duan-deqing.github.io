import config from '../../content/site.yaml'
import SkillGroups from '../shared/SkillGroups'

export default function SkillsSection({ t }) {
  const groups = (config.skills || []).filter(
    (group) => !/hobbies/i.test(group.category?.en || String(group.category || ''))
  )

  return <SkillGroups groups={groups} t={t} columns="home" headingLevel={3} />
}
