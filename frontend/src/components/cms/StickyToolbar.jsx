import { Save, Eye, RotateCcw, Undo, Redo, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

export default function StickyToolbar({
  onSave, onPreview, onReset, onUndo, onRedo,
  canUndo = false, canRedo = false,
  title = 'Edit Section', description, children,
}) {
  const [showMore, setShowMore] = useState(false)

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex flex-col justify-center">
          <h1 className="font-bold text-lg text-gray-900 leading-tight">{title}</h1>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">{children}</div>
          <button onClick={onSave} className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors">
            <Save size={14} /> Save
          </button>
          <button onClick={onPreview} className="inline-flex items-center gap-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors">
            <Eye size={14} /> Preview
          </button>
          <div className="relative">
            <button onClick={() => setShowMore(!showMore)} className="inline-flex items-center justify-center w-9 h-9 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
              <MoreHorizontal size={14} />
            </button>
            {showMore && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 z-50 animate-scale-in">
                <button onClick={() => { onUndo?.(); setShowMore(false) }} disabled={!canUndo}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 w-full disabled:opacity-40">
                  <Undo size={14} /> Undo
                </button>
                <button onClick={() => { onRedo?.(); setShowMore(false) }} disabled={!canRedo}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 w-full disabled:opacity-40">
                  <Redo size={14} /> Redo
                </button>
                <div className="h-px bg-gray-200 my-1" />
                <button onClick={() => { onReset?.(); setShowMore(false) }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full">
                  <RotateCcw size={14} /> Reset Page
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="sm:hidden px-6 pb-2">{children}</div>
    </div>
  )
}