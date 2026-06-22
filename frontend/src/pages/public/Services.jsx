import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Warehouse, Package, Truck, CreditCard, MessageSquare, Star, Check, ArrowRight } from 'lucide-react'
import CTABanner from '../../components/common/CTABanner'
import api from '../../services/api'

function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect() }
    }, { threshold })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView]
}

function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
  const [ref, inView] = useInView()
  
  const directionClasses = {
    up: inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
    left: inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8',
    right: inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8',
    scale: inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
  }
  
  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ease-out ${directionClasses[direction]} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const SERVICES = [
  {
    icon: Warehouse,
    title: 'Short-term Storage',
    desc: 'From a few days to several months. Flexible booking with no lock-in contracts. Ideal for home moves, shop overflow and seasonal stock.',
    tags: ['Flexible duration', 'Any size', 'Verified hosts'],
  },
  {
    icon: Package,
    title: 'Inventory Management',
    desc: 'Track your stored goods item by item from your seller dashboard. Add, update or remove inventory records anytime from any device.',
    tags: ['Real-time', 'Item tracking', 'Export ready'],
  },
  {
    icon: Truck,
    title: 'Courier Pickup & Drop-off',
    desc: 'Book a courier to collect from your address and deliver to your storage unit — or the reverse. Fast turnarounds across the valley.',
    tags: ['Same-day', 'GPS tracked', 'Insured'],
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    desc: 'Pay via eSewa or Khalti. All transactions are encrypted. Hosts receive payouts weekly — no manual chasing required.',
    tags: ['eSewa', 'Khalti', 'Weekly payouts'],
  },
  {
    icon: MessageSquare,
    title: 'In-app Messaging',
    desc: 'Chat directly with your host or courier before and during your booking. No personal numbers shared — stay in the platform.',
    tags: ['Real-time', 'Secure', 'Archived'],
  },
  {
    icon: Star,
    title: 'Reviews & Trust',
    desc: 'Every completed booking can receive a review. Transparent ratings keep the platform honest and help you choose with confidence.',
    tags: ['Verified reviews', 'Two-way', 'Public profiles'],
  },
]

const PLANS = [
  {
    name: 'Seller',
    price: 'Free',
    note: 'to browse and book',
    features: ['Browse all listings', 'Book storage spaces', 'Request courier pickup', 'In-app messaging', 'Pay via eSewa / Khalti'],
    cta: 'Start for free',
    to: '/register',
    highlight: false,
  },
  {
    name: 'Host',
    price: '10%',
    note: 'commission per booking',
    features: ['List unlimited spaces', 'Manage booking requests', 'Earnings dashboard', 'In-app messaging', 'Weekly payouts'],
    cta: 'List your space',
    to: '/register?role=host',
    highlight: true,
  },
  {
    name: 'Courier',
    price: 'Free',
    note: 'to join, earn per job',
    features: ['Browse available jobs', 'Accept pickups nearby', 'Track active deliveries', 'Transparent earnings', 'Weekly payment'],
    cta: 'Become a courier',
    to: '/register?role=courier',
    highlight: false,
  },
]

export default function Services() {
  const [heroVisible, setHeroVisible] = useState(false)
  const [publicStats, setPublicStats] = useState(null)

  useEffect(() => { setTimeout(() => setHeroVisible(true), 80) }, [])

  useEffect(() => {
    api.get('/admin/public-stats')
      .then(res => setPublicStats(res.data.data))
      .catch(() => {})
  }, [])

  const WHY = [
    { num: `${publicStats?.total_sellers || 0}+`, label: 'Active sellers', sub: 'across Nepal' },
    { num: `${publicStats?.total_hosts || 0}+`, label: 'Verified hosts', sub: 'manually checked' },
    { num: `${publicStats?.total_cities || 0}+`, label: 'Locations covered', sub: 'and growing' },
    { num: '4.8★', label: 'Average rating', sub: 'from reviews' },
  ]

  return (
    <div className="bg-[#FAFAF9] overflow-x-hidden">

      <section className="relative bg-[#1c1917] border-b border-white/10 py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brick/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />
        </div>
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`max-w-2xl transition-all duration-700 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-white/80 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brick opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brick" />
              </span>
              What we offer
            </div>
            <h1 className="font-display font-black text-5xl sm:text-6xl text-white tracking-tight leading-[1.08] mb-5">
              Everything you need to store and move goods in Nepal.
            </h1>
            <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-xl">
              SamanBhandar connects renters, hosts and couriers on one platform — with tools built specifically for each role.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="inline-flex items-center gap-2 bg-brick hover:bg-brick-dark text-white font-display font-bold px-5 py-3 rounded-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-sm group">
                Get started free <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/listings" className="inline-flex items-center gap-2 border border-white/20 text-white font-display font-bold px-5 py-3 rounded-md hover:bg-white/8 transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm">
                Browse storage
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-border py-8">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY.map((w, i) => (
              <Reveal key={i} delay={i * 100} direction="scale">
                <div className="text-center lg:text-left group cursor-default">
                  <p className="font-display font-black text-3xl text-[#1c1917] group-hover:text-brick transition-colors duration-300">{w.num}</p>
                  <p className="text-sm font-semibold text-[#3a3a3a] mt-0.5">{w.label}</p>
                  <p className="text-xs text-[#71717a] mt-0.5">{w.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#FAFAF9]">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-14" direction="up">
            <p className="text-xs font-bold text-brick uppercase tracking-widest mb-3">Our services</p>
            <h2 className="font-display font-black text-4xl text-[#1c1917] tracking-tight max-w-lg leading-tight">
              Six tools. One platform. Zero hassle.
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={i * 80} direction="scale">
                <div className="group bg-white border border-border rounded-xl p-6 h-full flex flex-col hover:border-[#3a3a3a] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 bg-[#F4F4F5] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#1c1917] group-hover:scale-110 transition-all duration-300">
                    <s.icon size={18} className="text-[#3a3a3a] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-display font-bold text-[#1c1917] mb-2">{s.title}</h3>
                  <p className="text-[#71717a] text-sm leading-relaxed flex-1 mb-4">{s.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {s.tags.map((t) => (
                      <span key={t} className="text-[10px] font-semibold px-2.5 py-1 bg-[#F4F4F5] text-[#52525b] rounded-full group-hover:bg-brick-light group-hover:text-brick transition-colors duration-300">{t}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-y border-border">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-14" direction="up">
            <p className="text-xs font-bold text-brick uppercase tracking-widest mb-3">Built for everyone</p>
            <h2 className="font-display font-black text-4xl text-[#1c1917] tracking-tight leading-tight">
              One platform. Three roles.
            </h2>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                role: 'Seller',
                color: 'bg-brick-light',
                text: 'text-brick',
                border: 'border-brick/20',
                steps: ['Register as a seller', 'Browse listings near you', 'Book a storage space', 'Manage inventory from dashboard', 'Request courier pickups'],
              },
              {
                role: 'Host',
                color: 'bg-amber-50',
                text: 'text-amber-700',
                border: 'border-amber-200',
                steps: ['Register as a host', 'List your space with photos', 'Get verified by our team', 'Accept booking requests', 'Earn weekly payouts'],
              },
              {
                role: 'Courier',
                color: 'bg-emerald-50',
                text: 'text-emerald-700',
                border: 'border-emerald-200',
                steps: ['Register as a courier', 'Get verified by our team', 'Browse available jobs nearby', 'Accept and complete deliveries', 'Earn per job, paid weekly'],
              },
            ].map((r, i) => (
              <Reveal key={i} delay={i * 100} direction="up">
                <div className={`border ${r.border} rounded-xl p-6 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
                  <div className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 ${r.color} ${r.text}`}>
                    {r.role}
                  </div>
                  <ul className="space-y-3">
                    {r.steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-3 group/item">
                        <div className="w-5 h-5 rounded-full bg-[#F4F4F5] flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-[#1c1917] transition-colors duration-300">
                          <span className="text-[10px] font-bold text-[#52525b] group-hover/item:text-white transition-colors duration-300">{j + 1}</span>
                        </div>
                        <span className="text-sm text-[#3a3a3a] leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className="inline-flex items-center gap-2 mt-6 text-sm font-bold text-[#1c1917] hover:text-brick transition-colors group/link">
                    Get started <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#FAFAF9]">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-14" direction="up">
            <p className="text-xs font-bold text-brick uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="font-display font-black text-4xl text-[#1c1917] tracking-tight leading-tight">
              Simple. Transparent. No surprises.
            </h2>
            <p className="text-[#71717a] text-base mt-3 max-w-lg leading-relaxed">
              No monthly subscriptions. No hidden fees. You only pay when you use the platform.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-5 items-start">
            {PLANS.map((p, i) => (
              <Reveal key={i} delay={i * 100} direction="scale">
                <div className={`relative rounded-xl border p-7 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                  p.highlight
                    ? 'bg-[#1c1917] border-brick shadow-lg'
                    : 'bg-white border-border hover:border-[#3a3a3a]'
                }`}>
                  {p.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brick text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap animate-pulse">
                      Most popular
                    </div>
                  )}

                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${p.highlight ? 'text-white/40' : 'text-[#71717a]'}`}>{p.name}</p>
                    <p className={`font-mono font-bold text-5xl leading-none mb-1 ${p.highlight ? 'text-white' : 'text-[#1c1917]'}`}>{p.price}</p>
                    <p className={`text-xs mt-1 ${p.highlight ? 'text-white/40' : 'text-[#71717a]'}`}>{p.note}</p>
                  </div>

                  <div className={`h-px ${p.highlight ? 'bg-white/10' : 'bg-border'}`} />

                  <ul className="space-y-3 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 group/item">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-300 ${p.highlight ? 'bg-brick/30 group-hover/item:bg-brick/50' : 'bg-brick-light group-hover/item:bg-brick/30'}`}>
                          <Check size={9} className="text-brick" />
                        </div>
                        <span className={`text-sm leading-relaxed ${p.highlight ? 'text-white/70' : 'text-[#3a3a3a]'}`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={p.to}
                    className={`flex items-center justify-center gap-2 py-3 rounded-md text-sm font-display font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${
                      p.highlight
                        ? 'bg-brick hover:bg-brick-dark text-white'
                        : 'bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#1c1917]'
                    }`}>
                    {p.cta} <ArrowRight size={14} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CTABanner />

    </div>
  )
}