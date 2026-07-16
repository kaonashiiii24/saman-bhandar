import { useState, useEffect, useRef, useCallback } from 'react'
import { getHero, updateHero } from '../../../services/cmsService'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import AutoSaveIndicator from '../../../components/cms/AutoSaveIndicator'
import SectionCard from '../../../components/cms/SectionCard'
import FormField from '../../../components/cms/FormField'
import ImageUploader from '../../../components/cms/ImageUploader'
import useAutoSave from '../../../hooks/useAutoSave'
import { useToast } from '../../../context/ToastContext'

const DEFAULT_HERO = {
  badge: '',
  title: '',
  title_highlight: '',
  description: '',
  cta_primary_text: '',
  cta_primary_link: '',
  cta_secondary_text: '',
  cta_secondary_link: '',
  hero_bg: '',
  stat1_label: '',
  stat2_label: '',
  stat3_label: '',
  dashboard_title: '',
  dashboard_subtitle: '',
  floating_card_1_title: '',
  floating_card_1_subtitle: '',
  floating_card_2_title: '',
  floating_card_2_subtitle: '',
}

export default function HeroManager() {
  const [hero, setHero] = useState(DEFAULT_HERO)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])

  const startSnapshot = useRef(null)
  const debounceTimer = useRef(null)
  const addToast = useToast()

  useEffect(() => {
    getHero()
      .then(res => setHero(res.data.data || DEFAULT_HERO))
      .catch(() => addToast('Failed to load hero data', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const { saveStatus, lastSaved, triggerSave } = useAutoSave(hero, (data) => {
    return updateHero(data).then(() => addToast('Hero saved', 'success')).catch(() => addToast('Auto-save failed', 'error'))
  }, 2500)

  const pushUndo = useCallback((oldState) => {
    setUndoStack(prev => [...prev, oldState])
    setRedoStack([])
  }, [])

  const handleFieldChange = (key, value) => {
    if (!startSnapshot.current) startSnapshot.current = { ...hero }
    setHero(prev => ({ ...prev, [key]: value }))
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      if (startSnapshot.current) {
        if (JSON.stringify(startSnapshot.current) !== JSON.stringify(hero)) pushUndo(startSnapshot.current)
        startSnapshot.current = null
      }
    }, 800)
  }

  const handleUndo = () => {
    if (undoStack.length === 0) return
    const previous = undoStack[undoStack.length - 1]
    setUndoStack(prev => prev.slice(0, -1))
    setRedoStack(prev => [...prev, hero])
    setHero(previous)
  }

  const handleRedo = () => {
    if (redoStack.length === 0) return
    const next = redoStack[redoStack.length - 1]
    setRedoStack(prev => prev.slice(0, -1))
    setUndoStack(prev => [...prev, hero])
    setHero(next)
  }

  const handleReset = () => {
    if (window.confirm('Reset all hero fields to empty? This can be undone.')) {
      pushUndo(hero)
      setHero(DEFAULT_HERO)
      addToast('Reset complete', 'success')
    }
  }

  const handleImageChange = (file) => {
    const formData = new FormData()
    formData.append('hero_bg', file)
    updateHero(formData)
      .then(() => { getHero().then(res => setHero(res.data.data || DEFAULT_HERO)); addToast('Image updated', 'success') })
      .catch(() => addToast('Image upload failed', 'error'))
  }

  const handleImageRemove = () => handleFieldChange('hero_bg', '')

  if (loading) return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="h-40 bg-gray-200 rounded-xl" />
      <div className="h-40 bg-gray-200 rounded-xl" />
    </div>
  )

  if (error) return (
    <div className="p-8 text-center">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={() => window.location.reload()} className="text-sm font-semibold text-gray-900 underline">Try Again</button>
    </div>
  )

  return (
    <>
      <StickyToolbar
        title="Hero Section"
        description="Manage headline, dashboard mockup, and floating cards."
        onSave={triggerSave}
        onPreview={() => window.open('/?preview=hero', '_blank')}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onReset={handleReset}
      >
        <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
      </StickyToolbar>
      <div className="p-6 space-y-6">
        <SectionCard title="Content" defaultOpen={true}>
          <FormField label="Badge (small text above heading)" value={hero.badge} onChange={v => handleFieldChange('badge', v)} placeholder="Nepal's first micro-warehouse marketplace" />
          <FormField label="Main Heading" value={hero.title} onChange={v => handleFieldChange('title', v)} placeholder="Store smart." maxLength={60} helper="The primary title visitors see" />
          <FormField label="Highlighted Word" value={hero.title_highlight} onChange={v => handleFieldChange('title_highlight', v)} placeholder="Sell more." maxLength={30} helper="The colored, underlined word in the heading" />
          <FormField label="Description" value={hero.description} onChange={v => handleFieldChange('description', v)} type="textarea" placeholder="Stop stuffing your room with inventory..." maxLength={250} helper="Main descriptive text below the heading" />
        </SectionCard>
        <SectionCard title="Background Image">
          <ImageUploader value={hero.hero_bg} onChange={handleImageChange} onRemove={handleImageRemove} />
        </SectionCard>
        <SectionCard title="Buttons">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Primary Button Text" value={hero.cta_primary_text} onChange={v => handleFieldChange('cta_primary_text', v)} placeholder="Find storage near you" />
            <FormField label="Primary Button Link" value={hero.cta_primary_link} onChange={v => handleFieldChange('cta_primary_link', v)} placeholder="/listings" />
            <FormField label="Secondary Button Text" value={hero.cta_secondary_text} onChange={v => handleFieldChange('cta_secondary_text', v)} placeholder="List your space" />
            <FormField label="Secondary Button Link" value={hero.cta_secondary_link} onChange={v => handleFieldChange('cta_secondary_link', v)} placeholder="/register?role=host" />
          </div>
        </SectionCard>
        <SectionCard title="Dashboard Mockup">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Dashboard Title" value={hero.dashboard_title} onChange={v => handleFieldChange('dashboard_title', v)} placeholder="Storage Overview" />
            <FormField label="Dashboard Subtitle" value={hero.dashboard_subtitle} onChange={v => handleFieldChange('dashboard_subtitle', v)} placeholder="Live inventory dashboard" />
          </div>
        </SectionCard>
        <SectionCard title="Floating Cards">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Card 1 Title" value={hero.floating_card_1_title} onChange={v => handleFieldChange('floating_card_1_title', v)} placeholder="Pickup confirmed" />
            <FormField label="Card 1 Subtitle" value={hero.floating_card_1_subtitle} onChange={v => handleFieldChange('floating_card_1_subtitle', v)} placeholder="Today at 2:00 PM" />
            <FormField label="Card 2 Title" value={hero.floating_card_2_title} onChange={v => handleFieldChange('floating_card_2_title', v)} placeholder="Booking approved" />
            <FormField label="Card 2 Subtitle" value={hero.floating_card_2_subtitle} onChange={v => handleFieldChange('floating_card_2_subtitle', v)} placeholder="By Host" />
          </div>
        </SectionCard>
        <SectionCard title="Statistics Labels (numbers are live)">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <FormField label="Stat 1 Label" value={hero.stat1_label} onChange={v => handleFieldChange('stat1_label', v)} placeholder="Active sellers" />
            <FormField label="Stat 2 Label" value={hero.stat2_label} onChange={v => handleFieldChange('stat2_label', v)} placeholder="Verified hosts" />
            <FormField label="Stat 3 Label" value={hero.stat3_label} onChange={v => handleFieldChange('stat3_label', v)} placeholder="Locations" />
          </div>
        </SectionCard>
      </div>
    </>
  )
}