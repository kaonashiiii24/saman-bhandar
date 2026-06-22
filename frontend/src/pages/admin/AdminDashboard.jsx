import { useState, useEffect } from 'react'
import { Users, Building2, BarChart3, DollarSign, TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/common/StatCard'
import api from '../../services/api'
import Loader from '../../components/common/Loader'

const ROLE_COLOR = {
  seller: 'bg-blue-100 text-blue-700',
  host: 'bg-emerald-100 text-emerald-700',
  courier: 'bg-amber-100 text-amber-700',
  admin: 'bg-brick-light text-brick',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/admin/stats'), api.get('/admin/users')])
      .then(([s, u]) => {
        setStats(s.data.data)
        setUsers((u.data.data.users || []).slice(0, 5))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-0.5">
          <ShieldCheck size={16} className="text-brick" />
          <p className="text-xs font-semibold text-[#71717a] uppercase tracking-wider">Admin Panel</p>
        </div>
        <h2 className="font-display font-black text-xl sm:text-2xl text-[#1c1917]">Platform Overview</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Users" value={stats?.total_users || 0} icon={Users} change="All time" color="blue" delay={0} />
        <StatCard label="Total Listings" value={stats?.total_listings || 0} icon={Building2} change="All time" color="green" delay={60} />
        <StatCard label="Total Bookings" value={stats?.total_bookings || 0} icon={BarChart3} change={`${stats?.active_bookings || 0} active`} color="orange" delay={120} />
        <StatCard label="Platform Earnings" value={`Rs ${Number(stats?.platform_earnings || 0).toLocaleString()}`} icon={TrendingUp} change={`${stats?.total_commission || 0} commission`} color="purple" delay={180} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Revenue" value={`Rs ${Number(stats?.total_revenue || 0).toLocaleString()}`} icon={DollarSign} change="All bookings" color="emerald" delay={240} />
        <StatCard label="Commission (10%)" value={`Rs ${Number(stats?.total_commission || 0).toLocaleString()}`} icon={TrendingUp} change="Platform fee" color="brick" delay={300} />
        <StatCard label="Pending" value={stats?.pending_bookings || 0} icon={BarChart3} change="Awaiting approval" color="amber" delay={360} />
        <StatCard label="Active Now" value={stats?.active_bookings || 0} icon={TrendingUp} change="In progress" color="blue" delay={420} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
        <div className="xl:col-span-2 bg-white border border-border rounded-xl overflow-hidden animate-fade-in-up">
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-border">
            <h3 className="font-display font-bold text-[#1c1917] text-sm">Recent Users</h3>
            <Link to="/admin/users" className="text-xs font-semibold text-brick hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {users.length === 0 ? (
            <div className="px-5 py-10 text-center"><p className="text-[#71717a] text-sm">No users yet</p></div>
          ) : (
            <div className="divide-y divide-border">
              {users.map((u, i) => (
                <div key={u.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 hover:bg-chalk transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}>
                  <div className="w-8 h-8 rounded-lg bg-[#1c1917] flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {u.full_name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1c1917] truncate">{u.full_name}</p>
                    <p className="text-xs text-[#71717a] truncate mt-0.5 hidden sm:block">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${ROLE_COLOR[u.role] || 'bg-[#F4F4F5] text-[#71717a]'}`}>{u.role}</span>
                    {u.status === 'pending' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Pending</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <div className="bg-white border border-border rounded-xl p-4 sm:p-5">
            <h3 className="font-display font-bold text-[#1c1917] text-sm mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Manage Users', desc: 'View and moderate', to: '/admin/users', icon: Users },
                { label: 'Manage Listings', desc: 'Review listings', to: '/admin/listings', icon: Building2 },
                { label: 'Analytics', desc: 'Platform stats', to: '/admin/analytics', icon: BarChart3 },
              ].map(a => (
                <Link key={a.to} to={a.to}
                  className="flex items-center gap-3 p-3 bg-chalk rounded-lg hover:bg-chalk-dark transition-colors group">
                  <div className="w-7 h-7 rounded-md bg-white border border-border flex items-center justify-center shrink-0 group-hover:border-[#1c1917] transition-colors">
                    <a.icon size={13} className="text-[#1c1917]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1c1917] leading-none">{a.label}</p>
                    <p className="text-xs text-[#71717a] mt-0.5 hidden sm:block">{a.desc}</p>
                  </div>
                  <ArrowRight size={13} className="text-[#71717a] group-hover:text-brick group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
          
          <div className="bg-chalk-dark border border-border rounded-xl p-4">
            <h3 className="font-display font-bold text-[#1c1917] text-sm mb-2">💰 Commission Model</h3>
            <div className="space-y-1.5 text-xs text-[#52525b]">
              <div className="flex justify-between">
                <span>Commission Rate</span>
                <span className="font-bold">10%</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Earnings</span>
                <span className="font-bold text-brick">Rs {Number(stats?.platform_earnings || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Transaction Volume</span>
                <span className="font-bold">Rs {Number(stats?.total_revenue || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}