import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, XCircle, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const bg = type === 'success' ? '#ecfdf5' : '#fef2f2'
  const text = type === 'success' ? '#065f46' : '#991b1b'
  const border = type === 'success' ? '#a7f3d0' : '#fecaca'

  return createPortal(
    <div style={{
      position: 'fixed', top: '1rem', right: '1rem', zIndex: 99999,
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.75rem 1.25rem', borderRadius: '0.75rem',
      backgroundColor: bg, color: text, border: `1px solid ${border}`,
      fontSize: '0.875rem', fontWeight: 500,
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    }}>
      {type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{ marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: text }}
      >
        <X size={14} />
      </button>
    </div>,
    document.body
  )
}