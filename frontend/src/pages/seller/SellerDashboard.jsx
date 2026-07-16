import { useState, useEffect, useRef } from 'react'
import { Package, CalendarCheck, CreditCard, TrendingUp, ArrowRight, Clock, CheckCircle2, AlertCircle, Plus, Warehouse, BookOpen, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/common/StatCard'
import { useAuth } from '../../hooks/useAuth'
import { getMyBookings } from '../../services/bookingService'
import { getInventory, createItem } from '../../services/inventoryService'
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

  const [showAddItem, setShowAddItem] = useState(false)
  const [addItemForm, setAddItemForm] = useState({
    name: '',
    category: '',
    quantity: 1,
    booking_id: ''
  })
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    Promise.all([getMyBookings(), getInventory(), getMyPayments()])
      .then(([b, i, p]) => {
        setBookings(b?.data?.data?.bookings || b?.data?.bookings || b || [])
        setInventory(i?.data?.data?.items || i?.data?.items || i || [])
        setPayments(p?.data?.data?.payments || p?.data?.payments || p || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalSpent = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0)
  const activeBookings = bookings.filter(b => b.status === 'active').length

  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!addItemForm.name || addItemForm.quantity < 1) {
      alert('Please enter a valid name and quantity')
      return
    }
    setAdding(true)
    try {
      await createItem({
        name: addItemForm.name,
        category: addItemForm.category,
        quantity: addItemForm.quantity,
        booking_id: addItemForm.booking_id || null
      })
      setShowAddItem(false)
      setAddItemForm({ name: '', category: '', quantity: 1, booking_id: '' })
      const iRes = await getInventory()
      setInventory(iRes?.data?.data?.items || iRes?.data?.items || [])
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add item')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div ref={headerRef} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-500 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#1c1917]">Hello {user?.full_name || 'Seller'}</h2>
          <p className="text-xs text-[#71717a] mt-1 hidden sm:block">Here's what's happening with your storage today.</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowAddItem(true)}
            className="inline-flex items-center gap-2 bg-[#1c1917] hover:bg-brick text-white font-display font-bold px-4 py-2.5 rounded-lg transition-colors text-sm shrink-0"
          >
            <Plus size={15} /> Add Item
          </button>
          <Link to="/listings" className="inline-flex items-center gap-2 border border-border bg-white hover:bg-chalk text-[#1c1917] font-display font-bold px-4 py-2.5 rounded-lg transition-colors text-sm shrink-0">
            <Plus size={15} /> Find Storage
          </Link>
        </div>
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
              <p className="text-[#71717a] text-xs mb-4">Find a storage space to get started</p>
              <Link to="/listings" className="inline-flex items-center gap-2 bg-[#1c1917] hover:bg-brick text-white font-display font-bold px-5 py-2.5 rounded-lg transition-colors text-sm">
                <Plus size={15} /> Book a Space Now
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

          <div className="bg-white border border-border rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={15} className="text-[#71717a]" />
              <h3 className="font-display font-bold text-[#1c1917] text-sm">Getting Started</h3>
            </div>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Browse and book a storage space near you' },
                { step: '2', text: 'Add your inventory items to track them' },
                { step: '3', text: 'Create delivery requests when ready' },
                { step: '4', text: 'Chat with hosts and couriers in real-time' },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-chalk flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-[#71717a]">{s.step}</span>
                  </div>
                  <p className="text-xs text-[#52525b] leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-[#1c1917] text-lg">Add Inventory Item</h3>
              <button onClick={() => setShowAddItem(false)} className="p-1.5 rounded-lg hover:bg-chalk text-[#71717a]"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Item Name *</label>
                <input type="text" placeholder="e.g. Handmade pottery" value={addItemForm.name}
                  onChange={e => setAddItemForm({ ...addItemForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:bg-white transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Category</label>
                  <input type="text" placeholder="e.g. Crafts" value={addItemForm.category}
                    onChange={e => setAddItemForm({ ...addItemForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Quantity *</label>
                  <input type="number" min="1" value={addItemForm.quantity}
                    onChange={e => setAddItemForm({ ...addItemForm, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:bg-white transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Storage Space (optional)</label>
                <select value={addItemForm.booking_id} onChange={e => setAddItemForm({ ...addItemForm, booking_id: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] outline-none focus:border-[#1c1917] focus:bg-white transition-all">
                  <option value="">No specific space</option>
                  {bookings.filter(b => b.status === 'active' || b.status === 'approved').map(b => (
                    <option key={b.id} value={b.id}>{b.listing_title} — {b.listing_location}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={adding}
                  className="flex-1 bg-[#1c1917] hover:bg-brick text-white font-display font-bold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60">
                  {adding ? 'Adding...' : 'Add Item'}
                </button>
                <button type="button" onClick={() => setShowAddItem(false)}
                  className="px-4 py-2.5 border border-border text-[#71717a] font-semibold rounded-lg text-sm hover:bg-chalk transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}