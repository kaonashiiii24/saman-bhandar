import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1c1917] text-white/50 pt-16 pb-8">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center">
                <Package size={16} className="text-white" />
              </div>
              <span className="font-display font-black text-lg text-white/90 tracking-tight">
                Saman<span className="text-brick">Bhandar</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed mb-5">
              Nepal's first peer-to-peer storage marketplace. Connecting sellers,
              hosts and couriers across the country.
            </p>

            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-white/8 rounded-md flex items-center justify-center hover:bg-white/15 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              <a
                href="#"
                className="w-8 h-8 bg-white/8 rounded-md flex items-center justify-center hover:bg-white/15 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <p className="text-white/80 font-semibold text-sm mb-4">Platform</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/listings" className="hover:text-white transition-colors">
                  Find Storage
                </Link>
              </li>
              <li>
                <Link
                  to="/register?role=host"
                  className="hover:text-white transition-colors"
                >
                  List Your Space
                </Link>
              </li>
              <li>
                <Link
                  to="/register?role=courier"
                  className="hover:text-white transition-colors"
                >
                  Become a Courier
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-white/80 font-semibold text-sm mb-4">Company</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-white/80 font-semibold text-sm mb-4">Legal</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <span>© 2026 SamanBhandar Pvt. Ltd. All rights reserved.</span>
          <span>Made with care in Nepal.</span>
        </div>
      </div>
    </footer>
  )
}