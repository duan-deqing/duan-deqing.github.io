import { useRef, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { cn } from '../../utils/cn'
import { parseCarouselBlock } from '../../utils/articleEmbeds'
import { ArrowLeftIcon, ArrowRightIcon } from '../site/icons'

export default function ArticleCarousel({ source }) {
  const { t } = useLanguage()
  const images = parseCarouselBlock(source)
  const trackRef = useRef(null)
  const dragRef = useRef(null)
  const [active, setActive] = useState(0)
  const [dragging, setDragging] = useState(false)
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

  function startDrag(event) {
    const track = trackRef.current
    if (!track || event.pointerType !== 'mouse' || event.button !== 0) return
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: track.scrollLeft,
    }
    setDragging(true)
    track.setPointerCapture?.(event.pointerId)
  }

  function moveDrag(event) {
    const track = trackRef.current
    const drag = dragRef.current
    if (!track || !drag) return
    track.scrollLeft = drag.startScroll - (event.clientX - drag.startX)
    event.preventDefault()
  }

  function endDrag() {
    const track = trackRef.current
    const drag = dragRef.current
    if (!track || !drag) return
    dragRef.current = null
    setDragging(false)
    if (track.hasPointerCapture?.(drag.pointerId)) {
      track.releasePointerCapture(drag.pointerId)
    }
    const next = Math.min(
      Math.max(Math.round(track.scrollLeft / track.clientWidth), 0),
      count - 1
    )
    track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' })
    setActive(next)
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
        className="relative lg:-mx-8"
      >
        <div
          ref={trackRef}
          onScroll={onScroll}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
          style={{ scrollSnapType: dragging ? 'none' : undefined }}
          className={cn(
            'article-carousel-track flex snap-x snap-mandatory overflow-x-auto lg:mx-9',
            dragging ? 'cursor-grabbing select-none' : 'cursor-grab'
          )}
        >
          {images.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${count}`}
              className="w-full shrink-0 snap-center px-3 py-1"
            >
              <div className="overflow-hidden rounded-xl border border-line bg-page shadow-sm dark:shadow-none">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  onDragStart={(event) => event.preventDefault()}
                  className="aspect-square w-full select-none object-cover"
                />
              </div>
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
              className="absolute left-2 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-line bg-page text-ink shadow-xs transition-colors hover:bg-subtle disabled:pointer-events-none disabled:opacity-40 lg:left-0"
            >
              <ArrowLeftIcon size={16} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={active === count - 1}
              aria-label={t({ en: 'Next image', zh: '下一张' })}
              className="absolute right-2 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-line bg-page text-ink shadow-xs transition-colors hover:bg-subtle disabled:pointer-events-none disabled:opacity-40 lg:right-0"
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

