import { useState, useEffect } from 'react'
import { getContact, updateContact } from '../../../services/cmsService'
import Loader from '../../../components/common/Loader'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import AutoSaveIndicator from '../../../components/cms/AutoSaveIndicator'
import SectionCard from '../../../components/cms/SectionCard'
import FormField from '../../../components/cms/FormField'
import useAutoSave from '../../../hooks/useAutoSave'
import { useToast } from '../../../context/ToastContext'

const DEFAULT_CONTACT = { heading: '', description: '', address: '', phone: '', email: '', map_url: '', social_media_links: [] }

export default function ContactManager() {
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  useEffect(() => {
    getContact()
      .then(res => setContact(res.data.data || {}))
      .catch(() => { addToast('Failed to load contact data', 'error'); setContact(DEFAULT_CONTACT) })
      .finally(() => setLoading(false))
  }, [])

  const { saveStatus, lastSaved, triggerSave } = useAutoSave(contact, (data) => {
    return updateContact(data).then(() => addToast('Contact saved', 'success')).catch(() => addToast('Auto-save failed', 'error'))
  }, 2500)

  const handleChange = (key, value) => setContact(prev => ({ ...prev, [key]: value }))

  const handleReset = () => {
    if (window.confirm('Reset all contact fields to empty?')) {
      setContact(DEFAULT_CONTACT)
      addToast('Reset complete', 'success')
    }
  }

  if (loading) return <Loader />

  return (
    <>
      <StickyToolbar title="Contact Page" onSave={triggerSave} onPreview={() => window.open('/contact', '_blank')} onReset={handleReset}>
        <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
      </StickyToolbar>
     <div className="p-6 space-y-6">
        <SectionCard title="Contact Information" defaultOpen={true}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Heading" value={contact.heading || ''} onChange={v => handleChange('heading', v)} placeholder="Get In Touch" />
            <FormField label="Description" value={contact.description || ''} onChange={v => handleChange('description', v)} type="textarea" placeholder="We'd love to hear from you..." />
            <FormField label="Address" value={contact.address || ''} onChange={v => handleChange('address', v)} placeholder="Kathmandu, Nepal" />
            <FormField label="Phone" value={contact.phone || ''} onChange={v => handleChange('phone', v)} placeholder="+977-9800000000" />
            <FormField label="Email" value={contact.email || ''} onChange={v => handleChange('email', v)} placeholder="info@samanbhandar.com" />
            <FormField label="Map URL" value={contact.map_url || ''} onChange={v => handleChange('map_url', v)} placeholder="https://..." />
          </div>
        </SectionCard>
        <SectionCard title="Social Media Links">
          <FormField label="Social Media (JSON array)" value={JSON.stringify(contact.social_media_links || [])} onChange={v => { try { handleChange('social_media_links', JSON.parse(v)) } catch {} }} type="textarea" placeholder='[{"platform": "facebook", "url": "#"}]' />
        </SectionCard>
      </div>
    </>
  )
}