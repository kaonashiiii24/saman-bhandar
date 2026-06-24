import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Package, LogOut, LayoutGrid, Menu, X, ChevronDown, LogIn, UserPlus } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [location])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }
  const getDashboardLink = () => `/${user.role}/dashboard`

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const navLinks = [
    { to: '/listings', label: 'Find Storage' },
    { to: '/services', label: 'Services' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border'
        : 'bg-[#FAFAF9] border-b border-border'
    }`}>
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-8">

          <Link
            to="/"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault()
                scrollToTop()
              }
            }}
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
            <div className="w-8 h-8 bg-[#1a1a1a] rounded-md flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <Package size={16} className="text-white" />
            </div>
            <span className="font-display font-black text-lg text-[#1a1a1a] tracking-tight">
              Saman<span className="text-brick">Bhandar</span>
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-0.5 flex-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}
                  onClick={scrollToTop}
                  className={`text-sm font-medium px-3.5 py-2 rounded-md transition-all duration-150 ${
                    location.pathname === link.to
                      ? 'text-[#1a1a1a] bg-chalk-dark font-semibold'
                      : 'text-[#52525b] hover:text-[#1a1a1a] hover:bg-chalk-dark'
                  }`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center ml-auto" ref={dropdownRef}>
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 bg-[#1a1a1a] hover:bg-[#2d2d2d] text-white text-sm font-semibold px-4 py-2.5 rounded-md transition-colors duration-150"
                >
                  <div className="w-5 h-5 rounded bg-white/15 flex items-center justify-center text-white text-xs font-bold">
                    {user.full_name?.charAt(0).toUpperCase()}
                  </div>
                  {user.full_name?.split(' ')[0]}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2d2d2d] text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors duration-150"
                >
                  Sign in
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              )}

              {dropdownOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] bg-white border border-border rounded-xl shadow-md min-w-[200px] z-50 p-1.5 animate-scale-in">
                  {user ? (
                    <>
                      <div className="px-3 py-2.5 mb-1">
                        <p className="text-xs text-[#71717a]">Signed in as</p>
                        <p className="text-sm font-bold text-[#1a1a1a] truncate">{user.full_name}</p>
                        <span className="inline-block mt-1 text-[10px] bg-chalk-dark text-[#52525b] font-semibold px-2 py-0.5 rounded capitalize">{user.role}</span>
                      </div>
                      <div className="h-px bg-border mb-1" />
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-[#1a1a1a] hover:bg-chalk transition-colors"
                      >
                        <LayoutGrid size={14} className="text-[#71717a]" /> Dashboard
                      </Link>
                      <div className="h-px bg-border my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-brick hover:bg-brick-light transition-colors w-full text-left"
                      >
                        <LogOut size={14} /> Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-[#1a1a1a] hover:bg-chalk transition-colors"
                      >
                        <LogIn size={14} className="text-[#71717a]" /> Log in
                      </Link>
                      <div className="h-px bg-border my-1" />
                      <Link
                        to="/register"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#1a1a1a] hover:bg-brick transition-colors"
                      >
                        <UserPlus size={14} /> Sign up free
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            className="lg:hidden ml-auto w-9 h-9 flex items-center justify-center rounded-md hover:bg-chalk-dark transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} className="text-[#1a1a1a]" /> : <Menu size={20} className="text-[#1a1a1a]" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-border animate-fade-in">
          <div className="max-w-container mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                onClick={scrollToTop}
                className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-chalk-dark text-[#1a1a1a] font-semibold'
                    : 'text-[#52525b] hover:text-[#1a1a1a] hover:bg-chalk'
                }`}>
                {link.label}
              </Link>
            ))}

            <div className="border-t border-border pt-3 mt-3 space-y-2">
              {user ? (
                <>
                  <div className="px-3 py-2.5 bg-chalk rounded-md">
                    <p className="text-xs text-[#71717a]">Signed in as</p>
                    <p className="text-sm font-bold text-[#1a1a1a]">{user.full_name}</p>
                    <span className="inline-block mt-1 text-[10px] bg-chalk-dark text-[#52525b] font-semibold px-2 py-0.5 rounded capitalize">{user.role}</span>
                  </div>
                  <Link to={getDashboardLink()}
                    className="flex items-center gap-2 w-full bg-[#1a1a1a] text-white font-display font-bold rounded-md py-2.5 px-4 text-sm hover:bg-[#2d2d2d] transition-colors">
                    <LayoutGrid size={15} /> Dashboard
                  </Link>
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 w-full border border-border text-brick font-semibold rounded-md py-2.5 px-4 text-sm hover:bg-brick-light transition-colors">
                    <LogOut size={15} /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login"
                    className="flex items-center gap-2 w-full border border-border text-[#1a1a1a] font-display font-bold rounded-md py-2.5 px-4 text-sm hover:bg-chalk transition-colors">
                    <LogIn size={15} /> Log in
                  </Link>
                  <Link to="/register"
                    className="flex items-center gap-2 w-full bg-[#1a1a1a] text-white font-display font-bold rounded-md py-2.5 px-4 text-sm hover:bg-brick transition-colors">
                    <UserPlus size={15} /> Sign up free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}