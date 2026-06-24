import { Menu, X, Home } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

export default function DashboardTopbar({ onMenuToggle, mobileOpen, title }) {
  const { user } = useAuth()
  const initials = user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'

  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-3 sm:px-5 sticky top-0 z-30 w-full">
      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-1.5 -ml-1 rounded-lg text-[#71717a] hover:bg-chalk transition-colors">
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <Link to="/" className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg text-[#71717a] hover:text-[#1c1917] hover:bg-chalk transition-colors" title="Go to Home">
          <Home size={16} />
        </Link>
        <h1 className="text-sm font-display font-bold text-[#1c1917]">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/" className="sm:hidden p-1.5 rounded-lg text-[#71717a] hover:text-[#1c1917] hover:bg-chalk transition-colors" title="Go to Home">
          <Home size={17} />
        </Link>

        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="w-7 h-7 rounded-md bg-[#1c1917] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-[#1c1917] leading-none truncate max-w-[80px]">{user?.full_name?.split(' ')[0] || 'User'}</p>
            <p className="text-[10px] text-[#71717a] leading-none capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}