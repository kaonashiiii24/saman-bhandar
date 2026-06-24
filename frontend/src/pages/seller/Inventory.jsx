import { useState, useEffect } from 'react'
import { Package, Plus, Search, Trash2, AlertTriangle, X, Truck, ArrowDown, ArrowUp } from 'lucide-react'
import { getInventory, createItem, deleteItem, createDeliveryRequest } from '../../services/inventoryService'
import { getMyBookings } from '../../services/bookingService'
import Loader from '../../components/common/Loader'
import AlertMessage from '../../components/common/AlertMessage'

export default function Inventory() {
  const [items, setItems] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showDeliveryForm, setShowDeliveryForm] = useState(false)
  const [deliveryType, setDeliveryType] = useState('pickup')
  const [form, setForm] = useState({ name: '', category: '', quantity: '', booking_id: '' })
  const [deliveryForm, setDeliveryForm] = useState({
    booking_id: '',
    pickup_location: '',
    delivery_location: '',
    instructions: '',
    delivery_fee: '',
    selectedItems: []
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [invRes, bookRes] = await Promise.all([getInventory(), getMyBookings()])
      setItems(invRes.data.data.items || [])
      setBookings(bookRes.data.data.bookings || [])
    } catch { setError('Failed to load data') }
    finally { setLoading(false) }
  }

  const handleAdd = async () => {
    if (!form.name) return
    try {
      await createItem({ 
        name: form.name,
        category: form.category,
        quantity: parseInt(form.quantity) || 0,
        booking_id: form.booking_id || null,
        location: form.booking_id ? bookings.find(b => b.id == form.booking_id)?.listing_title : form.location
      })
      setSuccess('Item added')
      setForm({ name: '', category: '', quantity: '', booking_id: '' })
      setShowForm(false)
      fetchData()
      setTimeout(() => setSuccess(''), 3000)
    } catch { setError('Failed to add item') }
  }

  const handleDelete = async (id) => {
    try {
      await deleteItem(id)
      setItems(items.filter(i => i.id !== id))
    } catch { setError('Failed to delete item') }
  }

  const handleDeliverySubmit = async () => {
    if (!deliveryForm.booking_id || !deliveryForm.pickup_location || !deliveryForm.delivery_location) {
      setError('Please fill all required fields')
      return
    }
    if (deliveryForm.selectedItems.length === 0) {
      setError('Select at least one item')
      return
    }
    
    setSubmitting(true)
    try {
      const itemsPayload = deliveryForm.selectedItems.map(i => ({
        id: i.id,
        name: i.name,
        category: i.category || '',
        quantity: i.quantity
      }))

      await createDeliveryRequest({
        booking_id: deliveryForm.booking_id,
        pickup_location: deliveryForm.pickup_location,
        delivery_location: deliveryForm.delivery_location,
        items: itemsPayload,
        instructions: deliveryForm.instructions,
        type: deliveryType,
        delivery_fee: deliveryForm.delivery_fee || 0
      })
      setSuccess(`Delivery request created! Couriers can now accept it.`)
      setDeliveryForm({ booking_id: '', pickup_location: '', delivery_location: '', instructions: '', delivery_fee: '', selectedItems: [] })
      setShowDeliveryForm(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create delivery request')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleItemSelection = (item) => {
    const exists = deliveryForm.selectedItems.find(i => i.id === item.id)
    if (exists) {
      setDeliveryForm(prev => ({
        ...prev,
        selectedItems: prev.selectedItems.filter(i => i.id !== item.id)
      }))
    } else {
      setDeliveryForm(prev => ({
        ...prev,
        selectedItems: [...prev.selectedItems, { id: item.id, name: item.name, category: item.category || '', quantity: 1 }]
      }))
    }
  }

  const updateSelectedQuantity = (itemId, qty) => {
    setDeliveryForm(prev => ({
      ...prev,
      selectedItems: prev.selectedItems.map(i => i.id === itemId ? { ...i, quantity: parseInt(qty) || 0 } : i)
    }))
  }

  const getBookingTitle = (bookingId) => {
    const booking = bookings.find(b => b.id == bookingId)
    return booking ? booking.listing_title : '—'
  }

  const getBookingItems = (bookingId) => {
    return items.filter(i => i.booking_id == bookingId)
  }

  const filtered = items.filter(i =>
    i.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.category?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Loader />

  return (
    <div className="space-y-4 sm:space-y-5">
      {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} />}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
          <input type="text" placeholder="Search inventory..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg bg-white text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/6 transition-all" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowDeliveryForm(!showDeliveryForm); setShowForm(false) }}
            className="inline-flex items-center justify-center gap-2 bg-brick hover:bg-brick-dark text-white font-display font-bold px-4 py-2.5 rounded-lg transition-colors text-sm shrink-0">
            {showDeliveryForm ? <><X size={15} /> Cancel</> : <><Truck size={15} /> Request Delivery</>}
          </button>
          <button onClick={() => { setShowForm(!showForm); setShowDeliveryForm(false) }}
            className="inline-flex items-center justify-center gap-2 bg-[#1c1917] hover:bg-brick text-white font-display font-bold px-4 py-2.5 rounded-lg transition-colors text-sm shrink-0">
            {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Item</>}
          </button>
        </div>
      </div>

      {showDeliveryForm && (
        <div className="bg-white border border-border rounded-xl p-4 sm:p-5 animate-fade-in-up">
          <h3 className="font-display font-bold text-[#1c1917] mb-4 text-sm">New Delivery Request</h3>

          <div className="flex gap-2 mb-4">
            <button type="button" onClick={() => { setDeliveryType('pickup'); setDeliveryForm({ ...deliveryForm, selectedItems: [] }) }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                deliveryType === 'pickup' ? 'bg-[#1c1917] text-white shadow-md' : 'bg-chalk border border-border text-[#71717a] hover:border-[#1c1917]'
              }`}>
              <ArrowUp size={15} /> Pickup from Storage
            </button>
            <button type="button" onClick={() => { setDeliveryType('dropoff'); setDeliveryForm({ ...deliveryForm, selectedItems: [] }) }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                deliveryType === 'dropoff' ? 'bg-[#1c1917] text-white shadow-md' : 'bg-chalk border border-border text-[#71717a] hover:border-[#1c1917]'
              }`}>
              <ArrowDown size={15} /> Dropoff to Storage
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Storage Space</label>
              <select value={deliveryForm.booking_id} onChange={e => setDeliveryForm({ ...deliveryForm, booking_id: e.target.value, selectedItems: [] })}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] outline-none focus:border-[#1c1917] focus:bg-white transition-all">
                <option value="">Select a space</option>
                {bookings.filter(b => b.status === 'active' || b.status === 'approved').map(b => (
                  <option key={b.id} value={b.id}>{b.listing_title} — {b.listing_location}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1c1917] mb-1.5">
                {deliveryType === 'pickup' ? 'Pickup Location' : 'Supplier/Your Address'}
              </label>
              <input type="text" placeholder={deliveryType === 'pickup' ? "e.g. Lakeside, Pokhara" : "e.g. Supplier warehouse, Newroad"}
                value={deliveryForm.pickup_location}
                onChange={e => setDeliveryForm({ ...deliveryForm, pickup_location: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:bg-white transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1c1917] mb-1.5">
                {deliveryType === 'pickup' ? 'Delivery Location' : 'Storage Address'}
              </label>
              <div className="flex items-center gap-2">
                <input type="text" placeholder={deliveryType === 'pickup' ? "e.g. New Baneshwor" : "Storage address (auto-filled)"}
                  value={deliveryForm.delivery_location}
                  onChange={e => setDeliveryForm({ ...deliveryForm, delivery_location: e.target.value })}
                  className="flex-1 px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:bg-white transition-all" />
                {deliveryType === 'dropoff' && deliveryForm.booking_id && (
                  <button type="button"
                    onClick={() => {
                      const booking = bookings.find(b => b.id == deliveryForm.booking_id);
                      if (booking) setDeliveryForm({ ...deliveryForm, delivery_location: booking.listing_location || '' });
                    }}
                    className="text-xs text-brick font-semibold hover:underline whitespace-nowrap">Use storage</button>
                )}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Instructions (Optional)</label>
              <textarea rows={2} placeholder="Any special instructions..." value={deliveryForm.instructions}
                onChange={e => setDeliveryForm({ ...deliveryForm, instructions: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:bg-white transition-all resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Delivery Fee (Rs)</label>
              <input type="number" min="0" placeholder="e.g. 500"
                value={deliveryForm.delivery_fee || ''}
                onChange={e => setDeliveryForm({ ...deliveryForm, delivery_fee: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:bg-white transition-all" />
            </div>
            {deliveryForm.booking_id && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#1c1917] mb-1.5">
                  {deliveryType === 'pickup' ? 'Select Items to Deliver' : 'Add Items to Inventory'}
                </label>
                {deliveryType === 'pickup' ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {getBookingItems(deliveryForm.booking_id).length === 0 ? (
                      <p className="text-xs text-[#71717a]">No items in this space. Add items first.</p>
                    ) : (
                      getBookingItems(deliveryForm.booking_id).map(item => {
                        const selected = deliveryForm.selectedItems.find(i => i.id === item.id)
                        return (
                          <div key={item.id} className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                            selected ? 'border-[#1c1917] bg-chalk' : 'border-border hover:border-[#1c1917]'
                          }`} onClick={() => toggleItemSelection(item)}>
                            <input type="checkbox" checked={!!selected} readOnly className="w-4 h-4 accent-[#1c1917]" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-[#1c1917]">{item.name}</p>
                              <p className="text-xs text-[#71717a]">Available: {item.quantity}</p>
                            </div>
                            {selected && (
                              <input type="number" min="1" max={item.quantity} value={selected.quantity}
                                onChange={e => { e.stopPropagation(); updateSelectedQuantity(item.id, e.target.value) }}
                                onClick={e => e.stopPropagation()} className="w-16 px-2 py-1 text-xs border border-border rounded text-center" />
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {deliveryForm.selectedItems.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {deliveryForm.selectedItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2.5 bg-chalk rounded-lg border border-border">
                            <div className="flex-1 flex gap-2">
                              <input type="text" placeholder="Item name" value={item.name}
                                onChange={e => {
                                  const updated = [...deliveryForm.selectedItems];
                                  updated[idx].name = e.target.value;
                                  setDeliveryForm(prev => ({ ...prev, selectedItems: updated }));
                                }} className="flex-1 px-2 py-1.5 text-xs border border-border rounded bg-white" />
                              <input type="text" placeholder="Category" value={item.category}
                                onChange={e => {
                                  const updated = [...deliveryForm.selectedItems];
                                  updated[idx].category = e.target.value;
                                  setDeliveryForm(prev => ({ ...prev, selectedItems: updated }));
                                }} className="w-24 px-2 py-1.5 text-xs border border-border rounded bg-white" />
                              <input type="number" min="1" placeholder="Qty" value={item.quantity}
                                onChange={e => {
                                  const updated = [...deliveryForm.selectedItems];
                                  updated[idx].quantity = parseInt(e.target.value) || 0;
                                  setDeliveryForm(prev => ({ ...prev, selectedItems: updated }));
                                }} className="w-16 px-2 py-1.5 text-xs border border-border rounded bg-white text-center" />
                            </div>
                            <button onClick={() => {
                              const updated = deliveryForm.selectedItems.filter((_, i) => i !== idx);
                              setDeliveryForm(prev => ({ ...prev, selectedItems: updated }));
                            }} className="p-1 text-[#71717a] hover:text-brick"><X size={14} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button type="button" onClick={() => {
                      setDeliveryForm(prev => ({
                        ...prev,
                        selectedItems: [...prev.selectedItems, { id: Date.now(), name: '', category: '', quantity: 1 }]
                      }));
                    }} className="w-full py-2 border-2 border-dashed border-border rounded-lg text-xs text-[#71717a] hover:border-[#1c1917] hover:text-[#1c1917] transition-colors font-semibold">
                      + Add Item
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <button onClick={handleDeliverySubmit} disabled={submitting}
            className="bg-brick hover:bg-brick-dark text-white font-display font-bold px-5 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60">
            {submitting ? 'Creating...' : 'Create Delivery Request'}
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-border rounded-xl p-4 sm:p-5 animate-fade-in-up">
          <h3 className="font-display font-bold text-[#1c1917] mb-4 text-sm">New Inventory Item</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              { key: 'name', label: 'Item Name', placeholder: 'e.g. Winter Jackets' },
              { key: 'category', label: 'Category', placeholder: 'e.g. Clothing' },
              { key: 'quantity', label: 'Quantity', placeholder: 'e.g. 50', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-bold text-[#1c1917] mb-1.5">{f.label}</label>
                <input type={f.type || 'text'} placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:bg-white transition-all" />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Storage Space (Optional)</label>
              {bookings.filter(b => b.status === 'active' || b.status === 'approved').length > 0 ? (
                <select value={form.booking_id} onChange={e => setForm({ ...form, booking_id: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] outline-none focus:border-[#1c1917] focus:bg-white transition-all">
                  <option value="">No space selected</option>
                  {bookings.filter(b => b.status === 'active' || b.status === 'approved').map(b => (
                    <option key={b.id} value={b.id}>{b.listing_title} — {b.listing_location}</option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#71717a]">
                  No approved bookings yet. <a href="/listings" className="text-brick hover:underline">Find a space</a>
                </div>
              )}
            </div>
          </div>
          <button onClick={handleAdd} className="bg-[#1c1917] hover:bg-brick text-white font-display font-bold px-5 py-2.5 rounded-lg text-sm transition-colors">
            Add Item
          </button>
        </div>
      )}

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-display font-bold text-[#1c1917] text-sm">All Items ({filtered.length})</h3>
        </div>
        {filtered.length === 0 ? (
          <div className="p-10 sm:p-14 text-center">
            <Package size={32} className="text-border mx-auto mb-3" />
            <p className="font-display font-bold text-[#1c1917] text-sm mb-1">No items yet</p>
            <p className="text-[#71717a] text-xs">Add your first inventory item</p>
          </div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-chalk border-b border-border">
                    {['Item', 'Category', 'Qty', 'Stored In', 'Status', ''].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold text-[#71717a] uppercase tracking-wider px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((item, i) => (
                    <tr key={item.id} className="hover:bg-chalk transition-colors animate-fade-in-up"
                      style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-chalk flex items-center justify-center">
                            <Package size={13} className="text-[#1c1917]" />
                          </div>
                          <span className="text-sm font-semibold text-[#1c1917]">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-[#71717a]">{item.category || '—'}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {item.quantity <= 5 && <AlertTriangle size={12} className="text-amber-500" />}
                          <span className="text-sm font-bold text-[#1c1917]">{item.quantity}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-[#71717a]">
                        {item.booking_id ? getBookingTitle(item.booking_id) : (item.location || '—')}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.quantity <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {item.quantity <= 5 ? 'Low' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-[#71717a] hover:text-brick hover:bg-brick-light rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="sm:hidden divide-y divide-border">
              {filtered.map((item, i) => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-chalk transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both' }}>
                  <div className="w-8 h-8 rounded-lg bg-chalk flex items-center justify-center shrink-0">
                    <Package size={14} className="text-[#1c1917]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1c1917] truncate">{item.name}</p>
                    <p className="text-xs text-[#71717a] mt-0.5">
                      {item.category || '—'} · Qty: {item.quantity} · {item.booking_id ? getBookingTitle(item.booking_id) : (item.location || '—')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.quantity <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {item.quantity <= 5 ? 'Low' : 'OK'}
                    </span>
                    <button onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-[#71717a] hover:text-brick transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}