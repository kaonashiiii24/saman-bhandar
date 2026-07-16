import { useState, useEffect } from 'react'
import { getFaqs, createFaq, updateFaq, deleteFaq } from '../../../services/cmsService'
import Loader from '../../../components/common/Loader'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import DynamicListEditor from '../../../components/cms/DynamicListEditor'
import { useToast } from '../../../context/ToastContext'

const fields = [
  { key: 'question', label: 'Question', type: 'text' },
  { key: 'answer', label: 'Answer', type: 'textarea' },
  { key: 'display_order', label: 'Order', type: 'number' },
]

const fallbackFaqs = [
  { question: 'How does SamanBhandar work?', answer: 'Sellers find nearby storage hosts, book a space, store their inventory, and schedule courier pickups with all from one dashboard.', display_order: 1 },
  { question: 'How do I become a storage host?', answer: 'Register as a host, list your unused room or garage, set your price, and start accepting bookings after our team verifies you.', display_order: 2 },
  { question: 'Is my inventory safe?', answer: 'All hosts are verified by our team before going live. You can also read reviews from other sellers before booking.', display_order: 3 },
  { question: 'What payment methods are supported?', answer: 'We support eSewa and Khalti for all payments. Cash is also accepted for in-person arrangements.', display_order: 4 },
  { question: 'Can I cancel a booking?', answer: 'Yes, you can cancel up to 24 hours before your scheduled move-in date for a full refund.', display_order: 5 },
]

export default function FaqManager() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  const fetch = async () => {
    try {
      const res = await getFaqs()
      if (res.data.data.length === 0) {
        for (const item of fallbackFaqs) {
          await createFaq(item).catch(() => {})
        }
        const newRes = await getFaqs()
        setItems(newRes.data.data)
      } else {
        setItems(res.data.data)
      }
    } catch { addToast('Failed to load FAQs', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const handleAdd = async (data) => {
    try { await createFaq(data); addToast('FAQ added', 'success'); fetch() }
    catch { addToast('Failed to add FAQ', 'error') }
  }

  const handleUpdate = async (id, data) => {
    try { await updateFaq(id, data); addToast('FAQ updated', 'success'); fetch() }
    catch { addToast('Failed to update FAQ', 'error') }
  }

  const handleDelete = async (id) => {
    try { await deleteFaq(id); addToast('FAQ deleted', 'success'); fetch() }
    catch { addToast('Failed to delete FAQ', 'error') }
  }

  const handleReorder = async (newOrder) => {
    const updates = newOrder.map((item, index) => ({ id: item.id, display_order: index }))
    try {
      await Promise.all(updates.map(u => updateFaq(u.id, { display_order: u.display_order })))
      setItems(newOrder)
    } catch { addToast('Reorder failed', 'error') }
  }

  const handleSave = async () => {
    await fetch()
    addToast('FAQs refreshed', 'success')
  }

  const handleReset = async () => {
    if (!window.confirm('Delete ALL FAQs? This cannot be undone.')) return
    try {
      await Promise.all(items.map(i => deleteFaq(i.id)))
      addToast('All FAQs deleted', 'success')
      fetch()
    } catch { addToast('Failed to reset', 'error') }
  }

  if (loading) return <Loader />

  return (
    <>
      <StickyToolbar
        title="FAQs"
        description="Frequently asked questions shown on the homepage."
        onSave={handleSave}
        onPreview={() => window.open('/?preview=faq', '_blank')}
        onReset={items.length > 0 ? handleReset : undefined}
      />
      <div className="p-6">
        <DynamicListEditor
          items={items}
          fields={fields}
          title="FAQs"
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </div>
    </>
  )
}