import { useState, useEffect } from 'react'
import { getHowItWorks, createHowItWorks, updateHowItWorks, deleteHowItWorks } from '../../../services/cmsService'
import Loader from '../../../components/common/Loader'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import DynamicListEditor from '../../../components/cms/DynamicListEditor'
import { useToast } from '../../../context/ToastContext'

const fields = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'step_order', label: 'Order', type: 'number' },
]

const fallbackSteps = [
  { title: 'Find a space', description: 'Search by your area. See pricing and host details before you book.', step_order: 1 },
  { title: 'Move your stock in', description: 'Book the space, coordinate with the host, move in on your schedule.', step_order: 2 },
  { title: 'Manage from your phone', description: 'Track stock, chat with your host and request pickups. All in one place.', step_order: 3 },
  { title: 'Scale without stress', description: 'When orders grow, book more space. No lease, no deposit, no commitment.', step_order: 4 },
]

export default function HowItWorksManager() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  const fetch = async () => {
    try {
      const res = await getHowItWorks()
      if (res.data.data.length === 0) {
        for (const item of fallbackSteps) {
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

  useEffect(() => { fetch() }, [])

  const handleUpdate = async (id, data) => {
    try { await updateHowItWorks(id, data); addToast('Step updated', 'success'); fetch() }
    catch { addToast('Failed to update step', 'error') }
  }

  const handleDelete = async (id) => {
    try { await deleteHowItWorks(id); addToast('Step deleted', 'success'); fetch() }
    catch { addToast('Failed to delete step', 'error') }
  }

  const handleReorder = async (newOrder) => {
    const updates = newOrder.map((item, index) => ({ id: item.id, step_order: index }))
    try {
      await Promise.all(updates.map(u => updateHowItWorks(u.id, { step_order: u.step_order })))
      setItems(newOrder)
    } catch { addToast('Reorder failed', 'error') }
  }

  const handleSave = async () => {
    await fetch()
    addToast('Steps refreshed', 'success')
  }

  const handleReset = async () => {
    if (!window.confirm('Delete ALL steps? This cannot be undone.')) return
    try {
      await Promise.all(items.map(i => deleteHowItWorks(i.id)))
      addToast('All steps deleted', 'success')
      fetch()
    } catch { addToast('Failed to reset', 'error') }
  }

  if (loading) return <Loader />

  return (
    <>
      <StickyToolbar
        title="How It Works"
        description="Edit the four steps shown on the homepage. No new steps can be added."
        onSave={handleSave}
        onPreview={() => window.open('/?preview=howitworks', '_blank')}
        onReset={items.length > 0 ? handleReset : undefined}
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