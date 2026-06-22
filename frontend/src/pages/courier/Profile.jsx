import { useState, useEffect } from 'react'
import { User, Mail, Phone, Save, Lock, Eye, EyeOff, Truck } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { updateProfile, changePassword } from '../../services/authService'
import AlertMessage from '../../components/common/AlertMessage'

export default function CourierProfile() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [tab, setTab] = useState('profile')

  useEffect(() => {
    if (user) setForm({ full_name: user.full_name || '', email: user.email || '', phone: user.phone || '' })
  }, [user])

  const handleSave = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await updateProfile({ full_name: form.full_name, phone: form.phone })
      login(res.data.data.user, localStorage.getItem('token'))
      setSuccess('Profile updated successfully')
      setSaved(true)
      setTimeout(() => { setSaved(false); setSuccess('') }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally { setLoading(false) }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPwLoading(true)
    setError('')
    setSuccess('')
    
    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match')
      setPwLoading(false)
      return
    }
    
    if (passwords.new.length < 6) {
      setError('New password must be at least 6 characters')
      setPwLoading(false)
      return
    }
    
    try {
      await changePassword(passwords.current, passwords.new)
      setSuccess('Password updated successfully')
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password')
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-4 animate-fade-in-up">
        <div className="w-16 h-16 rounded-2xl bg-[#1c1917] flex items-center justify-center text-white font-display font-black text-2xl shrink-0">
          {form.full_name?.charAt(0)?.toUpperCase() || 'C'}
        </div>
        <div>
          <h2 className="font-display font-black text-xl text-[#1c1917]">{form.full_name || 'Courier'}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              <Truck size={9} /> Courier
            </span>
            <span className="text-xs text-[#71717a]">{form.email}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-1 bg-chalk-dark rounded-xl p-1 animate-fade-in-up">
        {[{ key: 'profile', label: 'Profile' }, { key: 'security', label: 'Security' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-lg text-sm font-display font-bold transition-all ${tab === t.key ? 'bg-white text-[#1c1917] shadow-xs' : 'text-[#71717a] hover:text-[#1c1917]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {error && <AlertMessage type="error" message={error} />}
      {success && <AlertMessage type="success" message={success} />}

      {tab === 'profile' && (
        <div className="bg-white border border-border rounded-xl p-6 animate-fade-in-up space-y-5">
          <div>
            <h3 className="font-display font-bold text-[#1c1917] mb-1">Personal Information</h3>
            <p className="text-xs text-[#71717a]">Update your name and contact details</p>
          </div>
          <div className="space-y-4">
            {[
              { key: 'full_name', label: 'Full Name', icon: User, placeholder: 'Your full name', disabled: false },
              { key: 'email', label: 'Email Address', icon: Mail, placeholder: 'your@email.com', disabled: true },
              { key: 'phone', label: 'Phone Number', icon: Phone, placeholder: '+977 98XXXXXXXX', disabled: false },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-bold text-[#1c1917] mb-1.5">{f.label}</label>
                <div className="relative">
                  <f.icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a]" />
                  <input type="text" placeholder={f.placeholder} value={form[f.key]} disabled={f.disabled}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg placeholder-[#71717a] outline-none transition-all
                      ${f.disabled ? 'bg-chalk border-border text-[#71717a] cursor-not-allowed' : 'bg-chalk border-border text-[#1c1917] focus:border-[#1c1917] focus:bg-white focus:ring-2 focus:ring-[#1c1917]/6'}`} />
                </div>
                {f.disabled && <p className="text-[10px] text-[#71717a] mt-1">Email cannot be changed</p>}
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-border flex items-center gap-3">
            <button onClick={handleSave} disabled={loading}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-display font-bold transition-all disabled:opacity-60 ${saved ? 'bg-emerald-500 text-white' : 'bg-[#1c1917] hover:bg-brick text-white'}`}>
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
            <p className="text-xs text-[#71717a]">Changes saved instantly</p>
          </div>
        </div>
      )}

      {tab === 'security' && (
        <form onSubmit={handlePasswordChange} className="bg-white border border-border rounded-xl p-6 animate-fade-in-up space-y-5">
          <div>
            <h3 className="font-display font-bold text-[#1c1917] mb-1">Change Password</h3>
            <p className="text-xs text-[#71717a]">Keep your courier account secure</p>
          </div>
          <div className="space-y-4">
            {[
              { key: 'current', label: 'Current Password', placeholder: 'Enter current password' },
              { key: 'new', label: 'New Password', placeholder: 'Min. 6 characters' },
              { key: 'confirm', label: 'Confirm New Password', placeholder: 'Repeat new password' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-bold text-[#1c1917] mb-1.5">{f.label}</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a]" />
                  <input 
                    type={showPw && f.key !== 'current' ? 'text' : 'password'} 
                    placeholder={f.placeholder} 
                    value={passwords[f.key]}
                    onChange={e => setPasswords({ ...passwords, [f.key]: e.target.value })}
                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-border rounded-lg bg-chalk text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:bg-white focus:ring-2 focus:ring-[#1c1917]/6 transition-all" 
                  />
                  {f.key === 'new' && (
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#1c1917] transition-colors">
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-border">
            <button type="submit" disabled={pwLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-display font-bold bg-[#1c1917] hover:bg-brick text-white transition-colors disabled:opacity-60">
              {pwLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Lock size={14} />}
              {pwLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-chalk-dark border border-border rounded-xl p-5 animate-fade-in-up">
        <h3 className="font-display font-bold text-[#1c1917] text-sm mb-3">Account Details</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Account Type', value: 'Courier' },
            { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—' },
            { label: 'Account Status', value: user?.status || 'Active' },
            { label: 'Verification', value: 'Verified' },
          ].map(d => (
            <div key={d.label}>
              <p className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider">{d.label}</p>
              <p className="text-sm font-semibold text-[#1c1917] mt-0.5 capitalize">{d.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}