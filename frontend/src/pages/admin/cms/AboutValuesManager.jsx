import { useState, useEffect } from 'react'
import { getAboutValues, createAboutValue, updateAboutValue, deleteAboutValue } from '../../../services/cmsService'
import Loader from '../../../components/common/Loader'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import DynamicListEditor from '../../../components/cms/DynamicListEditor'
import { useToast } from '../../../context/ToastContext'

const fields = [
  { key: 'icon', label: 'Icon', type: 'icon' },
  { key: 'label', label: 'Label', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'display_order', label: 'Order', type: 'number' },
]

const fallbackValues = [
  { icon: 'Target', label: 'Mission-driven', description: 'We exist to make storage and logistics accessible for every Nepali seller, big or small.', display_order: 1 },
  { icon: 'Heart', label: 'Community first', description: 'Every feature we build starts with feedback from our sellers, hosts and couriers.', display_order: 2 },
  { icon: 'Zap', label: 'Move fast', description: 'We ship fast, learn fast and iterate on what actually matters to our users.', display_order: 3 },
  { icon: 'Star', label: 'Quality always', description: 'Every host is verified. Every feature is tested. We never compromise on trust.', display_order: 4 },
]

export default function AboutValuesManager() {
  const [values, setValues] = useState([])
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  const fetch = async () => {
    try {
      const res = await getAboutValues()
      const data = res.data.data || []
      if (data.length === 0) {
        for (const v of fallbackValues) {
          await createAboutValue(v).catch(() => {})
        }
        const newRes = await getAboutValues()
        setValues(newRes.data.data)
      } else {
        setValues(data)
      }
    } catch { addToast('Failed to load values', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const handleAdd = async (data) => {
    try { await createAboutValue(data); addToast('Value added', 'success'); fetch() }
    catch { addToast('Failed to add', 'error') }
  }

  const handleUpdate = async (id, data) => {
    try { await updateAboutValue(id, data); addToast('Value updated', 'success'); fetch() }
    catch { addToast('Failed to update', 'error') }
  }

  const handleDelete = async (id) => {
    try { await deleteAboutValue(id); addToast('Value deleted', 'success'); fetch() }
    catch { addToast('Failed to delete', 'error') }
  }

  const handleReorder = async (newOrder) => {
    const updates = newOrder.map((item, index) => ({ id: item.id, display_order: index }))
    try {
      await Promise.all(updates.map(u => updateAboutValue(u.id, { display_order: u.display_order })))
      setValues(newOrder)
    } catch { addToast('Reorder failed', 'error') }
  }

  const handleSave = async () => {
    await fetch()
    addToast('Values refreshed', 'success')
  }

  const handleReset = async () => {
    if (!window.confirm('Delete ALL values and restore defaults?')) return
    try {
      await Promise.all(values.map(v => deleteAboutValue(v.id).catch(() => {})))
      addToast('Reset complete', 'success')
      fetch() // fetch will re-seed because table will be empty
    } catch { addToast('Reset failed', 'error') }
  }

  if (loading) return <Loader />

  return (
    <>
      <StickyToolbar
        title="Our Values"
        description="Manage the core values displayed on the About page."
        onSave={handleSave}
        onPreview={() => window.open('/about', '_blank')}
        onReset={values.length > 0 ? handleReset : undefined}
      />
      <div className="p-6">
        <DynamicListEditor
          items={values}
          fields={fields}
          title="Values"
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </div>
    </>
  )
}