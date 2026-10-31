import ProjectCard from './ProjectCard'

export default function ProjectGrid({ projects = [] }) {
  if (!projects.length) return null

  return (
    <div className="project-cards-grid">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.link || project.repo || project.icon || index}
          project={project}
        />
      ))}
    </div>
  )
}
