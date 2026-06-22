import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, Clock, User, CalendarCheck, Package, ChevronDown, ChevronUp } from 'lucide-react'
import { getHostBookings, updateBookingStatus } from '../../services/bookingService'
import { getListingItems } from '../../services/listingService'
import Loader from '../../components/common/Loader'
import AlertMessage from '../../components/common/AlertMessage'

const STATUS_MAP = {
  active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700' },
  approved: { label: 'Approved', color: 'bg-blue-100 text-blue-700' },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  completed: { label: 'Completed', color: 'bg-[#F4F4F5] text-[#71717a]' },
  cancelled: { label: 'Cancelled', color: 'bg-brick-light text-brick' },
  picking_up: { label: 'Pickup', color: 'bg-blue-100 text-blue-700' },
  in_transit: { label: 'In Transit', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700' },
}

export default function ManageBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [expandedBooking, setExpandedBooking] = useState(null)
  const [bookingItems, setBookingItems] = useState({})
  const [itemsLoading, setItemsLoading] = useState({})

  useEffect(() => {
    getHostBookings()
      .then(res => setBookings(res.data.data.bookings || []))
      .catch(() => setError('Failed to load bookings'))
      .finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id) => {
    try {
      await updateBookingStatus(id, 'approved')
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'approved' } : b))
    } catch { setError('Failed to approve') }
  }

  const handleReject = async (id) => {
    try {
      await updateBookingStatus(id, 'cancelled')
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
    } catch { setError('Failed to reject') }
  }

  const toggleItems = async (booking) => {
    if (expandedBooking === booking.id) {
      setExpandedBooking(null)
      return
    }
    
    setExpandedBooking(booking.id)
    
    if (!bookingItems[booking.id]) {
      setItemsLoading(prev => ({ ...prev, [booking.id]: true }))
      try {
        const res = await getListingItems(booking.listing_id)
        setBookingItems(prev => ({ ...prev, [booking.id]: res.data.data.items || [] }))
      } catch {
        setBookingItems(prev => ({ ...prev, [booking.id]: [] }))
      } finally {
        setItemsLoading(prev => ({ ...prev, [booking.id]: false }))
      }
    }
  }

  const filtered = bookings.filter(b => filter === 'all' || b.status === filter)

  if (loading) return <Loader />

  return (
    <div className="space-y-4 sm:space-y-5">
      {error && <AlertMessage type="error" message={error} />}

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {['all', 'pending', 'approved', 'completed', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all shrink-0 ${filter === f ? 'bg-[#1c1917] text-white' : 'bg-white border border-border text-[#71717a] hover:border-[#1c1917]'}`}>
            {f} {f !== 'all' && bookings.filter(b => b.status === f).length > 0 && `(${bookings.filter(b => b.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white border border-border rounded-xl p-10 sm:p-14 text-center">
            <CalendarCheck size={32} className="text-border mx-auto mb-3" />
            <p className="font-display font-bold text-[#1c1917] text-sm mb-1">No bookings found</p>
            <p className="text-[#71717a] text-xs">Try a different filter</p>
          </div>
        )}
        {filtered.map((b, i) => {
          const s = STATUS_MAP[b.status] || STATUS_MAP.pending
          const isExpanded = expandedBooking === b.id
          const items = bookingItems[b.id] || []
          const isLoading = itemsLoading[b.id]
          
          return (
            <div key={b.id} className="bg-white border border-border rounded-xl hover:shadow-xs transition-all duration-200 animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}>
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-chalk flex items-center justify-center shrink-0">
                      <User size={15} className="text-[#1c1917]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="font-display font-bold text-[#1c1917] text-sm">{b.seller_name}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                      </div>
                      <p className="text-xs text-[#71717a]">{b.listing_title}</p>
                      <p className="text-xs text-[#71717a] mt-0.5">{b.start_date} → {b.end_date}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0 pl-12 sm:pl-0">
                    <p className="font-display font-black text-[#1c1917]">Rs {Number(b.total_amount).toLocaleString()}</p>
                    {b.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(b.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                          <CheckCircle2 size={12} /> Approve
                        </button>
                        <button onClick={() => handleReject(b.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brick hover:bg-brick-light px-3 py-1.5 rounded-lg transition-colors">
                          <XCircle size={12} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {(b.status === 'active' || b.status === 'approved') && (
                  <button onClick={() => toggleItems(b)}
                    className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#71717a] hover:text-[#1c1917] transition-colors">
                    <Package size={12} />
                    {isExpanded ? 'Hide stored items' : 'View stored items'}
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                )}
              </div>
              
              {isExpanded && (
                <div className="border-t border-border px-4 sm:px-5 py-3 bg-chalk rounded-b-xl">
                  {isLoading ? (
                    <p className="text-xs text-[#71717a] py-2">Loading items...</p>
                  ) : items.length === 0 ? (
                    <p className="text-xs text-[#71717a] py-2">No items stored yet by the seller.</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-[#1c1917]">{items.length} item{items.length !== 1 ? 's' : ''} stored</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {items.map(item => (
                          <div key={item.id} className="flex items-center gap-2 bg-white border border-border rounded-lg p-2.5">
                            <Package size={13} className="text-[#1c1917] shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-[#1c1917] truncate">{item.name}</p>
                              <p className="text-[10px] text-[#71717a]">Qty: {item.quantity} · {item.category || 'N/A'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}