import { useState, useEffect } from 'react'
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../../services/cmsService'
import Loader from '../../../components/common/Loader'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import DynamicListEditor from '../../../components/cms/DynamicListEditor'
import { useToast } from '../../../context/ToastContext'

const fields = [
  { key: 'customer_name', label: 'Name', type: 'text' },
  { key: 'position', label: 'Position', type: 'text' },
  { key: 'rating', label: 'Rating (1-5)', type: 'number', min: 1, max: 5, step: 1 },
  { key: 'review', label: 'Review', type: 'textarea' },
  { key: 'display_order', label: 'Order', type: 'number' },
]

const fallback = [
  { customer_name: 'Sachin', position: 'Instagram seller, Pokhara', rating: 5, review: 'Before this I kept stock in my bedroom. Now I have a proper space 5 minutes away and I can actually take bulk orders.', display_order: 1 },
  { customer_name: 'Nabin', position: 'Storage host, Pokhara', rating: 5, review: 'My spare room was doing nothing. Now it earns me Rs 8,000 a month and I barely have to do anything.', display_order: 2 },
  { customer_name: 'Lijas', position: 'Facebook seller, Pokhara', rating: 5, review: 'The inventory tracking alone is worth it. I always know exactly what I have in storage and when pickups are due.', display_order: 3 },
]

export default function TestimonialsManager() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  const fetch = async () => {
    try {
      const res = await getTestimonials()
      if (res.data.data.length === 0) {
        for (const item of fallback) {
          await createTestimonial(item).catch(() => {})
        }
        const newRes = await getTestimonials()
        setItems(newRes.data.data)
      } else {
        setItems(res.data.data)
      }
    } catch { addToast('Failed to load testimonials', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const handleAdd = async (data) => {
    try { await createTestimonial(data); addToast('Testimonial added', 'success'); fetch() }
    catch { addToast('Failed to add testimonial', 'error') }
  }

  const handleUpdate = async (id, data) => {
    try { await updateTestimonial(id, data); addToast('Testimonial updated', 'success'); fetch() }
    catch { addToast('Failed to update testimonial', 'error') }
  }

  const handleDelete = async (id) => {
    try { await deleteTestimonial(id); addToast('Testimonial deleted', 'success'); fetch() }
    catch { addToast('Failed to delete testimonial', 'error') }
  }

  const handleReorder = async (newOrder) => {
    const updates = newOrder.map((item, index) => ({ id: item.id, display_order: index }))
    try {
      await Promise.all(updates.map(u => updateTestimonial(u.id, { display_order: u.display_order })))
      setItems(newOrder)
    } catch { addToast('Reorder failed', 'error') }
  }

  const handleSave = async () => {
    await fetch()
    addToast('Testimonials refreshed', 'success')
  }

  const handleReset = async () => {
    if (!window.confirm('Delete ALL testimonials? This cannot be undone.')) return
    try {
      await Promise.all(items.map(i => deleteTestimonial(i.id)))
      addToast('All testimonials deleted', 'success')
      fetch()
    } catch { addToast('Failed to reset', 'error') }
  }

  if (loading) return <Loader />

  return (
    <>
      <StickyToolbar
        title="Testimonials"
        description="Customer reviews shown on the homepage."
        onSave={handleSave}
        onPreview={() => window.open('/?preview=testimonials', '_blank')}
        onReset={items.length > 0 ? handleReset : undefined}
      />
      <div className="p-6">
        <DynamicListEditor
          items={items}
          fields={fields}
          title="Testimonials"
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </div>
    </>
  )
}