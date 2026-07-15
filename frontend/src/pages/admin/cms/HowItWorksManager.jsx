import { useState, useEffect } from 'react'
import { getHowItWorks, createHowItWorks, updateHowItWorks, deleteHowItWorks } from '../../../services/cmsService'
import Loader from '../../../components/common/Loader'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import DynamicListEditor from '../../../components/cms/DynamicListEditor'
import { useToast } from '../../../context/ToastContext'

const fields = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'icon', label: 'Icon', type: 'icon' },
  { key: 'step_order', label: 'Order', type: 'number' },
]

const fallback = [
  { title: 'Find a space', description: 'Search by your area. See pricing and host details before you book.', icon: 'Search', step_order: 1 },
  { title: 'Move your stock in', description: 'Book the space, coordinate with the host, move in on your schedule.', icon: 'Package', step_order: 2 },
  { title: 'Manage from your phone', description: 'Track stock, chat with your host and request pickups. All in one place.', icon: 'Smartphone', step_order: 3 },
  { title: 'Scale without stress', description: 'When orders grow, book more space. No lease, no deposit, no commitment.', icon: 'TrendingUp', step_order: 4 },
]

export default function HowItWorksManager() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  const seedIfEmpty = async () => {
    try {
      const res = await getHowItWorks()
      if (res.data.data.length === 0) {
        for (const item of fallback) {
          await createHowItWorks(item).catch(() => {})
        }
        const newRes = await getHowItWorks()
        setItems(newRes.data.data)
      } else {
        setItems(res.data.data)
      }
    } catch { addToast('Failed to load steps', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { seedIfEmpty() }, [])

  const handleUpdate = async (id, data) => {
    try { await updateHowItWorks(id, data); addToast('Step updated', 'success'); setItems(prev => prev.map(i => i.id === id ? { ...i, ...data } : i)) }
    catch { addToast('Failed to update step', 'error') }
  }

  const handleDelete = async (id) => {
    try { await deleteHowItWorks(id); addToast('Step deleted', 'success'); setItems(prev => prev.filter(i => i.id !== id)) }
    catch { addToast('Failed to delete step', 'error') }
  }

  const handleReorder = async (newOrder) => {
    const updates = newOrder.map((item, index) => ({ id: item.id, step_order: index }))
    try {
      await Promise.all(updates.map(u => updateHowItWorks(u.id, { step_order: u.step_order })))
      setItems(newOrder)
    } catch { addToast('Reorder failed', 'error') }
  }

  if (loading) return <Loader />

  return (
    <>
      <StickyToolbar
        title="How It Works"
        description="The four steps shown on the homepage. You can edit or reorder them, but not add new steps."
        onPreview={() => window.open('/?preview=howitworks', '_blank')}
      />
      <div className="p-6">
        <DynamicListEditor
          items={items}
          fields={fields}
          title="Steps"
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onReorder={handleReorder}
          allowAdd={false}
        />
      </div>
    </>
  )
}