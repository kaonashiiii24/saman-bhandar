import { useState } from 'react'
import { Briefcase, Truck, DollarSign, Star, ArrowRight, CheckCircle2, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/common/StatCard'
import { useAuth } from '../../hooks/useAuth'

export default function CourierDashboard() {
  const { user } = useAuth()
  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
        <div>
          <p className="text-xs font-semibold text-[#71717a] uppercase tracking-wider">{greeting()}</p>
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#1c1917] mt-0.5">{user?.full_name || 'Courier'} </h2>
        </div>
        <Link to="/courier/jobs" className="inline-flex items-center gap-2 bg-[#1c1917] hover:bg-brick text-white font-display font-bold px-4 py-2.5 rounded-lg transition-colors text-sm shrink-0 self-start sm:self-auto">
          <Briefcase size={15} /> Find Jobs
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Jobs Done" value="0" icon={CheckCircle2} change="All time" color="green" delay={0} />
        <StatCard label="Active Jobs" value="0" icon={Truck} change="In progress" color="blue" delay={60} />
        <StatCard label="Total Earned" value="Rs 0" icon={DollarSign} change="All time" color="orange" delay={120} />
        <StatCard label="Rating" value="—" icon={Star} change="No reviews" color="purple" delay={180} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
        <div className="xl:col-span-2 bg-white border border-border rounded-xl p-8 sm:p-12 text-center animate-fade-in-up">
          <div className="w-14 h-14 rounded-2xl bg-chalk flex items-center justify-center mx-auto mb-4">
            <Briefcase size={24} className="text-[#71717a]" />
          </div>
          <p className="font-display font-bold text-[#1c1917] mb-1">No recent jobs</p>
          <p className="text-[#71717a] text-sm mb-5">Accept delivery jobs to see them here</p>
          <Link to="/courier/jobs" className="inline-flex items-center gap-2 bg-[#1c1917] hover:bg-brick text-white font-display font-bold px-5 py-2.5 rounded-lg transition-colors text-sm">
            Browse Available Jobs <ArrowRight size={14} />
          </Link>
        </div>

        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
          <div className="bg-white border border-border rounded-xl p-4 sm:p-5">
            <h3 className="font-display font-bold text-[#1c1917] text-sm mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Find Jobs', desc: 'Browse deliveries', to: '/courier/jobs', icon: Briefcase },
                { label: 'My Deliveries', desc: 'Track active jobs', to: '/courier/deliveries', icon: Truck },
                { label: 'My Profile', desc: 'Update your info', to: '/courier/profile', icon: Package },
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
          <div className="bg-brick-light border border-brick/15 rounded-xl p-4">
            <p className="text-xs font-bold text-brick mb-1">💡 Tip</p>
            <p className="text-xs text-[#3a3a3a] leading-relaxed">Complete jobs quickly and get 5-star ratings to unlock premium routes.</p>
          </div>
        </div>
      </div>
    </div>
  )
}