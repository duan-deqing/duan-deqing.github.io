/**
 * Contact.jsx - 联系方式区块
 * 
 * 不使用动画，直接显示文字
 */

import config from '../config'

export default function Contact({ t }) {
  const { contact, socialLinks } = config

  return (
    <section id="contact" className="py-20 px-6 bg-gray-50 dark:bg-gray-800/50 min-h-[360px]">
      <div style={{ maxWidth: '42rem', margin: '0 auto' }} className="text-center">
        
        <div className="min-h-[48px] mb-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ lineHeight: '1.3' }}>
            {t(contact.title)}
          </h2>
        </div>
        
        <div className="min-h-[60px] mb-8">
          <p className="text-gray-500 dark:text-gray-400" style={{ lineHeight: '1.8' }}>
            {t(contact.description)}
          </p>
        </div>
        
        <div className="flex justify-center">
          <a href={`mailto:${contact.email}`} className="btn btn-primary">
            {t(contact.emailButtonText)}
          </a>
        </div>
        
        <div className="flex justify-center gap-6 mt-8">
          {socialLinks.map((link) => (
            <a 
              key={link.platform} 
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {link.platform}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
