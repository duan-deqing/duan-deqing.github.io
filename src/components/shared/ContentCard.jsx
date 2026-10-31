export default function ContentCard({
  href,
  title,
  meta,
  MetaIcon,
  description,
  media,
  index = 0,
  ariaLabel,
}) {
  const Tag = href ? 'a' : 'article'
  const linkProps = href
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Tag
      {...linkProps}
      className="content-card content-card-enter"
      style={{ '--content-card-index': Math.min(index, 12) }}
      aria-label={ariaLabel}
    >
      <span className="content-card-media">{media}</span>

      <span className="content-card-body">
        <span className="content-card-title">{title}</span>
        {meta ? (
          <span className="content-card-meta">
            {MetaIcon ? <MetaIcon size={15} /> : null}
            <span className="content-card-meta-text">{meta}</span>
          </span>
        ) : null}
        {description ? (
          <span className="content-card-description">{description}</span>
        ) : null}
      </span>
    </Tag>
  )
}
