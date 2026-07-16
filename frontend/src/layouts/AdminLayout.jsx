import { useState, useEffect } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, Users, Building2, BarChart3, BookOpen, LogOut, ShieldCheck, ChevronLeft, ChevronRight, Home, Settings, UserCircle } from 'lucide-react'
import SidebarLink from '../components/common/SidebarLink'
import DashboardTopbar from '../components/common/DashboardTopbar'
import { useAuth } from '../hooks/useAuth'

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/listings', icon: Building2, label: 'Listings' },
  { to: '/admin/cms', icon: Settings, label: 'Website CMS' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/docs', icon: BookOpen, label: 'Documentation' },
  { to: '/admin/profile', icon: UserCircle, label: 'Profile' },
]

const PAGE_TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/users': 'Manage Users',
  '/admin/listings': 'Manage Listings',
  '/admin/cms': 'Website CMS',
  '/admin/analytics': 'Analytics',
  '/admin/profile': 'Profile',
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { logout } = useAuth()
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || 'Admin'

  const isCmsRoute = location.pathname.startsWith('/admin/cms')

  useEffect(() => { setMobileOpen(false) }, [location.pathname])
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setMobileOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  return (
    <div className="flex h-screen bg-chalk overflow-hidden">
      {mobileOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed lg:relative z-50 lg:z-auto h-full flex flex-col bg-white border-r border-border transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? 'w-[64px]' : 'w-60'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Link to="/" className={`flex items-center gap-3 px-4 h-14 border-b border-border hover:bg-chalk transition-colors shrink-0 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-brick rounded-lg flex items-center justify-center shrink-0">
            <ShieldCheck size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-[#1c1917] font-display font-black text-sm leading-none">SamanBhandar</p>
              <p className="text-[#71717a] text-[10px] mt-0.5">Admin Portal</p>
            </div>
          )}
        </Link>
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {NAV.map(item => <SidebarLink key={item.to} {...item} collapsed={collapsed} />)}
        </nav>
        <div className="border-t border-border px-2 py-3 space-y-0.5 shrink-0">
          <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#71717a] hover:text-[#1c1917] hover:bg-chalk transition-all">
            <Home size={17} className="shrink-0" />
            {!collapsed && <span>Back to Home</span>}
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#71717a] hover:text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={17} className="shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#71717a] hover:text-[#1c1917] hover:bg-chalk transition-all">
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {!isCmsRoute && (
          <DashboardTopbar onMenuToggle={() => setMobileOpen(!mobileOpen)} mobileOpen={mobileOpen} title={title} />
        )}
        <main className={`flex-1 overflow-y-auto bg-chalk ${!isCmsRoute ? 'p-4 sm:p-5 lg:p-6 max-w-7xl mx-auto' : ''}`}>
          <div className={`${!isCmsRoute ? '' : 'animate-fade-in'}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}