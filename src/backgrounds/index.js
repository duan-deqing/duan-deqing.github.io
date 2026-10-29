import PlumBackground from './PlumBackground'
import DotsBackground from './DotsBackground'

export const BACKGROUNDS = {
  none: null,
  plum: PlumBackground,
  dots: DotsBackground,
}

export const BACKGROUND_ORDER = ['plum', 'dots', 'none']

// Change this value to switch the default homepage background.
export const HOME_BACKGROUND = 'plum'

export function nextBackground(current) {
  const index = BACKGROUND_ORDER.indexOf(current)
  return BACKGROUND_ORDER[(index + 1) % BACKGROUND_ORDER.length] ?? HOME_BACKGROUND
}
