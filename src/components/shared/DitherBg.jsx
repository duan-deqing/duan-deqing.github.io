/**
 * DitherBg — 浅色全屏 Dither（React Bits 官方实现）
 * 仅浅色挂载；three 异步加载，避免进主包
 */

import { Suspense, lazy } from 'react'
import { useTheme } from '../../hooks/useTheme'

const Dither = lazy(() => import('./Dither'))

export default function DitherBg() {
  const { isDark } = useTheme()

  if (isDark) return null

  return (
    <div className="dither-bg" aria-hidden="true">
      <Suspense fallback={null}>
        <Dither
          waveColor={[0.23137254901960785, 0.5098039215686274, 0.9647058823529412]}
          backgroundColor={[0.97, 0.97, 0.96]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.35}
          colorNum={3.1}
          waveAmplitude={0.45}
          waveFrequency={1.2}
          waveSpeed={0.35}
          pixelSize={2}
        />
      </Suspense>
    </div>
  )
}
