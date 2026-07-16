import { useState, useEffect } from 'react'
import { CreditCard, Search, Download } from 'lucide-react'
import { getMyPayments } from '../../services/paymentService'
import Loader from '../../components/common/Loader'

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getMyPayments()
      .then(res => {
        const data = res?.data?.data?.payments || res?.data?.payments || []
        setPayments(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = payments.filter(p =>
    p.transaction_id?.toLowerCase().includes(search.toLowerCase()) ||
    p.status?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Loader />

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-display font-black text-xl sm:text-2xl text-[#1c1917]">Payments</h2>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg bg-white text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <CreditCard size={32} className="text-border mx-auto mb-3" />
            <p className="font-display font-bold text-[#1c1917] text-sm mb-1">No payments found</p>
            <p className="text-[#71717a] text-xs">Your payment history will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-chalk border-b border-border">
                  {['Transaction ID', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left text-[10px] font-bold text-[#71717a] uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p, i) => (
                  <tr key={p.id} className="hover:bg-chalk transition-colors">
                    <td className="px-5 py-3.5 text-sm font-semibold text-[#1c1917]">{p.transaction_id || '—'}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-[#1c1917]">Rs {Number(p.amount).toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-sm text-[#71717a] capitalize">{p.method || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        p.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        p.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-[#F4F4F5] text-[#71717a]'
                      }`}>
                        {p.status || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#71717a]">{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}