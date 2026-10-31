import { BACKGROUNDS, HOME_BACKGROUND } from './index'
import './backgrounds.css'

export default function BackgroundLayer({ variant = HOME_BACKGROUND }) {
  const Background = BACKGROUNDS[variant] ?? null
  return Background ? <Background /> : null
}
