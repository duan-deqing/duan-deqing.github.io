import { Link } from 'react-router-dom'

const HTTP_URL = /^https?:\/\//i
const OTHER_PROTOCOL = /^(?:mailto|tel):/i
const STATIC_FILE = /^\/[^?#]*\.[a-z0-9]{2,5}(?:[?#].*)?$/i

export default function SiteLink({ href, children, ...props }) {
  if (typeof href !== 'string' || href.trim() === '') {
    return <span {...props}>{children}</span>
  }

  if (HTTP_URL.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  }

  if (OTHER_PROTOCOL.test(href) || STATIC_FILE.test(href)) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }

  return (
    <Link to={href} {...props}>
      {children}
    </Link>
  )
}
