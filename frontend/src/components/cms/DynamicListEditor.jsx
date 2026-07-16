import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Trash2, Copy, Eye, EyeOff, ChevronLeft, ChevronRight, X } from 'lucide-react'
import * as Icons from 'lucide-react'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import IconPicker from './IconPicker'

function SortableItem({ item, onEdit, onDelete, onDuplicate, onToggle, showIcon, allowDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  const IconComponent = showIcon && item.icon ? Icons[item.icon] : null

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200">
      <button {...listeners} {...attributes} className="cursor-grab text-gray-400 hover:text-gray-600">
        <GripVertical size={18} />
      </button>
      {IconComponent && <IconComponent size={22} className="text-gray-500 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 truncate">{item.title || item.question || item.customer_name || item.label}</p>
        <p className="text-xs text-gray-500 truncate mt-0.5">{item.description || item.answer || item.position}</p>
      </div>
      <div className="flex items-center gap-1">
        {onToggle && (
          <button onClick={() => onToggle(item.id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400" title={item.visible === false ? 'Show' : 'Hide'}>
            {item.visible === false ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {onDuplicate && (
          <button onClick={() => onDuplicate(item)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400" title="Duplicate">
            <Copy size={16} />
          </button>
        )}
        <button onClick={() => onEdit(item)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400" title="Edit">
          <Pencil size={16} />
        </button>
        {allowDelete !== false && (
          <button onClick={() => onDelete(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500" title="Delete">
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

export default function DynamicListEditor({
  items,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  onDuplicate,
  onToggle,
  fields,
  title,
  pageSize = 10,
  allowAdd = true,
  allowDelete = true,
}) {
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [deleteId, setDeleteId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(items.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const visibleItems = items.slice(startIndex, startIndex + pageSize)

  const showIcon = fields.some(f => f.key === 'icon')

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = visibleItems.findIndex(i => i.id === active.id)
      const newIndex = visibleItems.findIndex(i => i.id === over.id)
      const reorderedPage = arrayMove(visibleItems, oldIndex, newIndex)
      const newItems = [...items]
      newItems.splice(startIndex, reorderedPage.length, ...reorderedPage)
      onReorder(newItems)
    }
  }

  const startAdd = () => {
    setForm({})
    setEditing('new')
  }

  const startEdit = (item) => {
    const { title: _t, description: _d, ...cleanItem } = item
    setForm(cleanItem)
    setEditing(item.id)
  }

  const closeModal = () => setEditing(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const cleaned = {}
    fields.forEach(f => {
      let val = form[f.key]
      if (val === undefined) {
        val = f.type === 'number' ? 0 : ''
      }
      if (f.type === 'number') {
        const num = Number(val)
        if (!isNaN(num)) {
          if (f.min !== undefined && num < f.min) val = f.min
          if (f.max !== undefined && num > f.max) val = f.max
        }
      }
      cleaned[f.key] = val
    })
    delete cleaned.title
    delete cleaned.description

    if (editing === 'new') {
      onAdd(cleaned)
    } else {
      onUpdate(editing, cleaned)
    }
    setEditing(null)
  }

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {allowAdd && (
          <button onClick={startAdd} className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            Add New
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-500 border border-dashed border-gray-200 rounded-xl">
          No items yet.
        </div>
      ) : (
        <>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={visibleItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {visibleItems.map(item => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    onEdit={startEdit}
                    onDelete={id => setDeleteId(id)}
                    onDuplicate={onDuplicate ? () => onDuplicate(item) : undefined}
                    onToggle={onToggle}
                    showIcon={showIcon}
                    allowDelete={allowDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">Page {currentPage} of {totalPages} ({items.length} items)</p>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i+1} onClick={() => setCurrentPage(i+1)} className={`w-7 h-7 text-xs font-medium rounded ${currentPage === i+1 ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
                    {i+1}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">{editing === 'new' ? `Add ${title}` : `Edit ${title}`}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {fields.map(field => {
                if (field.type === 'icon') {
                  return (
                    <div key={field.key}>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">{field.label}</label>
                      <IconPicker value={form[field.key] || ''} onChange={v => setForm(prev => ({ ...prev, [field.key]: v }))} />
                    </div>
                  )
                }
                if (field.type === 'textarea') {
                  return (
                    <div key={field.key}>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">{field.label}</label>
                      <textarea value={form[field.key] || ''} onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-200" rows={3} />
                    </div>
                  )
                }
                return (
                  <div key={field.key}>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">{field.label}</label>
                    <input
                      value={form[field.key] || ''}
                      onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                      type={field.type || 'text'}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                )
              })}
              <div className="flex gap-2 pt-2">
                <button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg py-2.5 px-5 text-sm">
                  {editing === 'new' ? 'Add' : 'Update'}
                </button>
                <button type="button" onClick={closeModal} className="border border-gray-200 text-gray-600 font-medium rounded-lg py-2.5 px-5 text-sm hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  )
}