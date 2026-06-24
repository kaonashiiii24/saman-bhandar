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
    <div className="bg-white border border-border rounded-xl overflow-hidden h-full flex flex-col animate-pulse">
      <div className="h-40 bg-chalk-dark" />
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="h-4 bg-chalk-dark rounded w-3/4" />
        <div className="h-3 bg-chalk-dark rounded w-1/2" />
        <div className="h-3 bg-chalk-dark rounded w-2/3" />
        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
          <div className="h-5 bg-chalk-dark rounded w-24" />
          <div className="h-8 bg-chalk-dark rounded-lg w-16" />
        </div>
      </div>
    </div>
  )
}

function StarRating({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`w-3 h-3 ${s <= value ? 'text-mustard' : 'text-border'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
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
      <div ref={ref} className={`transition-all duration-500 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionDelay: `${index * 80}ms` }}>
        <div className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col">
          <div className="h-44 bg-chalk border-b border-border flex items-center justify-center relative overflow-hidden">
            {listing.image_url ? (
              <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-chalk via-white to-chalk-dark" />
                <Package size={44} className="text-border relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </>
            )}
            <div className="absolute top-3 left-3">
              <span className="text-[10px] font-bold bg-white/90 backdrop-blur-sm text-[#1c1917] px-2.5 py-1 rounded-lg shadow-sm">
                {listing.size || 'Flexible'}
              </span>
            </div>
            {listing.avg_rating > 0 && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                <Star size={11} className="fill-mustard text-mustard" />
                <span className="text-[11px] font-bold text-[#1c1917]">{Number(listing.avg_rating).toFixed(1)}</span>
                <span className="text-[10px] text-[#71717a]">({listing.review_count})</span>
              </div>
            )}
          </div>
          <div className="p-5 flex flex-col flex-1">
            <div className="flex-1">
              <h3 className="font-display font-bold text-[#1c1917] mb-1 line-clamp-1 text-base">{listing.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-[#71717a] mb-1.5">
                <div className="w-5 h-5 rounded-full bg-chalk flex items-center justify-center">
                  <span className="text-[9px] font-bold text-[#71717a]">{listing.host_name?.charAt(0)}</span>
                </div>
                <span className="truncate">{listing.host_name}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#71717a] mb-3">
                <MapPin size={11} className="shrink-0" /> <span className="line-clamp-1">{listing.location}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-display font-black text-xl text-[#1c1917]">Rs {Number(listing.price_per_month).toLocaleString()}</span>
                  <span className="text-[11px] text-[#71717a] ml-0.5">/month</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowModal(true)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white border-2 border-border text-[#1c1917] hover:border-[#1c1917] text-xs font-semibold px-3 py-2.5 rounded-xl transition-all hover:shadow-sm">
                  <Eye size={13} /> View Details
                </button>
                <button onClick={handleBookNow}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#1c1917] hover:bg-brick text-white text-xs font-display font-bold px-3 py-2.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                  Book Now <ArrowRight size={12} />
                </button>
              </div>
              {bookError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-center animate-fade-in">
                  <p className="text-[11px] font-semibold text-red-600 flex items-center justify-center gap-1">
                    <XCircle size={12} /> Only sellers can book spaces
                  </p>
                  <Link to="/register" className="text-[10px] text-red-500 hover:underline mt-0.5 inline-block">Register as a seller</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            
            <div className="relative h-56 sm:h-64 bg-chalk overflow-hidden rounded-t-3xl">
              {listing.image_url ? (
                <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1c1917] via-[#2d2522] to-brick flex items-center justify-center">
                  <Package size={56} className="text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white transition-all shadow-lg">
                <X size={18} className="text-[#1c1917]" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm mb-2">
                    <MapPin size={12} className="text-brick" />
                    <span className="text-xs font-semibold text-[#1c1917]">{listing.location}</span>
                  </div>
                  <h2 className="text-2xl font-display font-black text-white drop-shadow-lg">{listing.title}</h2>
                </div>
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm text-right">
                  <p className="font-display font-black text-xl text-[#1c1917] leading-none">Rs {Number(listing.price_per_month).toLocaleString()}</p>
                  <p className="text-[10px] text-[#71717a]">per month</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-chalk rounded-2xl p-4 text-center hover:bg-chalk-dark transition-colors">
                  <Package size={18} className="text-[#1c1917] mx-auto mb-1.5" />
                  <p className="text-[10px] text-[#71717a] uppercase tracking-wider font-semibold">Size</p>
                  <p className="text-sm font-bold text-[#1c1917] mt-0.5">{listing.size || 'Flexible'}</p>
                </div>
                <div className="bg-chalk rounded-2xl p-4 text-center hover:bg-chalk-dark transition-colors">
                  <MapPin size={18} className="text-[#1c1917] mx-auto mb-1.5" />
                  <p className="text-[10px] text-[#71717a] uppercase tracking-wider font-semibold">Location</p>
                  <p className="text-sm font-bold text-[#1c1917] mt-0.5 truncate">{listing.location}</p>
                </div>
                <div className="bg-chalk rounded-2xl p-4 text-center hover:bg-chalk-dark transition-colors">
                  <Star size={18} className="text-[#1c1917] mx-auto mb-1.5" />
                  <p className="text-[10px] text-[#71717a] uppercase tracking-wider font-semibold">Rating</p>
                  <p className="text-sm font-bold text-[#1c1917] mt-0.5">
                    {listing.avg_rating > 0 ? `${Number(listing.avg_rating).toFixed(1)}★` : 'New'}
                  </p>
                </div>
                <div className="bg-chalk rounded-2xl p-4 text-center hover:bg-chalk-dark transition-colors">
                  <CheckCircle2 size={18} className="text-[#1c1917] mx-auto mb-1.5" />
                  <p className="text-[10px] text-[#71717a] uppercase tracking-wider font-semibold">Status</p>
                  <p className="text-sm font-bold text-emerald-600 mt-0.5">Available</p>
                </div>
              </div>

              <div className="bg-chalk-dark/50 rounded-2xl p-5">
                <h3 className="font-display font-bold text-[#1c1917] text-sm mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-brick rounded-full" />
                  About this space
                </h3>
                <p className="text-sm text-[#52525b] leading-relaxed">
                  {listing.description || 'A verified storage space available for rent. Safe, secure, and managed by a trusted host on SamanBhandar.'}
                </p>
              </div>

              <div className="flex items-center gap-4 p-4 bg-chalk rounded-2xl">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1c1917] to-brick flex items-center justify-center text-white font-display font-black text-xl shrink-0 shadow-lg">
                  {listing.host_name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-[#1c1917]">{listing.host_name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Shield size={12} className="text-emerald-500" />
                    <span className="text-xs text-[#71717a]">Verified Host</span>
                    <span className="text-[10px] text-[#71717a]">· Member since 2025</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[#71717a]">Response rate</p>
                  <p className="text-sm font-bold text-emerald-600">98%</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Link to={`/listings/${listing.id}`} onClick={() => setShowModal(false)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white border-2 border-border text-[#1c1917] hover:border-[#1c1917] font-semibold px-5 py-3 rounded-2xl transition-all hover:shadow-md text-sm">
                  View Full Page <ArrowRight size={15} />
                </Link>
                <button onClick={() => { setShowModal(false); handleBookNow({ preventDefault: () => {} }) }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1c1917] hover:bg-brick text-white font-display font-bold px-5 py-3 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-sm">
                  Book Now <ArrowRight size={15} />
                </button>
              </div>
              {bookError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-center animate-fade-in">
                  <p className="text-sm font-semibold text-red-600 flex items-center justify-center gap-1.5">
                    <XCircle size={14} /> Only sellers can book storage spaces
                  </p>
                  <Link to="/register" className="text-xs text-red-500 hover:underline mt-1 inline-block font-medium">Register as a seller to book</Link>
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
    const matchSearch = l.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) || l.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchLocation = location === 'All' || l.location?.toLowerCase().includes(location.toLowerCase())
    return matchSearch && matchLocation
  })

  const { page, totalPages, paged, goTo, reset } = usePagination(filtered, PAGE_SIZE)

  const handleSearch = (e) => { setSearchInput(e.target.value); reset() }
  const handleLocation = (loc) => { setLocation(loc); reset() }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">

      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
          style={{ 
            backgroundImage: "url('/images/browse-hero.jpg')",
            transform: `translateY(${scrollY * 0.15}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c1917]/90 via-[#1c1917]/70 to-[#1c1917]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/40 via-transparent to-transparent" />
        
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full relative z-10">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-2 border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-white/80 mb-6 transition-all duration-700 delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brick opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brick" />
              </span>
              Find Storage
            </div>
            <h1 className={`font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] mb-5 transition-all duration-700 delay-300 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Storage near you.
            </h1>
            <p className={`text-white/50 text-lg leading-relaxed mb-8 max-w-xl transition-all duration-700 delay-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Verified spaces across Nepal — book by the day, week or month.
            </p>
            <div className={`relative group transition-all duration-700 delay-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] group-focus-within:text-[#1c1917] transition-colors" />
              <input type="text" placeholder="Search by name or description..." value={searchInput} onChange={handleSearch}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-[#1c1917] placeholder-[#71717a] outline-none bg-white border border-border focus:border-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/10 transition-all" />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 flex-1 scrollbar-hide">
            <button onClick={() => handleLocation('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                location === 'All' 
                  ? 'bg-[#1c1917] text-white shadow-md scale-105' 
                  : 'bg-white border border-border text-[#71717a] hover:border-[#1c1917] hover:shadow-sm hover:-translate-y-0.5'
              }`}>
              All
            </button>
            {locations.map(loc => (
              <button key={loc.location} onClick={() => handleLocation(loc.location)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                  location === loc.location 
                    ? 'bg-[#1c1917] text-white shadow-md scale-105' 
                    : 'bg-white border border-border text-[#71717a] hover:border-[#1c1917] hover:shadow-sm hover:-translate-y-0.5'
                }`}>
                {loc.location} ({loc.count})
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <>
            <div className="h-4 w-32 bg-chalk-dark rounded animate-pulse mb-5" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-semibold text-[#71717a]">{filtered.length} listing{filtered.length !== 1 ? 's' : ''} found</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {paged.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
              {filtered.length === 0 && (
                <div className="col-span-full bg-white border border-border rounded-xl p-12 sm:p-16 text-center animate-fade-in">
                  <Package size={36} className="text-border mx-auto mb-3" />
                  <p className="font-display font-bold text-[#1c1917] mb-1">No listings found</p>
                  <p className="text-[#71717a] text-sm">Try a different location or search term</p>
                </div>
              )}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={goTo} className="mt-8" />
          </>
        )}
      </div>
    </div>
  )
}