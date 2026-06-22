import { TrendingUp, TrendingDown } from 'lucide-react'

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
  green: { bg: 'bg-emerald-50', icon: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
  purple: { bg: 'bg-violet-50', icon: 'text-violet-600', badge: 'bg-violet-100 text-violet-700' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-500', badge: 'bg-orange-100 text-orange-700' },
  red: { bg: 'bg-brick-light', icon: 'text-brick', badge: 'bg-brick-light text-brick' },
}

export default function StatCard({ label, value, icon: Icon, change, changeType = 'up', color = 'blue', delay = 0 }) {
  const c = colorMap[color] || colorMap.blue
  return (
    <div className="bg-white border border-border rounded-xl p-5 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#71717a] uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-display font-black text-[#1c1917]">{value}</p>
          {change && (
            <div className={`inline-flex items-center gap-1 mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>
              {changeType === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {change}
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
          <Icon size={18} className={c.icon} />
        </div>
      </div>
    </div>
  )
}