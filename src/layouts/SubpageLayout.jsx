import { Outlet } from 'react-router-dom'

export default function SubpageLayout() {
  return (
    <div className="min-h-dvh bg-page text-ink">
      <main className="mx-auto w-full max-w-5xl px-6 py-8 lg:px-8 lg:py-16">
        <Outlet />
      </main>
    </div>
  )
}
