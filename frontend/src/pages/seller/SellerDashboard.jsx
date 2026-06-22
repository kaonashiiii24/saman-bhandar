import { useState, useEffect, useRef } from 'react'
import { Package, CalendarCheck, CreditCard, TrendingUp, ArrowRight, Clock, CheckCircle2, AlertCircle, Plus, Warehouse } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/common/StatCard'
import { useAuth } from '../../hooks/useAuth'
import { getMyBookings } from '../../services/bookingService'
import { getInventory } from '../../services/inventoryService'
import { getMyPayments } from '../../services/paymentService'

function useInView(threshold = 0.1) {
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

const STATUS_MAP = {
  active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
  completed: { label: 'Completed', color: 'bg-[#F4F4F5] text-[#71717a]', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-brick-light text-brick', icon: AlertCircle },
}

export default function SellerDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [inventory, setInventory] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [headerRef, headerVisible] = useInView(0.1)

  useEffect(() => {
    Promise.all([getMyBookings(), getInventory(), getMyPayments()])
      .then(([b, i, p]) => {
        setBookings(b.data.data.bookings || [])
        setInventory(i.data.data.items || [])
        setPayments(p.data.data.payments || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const totalSpent = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0)
  const activeBookings = bookings.filter(b => b.status === 'active').length

  return (
    <div className="space-y-5 sm:space-y-6">
      <div ref={headerRef} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-500 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <p className="text-xs font-semibold text-[#71717a] uppercase tracking-wider">{greeting()}</p>
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#1c1917] mt-0.5">{user?.full_name || 'Seller'} </h2>
          <p className="text-xs text-[#71717a] mt-1 hidden sm:block">Here's what's happening with your storage today.</p>
        </div>
        <Link to="/listings" className="inline-flex items-center gap-2 bg-[#1c1917] hover:bg-brick text-white font-display font-bold px-4 py-2.5 rounded-lg transition-colors text-sm shrink-0 self-start sm:self-auto">
          <Plus size={15} /> Find Storage
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Active Bookings" value={loading ? '—' : activeBookings} icon={CalendarCheck} change="Current" color="blue" delay={0} />
        <StatCard label="Total Items" value={loading ? '—' : inventory.length} icon={Package} change="In storage" color="green" delay={60} />
        <StatCard label="Total Spent" value={loading ? '—' : `Rs ${totalSpent.toLocaleString()}`} icon={CreditCard} change="All time" color="orange" delay={120} />
        <StatCard label="Transactions" value={loading ? '—' : payments.length} icon={TrendingUp} change="All time" color="purple" delay={180} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
        <div className="xl:col-span-2 bg-white border border-border rounded-xl overflow-hidden animate-fade-in-up">
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-border">
            <h3 className="font-display font-bold text-[#1c1917] text-sm">Recent Bookings</h3>
            <Link to="/seller/bookings" className="text-xs font-semibold text-brick hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {bookings.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Warehouse size={32} className="text-border mx-auto mb-3" />
              <p className="font-display font-bold text-[#1c1917] text-sm mb-1">No bookings yet</p>
              <p className="text-[#71717a] text-xs mb-3">Find a storage space to get started</p>
              <Link to="/listings" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brick hover:underline">
                Browse storage <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {bookings.slice(0, 5).map((b, i) => {
                const s = STATUS_MAP[b.status] || STATUS_MAP.pending
                const Icon = s.icon
                return (
                  <div key={b.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 hover:bg-chalk transition-colors animate-fade-in-up"
                    style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}>
                    <div className="w-8 h-8 rounded-lg bg-chalk flex items-center justify-center shrink-0">
                      <CalendarCheck size={14} className="text-[#1c1917]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1c1917] truncate">{b.listing_title}</p>
                      <p className="text-xs text-[#71717a] truncate mt-0.5 hidden sm:block">{b.location} · {b.start_date}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-[#1c1917]">Rs {Number(b.total_amount).toLocaleString()}</p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${s.color}`}>
                        <Icon size={9} /> {s.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <div className="bg-white border border-border rounded-xl p-4 sm:p-5">
            <h3 className="font-display font-bold text-[#1c1917] text-sm mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Browse Storage', desc: 'Find warehouse space', to: '/listings', icon: Warehouse },
                { label: 'Add Inventory', desc: 'Track stored items', to: '/seller/inventory', icon: Package },
                { label: 'View Payments', desc: 'Billing history', to: '/seller/payments', icon: CreditCard },
              ].map(a => (
                <Link key={a.to} to={a.to}
                  className="flex items-center gap-3 p-3 bg-chalk rounded-lg hover:bg-chalk-dark transition-colors group">
                  <div className="w-7 h-7 rounded-md bg-white border border-border flex items-center justify-center shrink-0 group-hover:border-[#1c1917] transition-colors">
                    <a.icon size={13} className="text-[#1c1917]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1c1917] leading-none">{a.label}</p>
                    <p className="text-xs text-[#71717a] mt-0.5 hidden sm:block">{a.desc}</p>
                  </div>
                  <ArrowRight size={13} className="text-[#71717a] group-hover:text-brick group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-brick-light border border-brick/15 rounded-xl p-4">
            <p className="text-xs font-bold text-brick mb-1">💡 Pro Tip</p>
            <p className="text-xs text-[#3a3a3a] leading-relaxed">Book storage for 3+ months to get up to 20% off on most listings.</p>
          </div>
        </div>
      </div>
    </div>
  )
}