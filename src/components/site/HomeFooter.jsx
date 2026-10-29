import config from '../../content/site.yaml'
import { useLanguage } from '../../hooks/useLanguage'

const LICENSE_URL = 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
const REFERENCE_URL = 'https://github.com/antfu/antfu.me'

export default function HomeFooter() {
  const { t } = useLanguage()
  const copyright = config.footer?.copyright || '2026 © STYLAN'

  return (
    <footer className="home-footer-enter mx-auto mb-6 mt-10 w-full max-w-[65ch] px-5 md:px-7">
      <div className="flex text-sm opacity-50">
        <span>
          <a
            className="footer-link"
            href={LICENSE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY-NC-SA 4.0
          </a>{' '}
          {copyright}
          {' · '}
          <a
            className="footer-link"
            href={REFERENCE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t({
              en: 'Design reference: antfu/antfu.me',
              zh: '设计参考：antfu/antfu.me',
            })}
          </a>
        </span>
        <div className="flex-auto" />
      </div>
    </footer>
  )
}
