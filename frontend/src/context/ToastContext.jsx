import { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, XCircle, X } from 'lucide-react'

const ToastContext = createContext(null)

function ToastItem({ id, message, type, onClose }) {
  const bg = type === 'success' ? '#ecfdf5' : '#fef2f2'
  const text = type === 'success' ? '#065f46' : '#991b1b'
  const border = type === 'success' ? '#a7f3d0' : '#fecaca'

  return createPortal(
    <div style={{
      position: 'fixed', top: `${20 + id * 60}px`, right: '20px', zIndex: 99999,
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

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          id={index}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}