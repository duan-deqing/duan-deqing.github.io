import PlumBackground from './PlumBackground'
import DotsBackground from './DotsBackground'
import GridBackground from './GridBackground'
import WavesBackground from './WavesBackground'
import AuroraBackground from './AuroraBackground'

export const BACKGROUNDS = {
  none: null,
  plum: PlumBackground,
  dots: DotsBackground,
  grid: GridBackground,
  waves: WavesBackground,
  aurora: AuroraBackground,
}

export const BACKGROUND_ORDER = ['plum', 'dots', 'grid', 'waves', 'aurora', 'none']

// Change this value to switch the default homepage background.
export const HOME_BACKGROUND = 'plum'

export const PAGE_BACKGROUNDS = {
  '/home': 'aurora',
  '/projects': 'dots',
  '/stack': 'waves',
}

export function pageBackgroundForPath(pathname) {
  const key = String(pathname || '').replace(/\/+$/, '') || '/'
  if (key === '/changelog' || key.startsWith('/changelog/')) return 'aurora'
  return PAGE_BACKGROUNDS[key] ?? null
}

export function nextBackground(current) {
  const index = BACKGROUND_ORDER.indexOf(current)
  return BACKGROUND_ORDER[(index + 1) % BACKGROUND_ORDER.length] ?? HOME_BACKGROUND
}
