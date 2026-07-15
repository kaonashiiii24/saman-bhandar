import { useState, useEffect } from 'react'
import { getMedia, uploadMedia, deleteMedia } from '../../../services/cmsService'
import Loader from '../../../components/common/Loader'
import StickyToolbar from '../../../components/cms/StickyToolbar'
import ConfirmDeleteDialog from '../../../components/cms/ConfirmDeleteDialog'
import { useToast } from '../../../context/ToastContext'

export default function MediaManager() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const addToast = useToast()

  const fetch = async () => {
    try { const res = await getMedia(); setMedia(res.data.data) }
    catch { addToast('Failed to load media', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      await uploadMedia(formData)
      addToast('File uploaded', 'success')
      fetch()
    } catch { addToast('Upload failed', 'error') }
    finally { setUploading(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteMedia(deleteId)
      addToast('File deleted', 'success')
      fetch()
    } catch { addToast('Delete failed', 'error') }
    finally { setDeleteId(null) }
  }

  const handleReset = async () => {
    if (!window.confirm('Delete ALL uploaded files? This cannot be undone.')) return
    try {
      await Promise.all(media.map(m => deleteMedia(m.id)))
      addToast('Reset complete', 'success')
      fetch()
    } catch { addToast('Failed to reset', 'error') }
  }

  if (loading) return <Loader />

  return (
    <>
      <StickyToolbar title="Media Library" onSave={fetch} onPreview={() => window.open('/', '_blank')} onReset={media.length > 0 ? handleReset : undefined} />
      <div className="p-6 space-y-6">
        <div className="mb-6">
          <input type="file" onChange={handleUpload} disabled={uploading}
            className="text-sm file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#1c1917] file:text-white" />
          {uploading && <span className="ml-3 text-sm text-[#71717a]">Uploading...</span>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map(item => (
            <div key={item.id} className="bg-white border border-border rounded-lg overflow-hidden group">
              <img src={item.filepath} alt={item.filename} className="w-full h-32 object-cover" />
              <div className="p-2 flex justify-between items-center">
                <p className="text-xs truncate">{item.original_name}</p>
                <button onClick={() => setDeleteId(item.id)} className="text-red-500 hover:text-red-600 text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmDeleteDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
    </>
  )
}