import { useState, useEffect } from 'react'
import { TrendingUp, Users, Building2, DollarSign, Percent } from 'lucide-react'
import StatCard from '../../components/common/StatCard'
import api from '../../services/api'
import Loader from '../../components/common/Loader'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function Analytics() {
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/admin/stats'), api.get('/admin/bookings')])
      .then(([s, b]) => {
        setStats(s.data.data)
        setBookings(b.data.data.bookings || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const monthlyData = MONTHS.map((month, i) => {
    const monthBookings = bookings.filter(b => {
      const bookingMonth = new Date(b.start_date).getMonth()
      return bookingMonth === i && ['active', 'completed', 'delivered'].includes(b.status)
    })
    const revenue = monthBookings.reduce((sum, b) => sum + Number(b.total_amount), 0)
    const commission = monthBookings.reduce((sum, b) => sum + Number(b.commission_amount || 0), 0)
    return { month, revenue, commission, bookings: monthBookings.length }
  })

  const maxRevenue = Math.max(...monthlyData.map(m => m.revenue), 1)
  const maxCommission = Math.max(...monthlyData.map(m => m.commission), 1)
  const hasData = stats?.total_bookings > 0

  if (loading) return <Loader />

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Users" value={stats?.total_users || 0} icon={Users} change="All time" color="blue" delay={0} />
        <StatCard label="Total Listings" value={stats?.total_listings || 0} icon={Building2} change="All time" color="green" delay={60} />
        <StatCard label="Platform Earnings" value={`Rs ${Number(stats?.platform_earnings || 0).toLocaleString()}`} icon={DollarSign} change="10% commission" color="purple" delay={120} />
        <StatCard label="Commission Rate" value="10%" icon={Percent} change="Per booking" color="orange" delay={180} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <div className="bg-white border border-border rounded-xl p-4 sm:p-5 animate-fade-in-up">
          <h3 className="font-display font-bold text-[#1c1917] text-sm mb-5">Revenue Overview</h3>
          {hasData ? (
            <div className="flex items-end gap-1 sm:gap-2 h-36 sm:h-44">
              {monthlyData.map(m => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                  <p className="text-[8px] sm:text-[10px] text-[#71717a] hidden sm:block font-medium">
                    {m.revenue > 0 ? `Rs ${(m.revenue / 1000).toFixed(0)}k` : ''}
                  </p>
                  <div className="w-full bg-chalk rounded-t-md relative" style={{ height: '100px' }}>
                    <div 
                      className={`w-full rounded-t-md transition-all duration-700 absolute bottom-0 ${m.revenue > 0 ? 'bg-[#1c1917]' : 'bg-chalk-dark'}`}
                      style={{ height: `${(m.revenue / maxRevenue) * 100}%` }} 
                    />
                  </div>
                  <p className="text-[8px] sm:text-[10px] text-[#71717a] font-medium truncate w-full text-center">{m.month}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-36 sm:h-44">
              <p className="text-sm text-[#71717a]">No revenue data yet</p>
            </div>
          )}
        </div>

        <div className="bg-white border border-border rounded-xl p-4 sm:p-5 animate-fade-in-up">
          <h3 className="font-display font-bold text-[#1c1917] text-sm mb-5">Commission Earned</h3>
          {hasData ? (
            <div className="flex items-end gap-1 sm:gap-2 h-36 sm:h-44">
              {monthlyData.map(m => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                  <p className="text-[8px] sm:text-[10px] text-[#71717a] hidden sm:block font-medium">
                    {m.commission > 0 ? `Rs ${(m.commission / 1000).toFixed(0)}k` : ''}
                  </p>
                  <div className="w-full bg-chalk rounded-t-md relative" style={{ height: '100px' }}>
                    <div 
                      className={`w-full rounded-t-md transition-all duration-700 absolute bottom-0 ${m.commission > 0 ? 'bg-brick' : 'bg-chalk-dark'}`}
                      style={{ height: `${(m.commission / maxCommission) * 100}%` }} 
                    />
                  </div>
                  <p className="text-[8px] sm:text-[10px] text-[#71717a] font-medium truncate w-full text-center">{m.month}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-36 sm:h-44">
              <p className="text-sm text-[#71717a]">No commission data yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden animate-fade-in-up">
        <div className="px-4 sm:px-5 py-4 border-b border-border">
          <h3 className="font-display font-bold text-[#1c1917] text-sm">Monthly Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-chalk border-b border-border">
                {['Month', 'Bookings', 'Revenue', 'Commission', 'Host Earns'].map(h => (
                  <th key={h} className="text-left text-[10px] font-bold text-[#71717a] uppercase tracking-wider px-4 sm:px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {monthlyData.map(m => (
                <tr key={m.month} className="hover:bg-chalk transition-colors">
                  <td className="px-4 sm:px-5 py-3.5 text-sm font-semibold text-[#1c1917]">{m.month}</td>
                  <td className="px-4 sm:px-5 py-3.5 text-sm text-[#71717a]">{m.bookings}</td>
                  <td className="px-4 sm:px-5 py-3.5 text-sm text-[#71717a]">Rs {m.revenue.toLocaleString()}</td>
                  <td className="px-4 sm:px-5 py-3.5 text-sm font-semibold text-brick">Rs {m.commission.toLocaleString()}</td>
                  <td className="px-4 sm:px-5 py-3.5 text-sm text-emerald-600">Rs {(m.revenue - m.commission).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}