import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Image, FileText, Settings, Palette, Globe, MessageSquare, Star, HelpCircle, Layers, Truck, Shield, Phone, Mail, Users } from 'lucide-react'

const links = [
  { to: 'hero', label: 'Hero', icon: LayoutDashboard },
  { to: 'about', label: 'About', icon: Users },
  { to: 'services', label: 'Services', icon: Layers },
  { to: 'how-it-works', label: 'How It Works', icon: Truck },
  { to: 'features', label: 'Features', icon: Star },
  { to: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { to: 'faqs', label: 'FAQs', icon: HelpCircle },
  { to: 'contact', label: 'Contact', icon: Phone },
  { to: 'footer', label: 'Footer', icon: Mail },
  { to: 'seo', label: 'SEO', icon: Globe },
  { to: 'theme', label: 'Theme', icon: Palette },
  { to: 'media', label: 'Media', icon: Image },
]

export default function CmsLayout() {
  return (
    <div className="flex h-screen bg-[#f7f7f8]">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Website CMS</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage public content</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}