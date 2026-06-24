import { useState, useEffect } from 'react'
import { Search, Trash2, Package, Building2 } from 'lucide-react'
import api from '../../services/api'
import Loader from '../../components/common/Loader'
import AlertMessage from '../../components/common/AlertMessage'

export default function ManageListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const res = await api.get('/admin/listings')
      setListings(res.data.data.listings || [])
    } catch {
      setError('Failed to load listings')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return
    try {
      await api.delete(`/listings/${id}`)
      setListings(listings.filter(l => l.id !== id))
      setSuccess('Listing deleted')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete listing')
    }
  }

  const filtered = listings.filter(l =>
    l.title?.toLowerCase().includes(search.toLowerCase()) ||
    l.location?.toLowerCase().includes(search.toLowerCase()) ||
    l.host_name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Loader />

  return (
    <div className="space-y-4 sm:space-y-5">
      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} />}

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
        <input
          type="text"
          placeholder="Search listings..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg bg-white text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/10 transition-all"
        />
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 sm:p-14 text-center">
            <Building2 size={32} className="text-border mx-auto mb-3" />
            <p className="font-display font-bold text-[#1c1917] text-sm mb-1">No listings found</p>
            <p className="text-[#71717a] text-xs">Listings will appear here once hosts add them</p>
          </div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-chalk border-b border-border">
                    {['Title', 'Host', 'Location', 'Price', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold text-[#71717a] uppercase tracking-wider px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((l, i) => (
                    <tr key={l.id} className="hover:bg-chalk transition-colors animate-fade-in-up"
                      style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-chalk flex items-center justify-center">
                            <Package size={14} className="text-[#1c1917]" />
                          </div>
                          <span className="text-sm font-semibold text-[#1c1917] truncate max-w-[200px]">{l.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-[#71717a]">{l.host_name}</td>
                      <td className="px-5 py-3.5 text-sm text-[#71717a]">{l.location}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-[#1c1917]">Rs {Number(l.price_per_month).toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          l.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-[#F4F4F5] text-[#71717a]'
                        }`}>
                          {l.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(l.id)}
                            className="p-1.5 text-[#71717a] hover:text-brick hover:bg-brick-light rounded-lg transition-colors"
                            title="Delete listing"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden divide-y divide-border">
              {filtered.map((l, i) => (
                <div key={l.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-chalk transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}>
                  <div className="w-8 h-8 rounded-lg bg-chalk flex items-center justify-center shrink-0">
                    <Package size={14} className="text-[#1c1917]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1c1917] truncate">{l.title}</p>
                    <p className="text-xs text-[#71717a] mt-0.5">{l.host_name} · {l.location}</p>
                    <p className="text-xs text-[#71717a]">Rs {Number(l.price_per_month).toLocaleString()} /mo</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      l.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-[#F4F4F5] text-[#71717a]'
                    }`}>
                      {l.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => handleDelete(l.id)}
                      className="p-1.5 text-[#71717a] hover:text-brick transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}