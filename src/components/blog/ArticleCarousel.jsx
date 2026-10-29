import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { useLanguage } from '../../hooks/useLanguage'
import { parseCarouselBlock } from '../../utils/articleEmbeds'
import { ArrowLeftIcon, ArrowRightIcon } from '../site/icons'

export default function ArticleCarousel({ source }) {
  const { t } = useLanguage()
  const images = parseCarouselBlock(source)
  const count = images.length
  const [active, setActive] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: count > 1 })

  const onSelect = useCallback(() => {
    if (emblaApi) setActive(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return undefined
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  if (!count) return null

  const caption = images[active]?.caption || ''

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
            emblaApi?.scrollPrev()
          } else if (event.key === 'ArrowRight') {
            event.preventDefault()
            emblaApi?.scrollNext()
          }
        }}
        className="relative lg:-mx-8"
      >
        <div
          ref={emblaRef}
          className="cursor-grab overflow-hidden active:cursor-grabbing lg:mx-9"
        >
          <div className="flex -ml-6 touch-pan-y select-none">
            {images.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${count}`}
                className="min-w-0 shrink-0 grow-0 basis-full pl-6"
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
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label={t({ en: 'Previous image', zh: '上一张' })}
              className="absolute left-2 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-line bg-page text-ink shadow-xs transition-colors hover:bg-subtle lg:left-0"
            >
              <ArrowLeftIcon size={16} />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label={t({ en: 'Next image', zh: '下一张' })}
              className="absolute right-2 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-line bg-page text-ink shadow-xs transition-colors hover:bg-subtle lg:right-0"
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
