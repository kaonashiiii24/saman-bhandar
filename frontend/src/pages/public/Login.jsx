import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Package, ArrowRight } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const pending = new URLSearchParams(window.location.search).get('pending')

  useEffect(() => { setTimeout(() => setVisible(true), 60) }, [])
  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      login(data.data.user, data.data.token)
      navigate(`/${data.data.user.role}/dashboard`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-chalk-dark flex flex-col">

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className={`w-full max-w-md transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

          <Link to="/" className="flex items-center justify-center gap-2.5 mb-10">
            <div className="w-8 h-8 bg-[#1c1917] rounded-md flex items-center justify-center">
              <Package size={16} className="text-white" />
            </div>
            <span className="font-display font-black text-xl text-[#1c1917] tracking-tight">
              Saman<span className="text-brick">Bhandar</span>
            </span>
          </Link>

          <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
            <div className="text-center mb-7">
              <h1 className="font-display font-black text-2xl text-[#1c1917] tracking-tight mb-1">Sign in to your account</h1>
              <p className="text-[#71717a] text-sm">Enter your credentials to continue</p>
            </div>

            {pending && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3 text-sm mb-5">
                ⏳ Your account is pending admin approval. You'll be notified once approved.
              </div>
            )}

            {error && (
              <div className="bg-brick-light border border-brick/20 text-brick rounded-lg px-4 py-3 text-sm font-medium mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a]" />
                  <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/6 focus:bg-white transition-all" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#1c1917]">Password</label>
                  <Link to="/forgot-password" className="text-xs text-[#71717a] hover:text-brick transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a]" />
                  <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Enter your password" value={form.password} onChange={handleChange}
                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/6 focus:bg-white transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#1c1917] transition-colors">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-[#1c1917] hover:bg-brick text-white font-display font-bold rounded-lg py-3 text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <>Sign in <ArrowRight size={15} /></>}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-[#71717a]">New to SamanBhandar?</span>
              </div>
            </div>

            <Link to="/register"
              className="w-full flex items-center justify-center gap-2 border border-border bg-chalk hover:border-[#1c1917] text-[#1c1917] font-display font-bold py-3 rounded-lg text-sm transition-all">
              Create a free account
            </Link>
          </div>

          <p className="text-center text-xs text-[#71717a] mt-5">
            By signing in you agree to our{' '}
            <Link to="/terms" className="text-[#1c1917] hover:text-brick transition-colors">Terms</Link> and{' '}
            <Link to="/privacy" className="text-[#1c1917] hover:text-brick transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}