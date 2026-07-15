import { useState, useEffect } from 'react'
import { getTheme, updateTheme } from '../../../services/cmsService'
import Loader from '../../../components/common/Loader'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import AutoSaveIndicator from '../../../components/cms/AutoSaveIndicator'
import SectionCard from '../../../components/cms/SectionCard'
import ColorPickerField from '../../../components/cms/ColorPickerField'
import useAutoSave from '../../../hooks/useAutoSave'
import { useToast } from '../../../context/ToastContext'

const DEFAULT_THEME = {
  primary_color: '#3B82F6', secondary_color: '#10B981', accent_color: '#F59E0B',
  background_color: '#FFFFFF', text_color: '#1F2937',
  button_primary_bg: '#3B82F6', button_primary_text: '#FFFFFF'
}

export default function ThemeManager() {
  const [theme, setTheme] = useState(null)
  const [loading, setLoading] = useState(true)
  const addToast = useToast()

  useEffect(() => {
    getTheme()
      .then(res => setTheme(res.data.data || {}))
      .catch(() => { addToast('Failed to load theme', 'error'); setTheme(DEFAULT_THEME) })
      .finally(() => setLoading(false))
  }, [])

  const { saveStatus, lastSaved, triggerSave } = useAutoSave(theme, (data) => {
    return updateTheme(data).then(() => addToast('Theme saved', 'success')).catch(() => addToast('Auto-save failed', 'error'))
  }, 2500)

  const handleChange = (key, value) => setTheme(prev => ({ ...prev, [key]: value }))

  const handleReset = () => {
    if (window.confirm('Reset theme to default colors?')) {
      setTheme(DEFAULT_THEME)
      addToast('Reset complete', 'success')
    }
  }

  if (loading) return <Loader />

  return (
    <>
      <StickyToolbar title="Theme Settings" onSave={triggerSave} onPreview={() => window.open('/', '_blank')} onReset={handleReset}>
        <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
      </StickyToolbar>
      <div className="p-6 space-y-6">
        <SectionCard title="Colors" defaultOpen={true}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ColorPickerField label="Primary Color" value={theme.primary_color || '#3B82F6'} onChange={v => handleChange('primary_color', v)} />
            <ColorPickerField label="Secondary Color" value={theme.secondary_color || '#10B981'} onChange={v => handleChange('secondary_color', v)} />
            <ColorPickerField label="Accent Color" value={theme.accent_color || '#F59E0B'} onChange={v => handleChange('accent_color', v)} />
            <ColorPickerField label="Background Color" value={theme.background_color || '#FFFFFF'} onChange={v => handleChange('background_color', v)} />
            <ColorPickerField label="Text Color" value={theme.text_color || '#1F2937'} onChange={v => handleChange('text_color', v)} />
            <ColorPickerField label="Button Background" value={theme.button_primary_bg || '#3B82F6'} onChange={v => handleChange('button_primary_bg', v)} />
            <ColorPickerField label="Button Text" value={theme.button_primary_text || '#FFFFFF'} onChange={v => handleChange('button_primary_text', v)} />
          </div>
        </SectionCard>
      </div>
    </>
  )
}