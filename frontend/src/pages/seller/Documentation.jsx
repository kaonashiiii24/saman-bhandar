import { BookOpen, Search, Building2, Package, Truck, CreditCard, MessageSquare, Star, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'Getting Started',
    icon: BookOpen,
    steps: [
      { title: '1. Browse Storage Spaces', desc: 'Go to the Find Storage page and browse available spaces near you. Filter by location and search by name.' },
      { title: '2. Book a Space', desc: 'Select a listing, choose your start and end dates, and book. The host will review and approve your request.' },
      { title: '3. Make Payment', desc: 'Once approved, pay via eSewa or Khalti to activate your booking. A 10% platform fee applies.' },
      { title: '4. Add Inventory', desc: 'After booking is active, add your items to the inventory section linked to your booked space.' },
    ]
  },
  {
    title: 'Managing Inventory',
    icon: Package,
    steps: [
      { title: 'Add Items', desc: 'Click "Add Item" and fill in the name, category, quantity, and select which booked space it belongs to.' },
      { title: 'Track Stock', desc: 'View all your items in one place. Low stock items show a warning indicator.' },
      { title: 'Create Delivery', desc: 'Click "Request Delivery", select items to deliver, and set pickup/drop locations.' },
    ]
  },
  {
    title: 'Communication',
    icon: MessageSquare,
    steps: [
      { title: 'Direct Chat', desc: 'Chat directly with your host after booking. The chat opens automatically.' },
      { title: 'Group Chat', desc: 'When a courier accepts your delivery, a group chat with the host and courier is created automatically.' },
      { title: 'Real-time Messaging', desc: 'All chats are real-time with typing indicators, online status, and read receipts.' },
    ]
  },
  {
    title: 'Payments & Reviews',
    icon: CreditCard,
    steps: [
      { title: 'Payment Methods', desc: 'We support eSewa and Khalti. All transactions are processed securely.' },
      { title: 'Commission', desc: 'A 10% platform commission is charged on every booking. The host receives the remaining 90%.' },
      { title: 'Leave Reviews', desc: 'After a booking is completed, you can rate and review the host space.' },
    ]
  },
]

export default function SellerDocumentation() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-0.5">
          <BookOpen size={16} className="text-brick" />
          <p className="text-xs font-semibold text-[#71717a] uppercase tracking-wider">Documentation</p>
        </div>
        <h2 className="font-display font-black text-xl sm:text-2xl text-[#1c1917]">How to Use SamanBhandar</h2>
        <p className="text-sm text-[#71717a] mt-1">Everything you need to know as a Seller.</p>
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