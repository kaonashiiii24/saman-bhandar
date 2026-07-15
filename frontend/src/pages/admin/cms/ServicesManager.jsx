import { useState, useEffect } from 'react'
import { getServices, createService, updateService, deleteService } from '../../../services/cmsService'
import Loader from '../../../components/common/Loader'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import DynamicListEditor from '../../../components/cms/DynamicListEditor'
import { useToast } from '../../../context/ToastContext'

const fields = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'icon', label: 'Icon', type: 'icon' },
  { key: 'display_order', label: 'Display Order', type: 'number' },
]

const fallback = [
  { title: 'Short-term Storage', description: 'From a few days to several months. Flexible booking with no lock-in contracts.', icon: 'Warehouse', display_order: 1 },
  { title: 'Inventory Management', description: 'Track your stored goods item by item from your seller dashboard.', icon: 'Package', display_order: 2 },
  { title: 'Courier Pickup & Drop-off', description: 'Book a courier to collect from your address and deliver to your storage unit.', icon: 'Truck', display_order: 3 },
  { title: 'Secure Payments', description: 'Pay via eSewa or Khalti. All transactions are encrypted.', icon: 'CreditCard', display_order: 4 },
  { title: 'In-app Messaging', description: 'Chat directly with your host or courier before and during your booking.', icon: 'MessageSquare', display_order: 5 },
  { title: 'Reviews & Trust', description: 'Every completed booking can receive a review.', icon: 'Star', display_order: 6 },
]

export default function ServicesManager() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  const fetch = async () => {
    try { const res = await getServices(); setServices(res.data.data) }
    catch { addToast('Failed to load services', 'error') }
    finally { setLoading(false) }
  }

  const seedIfEmpty = async () => {
    const res = await getServices()
    if (res.data.data.length === 0) {
      for (const item of fallback) {
        await createService(item).catch(() => {})
      }
      const newRes = await getServices()
      setServices(newRes.data.data)
    } else {
      setServices(res.data.data)
    }
  }

  useEffect(() => {
    seedIfEmpty().finally(() => setLoading(false))
  }, [])

  const handleAdd = async (data) => {
    try { await createService(data); addToast('Service added', 'success'); fetch() }
    catch { addToast('Failed to add service', 'error') }
  }

  const handleUpdate = async (id, data) => {
    try { await updateService(id, data); addToast('Service updated', 'success'); fetch() }
    catch { addToast('Failed to update service', 'error') }
  }

  const handleDelete = async (id) => {
    try { await deleteService(id); addToast('Service deleted', 'success'); fetch() }
    catch { addToast('Failed to delete service', 'error') }
  }

  const handleReorder = async (newOrder) => {
    const updates = newOrder.map((item, index) => ({ id: item.id, display_order: index }))
    try {
      await Promise.all(updates.map(u => updateService(u.id, { display_order: u.display_order })))
      setServices(newOrder)
    } catch { addToast('Reorder failed', 'error') }
  }

  const handleReset = async () => {
    if (!window.confirm('Delete ALL services? This cannot be undone.')) return
    try {
      await Promise.all(services.map(s => deleteService(s.id)))
      addToast('Reset complete', 'success')
      fetch()
    } catch { addToast('Failed to reset', 'error') }
  }

  if (loading) return <Loader />

  return (
    <>
      <StickyToolbar
        title="Services"
        description="Manage the services displayed on the Services page."
        onSave={fetch}
        onPreview={() => window.open('/services', '_blank')}
        onReset={services.length > 0 ? handleReset : undefined}
      />
      <div className="p-6">
        <DynamicListEditor
          items={services}
          fields={fields}
          title="Services"
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </div>
    </>
  )
}