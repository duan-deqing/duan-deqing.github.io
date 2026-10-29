import { Outlet } from 'react-router-dom'
import HomeFooter from '../components/site/HomeFooter'
import HomeHeader from '../components/site/HomeHeader'

export default function HomeLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-page text-ink">
      <HomeHeader />
      <main className="mx-auto w-full max-w-[65ch] flex-1 px-5 py-10 md:px-7">
        <Outlet />
      </main>
      <HomeFooter />
    </div>
  )
}
