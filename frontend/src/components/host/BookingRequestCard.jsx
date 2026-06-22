import { User, MapPin, CheckCircle2, XCircle, Clock } from 'lucide-react'

export default function BookingRequestCard({ booking, onApprove, onReject }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:shadow-slate-100 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <User size={18} className="text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <p className="font-semibold text-slate-800 text-sm">{booking.seller_name}</p>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                <Clock size={9} /> Pending
              </span>
            </div>
            <p className="text-xs text-slate-500">{booking.listing_title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{booking.start_date} → {booking.end_date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:flex-col sm:items-end shrink-0">
          <p className="font-bold text-slate-800">Rs {booking.total_amount}</p>
          <div className="flex gap-2">
            {onApprove && (
              <button onClick={() => onApprove(booking.id)} className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                <CheckCircle2 size={13} /> Approve
              </button>
            )}
            {onReject && (
              <button onClick={() => onReject(booking.id)} className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                <XCircle size={13} /> Reject
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}