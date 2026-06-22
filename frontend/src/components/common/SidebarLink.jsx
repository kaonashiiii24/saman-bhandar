import { NavLink } from 'react-router-dom'

export default function SidebarLink({ to, icon: Icon, label, collapsed }) {
  return (
    <NavLink to={to} end={to === '/seller/dashboard' || to === '/host/dashboard' || to === '/courier/dashboard' || to === '/admin/dashboard' ? true : false} className={({ isActive }) =>
      `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative
      ${isActive ? 'bg-white text-[#1c1917] shadow-xs font-semibold' : 'text-white/50 hover:text-white hover:bg-white/8'}`
    }>
      {({ isActive }) => (
        <>
          <Icon size={17} className={`shrink-0 transition-all ${isActive ? 'text-[#1c1917]' : 'text-white/50 group-hover:text-white'}`} />
          {!collapsed && <span className="truncate">{label}</span>}
        </>
      )}
    </NavLink>
  )
}