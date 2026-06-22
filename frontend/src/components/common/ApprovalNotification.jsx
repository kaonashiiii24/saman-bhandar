import { useState, useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function ApprovalNotification() {
  const { user } = useAuth()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!user || user.status !== 'active' || !user.approved_at) return
    const key = `approval_seen_${user.id}`
    if (localStorage.getItem(key)) return
    const approvedAt = new Date(user.approved_at)
    const diffHours = (new Date() - approvedAt) / (1000 * 60 * 60)
    if (diffHours < 72) { setShow(true); localStorage.setItem(key, 'true') }
  }, [user])

  if (!show) return null

  const roleLabel = user?.role === 'host' ? 'Host' : 'Courier'

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up max-w-sm w-full">
      <div className="bg-[#1c1917] border border-white/10 rounded-xl p-4 shadow-lg flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          <CheckCircle2 size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm text-white">Account Approved 🎉</p>
          <p className="text-white/50 text-xs mt-0.5 leading-relaxed">
            Your {roleLabel} account has been approved. You now have full access to the platform.
          </p>
        </div>
        <button onClick={() => setShow(false)} className="text-white/30 hover:text-white transition-colors shrink-0">
          <X size={15} />
        </button>
      </div>
    </div>
  )
}