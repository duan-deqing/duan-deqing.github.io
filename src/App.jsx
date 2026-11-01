import { AppSettingsProvider } from './hooks/AppSettings'
import ScrollToTop from './components/layout/ScrollToTop'
import { AppRoutes } from './routes'

export default function App() {
  return (
    <AppSettingsProvider>
      <ScrollToTop />
      <AppRoutes />
    </AppSettingsProvider>
  )
}
