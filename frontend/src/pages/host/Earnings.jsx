import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, CalendarCheck, ArrowUpRight, Download } from 'lucide-react'
import StatCard from '../../components/common/StatCard'
import { getHostBookings } from '../../services/bookingService'
import Loader from '../../components/common/Loader'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function Earnings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHostBookings()
      .then(res => setBookings(res.data.data.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const completed = bookings.filter(b => ['completed', 'active', 'delivered'].includes(b.status))
  const totalRevenue = completed.reduce((sum, b) => sum + Number(b.total_amount), 0)
  const pendingBookings = bookings.filter(b => b.status === 'pending')
  const pendingAmount = pendingBookings.reduce((sum, b) => sum + Number(b.total_amount), 0)
  const totalBookings = bookings.length
  
  const monthlyData = MONTHS.map((month, i) => {
    const monthBookings = bookings.filter(b => {
      const bookingMonth = new Date(b.start_date).getMonth()
      return bookingMonth === i && ['completed', 'active', 'delivered'].includes(b.status)
    })
    const amount = monthBookings.reduce((sum, b) => sum + Number(b.total_amount), 0)
    return { month, amount }
  })
  
  const max = Math.max(...monthlyData.map(m => m.amount), 1)
  const hasRevenue = totalRevenue > 0

  if (loading) return <Loader />

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Earned" value={`Rs ${totalRevenue.toLocaleString()}`} icon={DollarSign} change="All time" color="green" delay={0} />
        <StatCard label="Pending" value={`Rs ${pendingAmount.toLocaleString()}`} icon={CalendarCheck} change={`${pendingBookings.length} bookings`} color="orange" delay={60} />
        <StatCard label="Completed" value={completed.length} icon={TrendingUp} change={`${totalBookings} total`} color="blue" delay={120} />
        <StatCard label="Avg/Booking" value={completed.length ? `Rs ${Math.floor(totalRevenue / completed.length).toLocaleString()}` : 'Rs 0'} icon={ArrowUpRight} change="Per booking" color="purple" delay={180} />
      </div>

      <div className="bg-white border border-border rounded-xl p-4 sm:p-5 animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-[#1c1917] text-sm">Revenue Overview</h3>
          <span className="text-[10px] text-[#71717a]">{new Date().getFullYear()}</span>
        </div>
        {hasRevenue ? (
          <div className="flex items-end gap-1 sm:gap-2 h-36 sm:h-44">
            {monthlyData.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                <p className="text-[8px] sm:text-[10px] text-[#71717a] hidden sm:block font-medium">
                  {m.amount > 0 ? `Rs ${(m.amount / 1000).toFixed(1)}k` : ''}
                </p>
                <div className="w-full bg-chalk rounded-t-md relative" style={{ height: '100px' }}>
                  <div 
                    className={`w-full rounded-t-md transition-all duration-700 absolute bottom-0 ${m.amount > 0 ? 'bg-[#1c1917]' : 'bg-chalk-dark'}`}
                    style={{ height: `${(m.amount / max) * 100}%` }} 
                  />
                </div>
                <p className="text-[8px] sm:text-[10px] text-[#71717a] font-medium truncate w-full text-center">{m.month}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-36 sm:h-44">
            <div className="text-center">
              <DollarSign size={28} className="text-border mx-auto mb-2" />
              <p className="text-sm text-[#71717a]">No revenue data yet</p>
              <p className="text-xs text-[#71717a] mt-0.5">Revenue will show here once bookings are completed</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-border">
          <h3 className="font-display font-bold text-[#1c1917] text-sm">Transaction History</h3>
          <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#71717a] hover:text-[#1c1917] transition-colors">
            <Download size={13} /> Export
          </button>
        </div>
        {bookings.length === 0 ? (
          <div className="p-10 sm:p-14 text-center">
            <DollarSign size={32} className="text-border mx-auto mb-3" />
            <p className="font-display font-bold text-[#1c1917] text-sm mb-1">No transactions yet</p>
            <p className="text-[#71717a] text-xs">Transactions will appear when sellers book your spaces</p>
          </div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-chalk border-b border-border">
                    {['Seller', 'Listing', 'Dates', 'Amount', 'Status'].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold text-[#71717a] uppercase tracking-wider px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookings.map((b, i) => (
                    <tr key={b.id} className="hover:bg-chalk transition-colors animate-fade-in-up"
                      style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}>
                      <td className="px-5 py-3.5 text-sm font-semibold text-[#1c1917]">{b.seller_name}</td>
                      <td className="px-5 py-3.5 text-sm text-[#71717a] max-w-[180px] truncate">{b.listing_title}</td>
                      <td className="px-5 py-3.5 text-xs text-[#71717a] whitespace-nowrap">{b.start_date} → {b.end_date}</td>
                      <td className="px-5 py-3.5 font-display font-black text-[#1c1917] text-sm whitespace-nowrap">Rs {Number(b.total_amount).toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                          ['completed', 'delivered'].includes(b.status) ? 'bg-emerald-100 text-emerald-700' :
                          ['active', 'picking_up', 'in_transit'].includes(b.status) ? 'bg-blue-100 text-blue-700' :
                          b.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-brick-light text-brick'
                        }`}>
                          {b.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="sm:hidden divide-y divide-border">
              {bookings.map((b, i) => (
                <div key={b.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-chalk transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#1c1917] truncate">{b.seller_name}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize shrink-0 ${
                        ['completed', 'delivered'].includes(b.status) ? 'bg-emerald-100 text-emerald-700' :
                        ['active', 'picking_up', 'in_transit'].includes(b.status) ? 'bg-blue-100 text-blue-700' :
                        b.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-brick-light text-brick'
                      }`}>
                        {b.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-[#71717a] truncate mt-0.5">{b.listing_title}</p>
                    <p className="text-xs text-[#71717a]">{b.start_date} → {b.end_date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display font-black text-sm text-[#1c1917]">Rs {Number(b.total_amount).toLocaleString()}</p>
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