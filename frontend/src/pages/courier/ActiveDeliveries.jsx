import { useState, useEffect } from 'react'
import { Truck, MapPin, CheckCircle2, Package, XCircle } from 'lucide-react'
import { getActiveDeliveries, updateDeliveryStatus, cancelDelivery } from '../../services/courierService'
import Loader from '../../components/common/Loader'
import AlertMessage from '../../components/common/AlertMessage'

const STATUS_MAP = {
  accepted: { label: 'Accepted', color: 'bg-amber-100 text-amber-700', next: 'picked_up', nextLabel: 'Mark as Picked Up' },
  picked_up: { label: 'Picked Up', color: 'bg-blue-100 text-blue-700', next: 'in_transit', nextLabel: 'Mark as In Transit' },
  in_transit: { label: 'In Transit', color: 'bg-purple-100 text-purple-700', next: 'delivered', nextLabel: 'Mark as Delivered' },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700', next: null, nextLabel: null },
}

export default function ActiveDeliveries() {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { fetchDeliveries() }, [])

  const fetchDeliveries = async () => {
    try {
      const res = await getActiveDeliveries()
      setDeliveries(res.data.data.deliveries || [])
    } catch {
      setError('Failed to load deliveries')
    } finally {
      setLoading(false)
    }
  }

  const advance = async (id, currentStatus) => {
    const next = STATUS_MAP[currentStatus].next
    if (!next) return
    
    try {
      await updateDeliveryStatus(id, next)
      setSuccess(`Status updated to ${STATUS_MAP[next].label}`)
      setTimeout(() => setSuccess(''), 3000)
      fetchDeliveries()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status')
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this delivery? It will reappear for other couriers.')) return
    try {
      await cancelDelivery(id)
      setSuccess('Delivery cancelled')
      setTimeout(() => setSuccess(''), 3000)
      fetchDeliveries()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel')
    }
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-3 sm:space-y-4">
      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} />}

      {deliveries.length === 0 && (
        <div className="bg-white border border-border rounded-xl p-10 sm:p-14 text-center animate-fade-in">
          <Truck size={36} className="text-border mx-auto mb-3" />
          <p className="font-display font-bold text-[#1c1917] text-sm mb-1">No active deliveries</p>
          <p className="text-[#71717a] text-xs">Accept delivery requests to see them here</p>
        </div>
      )}

      {deliveries.map((d, i) => {
        const s = STATUS_MAP[d.status] || STATUS_MAP.accepted
        return (
          <div key={d.id} className="bg-white border border-border rounded-xl p-4 sm:p-5 animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}>
            <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-chalk flex items-center justify-center shrink-0">
                  <Package size={15} className="text-[#1c1917]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#71717a] mb-1">Request #{d.id}</p>
                  <div className="flex items-start gap-1.5 text-xs text-[#71717a] mb-0.5">
                    <MapPin size={11} className="text-brick mt-0.5 shrink-0" />
                    <span className="truncate">Pickup: {d.pickup_location}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-xs text-[#71717a]">
                    <MapPin size={11} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span className="truncate">Drop: {d.delivery_location}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-[#71717a]">{d.seller_name} · {d.quantity} items</span>
                    {d.delivery_fee > 0 && (
                      <span className="text-xs font-bold text-[#1c1917]">Rs {Number(d.delivery_fee).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${s.color}`}>{s.label}</span>
              </div>
            </div>
            {s.next && (
              <div className="pt-3 border-t border-border flex gap-2">
                <button onClick={() => advance(d.id, d.status)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1c1917] hover:bg-brick text-white text-sm font-display font-bold py-2.5 rounded-lg transition-colors">
                  <CheckCircle2 size={14} /> {s.nextLabel}
                </button>
                <button onClick={() => handleCancel(d.id)}
                  className="px-4 flex items-center justify-center gap-2 bg-brick-light hover:bg-red-100 text-brick text-sm font-bold py-2.5 rounded-lg transition-colors">
                  <XCircle size={14} /> Cancel
                </button>
              </div>
            )}
            {!s.next && (
              <div className="pt-3 border-t border-border">
                <div className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 text-sm font-display font-bold py-2.5 rounded-lg">
                  <CheckCircle2 size={14} /> Delivery Complete · Items updated
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}