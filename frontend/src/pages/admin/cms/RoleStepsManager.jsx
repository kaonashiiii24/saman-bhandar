import { useState, useEffect } from 'react'
import { getRoleSteps, updateRoleStep, createRoleStep, deleteRoleStep } from '../../../services/cmsService'
import Loader from '../../../components/common/Loader'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import DynamicListEditor from '../../../components/cms/DynamicListEditor'
import { useToast } from '../../../context/ToastContext'

const fields = [
  { key: 'role', label: 'Role Name', type: 'text' },
  { key: 'badge_bg', label: 'Badge Background Class', type: 'text' },
  { key: 'badge_text', label: 'Badge Text Class', type: 'text' },
  { key: 'border_color', label: 'Border Class', type: 'text' },
  { key: 'steps', label: 'Steps (one per line)', type: 'textarea' },
  { key: 'display_order', label: 'Order', type: 'number' },
]

const fallbackRoles = [
  { role: 'Seller', badge_bg: 'bg-brick-light', badge_text: 'text-brick', border_color: 'border-brick/20', steps: ['Register as a seller', 'Browse listings near you', 'Book a storage space', 'Manage inventory from dashboard', 'Request courier pickups'], display_order: 1 },
  { role: 'Host', badge_bg: 'bg-amber-50', badge_text: 'text-amber-700', border_color: 'border-amber-200', steps: ['Register as a host', 'List your space with photos', 'Get verified by our team', 'Accept booking requests', 'Earn weekly payouts'], display_order: 2 },
  { role: 'Courier', badge_bg: 'bg-emerald-50', badge_text: 'text-emerald-700', border_color: 'border-emerald-200', steps: ['Register as a courier', 'Get verified by our team', 'Browse available jobs nearby', 'Accept and complete deliveries', 'Earn per job, paid weekly'], display_order: 3 },
]

export default function RoleStepsManager() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  const fetch = async () => {
    try {
      const res = await getRoleSteps()
      const data = res.data.data || []
      if (data.length !== 3) {
        await Promise.all(data.map(i => deleteRoleStep(i.id).catch(() => {})))
        for (const r of fallbackRoles) {
          await createRoleStep(r).catch(() => {})
        }
        const newRes = await getRoleSteps()
        setItems(newRes.data.data.map(r => ({
          ...r,
          title: r.role,
          description: Array.isArray(r.steps) ? r.steps.slice(0, 2).join(', ') + '…' : (r.steps || ''),
          steps: Array.isArray(r.steps) ? r.steps.join('\n') : (r.steps || '')
        })))
      } else {
        setItems(data.map(r => ({
          ...r,
          title: r.role,
          description: Array.isArray(r.steps) ? r.steps.slice(0, 2).join(', ') + '…' : (r.steps || ''),
          steps: Array.isArray(r.steps) ? r.steps.join('\n') : (r.steps || '')
        })))
      }
    } catch { addToast('Failed to load role steps', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const handleUpdate = async (id, data) => {
    try {
      const payload = { ...data, steps: data.steps ? data.steps.split('\n').filter(s => s.trim() !== '') : [] }
      await updateRoleStep(id, payload)
      addToast('Role updated', 'success')
      fetch()
    } catch { addToast('Failed to update role', 'error') }
  }

  const handleReorder = async (newOrder) => {
    const updates = newOrder.map((item, index) => ({ id: item.id, display_order: index + 1 }))
    try {
      await Promise.all(updates.map(u => updateRoleStep(u.id, { display_order: u.display_order })))
      setItems(newOrder)
    } catch { addToast('Reorder failed', 'error') }
  }

  const handleSave = async () => {
    await fetch()
    addToast('Role steps refreshed', 'success')
  }

  const handleReset = async () => {
    if (!window.confirm('Reset roles to default? This will replace any changes.')) return
    try {
      await Promise.all(items.map(i => deleteRoleStep(i.id).catch(() => {})))
      for (const r of fallbackRoles) {
        await createRoleStep(r).catch(() => {})
      }
      addToast('Roles reset to defaults', 'success')
      fetch()
    } catch { addToast('Failed to reset', 'error') }
  }

  if (loading) return <Loader />

  return (
    <>
      <StickyToolbar
        title="Role Steps"
        description="Edit the Seller, Host, Courier walkthrough cards."
        onSave={handleSave}
        onPreview={() => window.open('/services', '_blank')}
        onReset={handleReset}
      />
      <div className="p-6">
        <DynamicListEditor
          items={items}
          fields={fields}
          title="Roles"
          onUpdate={handleUpdate}
          onReorder={handleReorder}
          allowAdd={false}
          allowDelete={false}
        />
      </div>
    </>
  )
}