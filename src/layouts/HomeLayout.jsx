import { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'
import BackgroundLayer from '../backgrounds/BackgroundLayer'
import { BACKGROUNDS, HOME_BACKGROUND, nextBackground } from '../backgrounds'
import HomeFooter from '../components/site/HomeFooter'
import HomeHeader from '../components/site/HomeHeader'

function readBackground() {
  try {
    const saved = localStorage.getItem('home-background')
    return saved && saved in BACKGROUNDS ? saved : HOME_BACKGROUND
  } catch {
    return HOME_BACKGROUND
  }
}

export default function HomeLayout() {
  const [background, setBackground] = useState(readBackground)
  const cycleBackground = useCallback(() => {
    setBackground((current) => {
      const next = nextBackground(current)
      try {
        localStorage.setItem('home-background', next)
      } catch {
        // ignore unavailable storage
      }
      return next
    })
  }, [])

  return (
    <div className="relative min-h-dvh text-ink">
      <BackgroundLayer variant={background} />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <HomeHeader background={background} onCycleBackground={cycleBackground} />
        <main className="mx-auto w-full max-w-[65ch] flex-1 px-5 py-10 md:px-7">
          <Outlet />
        </main>
        <HomeFooter />
      </div>
    </div>
  )
}
