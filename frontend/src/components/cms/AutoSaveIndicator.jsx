import { Cloud, Check, AlertTriangle, Loader } from 'lucide-react'

export default function AutoSaveIndicator({ status, lastSaved }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {status === 'saving' && (
        <span className="flex items-center gap-1 text-amber-600">
          <Loader size={12} className="animate-spin" /> Saving...
        </span>
      )}
      {status === 'saved' && (
        <span className="flex items-center gap-1 text-emerald-600">
          <Check size={12} /> Saved {lastSaved ? new Date(lastSaved).toLocaleTimeString() : ''}
        </span>
      )}
      {status === 'unsaved' && (
        <span className="flex items-center gap-1 text-red-500">
          <AlertTriangle size={12} /> Unsaved changes
        </span>
      )}
      {status === 'idle' && (
        <span className="flex items-center gap-1 text-gray-400">
          <Cloud size={12} /> All changes saved
        </span>
      )}
    </div>
  )
}