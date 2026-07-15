import { useState, useEffect } from 'react'
import { getSeo, updateSeo } from '../../../services/cmsService'
import Loader from '../../../components/common/Loader'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import AutoSaveIndicator from '../../../components/cms/AutoSaveIndicator'
import SectionCard from '../../../components/cms/SectionCard'
import FormField from '../../../components/cms/FormField'
import useAutoSave from '../../../hooks/useAutoSave'
import { useToast } from '../../../context/ToastContext'

const DEFAULT_SEO = { seo_title: '', seo_description: '', seo_keywords: '' }

export default function SeoManager() {
  const [seo, setSeo] = useState(null)
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  useEffect(() => {
    getSeo()
      .then(res => setSeo(res.data.data || {}))
      .catch(() => { addToast('Failed to load SEO data', 'error'); setSeo(DEFAULT_SEO) })
      .finally(() => setLoading(false))
  }, [])

  const { saveStatus, lastSaved, triggerSave } = useAutoSave(seo, (data) => {
    return updateSeo(data).then(() => addToast('SEO saved', 'success')).catch(() => addToast('Auto-save failed', 'error'))
  }, 2500)

  const handleChange = (key, value) => setSeo(prev => ({ ...prev, [key]: value }))

  const handleReset = () => {
    if (window.confirm('Reset all SEO fields to empty?')) {
      setSeo(DEFAULT_SEO)
      addToast('Reset complete', 'success')
    }
  }

  if (loading) return <Loader />

  return (
    <>
      <StickyToolbar title="SEO Settings" onSave={triggerSave} onPreview={() => window.open('/', '_blank')} onReset={handleReset}>
        <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
      </StickyToolbar>
      <div className="p-6 space-y-6">
        <SectionCard title="Meta Tags" defaultOpen={true}>
          <FormField label="Website Title" value={seo.seo_title || ''} onChange={v => handleChange('seo_title', v)} placeholder="SamanBhandar — Nepal's Micro-Warehouse Marketplace" />
          <FormField label="Meta Description" value={seo.seo_description || ''} onChange={v => handleChange('seo_description', v)} type="textarea" placeholder="Find affordable storage near you..." />
          <FormField label="Keywords" value={seo.seo_keywords || ''} onChange={v => handleChange('seo_keywords', v)} placeholder="storage, warehouse, Nepal" />
        </SectionCard>
      </div>
    </>
  )
}