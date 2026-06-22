import { CalendarCheck, MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

const STATUS_MAP = {
  active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
  completed: { label: 'Completed', color: 'bg-slate-100 text-slate-600', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-600', icon: AlertCircle },
}

export default function BookingCard({ booking, onCancel }) {
  const s = STATUS_MAP[booking.status] || STATUS_MAP.pending
  const Icon = s.icon
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:shadow-slate-100 hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <CalendarCheck size={18} className="text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-slate-800 text-sm">{booking.listing_title || booking.host}</p>
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${s.color}`}>
                <Icon size={10} /> {s.label}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <MapPin size={10} /> {booking.location}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{booking.start_date} → {booking.end_date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:flex-col sm:items-end shrink-0">
          <p className="font-bold text-slate-800">Rs {booking.total_amount}</p>
          <span className="text-xs text-slate-400">{booking.id}</span>
          {booking.status === 'active' && onCancel && (
            <button onClick={() => onCancel(booking.id)} className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}