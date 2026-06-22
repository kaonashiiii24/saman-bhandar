import { Search, Menu, X, Home } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'

export default function DashboardTopbar({ onMenuToggle, mobileOpen, title }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const initials = user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    const query = searchQuery.toLowerCase().trim()
    
    if (user?.role === 'admin') {
      if (query.includes('user')) navigate('/admin/users')
      else if (query.includes('listing')) navigate('/admin/listings')
      else if (query.includes('analytics') || query.includes('stat')) navigate('/admin/analytics')
      else navigate('/admin/users')
    } else if (user?.role === 'seller') {
      if (query.includes('inventory') || query.includes('item')) navigate('/seller/inventory')
      else if (query.includes('book')) navigate('/seller/bookings')
      else if (query.includes('chat') || query.includes('message')) navigate('/seller/chat')
      else if (query.includes('pay')) navigate('/seller/payments')
      else if (query.includes('profile')) navigate('/seller/profile')
      else navigate('/seller/bookings')
    } else if (user?.role === 'host') {
      if (query.includes('listing')) navigate('/host/listings')
      else if (query.includes('book')) navigate('/host/bookings')
      else if (query.includes('earn') || query.includes('revenue')) navigate('/host/earnings')
      else if (query.includes('chat') || query.includes('message')) navigate('/host/chat')
      else if (query.includes('profile')) navigate('/host/profile')
      else navigate('/host/bookings')
    } else if (user?.role === 'courier') {
      if (query.includes('job')) navigate('/courier/jobs')
      else if (query.includes('delivery')) navigate('/courier/deliveries')
      else if (query.includes('profile')) navigate('/courier/profile')
      else navigate('/courier/jobs')
    }
    
    setSearchQuery('')
  }

  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-3 sm:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-1.5 rounded-lg text-[#71717a] hover:bg-chalk transition-colors">
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <Link to="/" className="hidden sm:flex items-center gap-1.5 p-1.5 rounded-lg text-[#71717a] hover:text-[#1c1917] hover:bg-chalk transition-colors" title="Go to Home">
          <Home size={16} />
        </Link>
        <h1 className="text-sm sm:text-base font-display font-bold text-[#1c1917] truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <form onSubmit={handleSearch} className={`hidden sm:flex items-center gap-2 bg-chalk border rounded-lg px-3 py-1.5 transition-all duration-200 ${searchFocused ? 'border-[#1c1917] w-44 lg:w-48' : 'border-border w-32 lg:w-36'}`}>
          <Search size={13} className="text-[#71717a] shrink-0" />
          <input 
            type="text" 
            placeholder="Quick navigate…" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)} 
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent text-xs text-[#1c1917] placeholder-[#71717a] outline-none w-full" 
          />
        </form>
        <Link to="/" className="sm:hidden p-1.5 rounded-lg text-[#71717a] hover:text-[#1c1917] hover:bg-chalk transition-colors" title="Go to Home">
          <Home size={17} />
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-border">
          <div className="w-7 h-7 rounded-lg bg-[#1c1917] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-[#1c1917] leading-none truncate max-w-[80px]">{user?.full_name?.split(' ')[0] || 'User'}</p>
            <p className="text-[10px] text-[#71717a] mt-0.5 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}