import { useRef, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { parseCarouselBlock } from '../../utils/articleEmbeds'
import { ArrowLeftIcon, ArrowRightIcon } from '../site/icons'

export default function ArticleCarousel({ source }) {
  const { t } = useLanguage()
  const images = parseCarouselBlock(source)
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)
  const count = images.length

  if (!count) return null

  const caption = images[active]?.caption || ''

  function go(step) {
    const track = trackRef.current
    if (!track) return
    const next = Math.min(Math.max(active + step, 0), count - 1)
    track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' })
    setActive(next)
  }

  function onScroll() {
    const track = trackRef.current
    if (!track) return
    const next = Math.round(track.scrollLeft / track.clientWidth)
    setActive((value) => (value === next ? value : next))
  }

  return (
    <figure className="my-6">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={t({ en: 'Image gallery', zh: '图片轮播' })}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            go(-1)
          } else if (event.key === 'ArrowRight') {
            event.preventDefault()
            go(1)
          }
        }}
        className="relative rounded-xl"
      >
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="article-carousel-track flex snap-x snap-mandatory overflow-x-auto rounded-xl border border-line bg-page"
        >
          {images.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${count}`}
              className="w-full shrink-0 snap-center"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full object-cover"
              />
            </div>
          ))}
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={active === 0}
              aria-label={t({ en: 'Previous image', zh: '上一张' })}
              className="absolute left-2 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-line bg-page text-ink shadow-xs transition-colors hover:bg-subtle disabled:pointer-events-none disabled:opacity-40"
            >
              <ArrowLeftIcon size={16} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={active === count - 1}
              aria-label={t({ en: 'Next image', zh: '下一张' })}
              className="absolute right-2 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-line bg-page text-ink shadow-xs transition-colors hover:bg-subtle disabled:pointer-events-none disabled:opacity-40"
            >
              <ArrowRightIcon size={16} />
            </button>
          </>
        ) : null}
      </div>

      <figcaption
        aria-live="polite"
        className="mt-2 min-h-[1.25rem] text-center text-xs text-muted"
      >
        {caption}
      </figcaption>
    </figure>
  )
}
