import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { CheckIcon, CopyIcon } from './icons'

const RESET_MS = 2000

/**
 * 复制按钮：点击写入剪贴板，图标 Copy→Check 停留 2s 后回弹，并用 aria-live 播报。
 * 外观完全由调用方的 className 决定，因此可放进任意容器。
 */
export default function CopyButton({
  value,
  label,
  copiedLabel,
  className = '',
  iconSize = 13,
}) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(0)

  useEffect(() => {
    if (!copied) return undefined
    timerRef.current = window.setTimeout(() => setCopied(false), RESET_MS)
    return () => window.clearTimeout(timerRef.current)
  }, [copied])

  async function onClick() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const text = copied
    ? t(copiedLabel || { en: 'Copied', zh: '已复制' })
    : t(label)

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={text}
        title={text}
        className={className}
      >
        {copied ? <CheckIcon size={iconSize} /> : <CopyIcon size={iconSize} />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? text : ''}
      </span>
    </>
  )
}
