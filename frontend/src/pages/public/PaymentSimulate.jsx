import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, Loader, ShieldCheck, XCircle } from 'lucide-react'
import api from '../../services/api'

export default function PaymentSimulate() {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState('processing')
  
  const bookingId = searchParams.get('booking')
  const txn = searchParams.get('txn')
  const method = searchParams.get('method')
  const amount = searchParams.get('amount')

  useEffect(() => {
    if (bookingId && txn) {
      setTimeout(() => setStep('verifying'), 1500)
      setTimeout(async () => {
        try {
          await api.post('/payments/verify-simulated', { bookingId, txn, method })
          setStep('success')
        } catch {
          setStep('failed')
        }
      }, 3000)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-chalk px-4">
      <div className="bg-white border border-border rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
        {step === 'processing' && (
          <>
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} className="text-purple-600" />
            </div>
            <h2 className="font-display font-black text-xl text-[#1c1917] mb-1">{method === 'esewa' ? 'eSewa' : 'Khalti'} Payment</h2>
            <p className="text-sm text-[#71717a] mb-4">Amount: Rs {Number(amount).toLocaleString()}</p>
            <div className="bg-chalk rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Loader size={20} className="text-[#1c1917] animate-spin" />
                <span className="text-sm font-semibold text-[#1c1917]">Processing payment...</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-[#1c1917] rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
            <p className="text-[11px] text-[#71717a]">Sandbox Mode — No real money is charged</p>
          </>
        )}
        {step === 'verifying' && (
          <>
            <Loader size={48} className="text-[#1c1917] mx-auto mb-4 animate-spin" />
            <h2 className="font-display font-black text-xl text-[#1c1917] mb-2">Verifying Payment</h2>
            <p className="text-sm text-[#71717a]">Confirming transaction with {method === 'esewa' ? 'eSewa' : 'Khalti'}...</p>
          </>
        )}
        {step === 'success' && (
          <>
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-emerald-600" />
            </div>
            <h2 className="font-display font-black text-xl text-[#1c1917] mb-2">Payment Successful</h2>
            <p className="text-sm text-[#71717a] mb-2">Transaction: {txn}</p>
            <p className="text-sm text-[#71717a] mb-6">Your booking has been activated.</p>
            <Link to="/seller/bookings" className="inline-block w-full bg-[#1c1917] hover:bg-brick text-white font-display font-bold py-3 rounded-xl transition-colors text-sm">
              View My Bookings
            </Link>
          </>
        )}
        {step === 'failed' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <XCircle size={32} className="text-red-600" />
            </div>
            <h2 className="font-display font-black text-xl text-[#1c1917] mb-2">Payment Failed</h2>
            <p className="text-sm text-[#71717a] mb-6">Please try again.</p>
            <Link to="/seller/bookings" className="inline-block w-full bg-[#1c1917] hover:bg-brick text-white font-display font-bold py-3 rounded-xl transition-colors text-sm">
              Back to Bookings
            </Link>
          </>
        )}
      </div>
    </div>
  )
}