import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '../../utils/cn'
import { CheckIcon, ChevronDownIcon } from '../site/icons'

const TRIGGER_CLASS =
  'flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-md border bg-page px-2.5 text-left text-xs text-ink transition-colors'
const MENU_CLASS =
  'filter-menu-enter absolute left-0 top-full z-40 mt-1 max-h-64 min-w-full overflow-y-auto rounded-lg border border-line bg-page p-1 shadow-lg'

function FilterSelect({ label, value, onChange, options }) {
  const uid = useId()
  const triggerRef = useRef(null)
  const rootRef = useRef(null)
  const [open, setOpen] = useState(false)
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  )
  const [activeIndex, setActiveIndex] = useState(selectedIndex)
  const selected = options[selectedIndex]
  const listId = `${uid}-list`
  const optionId = (index) => `${uid}-option-${index}`

  useEffect(() => {
    if (!open) return undefined
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open, uid])

  function openMenu() {
    setActiveIndex(selectedIndex)
    setOpen(true)
  }

  function select(index) {
    const option = options[index]
    if (option) onChange(option.value)
    setOpen(false)
    triggerRef.current?.focus()
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      if (open) {
        event.preventDefault()
        setOpen(false)
      }
      return
    }
    if (event.key === 'Tab') {
      setOpen(false)
      return
    }
    if (!open && (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      openMenu()
      return
    }
    if (!open) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, options.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(options.length - 1)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      select(activeIndex)
    }
  }

  return (
    <span ref={rootRef} className="relative min-w-0 flex-1">
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        className={cn(
          TRIGGER_CLASS,
          open ? 'border-line-strong' : 'border-line hover:border-line-strong'
        )}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={onKeyDown}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDownIcon
          size={13}
          className={cn(
            'shrink-0 text-muted transition-transform duration-150',
            open && 'rotate-180'
          )}
        />
      </button>

      {open ? (
        <ul id={listId} role="listbox" aria-label={label} className={MENU_CLASS}>
          {options.map((option, index) => {
            const isSelected = option.value === value
            const isActive = index === activeIndex
            return (
              <li
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-xs transition-colors',
                  isActive ? 'bg-hover text-heading' : 'text-muted-strong',
                  isSelected && 'font-medium text-heading'
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => select(index)}
              >
                <span className="truncate">{option.label}</span>
                {isSelected ? <CheckIcon size={13} className="shrink-0" /> : null}
              </li>
            )
          })}
        </ul>
      ) : null}
    </span>
  )
}

export default function WritingFilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  tags,
  activeTag,
  onTagChange,
  t,
  className,
}) {
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label:
      category.id === 'all'
        ? t({ en: 'All categories', zh: '全部分类' })
        : t(category.label),
  }))

  const tagOptions = [
    { value: 'all', label: t({ en: 'All tags', zh: '全部标签' }) },
    ...tags.map((tag) => ({ value: tag, label: tag })),
  ]

  return (
    <div className={cn('relative z-20 flex items-center gap-2', className)}>
      <FilterSelect
        label={t({ en: 'Filter by category', zh: '按分类筛选' })}
        value={activeCategory}
        onChange={onCategoryChange}
        options={categoryOptions}
      />
      <FilterSelect
        label={t({ en: 'Filter by tag', zh: '按标签筛选' })}
        value={activeTag ?? 'all'}
        onChange={(value) => onTagChange(value === 'all' ? null : value)}
        options={tagOptions}
      />
    </div>
  )
}
