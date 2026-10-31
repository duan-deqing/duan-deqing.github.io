import { useLanguage } from '../../hooks/useLanguage'
import { getProjectInitial, resolveProjectIcon } from '../../utils/projectIcon'
import ProjectLinkCard from '../shared/ProjectLinkCard'

function projectUrl(project) {
  return project.link || project.repo || null
}

export default function ProjectCard({ project }) {
  const { t } = useLanguage()

  return (
    <ProjectLinkCard
      href={projectUrl(project)}
      title={t(project.title)}
      description={t(project.description)}
      icon={resolveProjectIcon(project.icon)}
      iconFallback={getProjectInitial(project.title)}
    />
  )
}
