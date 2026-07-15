import { useState } from 'react'

export default function ColorPickerField({ label, value = '#000000', onChange }) {
  const [hex, setHex] = useState(value)

  const handleChange = (newHex) => {
    setHex(newHex)
    onChange(newHex)
  }

  return (
    <div>
      <label className="block text-xs font-bold text-[#1c1917] mb-1.5">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={hex}
          onChange={(e) => handleChange(e.target.value)}
          className="h-10 w-14 border border-border rounded-lg cursor-pointer bg-white p-1"
        />
        <input
          type="text"
          value={hex}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-3 py-2 border border-border rounded-lg bg-[#FAFAF9] text-sm font-mono"
        />
      </div>
    </div>
  )
}