import { useState, useEffect, useCallback } from 'react'
import { CalendarCheck, Search, Clock, CheckCircle2, AlertCircle, MapPin, X, Star, Package, ArrowRight } from 'lucide-react'
import { getMyBookings, cancelBooking } from '../../services/bookingService'
import { initiatePayment } from '../../services/paymentService'
import { checkCanReview, submitReview } from '../../services/reviewService'
import Loader from '../../components/common/Loader'
import AlertMessage from '../../components/common/AlertMessage'
import usePagination from '../../hooks/usePagination'
import Pagination from '../../components/common/Pagination'

const STATUS_MAP = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
  approved: { label: 'Approved', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
  active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  picking_up: { label: 'Picking Up', color: 'bg-purple-100 text-purple-700', icon: Package },
  in_transit: { label: 'In Transit', color: 'bg-orange-100 text-orange-700', icon: Package },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  completed: { label: 'Completed', color: 'bg-[#F4F4F5] text-[#71717a]', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-brick-light text-brick', icon: AlertCircle },
}

const PAGE_SIZE = 10

function StarPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" onClick={() => onChange(s)}
          className="focus:outline-none transition-transform hover:scale-110">
          <Star size={20} className={s <= value ? 'text-mustard fill-mustard' : 'text-border'} />
        </button>
      ))}
    </div>
  )
}

function ReviewModal({ booking, onSuccess, onClose }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) { setError('Please select a rating'); return }
    setLoading(true)
    setError('')
    try {
      await submitReview({ booking_id: booking.id, reviewee_id: booking.host_id, rating, comment: comment.trim() })
      onSuccess()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-fade-in-up">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <p className="font-display font-bold text-[#1c1917] text-sm">Leave a review</p>
            <p className="text-xs text-[#71717a] mt-0.5 truncate max-w-[260px]">{booking.listing_title}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-chalk transition-colors">
            <X size={16} className="text-[#71717a]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <AlertMessage type="error" message={error} />}
          <div>
            <p className="text-xs font-semibold text-[#1c1917] mb-2">Your rating</p>
            <StarPicker value={rating} onChange={setRating} />
            {rating > 0 && (
              <p className="text-xs text-[#71717a] mt-1">{['','Poor','Fair','Good','Very good','Excellent'][rating]}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-[#1c1917] block mb-1.5">
              Comment <span className="font-normal text-[#71717a]">(optional)</span>
            </label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} maxLength={500}
              placeholder="Describe your experience..."
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/6 resize-none transition-all" />
            <p className="text-[10px] text-[#71717a] text-right mt-0.5">{comment.length}/500</p>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold text-[#71717a] hover:bg-chalk transition-all hover:shadow-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-[#1c1917] hover:bg-brick text-white rounded-xl text-sm font-display font-bold transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60">
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function PaymentModal({ booking, onSuccess, onClose }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePayment = async (method) => {
    setLoading(true)
    setError('')
    try {
      await initiatePayment({ booking_id: booking.id, method })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl animate-fade-in-up">
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-bold text-[#1c1917] text-sm">Complete Payment</p>
              <p className="text-xs text-[#71717a] mt-0.5 truncate max-w-[220px]">{booking.listing_title}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-chalk transition-colors">
              <X size={16} className="text-[#71717a]" />
            </button>
          </div>
          <div className="mt-4 p-4 bg-chalk rounded-xl space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#71717a]">Amount</span>
              <span className="font-display font-black text-[#1c1917]">Rs {Number(booking.total_amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#71717a]">Platform fee (10%)</span>
              <span className="text-[#71717a]">Rs {Math.ceil(Number(booking.total_amount) * 0.1).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs pt-2 border-t border-border">
              <span className="text-[#71717a]">Host receives</span>
              <span className="text-emerald-600 font-semibold">Rs {Math.floor(Number(booking.total_amount) * 0.9).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="p-5 space-y-3">
          {error && <AlertMessage type="error" message={error} />}
          <p className="text-xs font-semibold text-[#1c1917]">Select payment method</p>
          <button
            onClick={() => handlePayment('esewa')}
            disabled={loading}
            className="w-full flex items-center justify-between p-4 border-2 border-border rounded-xl hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-700 font-black text-sm">e₹</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[#1c1917]">eSewa</p>
                <p className="text-[11px] text-[#71717a]">Pay with eSewa wallet</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-[#71717a] group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
          </button>
          <button
            onClick={() => handlePayment('khalti')}
            disabled={loading}
            className="w-full flex items-center justify-between p-4 border-2 border-border rounded-xl hover:border-purple-500 hover:bg-purple-50/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="text-purple-700 font-black text-sm">K</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[#1c1917]">Khalti</p>
                <p className="text-[11px] text-[#71717a]">Pay with Khalti digital wallet</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-[#71717a] group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
          </button>
          {loading && (
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="w-4 h-4 border-2 border-[#1c1917] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-[#71717a]">Processing payment...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [reviewBooking, setReviewBooking] = useState(null)
  const [reviewableIds, setReviewableIds] = useState(new Set())
  const [paymentBooking, setPaymentBooking] = useState(null)

  const fetchBookings = useCallback(async () => {
    try {
      const res = await getMyBookings()
      const data = res.data.data.bookings || []
      setBookings(data)
      const checks = await Promise.all(
        data.filter(b => b.status === 'completed').map(async b => {
          try { const r = await checkCanReview(b.id); return r.data?.data?.can_review ? b.id : null }
          catch { return null }
        })
      )
      setReviewableIds(new Set(checks.filter(Boolean)))
    } catch {
      setError('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await cancelBooking(id)
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
      setSuccessMsg('Booking cancelled')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch { setError('Failed to cancel booking') }
  }

  const handleReviewSuccess = () => {
    setReviewableIds(prev => { const n = new Set(prev); n.delete(reviewBooking.id); return n })
    setReviewBooking(null)
    setSuccessMsg('Review submitted — thank you!')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handlePaymentSuccess = () => {
    setBookings(bookings.map(b => b.id === paymentBooking.id ? { ...b, status: 'active' } : b))
    setPaymentBooking(null)
    setSuccessMsg('Payment successful! Your booking is now active.')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const filtered = bookings.filter(b => {
    const matchSearch = b.listing_title?.toLowerCase().includes(search.toLowerCase()) || b.location?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || b.status === filter
    return matchSearch && matchFilter
  })

  const { page, totalPages, paged, goTo, reset } = usePagination(filtered, PAGE_SIZE)

  const handleSearch = (e) => { setSearch(e.target.value); reset() }
  const handleFilter = (f) => { setFilter(f); reset() }

  if (loading) return <Loader />

  return (
    <div className="space-y-4 sm:space-y-5">
      {reviewBooking && (
        <ReviewModal booking={reviewBooking} onSuccess={handleReviewSuccess} onClose={() => setReviewBooking(null)} />
      )}
      {paymentBooking && (
        <PaymentModal booking={paymentBooking} onSuccess={handlePaymentSuccess} onClose={() => setPaymentBooking(null)} />
      )}

      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
      {successMsg && <AlertMessage type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}

      <div className="flex flex-col gap-3">
        <div className="relative group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] group-focus-within:text-[#1c1917] transition-colors" />
          <input 
            type="text" 
            placeholder="Search bookings..." 
            value={search} 
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg bg-white text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/10 transition-all" 
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {['all', 'pending', 'approved', 'active', 'completed', 'cancelled'].map(f => (
            <button 
              key={f} 
              onClick={() => handleFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all duration-300 shrink-0 ${
                filter === f 
                  ? 'bg-[#1c1917] text-white shadow-md scale-105' 
                  : 'bg-white border border-border text-[#71717a] hover:border-[#1c1917] hover:shadow-sm hover:-translate-y-0.5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white border border-border rounded-xl p-10 sm:p-14 text-center animate-fade-in">
            <CalendarCheck size={36} className="text-border mx-auto mb-3" />
            <p className="font-display font-bold text-[#1c1917] text-sm mb-1">No bookings found</p>
            <p className="text-[#71717a] text-xs">Try adjusting your search or filter</p>
          </div>
        )}
        {paged.map((b, i) => {
          const s = STATUS_MAP[b.status] || STATUS_MAP.pending
          const Icon = s.icon
          const canReview = reviewableIds.has(b.id)
          return (
            <div 
              key={b.id} 
              className="bg-white border border-border rounded-xl p-4 sm:p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-chalk to-chalk-dark flex items-center justify-center shrink-0">
                    <Package size={15} className="text-[#1c1917]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="font-display font-bold text-[#1c1917] text-sm truncate max-w-[200px] sm:max-w-none">{b.listing_title}</p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${s.color}`}>
                        <Icon size={9} /> {s.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#71717a]">
                      <MapPin size={10} /> {b.location || b.listing_location}
                    </div>
                    <p className="text-xs text-[#71717a] mt-0.5">{b.start_date} → {b.end_date}</p>
                    {b.host_name && (
                      <p className="text-xs text-[#71717a] mt-0.5">Host: {b.host_name}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0 pl-12 sm:pl-0">
                  <p className="font-display font-black text-[#1c1917]">Rs {Number(b.total_amount).toLocaleString()}</p>
                  <div className="flex items-center gap-2">
                    {b.status === 'approved' && (
                      <button 
                        onClick={() => setPaymentBooking(b)}
                        className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline font-semibold"
                      >
                        <CheckCircle2 size={11} /> Pay Now
                      </button>
                    )}
                    {b.status === 'active' && (
                      <button 
                        onClick={() => handleCancel(b.id)}
                        className="inline-flex items-center gap-1 text-xs text-brick hover:underline font-semibold transition-all hover:text-red-700"
                      >
                        <X size={11} /> Cancel
                      </button>
                    )}
                    {canReview && (
                      <button 
                        onClick={() => setReviewBooking(b)}
                        className="inline-flex items-center gap-1 text-xs text-amber-600 hover:underline font-semibold transition-all hover:text-amber-700"
                      >
                        <Star size={11} /> Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={goTo} className="pt-2" />
      )}
    </div>
  )
}