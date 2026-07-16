import { useState, useEffect } from 'react'
import { getPricingPlans, createPricingPlan, updatePricingPlan, deletePricingPlan } from '../../../services/cmsService'
import Loader from '../../../components/common/Loader'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import DynamicListEditor from '../../../components/cms/DynamicListEditor'
import { useToast } from '../../../context/ToastContext'

const fields = [
  { key: 'name', label: 'Plan Name', type: 'text' },
  { key: 'price', label: 'Price', type: 'text' },
  { key: 'note', label: 'Note', type: 'text' },
  { key: 'features', label: 'Features (one per line)', type: 'textarea' },
  { key: 'cta_text', label: 'CTA Text', type: 'text' },
  { key: 'cta_link', label: 'CTA Link', type: 'text' },
  { key: 'highlight', label: 'Highlight (Most Popular)', type: 'checkbox' },
  { key: 'display_order', label: 'Order', type: 'number' },
]

const fallbackPlans = [
  { name: 'Seller', price: 'Free', note: 'to browse and book', features: ['Browse all listings', 'Book storage spaces', 'Request courier pickup', 'In-app messaging', 'Pay via eSewa / Khalti'], cta_text: 'Start for free', cta_link: '/register', highlight: 0, display_order: 1 },
  { name: 'Host', price: '10%', note: 'commission per booking', features: ['List unlimited spaces', 'Manage booking requests', 'Earnings dashboard', 'In-app messaging', 'Weekly payouts'], cta_text: 'List your space', cta_link: '/register?role=host', highlight: 1, display_order: 2 },
  { name: 'Courier', price: 'Free', note: 'to join, earn per job', features: ['Browse available jobs', 'Accept pickups nearby', 'Track active deliveries', 'Transparent earnings', 'Weekly payment'], cta_text: 'Become a courier', cta_link: '/register?role=courier', highlight: 0, display_order: 3 },
]

export default function PricingPlansManager() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  const fetch = async () => {
    try {
      const res = await getPricingPlans()
      const data = res.data.data || []
      if (data.length !== 3) {
        await Promise.all(data.map(p => deletePricingPlan(p.id).catch(() => {})))
        for (const p of fallbackPlans) {
          await createPricingPlan(p).catch(() => {})
        }
        const newRes = await getPricingPlans()
        setPlans(newRes.data.data.map(p => ({
          ...p,
          title: p.name,
          description: p.price,
          features: Array.isArray(p.features) ? p.features.join('\n') : (p.features || '')
        })))
      } else {
        setPlans(data.map(p => ({
          ...p,
          title: p.name,
          description: p.price,
          features: Array.isArray(p.features) ? p.features.join('\n') : (p.features || '')
        })))
      }
    } catch { addToast('Failed to load plans', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const handleUpdate = async (id, data) => {
    try {
      const payload = {
        ...data,
        features: data.features ? data.features.split('\n').filter(f => f.trim() !== '') : [],
        highlight: data.highlight === true || data.highlight === 'true' ? 1 : 0
      }
      await updatePricingPlan(id, payload)
      addToast('Plan updated', 'success')
      fetch()
    } catch { addToast('Failed to update plan', 'error') }
  }

  const handleReorder = async (newOrder) => {
    const updates = newOrder.map((item, index) => ({ id: item.id, display_order: index + 1 }))
    try {
      await Promise.all(updates.map(u => updatePricingPlan(u.id, { display_order: u.display_order })))
      setPlans(newOrder)
    } catch { addToast('Reorder failed', 'error') }
  }

  const handleSave = async () => {
    await fetch()
    addToast('Plans refreshed', 'success')
  }

  const handleReset = async () => {
    if (!window.confirm('Reset to default plans? This will replace any changes.')) return
    try {
      await Promise.all(plans.map(p => deletePricingPlan(p.id).catch(() => {})))
      addToast('Plans reset to defaults', 'success')
      fetch()
    } catch { addToast('Failed to reset', 'error') }
  }

  if (loading) return <Loader />

  return (
    <>
      <StickyToolbar
        title="Pricing Plans"
        description="Edit the three pricing cards."
        onSave={handleSave}
        onPreview={() => window.open('/services', '_blank')}
        onReset={handleReset}
      />
      <div className="p-6">
        <DynamicListEditor
          items={plans}
          fields={fields}
          title="Plans"
          onUpdate={handleUpdate}
          onReorder={handleReorder}
          allowAdd={false}
          allowDelete={false}
        />
      </div>
    </>
  )
}