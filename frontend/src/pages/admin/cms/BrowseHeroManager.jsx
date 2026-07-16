import { useState, useEffect } from 'react'
import { getBrowsePage, updateBrowsePage } from '../../../services/cmsService'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import AutoSaveIndicator from '../../../components/cms/AutoSaveIndicator'
import SectionCard from '../../../components/cms/SectionCard'
import FormField from '../../../components/cms/FormField'
import ImageUploader from '../../../components/cms/ImageUploader'
import useAutoSave from '../../../hooks/useAutoSave'
import { useToast } from '../../../context/ToastContext'

const DEFAULT_BROWSE = {
  hero_title: '',
  hero_subtitle: '',
  hero_description: '',
  hero_image: '',
  cta_text: '',
  cta_link: '',
}

export default function BrowseHeroManager() {
  const [page, setPage] = useState(DEFAULT_BROWSE)
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  useEffect(() => {
    getBrowsePage()
      .then(res => setPage(res.data.data || DEFAULT_BROWSE))
      .catch(() => addToast('Failed to load browse hero', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const { saveStatus, lastSaved, triggerSave } = useAutoSave(page, (data) => {
    return updateBrowsePage(data).then(() => addToast('Hero saved', 'success')).catch(() => addToast('Auto-save failed', 'error'))
  }, 2500)

  const handleChange = (key, value) => setPage(prev => ({ ...prev, [key]: value }))

  const handleImageChange = (file) => {
    const formData = new FormData()
    formData.append('hero_image', file)
    updateBrowsePage(formData)
      .then(() => { getBrowsePage().then(res => setPage(res.data.data || DEFAULT_BROWSE)); addToast('Image updated', 'success') })
      .catch(() => addToast('Image upload failed', 'error'))
  }

  const handleReset = () => {
    if (window.confirm('Reset browse hero to defaults?')) {
      setPage(DEFAULT_BROWSE)
      addToast('Hero reset', 'success')
    }
  }

  if (loading) return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="h-40 bg-gray-200 rounded-xl" />
    </div>
  )

  return (
    <>
      <StickyToolbar
        title="Browse Page Hero"
        description="Edit the hero section on the Find Storage page."
        onSave={triggerSave}
        onPreview={() => window.open('/listings', '_blank')}
        onReset={handleReset}
      >
        <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
      </StickyToolbar>
      <div className="p-6 space-y-6">
        <SectionCard title="Content" defaultOpen={true}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Title" value={page.hero_title || ''} onChange={v => handleChange('hero_title', v)} placeholder="Find Storage" />
            <FormField label="Subtitle" value={page.hero_subtitle || ''} onChange={v => handleChange('hero_subtitle', v)} placeholder="Storage near you" />
            <FormField label="Description" value={page.hero_description || ''} onChange={v => handleChange('hero_description', v)} type="textarea" placeholder="Browse verified storage spaces..." />
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Background Image</label>
              <ImageUploader value={page.hero_image} onChange={handleImageChange} onRemove={() => handleChange('hero_image', '')} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Call‑to‑Action">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Button Text" value={page.cta_text || ''} onChange={v => handleChange('cta_text', v)} placeholder="Start Booking" />
            <FormField label="Button Link" value={page.cta_link || ''} onChange={v => handleChange('cta_link', v)} placeholder="/listings" />
          </div>
        </SectionCard>
      </div>
    </>
  )
}