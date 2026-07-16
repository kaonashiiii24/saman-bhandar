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

const DEFAULT_ABOUT = {
  hero_badge: '',
  hero_title: '',
  hero_title_line2: '',
  hero_description: '',
  hero_image: '',
  hero_cta_text: '',
  hero_cta_link: '',
  story_badge: '',
  story_title: '',
  story_paragraphs: '',
  side_card_text: '',
}

export default function AboutManager() {
  const [about, setAbout] = useState(DEFAULT_ABOUT)
  const [loading, setLoading] = useState(true)
  const [values, setValues] = useState([])
  const addToast = useToast()

  useEffect(() => {
    const init = async () => {
      try {
        const [aboutRes, valuesRes] = await Promise.all([
          getAbout(),
          getAboutValues()
        ])
        const aboutData = aboutRes.data.data || {}
        if (Array.isArray(aboutData.story_paragraphs)) {
          aboutData.story_paragraphs = aboutData.story_paragraphs.join('\n')
        }
        setAbout({ ...DEFAULT_ABOUT, ...aboutData })

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
    const payload = { ...data }
    if (payload.story_paragraphs && typeof payload.story_paragraphs === 'string') {
      payload.story_paragraphs = payload.story_paragraphs.split('\n').filter(line => line.trim() !== '')
    }
    return updateAbout(payload).then(() => addToast('About saved', 'success')).catch(() => addToast('Auto-save failed', 'error'))
  }, 2500)

  const handleChange = (key, value) => setAbout(prev => ({ ...prev, [key]: value }))

  const handleImageChange = (file) => {
    const formData = new FormData()
    formData.append('hero_image', file)
    updateAbout(formData)
      .then(() => { getAbout().then(res => {
        const d = res.data.data || {}
        if (Array.isArray(d.story_paragraphs)) d.story_paragraphs = d.story_paragraphs.join('\n')
        setAbout(prev => ({ ...prev, ...d }))
        addToast('Image updated', 'success')
      })})
      .catch(() => addToast('Image upload failed', 'error'))
  }

  const handleAddValue = async (data) => {
    try { await createAboutValue(data); addToast('Value added', 'success'); const res = await getAboutValues(); setValues(res.data.data) }
    catch { addToast('Failed to add value', 'error') }
  }

  const handleUpdateValue = async (id, data) => {
    try { await updateAboutValue(id, data); addToast('Value updated', 'success'); setValues(prev => prev.map(v => v.id === id ? { ...v, ...data } : v)) }
    catch { addToast('Failed to update value', 'error') }
  }

  const handleDeleteValue = async (id) => {
    try { await deleteAboutValue(id); addToast('Value deleted', 'success'); setValues(prev => prev.filter(v => v.id !== id)) }
    catch { addToast('Failed to delete value', 'error') }
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
        title="About Page"
        description="Edit the About page hero, story, and core values."
        onSave={triggerSave}
        onPreview={() => window.open('/about', '_blank')}
        onReset={handleReset}
      >
        <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
      </StickyToolbar>

      <div className="p-6 space-y-6">
        <SectionCard title="Hero Section" defaultOpen={true}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Badge" value={about.hero_badge || ''} onChange={v => handleChange('hero_badge', v)} placeholder="Our story" />
            <FormField label="Title (first line)" value={about.hero_title || ''} onChange={v => handleChange('hero_title', v)} placeholder="Built in Nepal," />
            <FormField label="Title (second line)" value={about.hero_title_line2 || ''} onChange={v => handleChange('hero_title_line2', v)} placeholder="for Nepal." />
            <FormField label="Description" value={about.hero_description || ''} onChange={v => handleChange('hero_description', v)} type="textarea" placeholder="SamanBhandar was born..." />
            <FormField label="CTA Button Text" value={about.hero_cta_text || ''} onChange={v => handleChange('hero_cta_text', v)} placeholder="Get in Touch" />
            <FormField label="CTA Button Link" value={about.hero_cta_link || ''} onChange={v => handleChange('hero_cta_link', v)} placeholder="/contact" />
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Background Image</label>
              <ImageUploader value={about.hero_image} onChange={handleImageChange} onRemove={() => handleChange('hero_image', '')} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Story Section">
          <div className="space-y-5">
            <FormField label="Story Badge" value={about.story_badge || ''} onChange={v => handleChange('story_badge', v)} placeholder="Why we built this" />
            <FormField label="Story Title" value={about.story_title || ''} onChange={v => handleChange('story_title', v)} placeholder="The problem we saw..." />
            <FormField label="Paragraphs (one per line)" value={about.story_paragraphs || ''} onChange={v => handleChange('story_paragraphs', v)} type="textarea" placeholder="Paragraph 1&#10;Paragraph 2&#10;Paragraph 3" rows={5} />
            <FormField label="Side Card Text" value={about.side_card_text || ''} onChange={v => handleChange('side_card_text', v)} placeholder="Fastest growing logistics startup..." />
          </div>
        </SectionCard>

        <SectionCard title="Our Values">
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