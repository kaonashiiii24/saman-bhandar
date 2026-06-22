import { Package, MapPin, CheckCircle2, Clock, Truck } from 'lucide-react'

const STATUS_MAP = {
  picking_up: { label: 'Picking Up', color: 'bg-amber-100 text-amber-700', next: 'in_transit', nextLabel: 'Mark as Picked Up' },
  in_transit: { label: 'In Transit', color: 'bg-blue-100 text-blue-700', next: 'delivered', nextLabel: 'Mark as Delivered' },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700', next: null, nextLabel: null },
}

export default function PickupCard({ delivery, onAdvance, delay = 0 }) {
  const s = STATUS_MAP[delivery.status] || STATUS_MAP.picking_up
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <Package size={18} className="text-orange-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">{delivery.id}</p>
            <div className="flex items-start gap-1.5 text-xs text-slate-600">
              <MapPin size={11} className="text-orange-400 mt-0.5 shrink-0" />
              <span>{delivery.from}</span>
            </div>
            <div className="flex items-start gap-1.5 text-xs text-slate-600 mt-0.5">
              <MapPin size={11} className="text-blue-400 mt-0.5 shrink-0" />
              <span>{delivery.to}</span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-slate-800">{delivery.earn}</p>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${s.color}`}>{s.label}</span>
        </div>
      </div>
      <div className="pt-4 border-t border-slate-100">
        {s.next ? (
          <button onClick={() => onAdvance && onAdvance(delivery.id)} className="w-full flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors">
            <CheckCircle2 size={13} /> {s.nextLabel}
          </button>
        ) : (
          <div className="w-full flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold py-2.5 rounded-xl">
            <CheckCircle2 size={13} /> Delivery Complete
          </div>
        )}
      </div>
    </div>
  )
}