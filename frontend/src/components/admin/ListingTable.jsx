import { Building2, MapPin, Eye, EyeOff, Trash2 } from 'lucide-react'

export default function ListingTable({ listings, onToggle, onDelete }) {
  if (!listings || listings.length === 0) return (
    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
      <p className="text-slate-500 text-sm">No listings found</p>
    </div>
  )

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              {['Listing', 'Host', 'Location', 'Price', 'Status', ''].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {listings.map((l, i) => (
              <tr key={l.id} className="hover:bg-slate-50/50 transition-colors animate-fade-in-up"
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                      <Building2 size={14} className="text-violet-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-800">{l.title || l.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-500">{l.host_name || l.host}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <MapPin size={11} /> {l.location}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">Rs {l.price_per_month || l.price}/mo</td>
                <td className="px-5 py-3.5">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${l.is_active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {l.is_active !== false ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    {onToggle && (
                      <button onClick={() => onToggle(l.id)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        {l.is_active !== false ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(l.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}