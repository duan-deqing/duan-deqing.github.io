import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

function ProjectIcon({ src, fallback }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!src) {
      setFailed(false)
      return undefined
    }

    let active = true
    const probe = new Image()
    probe.onload = () => {
      if (active) setFailed(false)
    }
    probe.onerror = () => {
      if (active) setFailed(true)
    }
    probe.src = src

    return () => {
      active = false
      probe.onload = null
      probe.onerror = null
    }
  }, [src])

  if (!src || failed) {
    return (
      <span className="project-card-icon-fallback" aria-hidden="true">
        {fallback}
      </span>
    )
  }

  return (
    <span
      className="project-card-icon-image"
      style={{ '--project-icon': `url("${src}")` }}
      aria-hidden="true"
    />
  )
}

export default function ProjectLinkCard({
  href,
  to,
  title,
  description,
  icon,
  iconFallback = '?',
  active = false,
  compact = false,
}) {
  const Tag = to ? Link : href ? 'a' : 'article'
  const linkProps = to
    ? {
        to,
        title,
        'aria-current': active ? 'page' : undefined,
      }
    : href
      ? { href, target: '_blank', rel: 'noopener noreferrer', title }
      : {}

  return (
    <Tag
      className={cn('project-card', compact && 'is-compact', active && 'is-active')}
      {...linkProps}
    >
      <span className="project-card-icon">
        <ProjectIcon src={icon} fallback={iconFallback} />
      </span>
      <span className="project-card-body">
        <span className="project-card-title">{title}</span>
        <span className="project-card-description">{description}</span>
      </span>
    </Tag>
  )
}
