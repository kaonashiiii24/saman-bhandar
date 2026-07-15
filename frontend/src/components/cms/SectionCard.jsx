import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function SectionCard({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-chalk transition-colors"
      >
        <h3 className="font-display font-bold text-sm text-[#1c1917]">{title}</h3>
        <ChevronDown
          size={16}
          className={`text-[#71717a] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="px-6 pb-6 space-y-5">{children}</div>}
    </div>
  )
}