import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useState } from 'react'

const TYPES = {
  success: { icon: CheckCircle2, bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon_color: 'text-emerald-500' },
  error: { icon: AlertCircle, bg: 'bg-brick-light border-brick/20', text: 'text-brick', icon_color: 'text-brick' },
  info: { icon: Info, bg: 'bg-chalk-dark border-border', text: 'text-[#1c1917]', icon_color: 'text-[#71717a]' },
}

export default function AlertMessage({ type = 'info', message, dismissible = true }) {
  const [visible, setVisible] = useState(true)
  if (!visible || !message) return null
  const t = TYPES[type] || TYPES.info
  const Icon = t.icon
  return (
    <div className={`flex items-start gap-3 border rounded-xl px-4 py-3 animate-fade-in ${t.bg}`}>
      <Icon size={15} className={`shrink-0 mt-0.5 ${t.icon_color}`} />
      <p className={`text-sm font-medium flex-1 ${t.text}`}>{message}</p>
      {dismissible && (
        <button onClick={() => setVisible(false)} className={`${t.text} opacity-50 hover:opacity-100 transition-opacity shrink-0`}>
          <X size={14} />
        </button>
      )}
    </div>
  )
}