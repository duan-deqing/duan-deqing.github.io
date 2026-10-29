import ProjectCard from './ProjectCard'

export default function ProjectGrid({ projects, t }) {
  const list = (projects || []).filter(
    (project) => !String(project.title?.en || '').includes('<')
  )

  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {list.map((project) => (
        <ProjectCard key={project.title?.en || project.title} project={project} t={t} />
      ))}
    </div>
  )
}
