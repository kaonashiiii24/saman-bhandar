import { useState, useEffect } from 'react'
import { Plus, Building2, MapPin, Eye, EyeOff, Trash2, X, Package, Upload, Pencil } from 'lucide-react'
import { getMyListings, createListing, updateListing, deleteListing } from '../../services/listingService'
import Loader from '../../components/common/Loader'
import AlertMessage from '../../components/common/AlertMessage'

export default function MyListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', location: '', size: '', price_per_month: '', description: '' })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [editModal, setEditModal] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', location: '', size: '', price_per_month: '', description: '' })
  const [editImage, setEditImage] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState(null)
  const [editSubmitting, setEditSubmitting] = useState(false)

  useEffect(() => { fetchListings() }, [])

  const fetchListings = async () => {
    try {
      const res = await getMyListings()
      setListings(res.data.data.listings || [])
    } catch { setError('Failed to load listings') }
    finally { setLoading(false) }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleAdd = async () => {
    if (!form.title || !form.location || !form.price_per_month) {
      setError('Title, location and price are required')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('location', form.location)
      formData.append('size', form.size)
      formData.append('price_per_month', form.price_per_month)
      formData.append('description', form.description)
      if (image) formData.append('image', image)
      await createListing(formData)
      setSuccess('Listing created successfully!')
      setForm({ title: '', location: '', size: '', price_per_month: '', description: '' })
      setImage(null)
      setImagePreview(null)
      setShowForm(false)
      fetchListings()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing')
    } finally {
      setSubmitting(false)
    }
  }

  const openEditModal = (listing) => {
    setEditModal(listing)
    setEditForm({
      title: listing.title || '',
      location: listing.location || '',
      size: listing.size || '',
      price_per_month: listing.price_per_month || '',
      description: listing.description || ''
    })
    setEditImage(null)
    setEditImagePreview(null)
  }

  const handleEditImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      setEditImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setEditImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleEditSave = async () => {
    if (!editForm.title || !editForm.location || !editForm.price_per_month) {
      setError('Title, location and price are required')
      return
    }
    setEditSubmitting(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('title', editForm.title)
      formData.append('location', editForm.location)
      formData.append('size', editForm.size)
      formData.append('price_per_month', editForm.price_per_month)
      formData.append('description', editForm.description)
      if (editImage) formData.append('image', editImage)
      await updateListing(editModal.id, formData)
      setSuccess('Listing updated successfully!')
      setEditModal(null)
      fetchListings()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing')
    } finally {
      setEditSubmitting(false)
    }
  }

  const handleToggle = async (id) => {
    const l = listings.find(l => l.id === id)
    try {
      await updateListing(id, { is_active: l.is_active ? 0 : 1 })
      setListings(listings.map(l => l.id === id ? { ...l, is_active: l.is_active ? 0 : 1 } : l))
    } catch { setError('Failed to update listing') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing? This cannot be undone.')) return
    try {
      await deleteListing(id)
      setListings(listings.filter(l => l.id !== id))
      setSuccess('Listing deleted')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete listing')
    }
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-4 sm:space-y-5">
      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} />}

      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-[#1c1917] hover:bg-brick text-white font-display font-bold px-4 py-2.5 rounded-lg transition-colors text-sm">
          {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Listing</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-border rounded-xl p-4 sm:p-5 animate-fade-in-up">
          <h3 className="font-display font-bold text-[#1c1917] mb-4 text-sm">New Listing</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              { key: 'title', label: 'Listing Name', placeholder: 'e.g. My Warehouse' },
              { key: 'location', label: 'Location', placeholder: 'e.g. Nadipur' },
              { key: 'size', label: 'Size', placeholder: 'e.g. 500 sq ft' },
              { key: 'price_per_month', label: 'Price/Month (Rs)', placeholder: 'e.g. 8000', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-bold text-[#1c1917] mb-1.5">{f.label}</label>
                <input type={f.type || 'text'} placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:bg-white transition-all" />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Description</label>
              <textarea rows={2} placeholder="Describe your space..." value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:bg-white transition-all resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Listing Image</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-[#1c1917] transition-colors">
                  <Upload size={14} className="text-[#71717a]" />
                  <span className="text-xs text-[#71717a]">{image ? image.name : 'Choose image'}</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {imagePreview && (
                  <button onClick={() => { setImage(null); setImagePreview(null) }} className="text-xs text-brick hover:underline">Remove</button>
                )}
              </div>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg border border-border" />
              )}
            </div>
          </div>
          <button onClick={handleAdd} disabled={submitting}
            className="bg-[#1c1917] hover:bg-brick text-white font-display font-bold px-5 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60">
            {submitting ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      )}

      {listings.length === 0 && !showForm && (
        <div className="bg-white border border-border rounded-xl p-10 sm:p-14 text-center animate-fade-in">
          <Building2 size={36} className="text-border mx-auto mb-3" />
          <p className="font-display font-bold text-[#1c1917] text-sm mb-1">No listings yet</p>
          <p className="text-[#71717a] text-xs mb-3">Create your first storage listing</p>
          <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 text-xs font-semibold text-brick hover:underline">
            <Plus size={12} /> Add your first listing
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {listings.map((l, i) => (
          <div key={l.id} className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up"
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}>
            <div className="h-32 bg-chalk border-b border-border flex items-center justify-center relative overflow-hidden">
              {l.image_url ? (
                <img src={l.image_url} alt={l.title} className="w-full h-full object-cover" />
              ) : (
                <Package size={32} className="text-border" />
              )}
              <div className="absolute top-3 right-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${l.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-[#F4F4F5] text-[#71717a]'}`}>
                  {l.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display font-bold text-[#1c1917] mb-1 truncate">{l.title}</h3>
              <div className="flex items-center gap-1 text-xs text-[#71717a] mb-2">
                <MapPin size={11} /> <span className="truncate">{l.location}</span>
              </div>
              <p className="font-display font-black text-[#1c1917]">
                Rs {Number(l.price_per_month).toLocaleString()}<span className="text-xs font-normal text-[#71717a]">/mo</span>
              </p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                <button onClick={() => handleToggle(l.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#71717a] hover:text-[#1c1917] hover:bg-chalk py-1.5 rounded-lg transition-colors">
                  {l.is_active ? <EyeOff size={12} /> : <Eye size={12} />}
                  {l.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => openEditModal(l)}
                  className="p-1.5 text-[#71717a] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(l.id)}
                  className="p-1.5 text-[#71717a] hover:text-brick hover:bg-brick-light rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setEditModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-scale-in overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-bold text-[#1c1917] text-sm">Edit Listing</h3>
              <button onClick={() => setEditModal(null)} className="p-1.5 rounded-lg hover:bg-chalk transition-colors">
                <X size={16} className="text-[#71717a]" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Title</label>
                  <input type="text" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] outline-none focus:border-[#1c1917] focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Location</label>
                  <input type="text" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] outline-none focus:border-[#1c1917] focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Size</label>
                  <input type="text" value={editForm.size} onChange={e => setEditForm({ ...editForm, size: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] outline-none focus:border-[#1c1917] focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Price/Month (Rs)</label>
                  <input type="number" value={editForm.price_per_month} onChange={e => setEditForm({ ...editForm, price_per_month: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] outline-none focus:border-[#1c1917] focus:bg-white transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Description</label>
                  <textarea rows={2} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] outline-none focus:border-[#1c1917] focus:bg-white transition-all resize-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Listing Image</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-[#1c1917] transition-colors">
                      <Upload size={14} className="text-[#71717a]" />
                      <span className="text-xs text-[#71717a]">{editImage ? editImage.name : 'Change image'}</span>
                      <input type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
                    </label>
                    {editImagePreview && (
                      <button
                        type="button"
                        onClick={() => { setEditImage(null); setEditImagePreview(null) }}
                        className="inline-flex items-center gap-1 text-xs font-medium text-brick hover:text-red-700 bg-brick-light hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    )}
                  </div>
                  <div className="mt-2 h-32 bg-chalk rounded-lg overflow-hidden border border-border">
                    <img 
                      src={editImagePreview || editModal.image_url || ''} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.target.style.display = 'none' }} 
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setEditModal(null)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-semibold text-[#71717a] hover:bg-chalk transition-colors">
                  Cancel
                </button>
                <button onClick={handleEditSave} disabled={editSubmitting}
                  className="flex-1 py-2.5 bg-[#1c1917] hover:bg-brick text-white rounded-lg text-sm font-display font-bold transition-colors disabled:opacity-60">
                  {editSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}