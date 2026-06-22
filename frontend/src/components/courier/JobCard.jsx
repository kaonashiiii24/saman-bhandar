import { Truck, MapPin, Clock, CheckCircle2 } from 'lucide-react'

export default function JobCard({ job, onAccept, accepted, delay = 0 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:shadow-slate-100 hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <Truck size={18} className="text-orange-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-500">{job.id}</span>
              {job.urgent && <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-600 rounded-full">Urgent</span>}
            </div>
            <div className="flex items-start gap-1.5 text-xs text-slate-600">
              <MapPin size={11} className="text-orange-400 mt-0.5 shrink-0" />
              <span>{job.from}</span>
            </div>
            <div className="flex items-start gap-1.5 text-xs text-slate-600 mt-0.5">
              <MapPin size={11} className="text-blue-400 mt-0.5 shrink-0" />
              <span>{job.to}</span>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              {job.time && <span className="flex items-center gap-1 text-[11px] text-slate-400"><Clock size={10} />{job.time}</span>}
              {job.distance && <span className="flex items-center gap-1 text-[11px] text-slate-400"><MapPin size={10} />{job.distance}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:flex-col sm:items-end shrink-0">
          <p className="font-bold text-slate-800 text-lg">{job.earn}</p>
          {accepted ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl">
              <CheckCircle2 size={14} /> Accepted
            </span>
          ) : (
            <button onClick={() => onAccept && onAccept(job.id)} className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
              Accept Job
            </button>
          )}
        </div>
      </div>
    </div>
  )
}