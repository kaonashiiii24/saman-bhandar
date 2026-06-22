import { MapPin, Package, Star, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function StorageCard({ listing, delay = 0 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}>
      <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <Package size={36} className="text-blue-400" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-slate-800 text-sm font-heading">{listing.title}</h3>
          {listing.rating && (
            <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold shrink-0">
              <Star size={11} className="fill-amber-400" /> {listing.rating}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
          <MapPin size={11} /> {listing.location} {listing.size && `· ${listing.size}`}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <span className="text-base font-bold text-slate-800">Rs {listing.price_per_month}</span>
            <span className="text-xs text-slate-400">/mo</span>
          </div>
          <Link to={`/listings/${listing.id}`} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors">
            View <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}