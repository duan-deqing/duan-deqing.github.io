/**
 * CopyButton — 编辑部风格复制控件
 */

import { useCallback, useEffect, useRef, useState } from 'react'

function IconCopy({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="11" rx="1.5" />
      <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function IconCheck({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  )
}

async function writeClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.setAttribute('readonly', '')
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
}

export default function CopyButton({ value, label, className = '' }) {
  const [state, setState] = useState('idle') // idle | success | error
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const onClick = useCallback(
    async (e) => {
      e.preventDefault()
      e.stopPropagation()
      clearTimeout(timerRef.current)
      try {
        await writeClipboard(value)
        setState('success')
      } catch {
        setState('error')
      }
      timerRef.current = setTimeout(() => setState('idle'), 1800)
    },
    [value]
  )

  const isCopied = state === 'success'
  const isError = state === 'error'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`copy-btn ${isCopied ? 'is-copied' : ''} ${isError ? 'is-error' : ''} ${className}`}
      aria-label={isCopied ? label?.copied || 'Copied' : label?.copy || 'Copy'}
      title={
        isCopied
          ? label?.copied || 'Copied'
          : isError
            ? label?.failed || 'Copy failed'
            : label?.copy || 'Copy'
      }
    >
      <span className="copy-btn-icon" aria-hidden="true">
        {isCopied ? <IconCheck /> : <IconCopy />}
      </span>
      <span className="copy-btn-text">
        {isCopied
          ? label?.copied || 'COPIED'
          : isError
            ? label?.failed || 'FAILED'
            : label?.copy || 'COPY'}
      </span>
    </button>
  )
}
