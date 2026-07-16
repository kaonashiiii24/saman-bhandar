import { useState, useEffect } from 'react'
import { getFeatures, createFeature, updateFeature, deleteFeature } from '../../../services/cmsService'
import Loader from '../../../components/common/Loader'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import DynamicListEditor from '../../../components/cms/DynamicListEditor'
import { useToast } from '../../../context/ToastContext'

const fields = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'icon', label: 'Icon', type: 'icon' },
  { key: 'display_order', label: 'Order', type: 'number' },
]

const fallback = [
  { title: 'Storage near you', description: 'Verified godowns and rooms across Kathmandu Valley. Filter by price, size and distance.', icon: 'MapPin', display_order: 1 },
  { title: 'Track every item', description: 'Know exactly what you have stored, where it is, and how much is left — updated live.', icon: 'Box', display_order: 2 },
  { title: 'Courier on demand', description: 'Request a pickup from your dashboard. Couriers come to storage, you stay home.', icon: 'Truck', display_order: 3 },
  { title: 'Hosts we verify', description: 'Every storage host is checked by our team before going live. Your goods are safe.', icon: 'Shield', display_order: 4 },
  { title: 'Talk directly', description: 'Message your host or courier without leaving the app. No WhatsApp needed.', icon: 'MessageSquare', display_order: 5 },
  { title: 'Pay your way', description: 'eSewa, Khalti or cash. Get a full invoice for every payment automatically.', icon: 'Package', display_order: 6 },
]

export default function FeaturesManager() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  const fetch = async () => {
    try {
      const res = await getFeatures()
      if (res.data.data.length === 0) {
        for (const item of fallback) {
          await createFeature(item).catch(() => {})
        }
        const newRes = await getFeatures()
        setItems(newRes.data.data)
      } else {
        setItems(res.data.data)
      }
    } catch { addToast('Failed to load features', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const handleAdd = async (data) => {
    try { await createFeature(data); addToast('Feature added', 'success'); fetch() }
    catch { addToast('Failed to add feature', 'error') }
  }

  const handleUpdate = async (id, data) => {
    try { await updateFeature(id, data); addToast('Feature updated', 'success'); fetch() }
    catch { addToast('Failed to update feature', 'error') }
  }

  const handleDelete = async (id) => {
    try { await deleteFeature(id); addToast('Feature deleted', 'success'); fetch() }
    catch { addToast('Failed to delete feature', 'error') }
  }

  const handleReorder = async (newOrder) => {
    const updates = newOrder.map((item, index) => ({ id: item.id, display_order: index }))
    try {
      await Promise.all(updates.map(u => updateFeature(u.id, { display_order: u.display_order })))
      setItems(newOrder)
    } catch { addToast('Reorder failed', 'error') }
  }

  const handleSave = async () => {
    await fetch()
    addToast('Features refreshed', 'success')
  }

  const handleReset = async () => {
    if (!window.confirm('Delete ALL features? This cannot be undone.')) return
    try {
      await Promise.all(items.map(i => deleteFeature(i.id)))
      addToast('All features deleted', 'success')
      fetch()
    } catch { addToast('Failed to reset', 'error') }
  }

  if (loading) return <Loader />

  return (
    <>
      <StickyToolbar
        title="Features"
        description="Feature cards shown on the homepage."
        onSave={handleSave}
        onPreview={() => window.open('/?preview=features', '_blank')}
        onReset={items.length > 0 ? handleReset : undefined}
      />
      <div className="p-6">
        <DynamicListEditor
          items={items}
          fields={fields}
          title="Features"
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </div>
    </>
  )
}