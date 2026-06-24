import { NavLink } from 'react-router-dom'

export default function SidebarLink({ to, icon: Icon, label, collapsed }) {
  return (
    <NavLink to={to} end={to.includes('dashboard')} className={({ isActive }) =>
      `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative
      ${isActive ? 'bg-[#1c1917] text-white shadow-sm font-semibold' : 'text-[#71717a] hover:text-[#1c1917] hover:bg-chalk'}`
    }>
      {({ isActive }) => (
        <>
          <Icon size={17} className={`shrink-0 transition-all ${isActive ? 'text-white' : 'text-[#71717a] group-hover:text-[#1c1917]'}`} />
          {!collapsed && <span className="truncate">{label}</span>}
        </>
      )}
    </NavLink>
  )
}