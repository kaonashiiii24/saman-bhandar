import { BookOpen, Briefcase, Truck, DollarSign, MessageSquare, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'Getting Started',
    icon: BookOpen,
    steps: [
      { title: '1. Get Verified', desc: 'Register as a courier and wait for admin approval. Once approved, you can start accepting jobs.' },
      { title: '2. Browse Jobs', desc: 'Go to Available Jobs to see all delivery requests from sellers. Each shows pickup and drop locations.' },
      { title: '3. Accept a Job', desc: 'Click "Accept Job" on any delivery request. It becomes exclusively yours and disappears for other couriers.' },
    ]
  },
  {
    title: 'Active Deliveries',
    icon: Truck,
    steps: [
      { title: 'Update Status', desc: 'Mark deliveries as "Picked Up", "In Transit", and "Delivered" as you progress through each stage.' },
      { title: 'Cancel if Needed', desc: 'You can cancel an accepted job if you cannot complete it. It will reappear for other couriers.' },
      { title: 'Completion', desc: 'When you mark a delivery as completed, the seller inventory updates automatically.' },
    ]
  },
  {
    title: 'Communication',
    icon: MessageSquare,
    steps: [
      { title: 'Group Chat', desc: 'When you accept a delivery, a group chat with the seller and host is created automatically.' },
      { title: 'Coordinate Pickups', desc: 'Use the chat to coordinate pickup times and any special instructions with the seller.' },
      { title: 'Real-time Messaging', desc: 'All chats are instant with typing indicators and online status for all members.' },
    ]
  },
  {
    title: 'Earnings',
    icon: DollarSign,
    steps: [
      { title: 'Per Job Payment', desc: 'You earn per completed delivery. Check your earnings in the dashboard.' },
      { title: 'Build Reputation', desc: 'Complete jobs quickly and maintain good communication to build your reputation.' },
    ]
  },
]

export default function CourierDocumentation() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-0.5">
          <BookOpen size={16} className="text-brick" />
          <p className="text-xs font-semibold text-[#71717a] uppercase tracking-wider">Documentation</p>
        </div>
        <h2 className="font-display font-black text-xl sm:text-2xl text-[#1c1917]">How to Use SamanBhandar</h2>
        <p className="text-sm text-[#71717a] mt-1">Everything you need to know as a Courier.</p>
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