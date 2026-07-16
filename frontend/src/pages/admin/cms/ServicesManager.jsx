
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
  { key: 'tags', label: 'Tags (comma separated)', type: 'text' },
  { key: 'display_order', label: 'Display Order', type: 'number' },
]

const fallbackServices = [
  { title: 'Short-term Storage', description: 'From a few days to several months. Flexible booking with no lock-in contracts.', icon: 'Warehouse', tags: 'Flexible duration,Any size,Verified hosts', display_order: 1 },
  { title: 'Inventory Management', description: 'Track your stored goods item by item from your seller dashboard.', icon: 'Package', tags: 'Real-time,Item tracking,Export ready', display_order: 2 },
  { title: 'Courier Pickup & Drop-off', description: 'Book a courier to collect from your address and deliver to your storage unit.', icon: 'Truck', tags: 'Same-day,GPS tracked,Insured', display_order: 3 },
  { title: 'Secure Payments', description: 'Pay via eSewa or Khalti. All transactions are encrypted.', icon: 'CreditCard', tags: 'eSewa,Khalti,Weekly payouts', display_order: 4 },
  { title: 'In-app Messaging', description: 'Chat directly with your host or courier before and during your booking.', icon: 'MessageSquare', tags: 'Real-time,Secure,Archived', display_order: 5 },
  { title: 'Reviews & Trust', description: 'Every completed booking can receive a review.', icon: 'Star', tags: 'Verified reviews,Two-way,Public profiles', display_order: 6 },
]

export default function ServicesManager() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  const fetch = async () => {
    try {
      const res = await getServices()
      if (res.data.data.length === 0) {
        for (const item of fallbackServices) {
          const payload = { ...item, tags: item.tags.split(',').map(t => t.trim()) }
          await createService(payload).catch(() => {})
        }
        const newRes = await getServices()
        setServices(newRes.data.data.map(s => ({ ...s, tags: Array.isArray(s.tags) ? s.tags.join(', ') : (s.tags || '') })))
      } else {
        setServices(res.data.data.map(s => ({ ...s, tags: Array.isArray(s.tags) ? s.tags.join(', ') : (s.tags || '') })))
      }
    } catch { addToast('Failed to load services', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const handleAdd = async (data) => {
    try {
      const payload = { ...data, tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [] }
      await createService(payload)
      addToast('Service added', 'success')
      fetch()
    } catch { addToast('Failed to add service', 'error') }
  }

  const handleUpdate = async (id, data) => {
    try {
      const payload = { ...data, tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [] }
      await updateService(id, payload)
      addToast('Service updated', 'success')
      fetch()
    } catch { addToast('Failed to update service', 'error') }
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

  const handleSave = async () => {
    await fetch()
    addToast('Services refreshed', 'success')
  }

  const handleReset = async () => {
    if (!window.confirm('Delete ALL services? This cannot be undone.')) return
    try {
      await Promise.all(services.map(s => deleteService(s.id)))
      addToast('All services deleted', 'success')
      fetch()
    } catch { addToast('Failed to reset', 'error') }
  }

  if (loading) return <Loader />

  return (
    <>
      <StickyToolbar
        title="Services List"
        description="Manage the service cards shown on the Services page."
        onSave={handleSave}
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