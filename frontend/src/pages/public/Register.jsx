import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { User, Mail, Lock, Phone, Eye, EyeOff, Package, ShoppingBag, Home, Truck, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const roles = [
  { value: 'seller', label: 'Seller', icon: ShoppingBag, desc: 'Store & manage inventory', color: 'bg-brick-light text-brick' },
  { value: 'host', label: 'Host', icon: Home, desc: 'Rent out your space', color: 'bg-amber-50 text-amber-700' },
  { value: 'courier', label: 'Courier', icon: Truck, desc: 'Deliver & earn', color: 'bg-emerald-50 text-emerald-700' },
]

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: '',
    role: searchParams.get('role') || 'seller',
  })

  useEffect(() => { setTimeout(() => setVisible(true), 60) }, [])
  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError('') }
  const handleRole = (role) => { setForm({ ...form, role }); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.full_name || !form.email || !form.phone || !form.password) { setError('Please fill in all fields.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      if (data.data.pending) { navigate('/login?pending=true'); return }
      login(data.data.user, data.data.token)
      navigate(`/${data.data.user.role}/dashboard`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const selectedRole = roles.find(r => r.value === form.role)

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
            <div className="text-center mb-6">
              <h1 className="font-display font-black text-2xl text-[#1c1917] tracking-tight mb-1">Create your account</h1>
              <p className="text-[#71717a] text-sm">Join thousands of users across Nepal</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {roles.map((r) => (
                <button key={r.value} type="button" onClick={() => handleRole(r.value)}
                  className={`flex flex-col items-center gap-2 py-3.5 px-2 rounded-xl border-2 transition-all duration-150 ${
                    form.role === r.value
                      ? 'border-[#1c1917] bg-chalk'
                      : 'border-border bg-white hover:border-[#3a3a3a]/30'
                  }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${form.role === r.value ? r.color : 'bg-[#F4F4F5] text-[#71717a]'}`}>
                    <r.icon size={15} />
                  </div>
                  <span className="font-display font-bold text-xs text-[#1c1917]">{r.label}</span>
                  <span className="text-[10px] text-[#71717a] leading-tight text-center hidden sm:block">{r.desc}</span>
                </button>
              ))}
            </div>

            {form.role !== 'seller' && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3 text-xs mb-5 leading-relaxed">
                ⏳ <strong>{selectedRole?.label}</strong> accounts require admin approval before you can log in.
              </div>
            )}

            {error && (
              <div className="bg-brick-light border border-brick/20 text-brick rounded-lg px-4 py-3 text-sm font-medium mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {[
                { name: 'full_name', label: 'Full Name', type: 'text', placeholder: 'Your full name', icon: User },
                { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', icon: Mail },
                { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '98XXXXXXXX', icon: Phone },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-xs font-bold text-[#1c1917] mb-1.5">{f.label}</label>
                  <div className="relative">
                    <f.icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a]" />
                    <input type={f.type} name={f.name} placeholder={f.placeholder} value={form[f.name]} onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/6 focus:bg-white transition-all" />
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a]" />
                  <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange}
                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/6 focus:bg-white transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#1c1917] transition-colors">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-[#1c1917] hover:bg-brick text-white font-display font-bold rounded-lg py-3 text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-1">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <>Create {selectedRole?.label} account <ArrowRight size={15} /></>}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-[#71717a]">Already have an account?</span>
              </div>
            </div>

            <Link to="/login"
              className="w-full flex items-center justify-center gap-2 border border-border bg-chalk hover:border-[#1c1917] text-[#1c1917] font-display font-bold py-3 rounded-lg text-sm transition-all">
              Sign in instead
            </Link>
          </div>

          <p className="text-center text-xs text-[#71717a] mt-5">
            By registering you agree to our{' '}
            <Link to="/terms" className="text-[#1c1917] hover:text-brick transition-colors">Terms</Link> and{' '}
            <Link to="/privacy" className="text-[#1c1917] hover:text-brick transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}