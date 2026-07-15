import { Link } from 'react-router-dom'
import { Menu, UserCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function DashboardTopbar({ onMenuToggle, mobileOpen, title }) {
  const { user } = useAuth()
  const profileLink = user ? `/${user.role}/profile` : '/login'

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-14 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-md hover:bg-chalk-dark transition-colors"
          >
            <Menu size={18} className="text-[#1c1917]" />
          </button>
          <h1 className="text-lg font-display font-bold text-[#1c1917] truncate">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to={profileLink}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-chalk transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#1c1917] text-white flex items-center justify-center text-sm font-bold">
              {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="hidden sm:block text-sm font-semibold text-[#1c1917]">
              {user?.full_name || 'Profile'}
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}