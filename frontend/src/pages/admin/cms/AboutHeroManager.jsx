import { useState, useEffect } from 'react'
import { getAbout, updateAbout } from '../../../services/cmsService'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import AutoSaveIndicator from '../../../components/cms/AutoSaveIndicator'
import SectionCard from '../../../components/cms/SectionCard'
import FormField from '../../../components/cms/FormField'
import ImageUploader from '../../../components/cms/ImageUploader'
import useAutoSave from '../../../hooks/useAutoSave'
import { useToast } from '../../../context/ToastContext'

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

export default function AboutHeroManager() {
  const [about, setAbout] = useState(DEFAULT_ABOUT)
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  useEffect(() => {
    getAbout()
      .then(res => {
        const data = res.data.data || {}
        if (Array.isArray(data.story_paragraphs)) {
          data.story_paragraphs = data.story_paragraphs.join('\n')
        }
        setAbout({ ...DEFAULT_ABOUT, ...data })
      })
      .catch(() => addToast('Failed to load about hero', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const { saveStatus, lastSaved, triggerSave } = useAutoSave(about, (data) => {
    const payload = { ...data }
    if (payload.story_paragraphs && typeof payload.story_paragraphs === 'string') {
      payload.story_paragraphs = payload.story_paragraphs.split('\n').filter(line => line.trim() !== '')
    }
    return updateAbout(payload).then(() => addToast('Hero saved', 'success')).catch(() => addToast('Auto-save failed', 'error'))
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

  const handleReset = () => {
    if (window.confirm('Reset hero & story fields to empty?')) {
      setAbout(DEFAULT_ABOUT)
      addToast('Reset complete', 'success')
    }
  }

  if (loading) return <div className="p-8 space-y-6 animate-pulse"><div className="h-8 w-48 bg-gray-200 rounded" /><div className="h-40 bg-gray-200 rounded-xl" /></div>

  return (
    <>
      <StickyToolbar
        title="About Hero & Story"
        description="Edit the hero section and the story behind the company."
        onSave={triggerSave}
        onPreview={() => window.open('/about', '_blank')}
        onReset={handleReset}
      >
        <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
      </StickyToolbar>
      <div className="p-6 space-y-6">
        <SectionCard title="Hero" defaultOpen={true}>
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

        <SectionCard title="Story">
          <div className="space-y-5">
            <FormField label="Story Badge" value={about.story_badge || ''} onChange={v => handleChange('story_badge', v)} placeholder="Why we built this" />
            <FormField label="Story Title" value={about.story_title || ''} onChange={v => handleChange('story_title', v)} placeholder="The problem we saw..." />
            <FormField label="Paragraphs (one per line)" value={about.story_paragraphs || ''} onChange={v => handleChange('story_paragraphs', v)} type="textarea" placeholder="Paragraph 1&#10;Paragraph 2&#10;Paragraph 3" rows={5} helper="Each line will become a separate paragraph on the page." />
            <FormField label="Side Card Text" value={about.side_card_text || ''} onChange={v => handleChange('side_card_text', v)} placeholder="Fastest growing logistics startup in Nepal — 2025" />
          </div>
        </SectionCard>
      </div>
    </>
  )
}