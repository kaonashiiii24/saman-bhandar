import { useState, useEffect } from 'react'
import { Search, Building2, MapPin, Eye, EyeOff, Trash2, Package } from 'lucide-react'
import api from '../../services/api'
import Loader from '../../components/common/Loader'
import AlertMessage from '../../components/common/AlertMessage'
import useDebounce from '../../hooks/useDebounce'
import usePagination from '../../hooks/usePagination'
import Pagination from '../../components/common/Pagination'

const PAGE_SIZE = 15

function StarDisplay({ value }) {
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

export default function ManageListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const debouncedSearch = useDebounce(searchInput, 350)

  useEffect(() => {
    api.get('/admin/listings')
      .then(res => setListings(res.data.data.listings || []))
      .catch(() => setError('Failed to load listings'))
      .finally(() => setLoading(false))
  }, [])

  const handleToggle = async (id) => {
    try {
      await api.put(`/admin/listings/${id}/toggle`)
      setListings(listings.map(l => l.id === id ? { ...l, is_active: l.is_active ? 0 : 1 } : l))
      setSuccess('Listing updated')
      setTimeout(() => setSuccess(''), 3000)
    } catch { setError('Failed to toggle listing') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return
    try {
      await api.delete(`/listings/${id}`)
      setListings(listings.filter(l => l.id !== id))
      setSuccess('Listing deleted')
      setTimeout(() => setSuccess(''), 3000)
    } catch { setError('Failed to delete') }
  }

  const filtered = listings.filter(l =>
    l.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    l.host_name?.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  const { page, totalPages, paged, goTo, reset } = usePagination(filtered, PAGE_SIZE)

  const handleSearch = (e) => { setSearchInput(e.target.value); reset() }

  if (loading) return <Loader />

  return (
    <div className="space-y-4 sm:space-y-5">
      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="relative max-w-sm group">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] group-focus-within:text-[#1c1917] transition-colors" />
        <input 
          type="text" 
          placeholder="Search listings..." 
          value={searchInput} 
          onChange={handleSearch}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg bg-white text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/10 transition-all" 
        />
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-sm transition-shadow duration-300">
        <div className="px-4 sm:px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-display font-bold text-[#1c1917] text-sm flex items-center gap-2">
            <Package size={16} className="text-[#71717a]" />
            All Listings ({filtered.length})
          </h3>
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-chalk border-b border-border">
                {['Listing', 'Host', 'Location', 'Price', 'Rating', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-[10px] font-bold text-[#71717a] uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paged.map((l, i) => (
                <tr 
                  key={l.id} 
                  className="hover:bg-chalk transition-all duration-200 animate-fade-in-up"
                  style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-chalk to-chalk-dark flex items-center justify-center">
                        <Building2 size={13} className="text-[#1c1917]" />
                      </div>
                      <span className="text-sm font-semibold text-[#1c1917] truncate max-w-[130px]">{l.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#71717a]">{l.host_name}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-sm text-[#71717a]">
                      <MapPin size={11} /> {l.location}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-display font-black text-[#1c1917] text-sm whitespace-nowrap">
                    Rs {Number(l.price_per_month).toLocaleString()}/mo
                  </td>
                  <td className="px-5 py-3.5">
                    {l.avg_rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <StarDisplay value={Math.round(l.avg_rating)} />
                        <span className="text-[10px] text-[#71717a]">({l.review_count})</span>
                      </div>
                    ) : <span className="text-xs text-[#71717a]">—</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${l.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-[#F4F4F5] text-[#71717a]'}`}>
                      {l.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => handleToggle(l.id)} 
                        className="p-1.5 text-[#71717a] hover:text-[#1c1917] hover:bg-chalk rounded-lg transition-all hover:shadow-sm"
                        title={l.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {l.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button 
                        onClick={() => handleDelete(l.id)} 
                        className="p-1.5 text-[#71717a] hover:text-brick hover:bg-brick-light rounded-lg transition-all hover:shadow-sm"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <Package size={36} className="text-border mx-auto mb-3" />
                    <p className="text-[#71717a] text-sm">No listings found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden divide-y divide-border">
          {paged.map((l, i) => (
            <div 
              key={l.id} 
              className="flex items-center gap-3 px-4 py-4 animate-fade-in-up"
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-chalk to-chalk-dark flex items-center justify-center shrink-0">
                <Building2 size={15} className="text-[#1c1917]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1c1917] truncate">{l.title}</p>
                <div className="flex items-center gap-1 text-xs text-[#71717a] mt-0.5">
                  <MapPin size={10} /> <span className="truncate">{l.location}</span>
                </div>
                <p className="text-xs font-bold text-[#1c1917] mt-0.5">Rs {Number(l.price_per_month).toLocaleString()}/mo</p>
                {l.avg_rating > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <StarDisplay value={Math.round(l.avg_rating)} />
                    <span className="text-[10px] text-[#71717a]">({l.review_count})</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${l.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-[#F4F4F5] text-[#71717a]'}`}>
                  {l.is_active ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleToggle(l.id)} 
                    className="p-1.5 text-[#71717a] hover:text-[#1c1917] hover:bg-chalk rounded-lg transition-all"
                  >
                    {l.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button 
                    onClick={() => handleDelete(l.id)} 
                    className="p-1.5 text-[#71717a] hover:text-brick hover:bg-brick-light rounded-lg transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-10 text-center">
              <Package size={36} className="text-border mx-auto mb-3" />
              <p className="text-[#71717a] text-sm">No listings found</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="border-t border-border p-4">
            <Pagination page={page} totalPages={totalPages} onPageChange={goTo} />
          </div>
        )}
      </div>
    </div>
  )
}