import { useState, useEffect } from 'react'
import { getFooter, updateFooter } from '../../../services/cmsService'
import Loader from '../../../components/common/Loader'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import AutoSaveIndicator from '../../../components/cms/AutoSaveIndicator'
import SectionCard from '../../../components/cms/SectionCard'
import FormField from '../../../components/cms/FormField'
import useAutoSave from '../../../hooks/useAutoSave'
import { useToast } from '../../../context/ToastContext'

const DEFAULT_FOOTER = { description: '', copyright_text: '', quick_links: [], social_links: [] }

export default function FooterManager() {
  const [footer, setFooter] = useState(null)
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  useEffect(() => {
    getFooter()
      .then(res => setFooter(res.data.data || {}))
      .catch(() => { addToast('Failed to load footer data', 'error'); setFooter(DEFAULT_FOOTER) })
      .finally(() => setLoading(false))
  }, [])

  const { saveStatus, lastSaved, triggerSave } = useAutoSave(footer, (data) => {
    return updateFooter(data).then(() => addToast('Footer saved', 'success')).catch(() => addToast('Auto-save failed', 'error'))
  }, 2500)

  const handleChange = (key, value) => setFooter(prev => ({ ...prev, [key]: value }))

  const handleReset = () => {
    if (window.confirm('Reset all footer fields to empty?')) {
      setFooter(DEFAULT_FOOTER)
      addToast('Reset complete', 'success')
    }
  }

  if (loading) return <Loader />

  return (
    <>
      <StickyToolbar title="Footer" onSave={triggerSave} onPreview={() => window.open('/?preview=footer', '_blank')} onReset={handleReset}>
        <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
      </StickyToolbar>
      <div className="p-6 space-y-6">
        <SectionCard title="Footer Content" defaultOpen={true}>
          <FormField label="Description" value={footer.description || ''} onChange={v => handleChange('description', v)} type="textarea" placeholder="Nepal's first peer-to-peer..." />
          <FormField label="Copyright" value={footer.copyright_text || ''} onChange={v => handleChange('copyright_text', v)} placeholder="© 2026 SamanBhandar" />
        </SectionCard>
        <SectionCard title="Quick Links (JSON)">
          <FormField label="Quick Links" value={JSON.stringify(footer.quick_links || [])} onChange={v => { try { handleChange('quick_links', JSON.parse(v)) } catch {} }} type="textarea" placeholder='[{"label": "Find Storage", "url": "/listings"}]' />
        </SectionCard>
        <SectionCard title="Social Links (JSON)">
          <FormField label="Social Links" value={JSON.stringify(footer.social_links || [])} onChange={v => { try { handleChange('social_links', JSON.parse(v)) } catch {} }} type="textarea" placeholder='[{"platform": "facebook", "url": "#"}]' />
        </SectionCard>
      </div>
    </>
  )
}