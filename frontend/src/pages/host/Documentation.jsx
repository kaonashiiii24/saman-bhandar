import { BookOpen, Building2, CalendarCheck, DollarSign, MessageSquare, Star, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'Getting Started',
    icon: BookOpen,
    steps: [
      { title: '1. Create Your First Listing', desc: 'Click "Add Listing" and fill in the details — title, location, size, price per month, and upload a photo.' },
      { title: '2. Get Verified', desc: 'Our team reviews all host accounts. Once approved, your listings go live on the platform.' },
      { title: '3. Set Your Price', desc: 'Price your space per month. You receive 90% of the booking amount after the 10% platform commission.' },
    ]
  },
  {
    title: 'Managing Listings',
    icon: Building2,
    steps: [
      { title: 'Edit or Deactivate', desc: 'You can edit listing details anytime. Deactivate listings to temporarily hide them from browse.' },
      { title: 'View Bookings', desc: 'See all booking requests in the Bookings section. Approve or reject each one.' },
      { title: 'Delete Listings', desc: 'You can only delete listings that have no active bookings. This protects sellers with ongoing storage.' },
    ]
  },
  {
    title: 'Bookings & Earnings',
    icon: DollarSign,
    steps: [
      { title: 'Approve Bookings', desc: 'Review booking requests and approve them. The seller can then pay to activate the booking.' },
      { title: 'Track Revenue', desc: 'View your earnings dashboard for real-time revenue tracking and transaction history.' },
      { title: 'View Stored Items', desc: 'Click "View stored items" on any booking to see what inventory the seller has in your space.' },
    ]
  },
  {
    title: 'Communication',
    icon: MessageSquare,
    steps: [
      { title: 'Chat with Sellers', desc: 'Direct chat opens automatically when a seller books your space.' },
      { title: 'Group Chat', desc: 'When a courier accepts a delivery from your space, a three-way group chat is created.' },
      { title: 'Real-time Updates', desc: 'All messages are instant with typing indicators and online status.' },
    ]
  },
]

export default function HostDocumentation() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-0.5">
          <BookOpen size={16} className="text-brick" />
          <p className="text-xs font-semibold text-[#71717a] uppercase tracking-wider">Documentation</p>
        </div>
        <h2 className="font-display font-black text-xl sm:text-2xl text-[#1c1917]">How to Use SamanBhandar</h2>
        <p className="text-sm text-[#71717a] mt-1">Everything you need to know as a Host.</p>
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
              Contact our support team at hello@samanbhandar.com or visit the <Link to="/contact" className="text-brick font-semibold hover:underline">Contact page</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}