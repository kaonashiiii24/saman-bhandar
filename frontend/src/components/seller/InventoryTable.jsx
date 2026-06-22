import { Package, Edit2, Trash2, AlertTriangle } from 'lucide-react'

const STATUS_MAP = {
  good: { label: 'In Stock', color: 'bg-emerald-100 text-emerald-700' },
  low: { label: 'Low Stock', color: 'bg-amber-100 text-amber-700' },
}

export default function InventoryTable({ items, onEdit, onDelete }) {
  if (!items || items.length === 0) return (
    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
      <Package size={40} className="text-slate-300 mx-auto mb-3" />
      <p className="text-slate-500 text-sm">No inventory items yet</p>
    </div>
  )

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              {['Item', 'Category', 'Quantity', 'Location', 'Status', ''].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item, i) => {
              const status = item.quantity <= 5 ? 'low' : 'good'
              const s = STATUS_MAP[status]
              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Package size={14} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-800">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{item.category || '—'}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {item.quantity <= 5 && <AlertTriangle size={13} className="text-amber-500" />}
                      <span className="text-sm font-semibold text-slate-800">{item.quantity}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{item.location || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${s.color}`}>{s.label}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {onEdit && (
                        <button onClick={() => onEdit(item)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 size={14} />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}