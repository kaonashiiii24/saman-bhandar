import { useState, useEffect } from 'react'
import { getSectionHeadings, updateSectionHeadings } from '../../../services/cmsService'
import Loader from '../../../components/common/Loader'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import AutoSaveIndicator from '../../../components/cms/AutoSaveIndicator'
import SectionCard from '../../../components/cms/SectionCard'
import FormField from '../../../components/cms/FormField'
import useAutoSave from '../../../hooks/useAutoSave'
import { useToast } from '../../../context/ToastContext'

const DEFAULT_HEADINGS = {
  how_it_works_badge: '',
  how_it_works_title: '',
  features_badge: '',
  features_title: '',
  features_description: '',
  testimonials_badge: '',
  testimonials_title: '',
  faq_badge: '',
  faq_title: '',
}

export default function SectionHeadingsManager() {
  const [headings, setHeadings] = useState(DEFAULT_HEADINGS)
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  useEffect(() => {
    getSectionHeadings()
      .then(res => setHeadings(res.data.data || DEFAULT_HEADINGS))
      .catch(() => addToast('Failed to load section headings', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const { saveStatus, lastSaved, triggerSave } = useAutoSave(headings, (data) => {
    return updateSectionHeadings(data).then(() => addToast('Section headings saved', 'success')).catch(() => addToast('Auto-save failed', 'error'))
  }, 2500)

  const handleChange = (key, value) => setHeadings(prev => ({ ...prev, [key]: value }))

  const handleReset = () => {
    if (window.confirm('Reset section headings to empty?')) {
      setHeadings(DEFAULT_HEADINGS)
      addToast('Reset complete', 'success')
    }
  }

  if (loading) return <Loader />

  return (
    <>
      <StickyToolbar title="Section Headings" description="Badges and titles above homepage sections." onSave={triggerSave} onPreview={() => window.open('/', '_blank')} onReset={handleReset}>
        <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
      </StickyToolbar>
      <div className="p-6 space-y-6">
        <SectionCard title="How It Works" defaultOpen={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Badge" value={headings.how_it_works_badge} onChange={v => handleChange('how_it_works_badge', v)} placeholder="How it works" />
            <FormField label="Title" value={headings.how_it_works_title} onChange={v => handleChange('how_it_works_title', v)} placeholder="Up and running in four steps." />
          </div>
        </SectionCard>
        <SectionCard title="Features (What you get)" defaultOpen={true}>
          <div className="space-y-5">
            <FormField label="Badge" value={headings.features_badge} onChange={v => handleChange('features_badge', v)} placeholder="What you get" />
            <FormField label="Title" value={headings.features_title} onChange={v => handleChange('features_title', v)} placeholder="Everything you need. Nothing you don't." />
            <FormField label="Description" value={headings.features_description} onChange={v => handleChange('features_description', v)} type="textarea" placeholder="Built specifically for Nepal's growing community..." />
          </div>
        </SectionCard>
        <SectionCard title="Testimonials" defaultOpen={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Badge" value={headings.testimonials_badge} onChange={v => handleChange('testimonials_badge', v)} placeholder="Real sellers" />
            <FormField label="Title" value={headings.testimonials_title} onChange={v => handleChange('testimonials_title', v)} placeholder="What they're saying." />
          </div>
        </SectionCard>
        <SectionCard title="FAQ" defaultOpen={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Badge" value={headings.faq_badge} onChange={v => handleChange('faq_badge', v)} placeholder="FAQ" />
            <FormField label="Title" value={headings.faq_title} onChange={v => handleChange('faq_title', v)} placeholder="Common questions." />
          </div>
        </SectionCard>
      </div>
    </>
  )
}