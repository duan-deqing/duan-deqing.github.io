import { useLanguage } from '../../hooks/useLanguage'
import { getProjectInitial, resolveIcon } from '../../utils/icons/icons'
import { hasProjectDetail } from '../../utils/projects/projectDetail'
import ProjectLinkCard from '../ui/ProjectLinkCard'

function projectUrl(project) {
  return project.link || project.repo || null
}

export default function ProjectCard({ project }) {
  const { t } = useLanguage()
  const to = project.slug && hasProjectDetail(project.slug)
    ? `/projects/${project.slug}`
    : null

  return (
    <ProjectLinkCard
      to={to}
      href={projectUrl(project)}
      title={t(project.title)}
      description={t(project.description)}
      icon={resolveIcon(project.icon)}
      iconFallback={getProjectInitial(project.title)}
    />
  )
}
