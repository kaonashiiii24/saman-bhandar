import { useState, useEffect, useCallback } from 'react'
import { getNavigation, updateNavigation } from '../../../services/cmsService'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import AutoSaveIndicator from '../../../components/cms/AutoSaveIndicator'
import SectionCard from '../../../components/cms/SectionCard'
import FormField from '../../../components/cms/FormField'
import ImageUploader from '../../../components/cms/ImageUploader'
import useAutoSave from '../../../hooks/useAutoSave'
import { useToast } from '../../../context/ToastContext'

const DEFAULT_NAV = {
  website_name: 'Saman',
  website_name_highlight: 'Bhandar',
  logo_url: '',
  footer_logo_url: '',
  logo_height: '32',
  menu_items: '[\n  {"label":"Find Storage","url":"/listings"},\n  {"label":"Services","url":"/services"},\n  {"label":"About","url":"/about"},\n  {"label":"Contact","url":"/contact"}\n]',
  sign_in_text: 'Sign in',
  sign_up_text: 'Sign up free',
}

export default function NavigationManager() {
  const [nav, setNav] = useState(DEFAULT_NAV)
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)
  const addToast = useToast()

  useEffect(() => {
    getNavigation()
      .then(res => {
        const data = res.data.data || {}
        setNav(prev => ({ ...prev, ...data }))
      })
      .catch(() => addToast('Failed to load navigation', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const clampLogoHeight = useCallback((value) => {
    let num = parseInt(value, 10)
    if (isNaN(num)) num = 32
    num = Math.min(64, Math.max(16, num))
    return num.toString()
  }, [])

  const { saveStatus, lastSaved, triggerSave } = useAutoSave(nav, (data) => {
    const payload = { ...data }
    payload.logo_height = clampLogoHeight(payload.logo_height)
    const formData = new FormData()
    Object.entries(payload).forEach(([key, val]) => {
      if (key === 'logo_url' || key === 'footer_logo_url') return
      if (val !== undefined && val !== null) formData.append(key, val)
    })
    return updateNavigation(formData)
      .then(() => addToast('Navigation saved', 'success'))
      .catch(() => addToast('Auto-save failed', 'error'))
  }, 2500)

  const handleChange = (key, value) => setNav(prev => ({ ...prev, [key]: value }))

  const handleLogoHeightBlur = () => {
    setNav(prev => ({ ...prev, logo_height: clampLogoHeight(prev.logo_height) }))
  }

  const handleLogoUpload = (file, field) => {
    const formData = new FormData()
    formData.append(field, file)
    updateNavigation(formData)
      .then(() => {
        getNavigation().then(res => setNav(prev => ({ ...prev, ...res.data.data })))
        addToast('Logo updated', 'success')
      })
      .catch(() => addToast('Logo upload failed', 'error'))
  }

  const handleReset = async () => {
    if (!window.confirm('Reset navigation to defaults? This will overwrite saved values.')) return
    setResetting(true)
    try {
      const formData = new FormData()
      Object.entries(DEFAULT_NAV).forEach(([key, val]) => {
        formData.append(key, val)
      })
      formData.set('logo_url', '')
      formData.set('footer_logo_url', '')

      await updateNavigation(formData)
      setNav(DEFAULT_NAV)
      addToast('Navigation reset', 'success')
    } catch {
      addToast('Failed to reset navigation', 'error')
    } finally {
      setResetting(false)
    }
  }

  if (loading) return <div className="p-8 animate-pulse"><div className="h-8 w-48 bg-gray-200 rounded" /></div>

  return (
    <>
      <StickyToolbar
        title="Navigation"
        description="Edit the website name, logo, menu links, and auth buttons."
        onSave={triggerSave}
        onPreview={() => window.open('/', '_blank')}
        onReset={handleReset}
        resetDisabled={resetting}
      >
        <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
      </StickyToolbar>
      <div className="p-6 space-y-6">
        <SectionCard title="Branding">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Website Name" value={nav.website_name} onChange={v => handleChange('website_name', v)} placeholder="Saman" />
            <FormField label="Highlight Part" value={nav.website_name_highlight} onChange={v => handleChange('website_name_highlight', v)} placeholder="Bhandar" />
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Logo Height (px, max 64)
              </label>
              <input
                type="number"
                min="16"
                max="64"
                step="4"
                value={nav.logo_height}
                onChange={e => {
                  let val = e.target.value
                  if (val === '') {
                    handleChange('logo_height', val)
                    return
                  }
                  let num = parseInt(val, 10)
                  if (isNaN(num)) return
                  if (num > 64) num = 64
                  handleChange('logo_height', num.toString())
                }}
                onBlur={handleLogoHeightBlur}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-200"
                placeholder="32"
              />
              <p className="text-[10px] text-gray-500 mt-1">Set the logo size. Maximum 64px (navbar height).</p>
            </div>
          </div>
          <div className="mt-5">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Website Logo</label>
            <ImageUploader value={nav.logo_url} onChange={file => handleLogoUpload(file, 'logo_url')} onRemove={() => handleChange('logo_url', '')} />
          </div>
          <div className="mt-5">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Footer Logo (optional)</label>
            <ImageUploader value={nav.footer_logo_url} onChange={file => handleLogoUpload(file, 'footer_logo_url')} onRemove={() => handleChange('footer_logo_url', '')} />
          </div>
        </SectionCard>

        <SectionCard title="Menu Items">
          <FormField
            label="Menu Items (JSON)"
            value={nav.menu_items}
            onChange={v => handleChange('menu_items', v)}
            type="textarea"
            placeholder='[{"label":"Find Storage","url":"/listings"}]'
            helper="Edit as JSON array of objects with 'label' and 'url' keys."
            rows={4}
          />
        </SectionCard>

        <SectionCard title="Auth Buttons">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Sign In Text" value={nav.sign_in_text} onChange={v => handleChange('sign_in_text', v)} placeholder="Sign in" />
            <FormField label="Sign Up Text" value={nav.sign_up_text} onChange={v => handleChange('sign_up_text', v)} placeholder="Sign up free" />
          </div>
        </SectionCard>
      </div>
    </>
  )
}