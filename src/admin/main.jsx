import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import 'katex/dist/katex.min.css'
import './admin.css'
import '../styles/math.css'
import '../styles/markdown-extras.css'
import AdminApp from './AdminApp'

try {
  const saved = localStorage.getItem('theme')
  const dark =
    saved === 'dark' ||
    (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
} catch {
  // 忽略隐私模式下的 localStorage 异常
}

createRoot(document.getElementById('admin-root')).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>
)
