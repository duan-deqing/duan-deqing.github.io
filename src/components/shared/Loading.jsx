/**
 * ============================================================================
 *  Loading.jsx - 加载动画组件
 * ============================================================================
 *
 * 【功能说明】
 * 1. 全屏加载动画，与主页设计风格一致
 * 2. 支持深色/浅色模式
 * 3. 只显示品牌标识和进度条
 * 4. 进度条完成后调用 onComplete 回调
 *
 * 【Props】
 * - fullScreen: boolean - 是否全屏显示（默认：true）
 * - onComplete: function - 加载完成后的回调函数
 * ============================================================================
 */

import { useState, useEffect } from 'react'

export default function Loading({ fullScreen = true, onComplete }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const duration = 500

    const animate = () => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / duration) * 100, 100)
      setProgress(newProgress)

      if (newProgress < 100) {
        requestAnimationFrame(animate)
      } else if (onComplete) {
        onComplete()
      }
    }

    requestAnimationFrame(animate)
  }, [onComplete])

  return (
    <div
      className={`flex items-center justify-center bg-white dark:bg-gray-900 transition-colors ${
        fullScreen ? 'min-h-screen' : 'min-h-[400px]'
      }`}
    >
      <div className="text-center px-6">
        {/* 品牌标识 */}
        <h1
          className="text-2xl font-semibold text-black dark:text-white mb-8"
          style={{ fontFamily: '"Noto Sans SC", "Noto Sans", sans-serif' }}
        >
          STYLAN
        </h1>

        {/* 进度条 */}
        <div className="w-48 mx-auto">
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
