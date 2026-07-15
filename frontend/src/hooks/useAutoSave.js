import { useState, useEffect, useRef } from 'react'

export default function useAutoSave(data, saveFn, delay = 3000) {
  const [saveStatus, setSaveStatus] = useState('idle')
  const [lastSaved, setLastSaved] = useState(null)
  const timeout = useRef(null)
  const previousData = useRef(data)

  useEffect(() => {
    if (!data) return

    // Skip if data is the same object reference (no actual edit)
    if (data === previousData.current) return

    // If the previous data was null (initial load), skip marking as unsaved
    if (previousData.current === null) {
      previousData.current = data
      return
    }

    // Real change detected → mark unsaved and schedule save
    previousData.current = data
    setSaveStatus('unsaved')
    clearTimeout(timeout.current)
    timeout.current = setTimeout(async () => {
      setSaveStatus('saving')
      try {
        await saveFn(data)
        setLastSaved(new Date())
        setSaveStatus('saved')
      } catch {
        setSaveStatus('unsaved')
      }
    }, delay)
    return () => clearTimeout(timeout.current)
  }, [data])

  const triggerSave = async () => {
    clearTimeout(timeout.current)
    setSaveStatus('saving')
    try {
      await saveFn(data)
      setLastSaved(new Date())
      setSaveStatus('saved')
    } catch {
      setSaveStatus('unsaved')
    }
  }

  return { saveStatus, lastSaved, triggerSave }
}