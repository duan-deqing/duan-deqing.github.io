import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { getVideoEmbed, parseVideoBlock } from '../../utils/articleEmbeds'

function LazyMount({ children }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="h-full w-full">
      {visible ? children : null}
    </div>
  )
}

export default function ArticleVideo({ source }) {
  const { t } = useLanguage()
  const { url, title, caption } = parseVideoBlock(source)
  const embed = getVideoEmbed(url)

  if (!embed) return null

  if (embed.type === 'link') {
    return (
      <p className="my-6 text-sm">
        <a className="link" href={embed.src} target="_blank" rel="noopener noreferrer">
          {title || embed.src}
        </a>
      </p>
    )
  }

  const description = caption || title
  const iframeTitle = title || t({ en: 'Embedded video', zh: '嵌入视频' })

  return (
    <figure className="my-6">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-black">
        <LazyMount>
          {embed.type === 'video' ? (
            <video
              src={embed.src}
              controls
              playsInline
              preload="metadata"
              className="h-full w-full object-contain"
            />
          ) : (
            <iframe
              src={embed.src}
              title={iframeTitle}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full border-0"
            />
          )}
        </LazyMount>
      </div>
      {description ? (
        <figcaption className="mt-2 text-center text-xs text-muted">{description}</figcaption>
      ) : null}
    </figure>
  )
}
