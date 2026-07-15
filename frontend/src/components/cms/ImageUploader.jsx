import { useState, useRef } from 'react'
import { Upload, X, Image } from 'lucide-react'

export default function ImageUploader({ value, onChange, onRemove }) {
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    setPreview(URL.createObjectURL(file))
    onChange(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
    onRemove()
  }

  return (
    <div className="space-y-3">
      {preview || value ? (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img
            src={preview || (typeof value === 'string' ? value : URL.createObjectURL(value))}
            alt="preview"
            className="w-full h-48 object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white border border-border rounded-lg p-1.5 shadow-sm transition-colors"
          >
            <X size={14} className="text-[#1c1917]" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragging ? 'border-[#1c1917] bg-chalk' : 'border-border hover:border-[#1c1917]/40'
          }`}
          onClick={() => fileRef.current?.click()}
        >
          <Image size={24} className="mx-auto mb-2 text-[#71717a]" />
          <p className="text-sm font-medium text-[#1c1917]">Drag & drop an image here, or click to browse</p>
          <p className="text-xs text-[#71717a] mt-1">PNG, JPG, WEBP up to 5MB</p>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files[0])}
        className="hidden"
      />
    </div>
  )
}