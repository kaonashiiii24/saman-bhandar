import { useState, useEffect } from 'react'
import { getFooter, updateFooter } from '../../../services/cmsService'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import AutoSaveIndicator from '../../../components/cms/AutoSaveIndicator'
import SectionCard from '../../../components/cms/SectionCard'
import FormField from '../../../components/cms/FormField'
import LinkGroupEditor from '../../../components/cms/LinkGroupEditor'
import useAutoSave from '../../../hooks/useAutoSave'
import { useToast } from '../../../context/ToastContext'

const FOOTER_PLACEHOLDERS = {
  description: "Nepal's first peer-to-peer storage marketplace. Connecting sellers, hosts and couriers across the country.",
  copyright_text: '© 2026 SamanBhandar Pvt. Ltd. All rights reserved.',
  tagline: 'Made with care in Nepal.',
  platform_links: JSON.stringify([
    { label: 'Find Storage', url: '/listings' },
    { label: 'List Your Space', url: '/register?role=host' },
    { label: 'Become a Courier', url: '/register?role=courier' },
    { label: 'Services', url: '/services' }
  ], null, 2),
  company_links: JSON.stringify([
    { label: 'About Us', url: '/about' },
    { label: 'Contact', url: '/contact' }
  ], null, 2),
  legal_links: JSON.stringify([
    { label: 'Privacy Policy', url: '/privacy' },
    { label: 'Terms of Service', url: '/terms' }
  ], null, 2),
}

const EMPTY_FOOTER = {
  description: '',
  copyright_text: '',
  tagline: '',
  platform_links: '',
  company_links: '',
  legal_links: '',
}

export default function FooterManager() {
  const [footer, setFooter] = useState(EMPTY_FOOTER)
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  useEffect(() => {
    getFooter()
      .then(res => {
        const data = res.data.data || {}
        const asString = (val) => {
          if (val === undefined || val === null || val === '') return ''
          if (typeof val === 'string') return val
          if (Array.isArray(val) && val.length === 0) return ''
          return JSON.stringify(val, null, 2)
        }
        setFooter({
          description: asString(data.description),
          copyright_text: asString(data.copyright_text),
          tagline: asString(data.tagline),
          platform_links: asString(data.platform_links),
          company_links: asString(data.company_links),
          legal_links: asString(data.legal_links),
        })
      })
      .catch(() => addToast('Failed to load footer data', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const { saveStatus, lastSaved, triggerSave } = useAutoSave(footer, (data) => {
    const payload = { ...data }
    ;['platform_links', 'company_links', 'legal_links'].forEach(key => {
      if (!payload[key]) { payload[key] = []; return }
      try { payload[key] = JSON.parse(payload[key]) } catch { payload[key] = [] }
    })
    return updateFooter(payload)
      .then(() => addToast('Footer saved', 'success'))
      .catch(() => addToast('Auto-save failed', 'error'))
  }, 2500)

  const handleChange = (key, value) => setFooter(prev => ({ ...prev, [key]: value }))

  const handleReset = async () => {
    if (!window.confirm('Clear all footer fields? The site will fall back to its default content.')) return
    try {
      const emptyPayload = { ...EMPTY_FOOTER }
      ;['platform_links', 'company_links', 'legal_links'].forEach(key => { emptyPayload[key] = [] })
      await updateFooter(emptyPayload)
      setFooter(EMPTY_FOOTER)
      addToast('Footer cleared', 'success')
    } catch { addToast('Failed to clear footer', 'error') }
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
        title="Footer"
        description="Edit footer content and link groups. Leave a field blank to use the default shown on the live site."
        onSave={triggerSave}
        onPreview={() => window.open('/', '_blank')}
        onReset={handleReset}
      >
        <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
      </StickyToolbar>
      <div className="p-6 space-y-6">
        <SectionCard title="Content" defaultOpen={true}>
          <FormField
            label="Description"
            value={footer.description}
            onChange={v => handleChange('description', v)}
            type="textarea"
            placeholder={FOOTER_PLACEHOLDERS.description}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            <FormField
              label="Copyright"
              value={footer.copyright_text}
              onChange={v => handleChange('copyright_text', v)}
              placeholder={FOOTER_PLACEHOLDERS.copyright_text}
            />
            <FormField
              label="Tagline"
              value={footer.tagline}
              onChange={v => handleChange('tagline', v)}
              placeholder={FOOTER_PLACEHOLDERS.tagline}
            />
          </div>
        </SectionCard>

        <SectionCard title="Platform Links">
          <LinkGroupEditor
            value={footer.platform_links}
            onChange={v => handleChange('platform_links', v)}
            placeholder={FOOTER_PLACEHOLDERS.platform_links}
          />
        </SectionCard>

        <SectionCard title="Company Links">
          <LinkGroupEditor
            value={footer.company_links}
            onChange={v => handleChange('company_links', v)}
            placeholder={FOOTER_PLACEHOLDERS.company_links}
          />
        </SectionCard>

        <SectionCard title="Legal Links">
          <LinkGroupEditor
            value={footer.legal_links}
            onChange={v => handleChange('legal_links', v)}
            placeholder={FOOTER_PLACEHOLDERS.legal_links}
          />
        </SectionCard>
      </div>
    </>
  )
}