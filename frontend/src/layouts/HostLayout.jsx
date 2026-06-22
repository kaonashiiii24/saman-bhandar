import { useState, useEffect } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, Building2, CalendarCheck, DollarSign, UserCircle, MessageSquare, LogOut, Warehouse, ChevronLeft, ChevronRight, Home } from 'lucide-react'
import SidebarLink from '../components/common/SidebarLink'
import DashboardTopbar from '../components/common/DashboardTopbar'
import { useAuth } from '../hooks/useAuth'

const NAV = [
  { to: '/host/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/host/listings', icon: Building2, label: 'My Listings' },
  { to: '/host/bookings', icon: CalendarCheck, label: 'Bookings' },
  { to: '/host/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/host/earnings', icon: DollarSign, label: 'Earnings' },
  { to: '/host/profile', icon: UserCircle, label: 'Profile' },
]

const PAGE_TITLES = {
  '/host/dashboard': 'Dashboard',
  '/host/listings': 'My Listings',
  '/host/bookings': 'Manage Bookings',
  '/host/chat': 'Chat',
  '/host/earnings': 'Earnings',
  '/host/profile': 'Profile',
}

export default function HostLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { logout } = useAuth()
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || 'Host'

  useEffect(() => { setMobileOpen(false) }, [location.pathname])
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setMobileOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  return (
    <div className="flex h-screen bg-chalk overflow-hidden">
      {mobileOpen && <div className="fixed inset-0 bg-[#1c1917]/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed lg:relative z-50 lg:z-auto h-full flex flex-col bg-[#1c1917] transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? 'w-[64px]' : 'w-60'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Link to="/" className={`flex items-center gap-3 px-4 py-4 border-b border-white/8 hover:bg-white/5 transition-colors ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-brick rounded-lg flex items-center justify-center shrink-0">
            <Warehouse size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-white font-display font-black text-sm leading-none">SamanBhandar</p>
              <p className="text-white/40 text-[10px] mt-0.5">Host Portal</p>
            </div>
          )}
        </Link>
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {NAV.map(item => <SidebarLink key={item.to} {...item} collapsed={collapsed} />)}
        </nav>
        <div className="border-t border-white/8 px-2 py-3 space-y-0.5">
          <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-white hover:bg-white/8 transition-all">
            <Home size={17} className="shrink-0" />
            {!collapsed && <span>Back to Home</span>}
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={17} className="shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/30 hover:text-white hover:bg-white/8 transition-all">
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardTopbar onMenuToggle={() => setMobileOpen(!mobileOpen)} mobileOpen={mobileOpen} title={title} />
        <main className="flex-1 overflow-y-auto bg-chalk">
          <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}