import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import useCms from '../../hooks/useCms'
export default function Footer() {
  const { cms } = useCms()

  const description = cms?.footer?.description || "Nepal's first peer-to-peer storage marketplace. Connecting sellers, hosts and couriers across the country."
  const copyright = cms?.footer?.copyright || '© 2026 SamanBhandar Pvt. Ltd. All rights reserved.'
  const tagline = cms?.footer?.tagline || 'Made with care in Nepal.'

  const platformLinks = cms?.footer?.platform_links || [
    { label: 'Find Storage', url: '/listings' },
    { label: 'List Your Space', url: '/register?role=host' },
    { label: 'Become a Courier', url: '/register?role=courier' },
    { label: 'Services', url: '/services' },
  ]
  const companyLinks = cms?.footer?.company_links || [
    { label: 'About Us', url: '/about' },
    { label: 'Contact', url: '/contact' },
  ]
  const legalLinks = cms?.footer?.legal_links || [
    { label: 'Privacy Policy', url: '/privacy' },
    { label: 'Terms of Service', url: '/terms' },
  ]
  const socialLinks = cms?.footer?.social_links || [
    { platform: 'facebook', url: '#' },
    { platform: 'instagram', url: '#' },
  ]

  const footerLogoUrl = cms?.navigation?.footer_logo_url || ''

  return (
    <footer className="bg-[#1c1917] text-white/50 pt-16 pb-8">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              {footerLogoUrl ? (
                <img src={footerLogoUrl} alt="Logo" className="w-8 h-8 rounded-md object-contain" />
              ) : (
                <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center">
                  <Package size={16} className="text-white" />
                </div>
              )}
              <span className="font-display font-black text-lg text-white/90 tracking-tight">
                {(cms?.navigation?.website_name || 'Saman')}
                <span className="text-brick">{(cms?.navigation?.website_name_highlight || 'Bhandar')}</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed mb-5">{description}</p>

            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  className="w-8 h-8 bg-white/8 rounded-md flex items-center justify-center hover:bg-white/15 transition-colors"
                >
                  {link.platform === 'facebook' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  ) : link.platform === 'instagram' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  ) : (
                    <span className="text-xs font-bold">{link.platform[0].toUpperCase()}</span>
                  )}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white/80 font-semibold text-sm mb-4">Platform</p>
            <ul className="space-y-2.5 text-sm">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.url} className="hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white/80 font-semibold text-sm mb-4">Company</p>
            <ul className="space-y-2.5 text-sm">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.url} className="hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white/80 font-semibold text-sm mb-4">Legal</p>
            <ul className="space-y-2.5 text-sm">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.url} className="hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <span>{copyright}</span>
          <span>{tagline}</span>
        </div>
      </div>
    </footer>
  )
}