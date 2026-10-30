import config from '@content/site.yaml'
import { useLanguage } from '../../hooks/useLanguage'

const LICENSE_URL = 'https://creativecommons.org/licenses/by-nc-sa/4.0/'

const REFERENCES = {
  antfu: {
    url: 'https://github.com/antfu/antfu.me',
    label: {
      en: 'Design reference: antfu/antfu.me',
      zh: '设计参考：antfu/antfu.me',
    },
  },
  onur: {
    url: 'https://github.com/suyalcinkaya/onur.dev',
    label: {
      en: 'Design reference: onur.dev',
      zh: '设计参考：onur.dev',
    },
  },
}

export default function FooterInfo({ className = '', stacked = false, reference = 'antfu' }) {
  const { t } = useLanguage()
  const copyright = config.footer?.copyright || '2026 © STYLAN'
  const referenceMeta = REFERENCES[reference] || REFERENCES.antfu

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
            href={referenceMeta.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t(referenceMeta.label)}
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
        href={referenceMeta.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t(referenceMeta.label)}
      </a>
    </p>
  )
}
