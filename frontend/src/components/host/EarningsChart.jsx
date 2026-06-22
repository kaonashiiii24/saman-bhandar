const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

export default function EarningsChart({ data }) {
  const chartData = data || MONTHS.map((month, i) => ({ month, amount: 5000 + i * 2000 }))
  const max = Math.max(...chartData.map((d) => d.amount))

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <h3 className="font-semibold text-slate-800 font-heading mb-5">Monthly Earnings</h3>
      <div className="flex items-end gap-3 h-40">
        {chartData.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
            <p className="text-[10px] text-slate-500 font-medium">Rs {(d.amount / 1000).toFixed(1)}k</p>
            <div className="w-full bg-slate-100 rounded-t-lg" style={{ height: '100px' }}>
              <div className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-700"
                style={{ height: `${(d.amount / max) * 100}%`, marginTop: `${100 - (d.amount / max) * 100}px` }} />
            </div>
            <p className="text-[10px] text-slate-400">{d.month}</p>
          </div>
        ))}
      </div>
    </div>
  )
}