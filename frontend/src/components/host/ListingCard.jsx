import { Building2, MapPin, Package, Eye, EyeOff, Edit2, Trash2 } from 'lucide-react'

export default function ListingCard({ listing, onToggle, onEdit, onDelete, delay = 0 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:shadow-slate-100 hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Building2 size={18} className="text-emerald-600" />
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${listing.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
          {listing.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>
      <h3 className="font-semibold text-slate-800 font-heading">{listing.title}</h3>
      <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
        <MapPin size={11} /> {listing.location}
      </div>
      {listing.size && (
        <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
          <Package size={11} /> {listing.size}
        </div>
      )}
      <p className="text-sm font-bold text-slate-800 mt-2">Rs {listing.price_per_month}/mo</p>
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
        {onEdit && (
          <button onClick={() => onEdit(listing)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 py-1.5 rounded-lg transition-colors">
            <Edit2 size={13} /> Edit
          </button>
        )}
        {onToggle && (
          <button onClick={() => onToggle(listing.id)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 py-1.5 rounded-lg transition-colors">
            {listing.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
            {listing.is_active ? 'Deactivate' : 'Activate'}
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(listing.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  )
}