export default function TagChip({ as: Tag = 'span', active = false, className = '', children, ...props }) {
  return (
    <Tag className={`tag-chip${active ? ' is-active' : ''} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  )
}
