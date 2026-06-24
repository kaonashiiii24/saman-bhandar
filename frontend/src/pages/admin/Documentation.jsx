import { BookOpen, Users, Building2, BarChart3, ShieldCheck, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'Platform Management',
    icon: ShieldCheck,
    steps: [
      { title: 'Dashboard Overview', desc: 'The dashboard shows real-time platform statistics including total users, listings, bookings, revenue, and commission earned.' },
      { title: 'Commission Model', desc: 'The platform charges 10% commission on every booking. Hosts receive 90% of the booking amount.' },
    ]
  },
  {
    title: 'User Management',
    icon: Users,
    steps: [
      { title: 'Approve Users', desc: 'Hosts and Couriers require admin approval before they can use the platform. Sellers are auto-approved.' },
      { title: 'Suspend Users', desc: 'You can suspend any user. Suspended users cannot log in until reactivated.' },
      { title: 'Delete Users', desc: 'Permanently remove users from the platform. Use with caution as it cascades to their listings and bookings.' },
    ]
  },
  {
    title: 'Listing Management',
    icon: Building2,
    steps: [
      { title: 'Toggle Listings', desc: 'Activate or deactivate any listing. Inactive listings do not appear in browse results.' },
      { title: 'View All Listings', desc: 'See all listings across the platform with host details and status.' },
    ]
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    steps: [
      { title: 'Revenue Charts', desc: 'View monthly revenue and commission breakdowns with interactive charts.' },
      { title: 'Booking Analytics', desc: 'Track booking trends and platform growth over time.' },
      { title: 'Monthly Summary', desc: 'Detailed table showing bookings, revenue, commission, and host earnings per month.' },
    ]
  },
]

export default function AdminDocumentation() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-0.5">
          <BookOpen size={16} className="text-brick" />
          <p className="text-xs font-semibold text-[#71717a] uppercase tracking-wider">Documentation</p>
        </div>
        <h2 className="font-display font-black text-xl sm:text-2xl text-[#1c1917]">Admin Guide</h2>
        <p className="text-sm text-[#71717a] mt-1">How to manage the SamanBhandar platform.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {sections.map((section, i) => (
          <div key={i} className="bg-white border border-border rounded-xl p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-chalk rounded-lg flex items-center justify-center">
                <section.icon size={18} className="text-[#1c1917]" />
              </div>
              <h3 className="font-display font-bold text-[#1c1917] text-sm">{section.title}</h3>
            </div>
            <div className="space-y-4">
              {section.steps.map((step, j) => (
                <div key={j} className="pl-4 border-l-2 border-chalk-dark hover:border-brick transition-colors">
                  <p className="text-sm font-semibold text-[#1c1917] mb-1">{step.title}</p>
                  <p className="text-xs text-[#71717a] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-brick-light border border-brick/15 rounded-xl p-5 animate-fade-in-up">
        <div className="flex items-start gap-3">
          <Star size={18} className="text-brick shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-brick mb-1">Need more help?</p>
            <p className="text-xs text-[#52525b] leading-relaxed">
              Refer to the project documentation or contact the development team for support.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}