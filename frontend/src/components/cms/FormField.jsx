import { useState } from 'react'

export default function FormField({
  label,
  value = '',
  onChange,
  type = 'text',
  placeholder = '',
  helper,
  maxLength,
  rows = 3,
  error,
}) {
  const [charCount, setCharCount] = useState(value.length)

  const handleChange = (e) => {
    const v = e.target.value
    if (maxLength && v.length > maxLength) return
    setCharCount(v.length)
    onChange(v)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-bold text-[#1c1917]">{label}</label>
        {maxLength && (
          <span className="text-[10px] text-[#71717a]">
            {charCount}/{maxLength}
          </span>
        )}
      </div>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-[#FAFAF9] transition-all outline-none focus:ring-2 focus:ring-[#1c1917]/10 ${
            error ? 'border-red-400 focus:border-red-500' : 'border-border focus:border-[#1c1917]'
          }`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-[#FAFAF9] transition-all outline-none focus:ring-2 focus:ring-[#1c1917]/10 ${
            error ? 'border-red-400 focus:border-red-500' : 'border-border focus:border-[#1c1917]'
          }`}
        />
      )}
      {helper && !error && <p className="text-[10px] text-[#71717a] mt-1">{helper}</p>}
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  )
}