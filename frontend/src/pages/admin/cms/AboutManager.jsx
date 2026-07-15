import { useState, useEffect } from 'react'
import { getAbout, updateAbout, getAboutValues, createAboutValue, updateAboutValue, deleteAboutValue } from '../../../services/cmsService'
import Loader from '../../../components/common/Loader'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import AutoSaveIndicator from '../../../components/cms/AutoSaveIndicator'
import SectionCard from '../../../components/cms/SectionCard'
import FormField from '../../../components/cms/FormField'
import ImageUploader from '../../../components/cms/ImageUploader'
import DynamicListEditor from '../../../components/cms/DynamicListEditor'
import useAutoSave from '../../../hooks/useAutoSave'
import { useToast } from '../../../context/ToastContext'

const DEFAULT_ABOUT = { heading: '', description: '', mission: '', vision: '', image: '' }

const valueFields = [
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

export default function AboutManager() {
  const [about, setAbout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [values, setValues] = useState([])
  const addToast = useToast()

  useEffect(() => {
    const init = async () => {
      try {
        const aboutRes = await getAbout()
        setAbout(aboutRes.data.data || {})
        const valuesRes = await getAboutValues()
        if (valuesRes.data.data.length === 0) {
          for (const v of fallbackValues) {
            await createAboutValue(v).catch(() => {})
          }
          const newValues = await getAboutValues()
          setValues(newValues.data.data)
        } else {
          setValues(valuesRes.data.data)
        }
      } catch {
        addToast('Failed to load about data', 'error')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const { saveStatus, lastSaved, triggerSave } = useAutoSave(about, (data) => {
    return updateAbout(data).then(() => addToast('About saved', 'success')).catch(() => addToast('Auto-save failed', 'error'))
  }, 2500)

  const handleChange = (key, value) => setAbout(prev => ({ ...prev, [key]: value }))

  const handleImageChange = (file) => {
    const formData = new FormData()
    formData.append('image', file)
    updateAbout(formData)
      .then(() => {
        getAbout().then(res => setAbout(res.data.data || {}))
        addToast('Image updated', 'success')
      })
      .catch(() => addToast('Image upload failed', 'error'))
  }

  const handleImageRemove = () => handleChange('image', '')

  const fetchValues = async () => {
    const res = await getAboutValues()
    setValues(res.data.data)
  }

  const handleAddValue = async (data) => {
    try {
      await createAboutValue(data)
      addToast('Value added', 'success')
      fetchValues()
    } catch { addToast('Failed to add value', 'error') }
  }

  const handleUpdateValue = async (id, data) => {
    try {
      await updateAboutValue(id, data)
      addToast('Value updated', 'success')
      setValues(prev => prev.map(v => v.id === id ? { ...v, ...data } : v))
    } catch { addToast('Failed to update value', 'error') }
  }

  const handleDeleteValue = async (id) => {
    try {
      await deleteAboutValue(id)
      addToast('Value deleted', 'success')
      setValues(prev => prev.filter(v => v.id !== id))
    } catch { addToast('Failed to delete value', 'error') }
  }

  const handleReorderValues = async (newOrder) => {
    const updates = newOrder.map((item, index) => ({ id: item.id, display_order: index }))
    try {
      await Promise.all(updates.map(u => updateAboutValue(u.id, { display_order: u.display_order })))
      setValues(newOrder)
    } catch { addToast('Reorder failed', 'error') }
  }

  const handleReset = () => {
    if (window.confirm('Reset all about fields to empty?')) {
      setAbout(DEFAULT_ABOUT)
      addToast('Reset complete', 'success')
    }
  }

  if (loading) return <Loader />

  return (
    <>
      <StickyToolbar
        title="About Section"
        description="Edit about page content and Our Values."
        onSave={triggerSave}
        onPreview={() => window.open('/about', '_blank')}
        onReset={handleReset}
      >
        <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
      </StickyToolbar>

      <div className="p-6 space-y-6">
        <SectionCard title="Content" defaultOpen={true}>
          <FormField label="Heading" value={about.heading || ''} onChange={v => handleChange('heading', v)} placeholder="About Saman Bhandar" />
          <FormField label="Description" value={about.description || ''} onChange={v => handleChange('description', v)} type="textarea" placeholder="We are Nepal's leading..." />
          <FormField label="Mission" value={about.mission || ''} onChange={v => handleChange('mission', v)} type="textarea" placeholder="Our mission..." />
          <FormField label="Vision" value={about.vision || ''} onChange={v => handleChange('vision', v)} type="textarea" placeholder="Our vision..." />
        </SectionCard>

        <SectionCard title="Image">
          <ImageUploader value={about.image} onChange={handleImageChange} onRemove={handleImageRemove} />
        </SectionCard>

        <SectionCard title="Our Values" defaultOpen={false}>
          <DynamicListEditor
            items={values}
            fields={valueFields}
            title="Values"
            onAdd={handleAddValue}
            onUpdate={handleUpdateValue}
            onDelete={handleDeleteValue}
            onReorder={handleReorderValues}
            allowAdd={true}
          />
        </SectionCard>
      </div>
    </>
  )
}