/**
 * ShapeGridBg — 浅色全屏 ShapeGrid（React Bits 官方实现）
 * 仅浅色挂载；深色用 PixelBlastBg
 */

import { useTheme } from '../../hooks/useTheme'
import ShapeGrid from './ShapeGrid'

export default function ShapeGridBg() {
  const { isDark } = useTheme()

  if (isDark) return null

  return (
    <div className="shape-grid-bg" aria-hidden="true">
      <ShapeGrid
        speed={0.5}
        squareSize={40}
        direction="diagonal"
        borderColor="rgba(59,130,246,0.42)"
        hoverFillColor="rgba(59,130,246,0.22)"
        hoverColor="rgba(59,130,246,0.35)"
        shape="square"
        hoverTrailAmount={5}
      />
    </div>
  )
}
