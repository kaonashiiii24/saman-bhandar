import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  Image, FileText, Globe,
  MessageSquare, Star, HelpCircle, Layers, Truck, Phone, Mail,
  Users, ChevronDown, Home, Tag
} from 'lucide-react'

const groupPaths = {
  'Home Page':     ['hero','section-headings','how-it-works','features','testimonials','faqs'],
  'About Page':    ['about-hero','about-values'],
  'Services Page': ['services-hero','services','pricing-plans','role-steps'],
  'Contact Page':  ['contact'],
  'Global':        ['footer','navigation'],
}

function SidebarGroup({ group, active }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-lg ${
          active
            ? 'text-brick bg-brick-light/10'
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <span className="flex items-center gap-2">
          <group.icon size={14} />
          {group.label}
        </span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mt-1 ml-2 space-y-1 border-l border-gray-200 pl-3">
          {group.links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CmsLayout() {
  const location = useLocation()
  const currentPath = location.pathname.replace('/admin/cms/', '').split('/')[0]

  const isGroupActive = (groupLabel) => {
    if (!groupPaths[groupLabel]) return false
    return groupPaths[groupLabel].includes(currentPath)
  }

  const groups = [
    {
      label: 'Home Page',
      icon: Home,
      links: [
        { to: 'hero', label: 'Hero' },
        { to: 'section-headings', label: 'Section Headings' },
        { to: 'how-it-works', label: 'How It Works' },
        { to: 'features', label: 'Features' },
        { to: 'testimonials', label: 'Testimonials' },
        { to: 'faqs', label: 'FAQs' },
      ],
    },
    {
      label: 'About Page',
      icon: Users,
      links: [
        { to: 'about-hero', label: 'Hero & Story' },
        { to: 'about-values', label: 'Our Values' },
      ],
    },
    {
      label: 'Services Page',
      icon: Layers,
      links: [
        { to: 'services-hero', label: 'Hero' },
        { to: 'services', label: 'Services List' },
        { to: 'pricing-plans', label: 'Pricing Plans' },
        { to: 'role-steps', label: 'Role Steps' },
      ],
    },
    {
      label: 'Contact Page',
      icon: Phone,
      links: [
        { to: 'contact', label: 'Contact Info' },
      ],
    },
    {
      label: 'Global',
      icon: Globe,
      links: [
        { to: 'footer', label: 'Footer' },
        { to: 'navigation', label: 'Navigation' },
      ],
    },
  ]

  return (
    <div className="flex h-screen bg-[#f7f7f8]">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Website CMS</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage public content</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-3">
          {groups.map(group => (
            <SidebarGroup key={group.label} group={group} active={isGroupActive(group.label)} />
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}