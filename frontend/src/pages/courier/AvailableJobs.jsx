import { useState, useEffect } from 'react'
import { Truck, MapPin, Clock, CheckCircle2, Briefcase, Package } from 'lucide-react'
import { getAvailableJobs, acceptJob } from '../../services/courierService'
import Loader from '../../components/common/Loader'
import AlertMessage from '../../components/common/AlertMessage'

export default function AvailableJobs() {
  const [jobs, setJobs] = useState([])
  const [accepted, setAccepted] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { fetchJobs() }, [])

  const fetchJobs = async () => {
    try {
      const res = await getAvailableJobs()
      setJobs(res.data.data.jobs || [])
    } catch {
      setError('Failed to load available jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (jobId) => {
    try {
      await acceptJob(jobId)
      setAccepted([...accepted, jobId])
      setSuccess('Job accepted! Check Active Deliveries.')
      setTimeout(() => setSuccess(''), 3000)
      fetchJobs()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept job')
    }
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-3 sm:space-y-4">
      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} />}

      <div className="flex items-center justify-between animate-fade-in-up">
        <p className="text-xs font-semibold text-[#71717a]">{jobs.length} delivery requests available</p>
      </div>

      {jobs.length === 0 && (
        <div className="bg-white border border-border rounded-xl p-10 sm:p-14 text-center">
          <Briefcase size={36} className="text-border mx-auto mb-3" />
          <p className="font-display font-bold text-[#1c1917] text-sm mb-1">No available jobs</p>
          <p className="text-[#71717a] text-xs">Check back later for new delivery requests</p>
        </div>
      )}

      {jobs.map((j, i) => (
        <div key={j.id} className="bg-white border border-border rounded-xl p-4 sm:p-5 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up"
          style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-chalk flex items-center justify-center shrink-0">
                <Truck size={15} className="text-[#1c1917]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs font-bold text-[#71717a]">Request #{j.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-brick-light text-brick rounded-full shrink-0">New</span>
                </div>
                <div className="flex items-start gap-1.5 text-xs text-[#71717a] mb-0.5">
                  <MapPin size={11} className="text-brick mt-0.5 shrink-0" />
                  <span className="truncate">Pickup: {j.pickup_location}</span>
                </div>
                <div className="flex items-start gap-1.5 text-xs text-[#71717a]">
                  <MapPin size={11} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span className="truncate">Drop: {j.delivery_location}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-[10px] text-[#71717a]"><Package size={9} />{j.quantity} items</span>
                  <span className="flex items-center gap-1 text-[10px] text-[#71717a]"><Clock size={9} />{new Date(j.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0 pl-12 sm:pl-0">
              <p className="font-display font-black text-xl sm:text-2xl text-[#1c1917]">{j.seller_name}</p>
              {accepted.includes(j.id) ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                  <CheckCircle2 size={13} /> Accepted
                </span>
              ) : (
                <button onClick={() => handleAccept(j.id)}
                  className="bg-[#1c1917] hover:bg-brick text-white text-xs font-display font-bold px-4 py-2 rounded-lg transition-colors">
                  Accept Job
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}