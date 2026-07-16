import { useState, useEffect } from 'react'
import { getContact, updateContact } from '../../../services/cmsService'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import AutoSaveIndicator from '../../../components/cms/AutoSaveIndicator'
import SectionCard from '../../../components/cms/SectionCard'
import FormField from '../../../components/cms/FormField'
import useAutoSave from '../../../hooks/useAutoSave'
import { useToast } from '../../../context/ToastContext'

const EMPTY_CONTACT = {
  hero_badge: '',
  hero_title: '',
  hero_title_line2: '',
  hero_description: '',
  heading: '',
  description: '',
  email: '',
  email_sub: '',
  phone: '',
  phone_sub: '',
  address: '',
  address_sub: '',
  hours: '',
  hours_sub: '',
  map_url: '',
  office_heading: '',
  office_address: '',
  social_media_links: '[]',
}

export default function ContactManager() {
  const [contact, setContact] = useState(EMPTY_CONTACT)
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  useEffect(() => {
    getContact()
      .then(res => {
        const data = res.data.data || {}
        if (Array.isArray(data.social_media_links)) {
          data.social_media_links = JSON.stringify(data.social_media_links, null, 2)
        } else if (!data.social_media_links) {
          data.social_media_links = '[]'
        }
        setContact({ ...EMPTY_CONTACT, ...data })
      })
      .catch(() => addToast('Failed to load contact data', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const { saveStatus, lastSaved, triggerSave } = useAutoSave(contact, (data) => {
    const payload = { ...data }
    if (typeof payload.social_media_links === 'string') {
      try { payload.social_media_links = JSON.parse(payload.social_media_links) } catch { payload.social_media_links = [] }
    }
    return updateContact(payload).then(() => addToast('Contact saved', 'success')).catch(() => addToast('Auto-save failed', 'error'))
  }, 2500)

  const handleChange = (key, value) => setContact(prev => ({ ...prev, [key]: value }))

  const handleReset = async () => {
    if (!window.confirm('Clear all contact fields? The public page will show default content until you save new values.')) return
    try {
      const emptyPayload = { ...EMPTY_CONTACT }
      emptyPayload.social_media_links = []
      await updateContact(emptyPayload)
      setContact(EMPTY_CONTACT)
      addToast('Fields cleared', 'success')
    } catch { addToast('Failed to clear', 'error') }
  }

  if (loading) return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="h-40 bg-gray-200 rounded-xl" />
      <div className="h-40 bg-gray-200 rounded-xl" />
    </div>
  )

  return (
    <>
      <StickyToolbar
        title="Contact Page"
        description="Customise the contact information. Leave blank to use the default website content."
        onSave={triggerSave}
        onPreview={() => window.open('/contact', '_blank')}
        onReset={handleReset}
      >
        <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
      </StickyToolbar>
      <div className="p-6 space-y-6">
        <SectionCard title="Hero Section" defaultOpen={true}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Badge" value={contact.hero_badge} onChange={v => handleChange('hero_badge', v)} placeholder="Get in touch" />
            <FormField label="Title (first line)" value={contact.hero_title} onChange={v => handleChange('hero_title', v)} placeholder="We'd love to" />
            <FormField label="Title (second line)" value={contact.hero_title_line2} onChange={v => handleChange('hero_title_line2', v)} placeholder="hear from you." />
            <FormField label="Description" value={contact.hero_description} onChange={v => handleChange('hero_description', v)} type="textarea" placeholder="Have a question, feedback or want to partner with us?" />
          </div>
        </SectionCard>

        <SectionCard title="Contact Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-4">
              <FormField label="Email" value={contact.email} onChange={v => handleChange('email', v)} placeholder="hello@samanbhandar.com" />
              <FormField label="Email Subtitle" value={contact.email_sub} onChange={v => handleChange('email_sub', v)} placeholder="Reply within 24 hours" />
            </div>
            <div className="space-y-4">
              <FormField label="Phone" value={contact.phone} onChange={v => handleChange('phone', v)} placeholder="+977 01-XXXXXXX" />
              <FormField label="Phone Subtitle" value={contact.phone_sub} onChange={v => handleChange('phone_sub', v)} placeholder="Mon–Fri, 9am–6pm" />
            </div>
            <div className="space-y-4">
              <FormField label="Address" value={contact.address} onChange={v => handleChange('address', v)} placeholder="Naybazar, Pokhara" />
              <FormField label="Address Subtitle" value={contact.address_sub} onChange={v => handleChange('address_sub', v)} placeholder="Ward 26, Nepal" />
            </div>
            <div className="space-y-4">
              <FormField label="Hours" value={contact.hours} onChange={v => handleChange('hours', v)} placeholder="Mon – Fri" />
              <FormField label="Hours Subtitle" value={contact.hours_sub} onChange={v => handleChange('hours_sub', v)} placeholder="9:00 AM – 6:00 PM NPT" />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Office Info">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Office Heading" value={contact.office_heading} onChange={v => handleChange('office_heading', v)} placeholder="Find us in Pokhara" />
            <FormField label="Office Address" value={contact.office_address} onChange={v => handleChange('office_address', v)} placeholder="Newroad, Pokhara" />
            <FormField label="Map URL (optional)" value={contact.map_url} onChange={v => handleChange('map_url', v)} placeholder="https://maps.google.com/..." />
          </div>
        </SectionCard>

        <SectionCard title="Form Section">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Form Heading" value={contact.heading} onChange={v => handleChange('heading', v)} placeholder="Send us a message" />
            <FormField label="Form Description" value={contact.description} onChange={v => handleChange('description', v)} type="textarea" placeholder="Fill out the form and our team will get back to you." />
          </div>
        </SectionCard>

        <SectionCard title="Social Links">
          <FormField
            label="Social Media Links (JSON)"
            value={contact.social_media_links}
            onChange={v => handleChange('social_media_links', v)}
            type="textarea"
            placeholder='[{"platform":"facebook","url":"#"},{"platform":"instagram","url":"#"}]'
            helper="Edit as JSON array of objects with 'platform' and 'url' keys."
            rows={4}
          />
        </SectionCard>
      </div>
    </>
  )
}
