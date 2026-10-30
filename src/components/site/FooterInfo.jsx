import config from '../../content/site.yaml'
import { useLanguage } from '../../hooks/useLanguage'

const LICENSE_URL = 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
const REFERENCE_URL = 'https://github.com/suyalcinkaya/onur.dev'

export default function FooterInfo({ className = '', stacked = false }) {
  const { t } = useLanguage()
  const copyright = config.footer?.copyright || '2026 © STYLAN'

  if (stacked) {
    return (
      <div className={className}>
        <p>
          <a
            className="footer-link"
            href={LICENSE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY-NC-SA 4.0
          </a>{' '}
          {copyright}
        </p>
        <p className="mt-1">
          <a
            className="footer-link"
            href={REFERENCE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t({
              en: 'Design reference: onur.dev',
              zh: '设计参考：onur.dev',
            })}
          </a>
        </p>
      </div>
    )
  }

  return (
    <p className={className}>
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
          en: 'Design reference: onur.dev',
          zh: '设计参考：onur.dev',
        })}
      </a>
    </p>
  )
}
