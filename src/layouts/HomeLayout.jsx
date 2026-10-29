import { Outlet } from 'react-router-dom'
import BackgroundLayer from '../backgrounds/BackgroundLayer'
import HomeFooter from '../components/site/HomeFooter'
import HomeHeader from '../components/site/HomeHeader'

export default function HomeLayout() {
  return (
    <div className="relative min-h-dvh text-ink">
      <BackgroundLayer />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <HomeHeader />
        <main className="mx-auto w-full max-w-[65ch] flex-1 px-5 py-10 md:px-7">
          <Outlet />
        </main>
        <HomeFooter />
      </div>
    </div>
  )
}
