import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Package, Shield, Clock, ArrowLeft, CheckCircle2, Star, Share2 } from 'lucide-react'
import { getListing } from '../../services/listingService'
import { createBooking } from '../../services/bookingService'
import { getListingReviews } from '../../services/reviewService'
import { useAuth } from '../../hooks/useAuth'
import Loader from '../../components/common/Loader'
import AlertMessage from '../../components/common/AlertMessage'
import ReviewList from '../../components/common/ReviewList'

export default function ListingDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState({ start_date: '', end_date: '' })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    getListing(id)
      .then(res => { setListing(res.data.data.listing); setTimeout(() => setVisible(true), 80) })
      .catch(() => setError('Listing not found'))
      .finally(() => setLoading(false))
    
    getListingReviews(id)
      .then(res => setReviews(res.data.data.reviews || []))
      .catch(() => {})
  }, [id])

  const handleBook = async () => {
    if (!user) { navigate('/login'); return }
    if (!booking.start_date || !booking.end_date) { setError('Please select dates'); return }
    setBookingLoading(true)
    try {
      await createBooking({ listing_id: id, ...booking })
      setSuccess('Booking created! Waiting for host approval.')
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed')
    } finally { setBookingLoading(false) }
  }

  const days = booking.start_date && booking.end_date
    ? Math.ceil((new Date(booking.end_date) - new Date(booking.start_date)) / (1000 * 60 * 60 * 24))
    : 0
  const estimatedCost = listing && days > 0 ? Math.ceil((listing.price_per_month / 30) * days) : 0

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]"><Loader /></div>
  if (!listing) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] px-4">
      <div className="text-center">
        <Package size={40} className="text-border mx-auto mb-3" />
        <p className="font-display font-bold text-[#1c1917] mb-1">Listing not found</p>
        <Link to="/listings" className="text-brick font-semibold hover:underline text-sm">Back to listings</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link to="/listings" className="inline-flex items-center gap-2 text-sm text-[#71717a] hover:text-brick transition-colors">
            <ArrowLeft size={15} /> <span className="hidden sm:inline">Back to listings</span><span className="sm:hidden">Back</span>
          </Link>
          <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#71717a] hover:text-[#1c1917] transition-colors">
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>

      <div className={`max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {error && <div className="mb-4"><AlertMessage type="error" message={error} /></div>}
        {success && <div className="mb-4"><AlertMessage type="success" message={success} /></div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div className="h-48 sm:h-64 bg-chalk border border-border rounded-xl flex items-center justify-center overflow-hidden relative">
              {listing.image_url ? (
                <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-chalk to-chalk-dark" />
                  <Package size={56} className="text-border relative z-10" />
                </>
              )}
            </div>

            <div className="bg-white border border-border rounded-xl p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div>
                  <h1 className="font-display font-black text-xl sm:text-2xl text-[#1c1917] tracking-tight">{listing.title}</h1>
                  <div className="flex items-center gap-1 text-sm text-[#71717a] mt-1">
                    <MapPin size={13} /> {listing.location}
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-chalk px-3 py-1.5 rounded-lg shrink-0">
                  <Star size={13} className="fill-mustard text-mustard" />
                  <span className="text-sm font-bold text-[#1c1917]">{Number(listing.avg_rating || 0).toFixed(1)}</span>
                  <span className="text-xs text-[#71717a]">({listing.review_count || 0})</span>
                </div>
              </div>
              <p className="text-sm text-[#71717a] leading-relaxed">{listing.description || 'A verified storage space available for rent. Contact the host for more details.'}</p>
            </div>

            <div className="bg-white border border-border rounded-xl p-5 sm:p-6">
              <h2 className="font-display font-bold text-[#1c1917] mb-4">Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Size', value: listing.size || 'N/A', icon: Package },
                  { label: 'Location', value: listing.location, icon: MapPin },
                  { label: 'Host', value: listing.host_name, icon: Shield },
                  { label: 'Available', value: 'Now', icon: Clock },
                ].map(d => (
                  <div key={d.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-chalk flex items-center justify-center shrink-0 mt-0.5">
                      <d.icon size={14} className="text-[#1c1917]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#71717a] font-bold uppercase tracking-wide">{d.label}</p>
                      <p className="text-sm font-semibold text-[#1c1917] mt-0.5 truncate">{d.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-5 sm:p-6">
              <h2 className="font-display font-bold text-[#1c1917] mb-4">About the Host</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1c1917] flex items-center justify-center text-white font-display font-black text-lg shrink-0">
                  {listing.host_name?.[0]}
                </div>
                <div>
                  <p className="font-display font-bold text-[#1c1917]">{listing.host_name}</p>
                  <p className="text-xs text-[#71717a] mt-0.5">Verified host · Member since 2024</p>
                </div>
              </div>
            </div>

            {reviews.length > 0 && (
              <div className="bg-white border border-border rounded-xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-[#1c1917]">
                    Reviews ({listing.review_count || reviews.length})
                  </h2>
                  {listing.avg_rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-mustard text-mustard" />
                      <span className="text-sm font-bold text-[#1c1917]">{Number(listing.avg_rating).toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <ReviewList reviews={reviews} />
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-20 lg:self-start space-y-4">
            <div className="bg-white border border-border rounded-xl p-5 sm:p-6">
              <div className="flex items-end gap-1 mb-5 pb-5 border-b border-border">
                <span className="font-display font-black text-3xl text-[#1c1917]">Rs {Number(listing.price_per_month).toLocaleString()}</span>
                <span className="text-[#71717a] text-sm mb-1">/month</span>
              </div>

              {user?.role === 'seller' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Start Date</label>
                    <input type="date" value={booking.start_date} onChange={e => setBooking({ ...booking, start_date: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk outline-none focus:border-[#1c1917] focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1c1917] mb-1.5">End Date</label>
                    <input type="date" value={booking.end_date} onChange={e => setBooking({ ...booking, end_date: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk outline-none focus:border-[#1c1917] focus:bg-white transition-all" />
                  </div>
                  {days > 0 && (
                    <div className="bg-chalk border border-border rounded-lg p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#71717a]">Rs {Number(listing.price_per_month).toLocaleString()} × {days} days</span>
                        <span className="font-display font-black text-[#1c1917]">Rs {estimatedCost.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  <button onClick={handleBook} disabled={bookingLoading}
                    className="w-full bg-[#1c1917] hover:bg-brick text-white font-display font-bold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                    {bookingLoading
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><CheckCircle2 size={15} /> Book This Space</>}
                  </button>
                  <p className="text-center text-xs text-[#71717a]">Free to book · No charge until approved</p>
                </div>
              ) : !user ? (
                <div className="space-y-3">
                  <Link to="/login" className="block w-full bg-[#1c1917] hover:bg-brick text-white font-display font-bold py-3 rounded-lg text-center transition-colors text-sm">
                    Login to Book
                  </Link>
                  <Link to="/register" className="block w-full border border-border hover:border-[#1c1917] text-[#1c1917] font-display font-bold py-3 rounded-lg text-center transition-colors text-sm">
                    Create Account
                  </Link>
                </div>
              ) : (
                <p className="text-center text-sm text-[#71717a] py-4">Only sellers can book storage spaces.</p>
              )}
            </div>

            <div className="bg-chalk-dark border border-border rounded-xl p-4">
              <div className="space-y-2">
                {['Verified host', 'Secure payment', 'Cancel anytime', '24/7 support'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-xs text-[#52525b]">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}