import config from '../../content/site.yaml'

export default function HomeFooter() {
  const copyright = config.footer?.copyright || `© ${new Date().getFullYear()} STYLAN`

  return (
    <footer className="home-footer-enter mx-auto mb-6 mt-10 w-full max-w-[65ch] px-5 md:px-7">
      <div className="flex text-sm opacity-50">
        <span>{copyright}</span>
        <div className="flex-auto" />
      </div>
    </footer>
  )
}
