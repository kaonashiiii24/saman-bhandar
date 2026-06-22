import { useState, useEffect } from 'react'
import { CreditCard, Clock, CheckCircle2, Download, TrendingUp, ArrowUpRight } from 'lucide-react'
import { getMyPayments } from '../../services/paymentService'
import StatCard from '../../components/common/StatCard'
import Loader from '../../components/common/Loader'
import AlertMessage from '../../components/common/AlertMessage'

const STATUS_MAP = {
  completed: { label: 'Paid', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
  refunded: { label: 'Refunded', color: 'bg-[#F4F4F5] text-[#71717a]', icon: TrendingUp },
}

const METHOD_COLOR = {
  esewa: 'bg-emerald-100 text-emerald-700',
  khalti: 'bg-violet-100 text-violet-700',
  cash: 'bg-[#F4F4F5] text-[#71717a]',
}

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyPayments()
      .then(res => setPayments(res.data.data.payments || []))
      .catch(() => setError('Failed to load payments'))
      .finally(() => setLoading(false))
  }, [])

  const total = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0)
  const pending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0)

  if (loading) return <Loader />

  return (
    <div className="space-y-4 sm:space-y-5">
      {error && <AlertMessage type="error" message={error} />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Paid" value={`Rs ${total.toLocaleString()}`} icon={CreditCard} change="All time" color="green" delay={0} />
        <StatCard label="Pending" value={`Rs ${pending.toLocaleString()}`} icon={Clock} change="Awaiting" color="orange" delay={60} />
        <StatCard label="Transactions" value={payments.length} icon={CheckCircle2} change="All time" color="blue" delay={120} />
        <StatCard label="Refunded" value={payments.filter(p => p.status === 'refunded').length} icon={ArrowUpRight} change="All time" color="purple" delay={180} />
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-border">
          <h3 className="font-display font-bold text-[#1c1917] text-sm">Payment History</h3>
          <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-brick hover:underline">
            <Download size={13} /> Export
          </button>
        </div>
        {payments.length === 0 ? (
          <div className="p-10 sm:p-14 text-center">
            <CreditCard size={32} className="text-border mx-auto mb-3" />
            <p className="font-display font-bold text-[#1c1917] text-sm mb-1">No payments yet</p>
            <p className="text-[#71717a] text-xs">Your payment history will appear here</p>
          </div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-chalk border-b border-border">
                    {['Description', 'Date', 'Method', 'Amount', 'Status'].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold text-[#71717a] uppercase tracking-wider px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payments.map((p, i) => {
                    const s = STATUS_MAP[p.status] || STATUS_MAP.pending
                    const Icon = s.icon
                    return (
                      <tr key={p.id} className="hover:bg-chalk transition-colors animate-fade-in-up"
                        style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}>
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-semibold text-[#1c1917] truncate max-w-[200px]">{p.listing_title}</p>
                          <p className="text-[10px] text-[#71717a] mt-0.5 truncate">{p.transaction_id}</p>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-[#71717a] whitespace-nowrap">{new Date(p.created_at).toLocaleDateString()}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${METHOD_COLOR[p.method] || METHOD_COLOR.cash}`}>{p.method}</span>
                        </td>
                        <td className="px-5 py-3.5 font-display font-black text-[#1c1917] text-sm whitespace-nowrap">Rs {Number(p.amount).toLocaleString()}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.color}`}>
                            <Icon size={9} /> {s.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="sm:hidden divide-y divide-border">
              {payments.map((p, i) => {
                const s = STATUS_MAP[p.status] || STATUS_MAP.pending
                const Icon = s.icon
                return (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-3.5 animate-fade-in-up"
                    style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1c1917] truncate">{p.listing_title}</p>
                      <p className="text-xs text-[#71717a] mt-0.5">{new Date(p.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display font-black text-sm text-[#1c1917]">Rs {Number(p.amount).toLocaleString()}</p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${s.color}`}>
                        <Icon size={9} /> {s.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}