import { useState, useEffect } from 'react'
import { Search, Users } from 'lucide-react'
import api from '../../services/api'
import Loader from '../../components/common/Loader'
import AlertMessage from '../../components/common/AlertMessage'
import useDebounce from '../../hooks/useDebounce'
import usePagination from '../../hooks/usePagination'
import Pagination from '../../components/common/Pagination'

const ROLE_COLOR = {
  seller: 'bg-blue-100 text-blue-700',
  host: 'bg-emerald-100 text-emerald-700',
  courier: 'bg-amber-100 text-amber-700',
  admin: 'bg-brick-light text-brick',
}

const STATUS_COLOR = {
  active: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  suspended: 'bg-brick-light text-brick',
}

const PAGE_SIZE = 15

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [filter, setFilter] = useState('all')

  const debouncedSearch = useDebounce(searchInput, 350)

  useEffect(() => {
    api.get('/admin/users')
      .then(res => setUsers(res.data.data.users || []))
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status, label) => {
    try {
      await api.put(`/admin/users/${id}`, { status })
      setUsers(users.map(u => u.id === id ? { ...u, status } : u))
      setSuccess(`User ${label}`)
      setTimeout(() => setSuccess(''), 3000)
    } catch { setError('Failed to update user') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers(users.filter(u => u.id !== id))
    } catch { setError('Failed to delete user') }
  }

  const filtered = users.filter(u => {
    const matchSearch = u.full_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) || u.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchFilter = filter === 'all' || u.role === filter || u.status === filter
    return matchSearch && matchFilter
  })

  const { page, totalPages, paged, goTo, reset } = usePagination(filtered, PAGE_SIZE)

  const handleSearch = (e) => { setSearchInput(e.target.value); reset() }
  const handleFilter = (f) => { setFilter(f); reset() }

  if (loading) return <Loader />

  return (
    <div className="space-y-4 sm:space-y-5">
      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="flex flex-col gap-3">
        <div className="relative group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] group-focus-within:text-[#1c1917] transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchInput} 
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg bg-white text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/10 transition-all" 
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {['all', 'seller', 'host', 'courier', 'pending', 'suspended'].map(f => (
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

      <div className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-sm transition-shadow duration-300">
        <div className="px-4 sm:px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-display font-bold text-[#1c1917] text-sm flex items-center gap-2">
            <Users size={16} className="text-[#71717a]" />
            All Users ({filtered.length})
          </h3>
          {users.filter(u => u.status === 'pending').length > 0 && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
              {users.filter(u => u.status === 'pending').length} pending
            </span>
          )}
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-chalk border-b border-border">
                {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[10px] font-bold text-[#71717a] uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paged.map((u, i) => (
                <tr 
                  key={u.id} 
                  className={`hover:bg-chalk transition-all duration-200 animate-fade-in-up ${u.status === 'pending' ? 'bg-amber-50/30' : ''}`}
                  style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1c1917] to-brick flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {u.full_name?.[0]}
                      </div>
                      <span className="text-sm font-semibold text-[#1c1917] truncate max-w-[120px]">{u.full_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#71717a] max-w-[150px] truncate">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${ROLE_COLOR[u.role] || 'bg-[#F4F4F5] text-[#71717a]'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLOR[u.status] || STATUS_COLOR.active}`}>
                      {u.status || 'active'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#71717a] whitespace-nowrap">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {u.status === 'pending' && (
                        <button 
                          onClick={() => updateStatus(u.id, 'active', 'approved')} 
                          className="text-[11px] font-bold px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                        >
                          Approve
                        </button>
                      )}
                      {u.status === 'active' && (
                        <button 
                          onClick={() => updateStatus(u.id, 'suspended', 'suspended')} 
                          className="text-[11px] font-bold px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                        >
                          Suspend
                        </button>
                      )}
                      {u.status === 'suspended' && (
                        <button 
                          onClick={() => updateStatus(u.id, 'active', 'reactivated')} 
                          className="text-[11px] font-bold px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                        >
                          Reactivate
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(u.id)} 
                        className="text-[11px] font-bold px-2.5 py-1.5 bg-brick-light hover:bg-brick hover:text-white text-brick rounded-lg transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <Users size={36} className="text-border mx-auto mb-3" />
                    <p className="text-[#71717a] text-sm">No users found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden divide-y divide-border">
          {paged.map((u, i) => (
            <div 
              key={u.id} 
              className={`px-4 py-4 animate-fade-in-up ${u.status === 'pending' ? 'bg-amber-50/30' : ''}`}
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1c1917] to-brick flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {u.full_name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1c1917] truncate">{u.full_name}</p>
                  <p className="text-xs text-[#71717a] truncate mt-0.5">{u.email}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${ROLE_COLOR[u.role] || 'bg-[#F4F4F5] text-[#71717a]'}`}>
                    {u.role}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLOR[u.status] || STATUS_COLOR.active}`}>
                    {u.status || 'active'}
                  </span>
                </div>
              </div>
              <div className="flex gap-1.5">
                {u.status === 'pending' && (
                  <button onClick={() => updateStatus(u.id, 'active', 'approved')} className="flex-1 text-[11px] font-bold py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all">
                    Approve
                  </button>
                )}
                {u.status === 'active' && (
                  <button onClick={() => updateStatus(u.id, 'suspended', 'suspended')} className="flex-1 text-[11px] font-bold py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all">
                    Suspend
                  </button>
                )}
                {u.status === 'suspended' && (
                  <button onClick={() => updateStatus(u.id, 'active', 'reactivated')} className="flex-1 text-[11px] font-bold py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all">
                    Reactivate
                  </button>
                )}
                <button onClick={() => handleDelete(u.id)} className="flex-1 text-[11px] font-bold py-1.5 bg-brick-light hover:bg-brick hover:text-white text-brick rounded-lg transition-all">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-10 text-center">
              <Users size={36} className="text-border mx-auto mb-3" />
              <p className="text-[#71717a] text-sm">No users found</p>
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