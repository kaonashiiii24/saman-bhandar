import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Package, ArrowRight } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { getListings, getLocations } from '../../services/listingService'
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
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className={`transition-all duration-500 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 80}ms` }}>
      <div className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col">
        <div className="h-40 bg-chalk border-b border-border flex items-center justify-center relative overflow-hidden">
          {listing.image_url ? (
            <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-chalk to-chalk-dark" />
              <Package size={40} className="text-border relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </>
          )}
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold bg-white border border-border text-[#1c1917] px-2 py-1 rounded-full group-hover:bg-[#1c1917] group-hover:text-white group-hover:border-[#1c1917] transition-all duration-300">
              {listing.size || 'N/A'}
            </span>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex-1">
            <h3 className="font-display font-bold text-[#1c1917] mb-1 line-clamp-1">{listing.title}</h3>
            <p className="text-xs text-[#71717a] mb-2">by {listing.host_name}</p>
            <div className="flex items-center gap-1 text-xs text-[#71717a] mb-2">
              <MapPin size={11} className="shrink-0" /> <span className="line-clamp-1">{listing.location}</span>
            </div>
            {listing.avg_rating > 0 && (
              <div className="flex items-center gap-1.5 mb-1">
                <StarRating value={Math.round(listing.avg_rating)} />
                <span className="text-[10px] text-[#71717a]">({listing.review_count})</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
            <div>
              <span className="font-display font-black text-lg text-[#1c1917]">Rs {Number(listing.price_per_month).toLocaleString()}</span>
              <span className="text-xs text-[#71717a]">/mo</span>
            </div>
            <Link to={`/listings/${listing.id}`}
              className="inline-flex items-center gap-1.5 bg-[#1c1917] hover:bg-brick text-white text-xs font-display font-bold px-3 py-2 rounded-lg transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 group/btn">
              View <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
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

  const debouncedSearch = useDebounce(searchInput, 400)

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
    const matchLocation = location === 'All' || l.location?.includes(location)
    return matchSearch && matchLocation
  })

  const { page, totalPages, paged, goTo, reset } = usePagination(filtered, PAGE_SIZE)

  const handleSearch = (e) => { setSearchInput(e.target.value); reset() }
  const handleLocation = (loc) => { setLocation(loc); reset() }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <div className="relative bg-[#1c1917] py-14 sm:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brick/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className={`transition-all duration-700 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-white/80 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brick opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brick" />
              </span>
              Find Storage
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight mb-2 leading-tight">Storage near you.</h1>
            <p className="text-white/50 text-sm mb-6 max-w-md">Verified spaces across Nepal — book by the day, week or month.</p>
            <div className="relative group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] group-focus-within:text-[#1c1917] transition-colors" />
              <input type="text" placeholder="Search by name or description..." value={searchInput} onChange={handleSearch}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-[#1c1917] placeholder-[#71717a] outline-none bg-white border border-border focus:border-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/10 transition-all" />
            </div>
          </div>
        </div>
      </div>

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