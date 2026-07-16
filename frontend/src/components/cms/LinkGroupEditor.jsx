import { Plus, Trash2, GripVertical, Pencil } from 'lucide-react'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  arrayMove, SortableContext, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableLink({ link, index, onChange, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `link-${index}` })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 mb-2 bg-white border border-gray-200 rounded-lg p-3">
      <button {...listeners} {...attributes} className="cursor-grab text-gray-400 hover:text-gray-600">
        <GripVertical size={14} />
      </button>
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          value={link.label}
          onChange={e => onChange(index, 'label', e.target.value)}
          placeholder="Label"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white"
        />
        <input
          value={link.url}
          onChange={e => onChange(index, 'url', e.target.value)}
          placeholder="URL"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white"
        />
      </div>
      <button onClick={() => onRemove(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
        <Trash2 size={14} />
      </button>
    </div>
  )
}

export default function LinkGroupEditor({ value, onChange, placeholder }) {
  const hasRealValue = (() => {
    if (!value) return false
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value
      return Array.isArray(parsed) && parsed.length > 0
    } catch { return false }
  })()

  const defaultLinks = (() => {
    try {
      const parsed = typeof placeholder === 'string' ? JSON.parse(placeholder) : placeholder
      return Array.isArray(parsed) ? parsed : []
    } catch { return [] }
  })()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  if (!hasRealValue) {
    return (
      <div>
        <div className="space-y-2 opacity-50 pointer-events-none select-none">
          {defaultLinks.map((link, index) => (
            <div key={`placeholder-${index}`} className="flex items-center gap-2 mb-2 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-3">
              <GripVertical size={14} className="text-gray-300" />
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="w-full px-3 py-2 text-sm rounded-lg text-gray-500">{link.label}</div>
                <div className="w-full px-3 py-2 text-sm rounded-lg text-gray-500">{link.url}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-1 mb-2">Using default links shown on the live site.</p>
        <button
          onClick={() => onChange(JSON.stringify(defaultLinks.length > 0 ? defaultLinks : [{ label: '', url: '' }], null, 2))}
          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <Pencil size={14} /> Customize Links
        </button>
      </div>
    )
  }

  const links = (() => {
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : (Array.isArray(value) ? value : [])
      return parsed.length === 0 ? [{ label: '', url: '' }] : parsed
    } catch { return [{ label: '', url: '' }] }
  })()

  const handleChange = (index, field, val) => {
    const updated = links.map((l, i) => i === index ? { ...l, [field]: val } : l)
    onChange(JSON.stringify(updated, null, 2))
  }

  const handleRemove = (index) => {
    if (links.length === 1) {
      onChange('')
      return
    }
    const updated = links.filter((_, i) => i !== index)
    onChange(JSON.stringify(updated, null, 2))
  }

  const handleAdd = () => {
    const updated = [...links, { label: '', url: '' }]
    onChange(JSON.stringify(updated, null, 2))
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = links.findIndex((_, i) => `link-${i}` === active.id)
      const newIndex = links.findIndex((_, i) => `link-${i}` === over.id)
      const updated = arrayMove(links, oldIndex, newIndex)
      onChange(JSON.stringify(updated, null, 2))
    }
  }

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map((_, i) => `link-${i}`)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {links.map((link, index) => (
              <SortableLink
                key={`link-${index}`}
                link={link}
                index={index}
                onChange={handleChange}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <button
        onClick={handleAdd}
        className="mt-2 flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        <Plus size={14} /> Add Link
      </button>
      <button
        onClick={() => onChange('')}
        className="mt-2 ml-4 text-sm font-medium text-gray-400 hover:text-gray-600"
      >
        Revert to defaults
      </button>
    </div>
  )
}