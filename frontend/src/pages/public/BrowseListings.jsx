import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Package, ArrowRight, Eye, X, Star, XCircle, Shield, CheckCircle2 } from 'lucide-react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { getListings, getLocations } from '../../services/listingService'
import { useAuth } from '../../hooks/useAuth'
import useDebounce from '../../hooks/useDebounce'
import usePagination from '../../hooks/usePagination'
import Pagination from '../../components/common/Pagination'

const PAGE_SIZE = 9

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

function SkeletonCard() {
  return (
    <div className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden h-full flex flex-col animate-pulse shadow-sm">
      <div className="h-44 bg-neutral-100" />
      <div className="p-5 flex flex-col flex-1 gap-3.5">
        <div className="h-5 bg-neutral-100 rounded-lg w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-neutral-100 rounded w-1/2" />
          <div className="h-3 bg-neutral-100 rounded w-2/3" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-auto">
          <div className="h-6 bg-neutral-100 rounded w-24" />
          <div className="h-9 bg-neutral-100 rounded-xl w-20" />
        </div>
      </div>
    </div>
  )
}

function StarRating({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-3 h-3 ${s <= value ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`} />
      ))}
    </div>
  )
}

function ListingCard({ listing, index }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [ref, inView] = useInView()
  const [showModal, setShowModal] = useState(false)
  const [bookError, setBookError] = useState(false)

  const handleBookNow = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'seller') {
      setBookError(true)
      setTimeout(() => setBookError(false), 3000)
      return
    }
    navigate(`/listings/${listing.id}`)
  }

  return (
    <>
      <div ref={ref} className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        style={{ transitionDelay: `${index * 60}ms` }}>
        <div className="bg-white border border-neutral-200/60 rounded-2xl overflow-hidden hover:shadow-xl hover:border-neutral-300/80 transition-all duration-300 group h-full flex flex-col relative">
          <div className="h-48 bg-neutral-50 flex items-center justify-center relative overflow-hidden">
            {listing.image_url ? (
              <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-white to-neutral-100/80" />
                <Package size={40} className="text-neutral-300 relative z-10 group-hover:scale-110 transition-transform duration-300 ease-out" />
              </>
            )}
            <div className="absolute top-3 left-3 z-10">
              <span className="text-[11px] font-bold bg-white/95 backdrop-blur-md text-neutral-900 px-3 py-1 rounded-xl shadow-sm tracking-wide uppercase">
                {listing.size || 'Flexible'}
              </span>
            </div>
            {listing.avg_rating > 0 && (
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-sm border border-neutral-100/50">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-[12px] font-bold text-neutral-900">{Number(listing.avg_rating).toFixed(1)}</span>
                <span className="text-[10px] text-neutral-500 font-medium">({listing.review_count})</span>
              </div>
            )}
          </div>
          <div className="p-5 flex flex-col flex-1">
            <div className="flex-1">
              <h3 className="font-display font-bold text-neutral-900 mb-1.5 line-clamp-1 text-lg group-hover:text-amber-600 transition-colors duration-200">{listing.title}</h3>
              <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200/40">
                  <span className="text-[10px] font-bold text-neutral-600 uppercase">{listing.host_name?.charAt(0)}</span>
                </div>
                <span className="truncate font-medium">{listing.host_name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-neutral-500 mb-4">
                <MapPin size={13} className="shrink-0 text-neutral-400" /> <span className="line-clamp-1">{listing.location}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-display font-black text-2xl text-neutral-900 tracking-tight">Rs {Number(listing.price_per_month).toLocaleString()}</span>
                  <span className="text-xs text-neutral-500 font-medium ml-1">/month</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowModal(true)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400 text-xs font-semibold px-3 py-3 rounded-xl transition-all duration-200 active:scale-98">
                  <Eye size={14} /> View Details
                </button>
                <button onClick={handleBookNow}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-display font-bold px-3 py-3 rounded-xl transition-all duration-200 hover:shadow-md active:scale-98">
                  Book Now <ArrowRight size={14} />
                </button>
              </div>
              {bookError && (
                <div className="bg-red-50/80 border border-red-100 rounded-xl px-3 py-2.5 text-center animate-in fade-in slide-in-from-top-1 duration-200">
                  <p className="text-xs font-semibold text-red-600 flex items-center justify-center gap-1.5">
                    <XCircle size={14} /> Only sellers can book spaces
                  </p>
                  <Link to="/register" className="text-[11px] text-red-500 font-bold hover:underline mt-1 inline-block">Register as a seller</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-md transition-opacity duration-300" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-300 scale-100 border border-neutral-100 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="relative h-60 sm:h-72 bg-neutral-50 overflow-hidden">
              {listing.image_url ? (
                <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 flex items-center justify-center">
                  <Package size={64} className="text-white/10" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-neutral-950/20 to-transparent" />
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white transition-all shadow-md border border-neutral-200/20 active:scale-95">
                <X size={18} className="text-neutral-900" />
              </button>
              <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-neutral-100/30">
                    <MapPin size={13} className="text-amber-600" />
                    <span className="text-xs font-bold text-neutral-800">{listing.location}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight drop-shadow-md">{listing.title}</h2>
                </div>
                <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-sm border border-neutral-100/30 shrink-0 self-start sm:self-auto">
                  <p className="font-display font-black text-2xl text-neutral-900 leading-none">Rs {Number(listing.price_per_month).toLocaleString()}</p>
                  <p className="text-[11px] text-neutral-500 font-bold mt-0.5 tracking-wide uppercase text-right">per month</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-center hover:bg-neutral-100/70 transition-colors">
                  <Package size={20} className="text-neutral-800 mx-auto mb-1.5" />
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">Size</p>
                  <p className="text-sm font-bold text-neutral-800 mt-0.5">{listing.size || 'Flexible'}</p>
                </div>
                <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-center hover:bg-neutral-100/70 transition-colors">
                  <MapPin size={20} className="text-neutral-800 mx-auto mb-1.5" />
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">Location</p>
                  <p className="text-sm font-bold text-neutral-800 mt-0.5 truncate">{listing.location}</p>
                </div>
                <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-center hover:bg-neutral-100/70 transition-colors">
                  <Star size={20} className="text-neutral-800 mx-auto mb-1.5" />
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">Rating</p>
                  <p className="text-sm font-bold text-neutral-800 mt-0.5">
                    {listing.avg_rating > 0 ? `${Number(listing.avg_rating).toFixed(1)} ★` : 'New Listing'}
                  </p>
                </div>
                <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-center hover:bg-neutral-100/70 transition-colors">
                  <CheckCircle2 size={20} className="text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">Status</p>
                  <p className="text-sm font-bold text-emerald-600 mt-0.5">Available</p>
                </div>
              </div>

              <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5">
                <h3 className="font-display font-bold text-neutral-900 text-sm mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-neutral-900 rounded-full" />
                  About this space
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {listing.description || 'A verified storage space available for rent. Safe, secure, and managed by a trusted host on SamanBhandar.'}
                </p>
              </div>

              <div className="flex items-center gap-4 p-4 bg-neutral-50 border border-neutral-100 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center text-white font-display font-black text-lg shrink-0 shadow-sm">
                  {listing.host_name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-neutral-900 truncate">{listing.host_name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <Shield size={13} className="text-emerald-600 shrink-0" />
                    <span className="text-xs text-neutral-500 font-medium">Verified Host</span>
                    <span className="text-xs text-neutral-300">·</span>
                    <span className="text-xs text-neutral-400">Member since 2025</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wide font-bold">Response rate</p>
                  <p className="text-sm font-bold text-emerald-600">98%</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link to={`/listings/${listing.id}`} onClick={() => setShowModal(false)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-50 font-semibold px-5 py-3.5 rounded-xl transition-all text-sm active:scale-98">
                  View Full Page <ArrowRight size={16} />
                </Link>
                <button onClick={() => { setShowModal(false); handleBookNow({ preventDefault: () => {} }) }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white font-display font-bold px-5 py-3.5 rounded-xl transition-all text-sm shadow-md active:scale-98">
                  Book Now <ArrowRight size={16} />
                </button>
              </div>
              {bookError && (
                <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-center animate-in fade-in slide-in-from-top-1">
                  <p className="text-sm font-semibold text-red-600 flex items-center justify-center gap-1.5">
                    <XCircle size={15} /> Only sellers can book storage spaces
                  </p>
                  <Link to="/register" className="text-xs text-red-500 hover:underline mt-1 inline-block font-bold">Register as a seller to book</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function BrowseListings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')
  const [location, setLocation] = useState(searchParams.get('location') || 'All')
  const [heroVisible, setHeroVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const listingsRef = useRef(null)

  const debouncedSearch = useDebounce(searchInput, 400)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const params = {}
    if (debouncedSearch) params.q = debouncedSearch
    if (location !== 'All') params.location = location
    setSearchParams(params, { replace: true })
  }, [debouncedSearch, location, setSearchParams])

  useEffect(() => {
    setLoading(true)
    Promise.all([getListings(), getLocations()])
      .then(([listRes, locRes]) => {
        setListings(listRes.data.data.listings || [])
        setLocations(locRes.data.data.locations || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { setTimeout(() => setHeroVisible(true), 80) }, [])

  const filtered = listings.filter(l => {
    const matchSearch = debouncedSearch
      ? l.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        l.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      : true
    const matchLocation = location === 'All' || l.location?.toLowerCase().includes(location.toLowerCase())
    return matchSearch && matchLocation
  })

  const { page, totalPages, paged, goTo, reset } = usePagination(filtered, PAGE_SIZE)

  const handleSearch = (e) => { setSearchInput(e.target.value); reset() }
  const handleLocation = (loc) => { setLocation(loc); reset() }
  const scrollToListings = () => {
    listingsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <section className="relative min-h-screen flex items-center overflow-hidden bg-neutral-900">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform scale-105"
          style={{ 
            backgroundImage: "url('/images/browse-hero.jpg')",
            transform: `translateY(${scrollY * 0.12}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/75 to-neutral-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full relative z-10">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-neutral-200 mb-6 transition-all duration-700 delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-300" />
              </span>
              Find Storage
            </div>
            <h1 className={`font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.05] mb-5 transition-all duration-700 delay-300 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Storage near you.
            </h1>
            <p className={`text-neutral-300/80 text-base sm:text-lg leading-relaxed mb-8 max-w-lg transition-all duration-700 delay-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Verified spaces across Nepal — book by the day, week or month.
            </p>
            <div className={`flex flex-wrap gap-3 transition-all duration-700 delay-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <button
                onClick={scrollToListings}
                className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-neutral-900 font-display font-bold px-6 py-3.5 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                Start Booking <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div ref={listingsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 border-b border-neutral-200/60 pb-5">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchInput}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-white text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 flex-1 scrollbar-none">
            <button onClick={() => handleLocation('All')}
              className={`px-4 py-2 rounded-xl text-xs font-display font-bold whitespace-nowrap transition-all duration-200 shadow-sm ${
                location === 'All' 
                  ? 'bg-neutral-950 text-white border border-transparent' 
                  : 'bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:border-neutral-300'
              }`}>
              All Spaces
            </button>
            {locations.map(loc => (
              <button key={loc.location} onClick={() => handleLocation(loc.location)}
                className={`px-4 py-2 rounded-xl text-xs font-display font-bold whitespace-nowrap transition-all duration-200 shadow-sm ${
                  location === loc.location 
                    ? 'bg-neutral-950 text-white border border-transparent' 
                    : 'bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:border-neutral-300'
                }`}>
                {loc.location} <span className={`ml-1 text-[10px] ${location === loc.location ? 'text-white/60' : 'text-neutral-400'}`}>({loc.count})</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <>
            <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-semibold text-neutral-500">{filtered.length} storage space{filtered.length !== 1 ? 's' : ''} found</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {paged.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
              {filtered.length === 0 && (
                <div className="col-span-full bg-white border border-neutral-200/60 rounded-2xl p-12 sm:p-20 text-center animate-in fade-in duration-300 shadow-sm max-w-md mx-auto w-full">
                  <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center mx-auto mb-4 border border-neutral-100">
                    <Package size={22} className="text-neutral-400" />
                  </div>
                  <p className="font-display font-bold text-neutral-900 text-base mb-1">No listings found</p>
                  <p className="text-neutral-400 text-sm">Try adjusting your search or location filters.</p>
                </div>
              )}
            </div>
            {filtered.length > 0 && (
              <Pagination page={page} totalPages={totalPages} onPageChange={goTo} className="mt-12" />
            )}
          </>
        )}
      </div>
    </div>
  )
}