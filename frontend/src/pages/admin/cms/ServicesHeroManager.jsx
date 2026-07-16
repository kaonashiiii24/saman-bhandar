import { useState, useEffect } from 'react'
import { getServicesPage, updateServicesPage } from '../../../services/cmsService'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import AutoSaveIndicator from '../../../components/cms/AutoSaveIndicator'
import SectionCard from '../../../components/cms/SectionCard'
import FormField from '../../../components/cms/FormField'
import ImageUploader from '../../../components/cms/ImageUploader'
import useAutoSave from '../../../hooks/useAutoSave'
import { useToast } from '../../../context/ToastContext'

const DEFAULT_HERO = {
  hero_badge: '',
  hero_title: '',
  hero_description: '',
  hero_image: '',
  hero_cta_primary_text: '',
  hero_cta_primary_link: '',
  hero_cta_secondary_text: '',
  hero_cta_secondary_link: '',
}

export default function ServicesHeroManager() {
  const [page, setPage] = useState(DEFAULT_HERO)
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  useEffect(() => {
    getServicesPage()
      .then(res => setPage(res.data.data || DEFAULT_HERO))
      .catch(() => addToast('Failed to load hero data', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const { saveStatus, lastSaved, triggerSave } = useAutoSave(page, (data) => {
    return updateServicesPage(data).then(() => addToast('Hero saved', 'success')).catch(() => addToast('Auto-save failed', 'error'))
  }, 2500)

  const handleChange = (key, value) => setPage(prev => ({ ...prev, [key]: value }))

  const handleImageChange = (file) => {
    const formData = new FormData()
    formData.append('hero_image', file)
    updateServicesPage(formData)
      .then(() => { getServicesPage().then(res => setPage(res.data.data || DEFAULT_HERO)); addToast('Image updated', 'success') })
      .catch(() => addToast('Image upload failed', 'error'))
  }

  const handleReset = () => {
    if (window.confirm('Reset all hero fields to empty?')) {
      setPage(DEFAULT_HERO)
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
        title="Services Hero"
        description="Edit the hero section and call‑to‑action buttons."
        onSave={triggerSave}
        onPreview={() => window.open('/services', '_blank')}
        onReset={handleReset}
      >
        <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
      </StickyToolbar>
      <div className="p-6 space-y-6">
        <SectionCard title="Content" defaultOpen={true}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Badge" value={page.hero_badge || ''} onChange={v => handleChange('hero_badge', v)} placeholder="What we offer" />
            <FormField label="Title" value={page.hero_title || ''} onChange={v => handleChange('hero_title', v)} placeholder="Everything you need..." />
            <FormField label="Description" value={page.hero_description || ''} onChange={v => handleChange('hero_description', v)} type="textarea" placeholder="SamanBhandar connects..." />
          </div>
          <div className="mt-5">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Background Image</label>
            <ImageUploader value={page.hero_image} onChange={handleImageChange} onRemove={() => handleChange('hero_image', '')} />
          </div>
        </SectionCard>

        <SectionCard title="Call‑to‑Action Buttons">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-4">
              <FormField label="Primary Button Text" value={page.hero_cta_primary_text || ''} onChange={v => handleChange('hero_cta_primary_text', v)} placeholder="Get started free" />
              <FormField label="Primary Button Link" value={page.hero_cta_primary_link || ''} onChange={v => handleChange('hero_cta_primary_link', v)} placeholder="/register" />
            </div>
            <div className="space-y-4">
              <FormField label="Secondary Button Text" value={page.hero_cta_secondary_text || ''} onChange={v => handleChange('hero_cta_secondary_text', v)} placeholder="Browse storage" />
              <FormField label="Secondary Button Link" value={page.hero_cta_secondary_link || ''} onChange={v => handleChange('hero_cta_secondary_link', v)} placeholder="/listings" />
            </div>
          </div>
        </SectionCard>
      </div>
    </>
  )
}