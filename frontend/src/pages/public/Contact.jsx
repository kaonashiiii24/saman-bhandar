import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ArrowRight } from 'lucide-react'
import CTABanner from '../../components/common/CTABanner'

function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect() }
    }, { threshold })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView]
}

function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
  const [ref, inView] = useInView()
  const directionClasses = {
    up: inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
    left: inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8',
    right: inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8',
    scale: inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
  }
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${directionClasses[direction]} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export default function Contact() {
  const [heroVisible, setHeroVisible] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const contactFormRef = useRef(null)

  useEffect(() => { setTimeout(() => setHeroVisible(true), 80) }, [])

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true); setForm({ name: '', email: '', subject: '', message: '' }) }, 1500)
  }

  const scrollToForm = () => {
    contactFormRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const info = [
    { icon: Mail, label: 'Email', value: 'hello@samanbhandar.com', sub: 'Reply within 24 hours' },
    { icon: Phone, label: 'Phone', value: '+977 01-XXXXXXX', sub: 'Mon–Fri, 9am–6pm' },
    { icon: MapPin, label: 'Office', value: 'Naybazar, Pokhara', sub: 'Ward 26, Nepal' },
    { icon: Clock, label: 'Hours', value: 'Mon – Fri', sub: '9:00 AM – 6:00 PM NPT' },
  ]

  return (
    <div className="bg-[#FAFAF9] overflow-x-hidden">

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
          style={{ 
            backgroundImage: "url('/images/contact-hero.jpg')",
            transform: `translateY(${scrollY * 0.15}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c1917]/90 via-[#1c1917]/70 to-[#1c1917]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/40 via-transparent to-transparent" />
        
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full relative z-10">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-2 border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-white/80 mb-6 transition-all duration-700 delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brick opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brick" />
              </span>
              Get in touch
            </div>
            <h1 className={`font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] mb-5 transition-all duration-700 delay-300 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              We'd love to<br />hear from you.
            </h1>
            <p className={`text-white/50 text-lg leading-relaxed mb-8 max-w-xl transition-all duration-700 delay-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Have a question, feedback or want to partner with us? We typically respond within one business day.
            </p>
            <div className={`flex flex-wrap gap-3 transition-all duration-700 delay-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <button
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-neutral-900 font-display font-bold px-6 py-3.5 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                Contact Now <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-border">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {info.map((item, i) => (
              <Reveal key={i} delay={i * 80} direction="up">
                <div className="flex items-start gap-3 group cursor-default">
                  <div className="w-9 h-9 bg-[#F4F4F5] rounded-md flex items-center justify-center shrink-0 group-hover:bg-[#1c1917] transition-colors duration-300">
                    <item.icon size={16} className="text-[#3a3a3a] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1c1917]">{item.label}</p>
                    <p className="text-sm text-[#1c1917] font-semibold mt-0.5">{item.value}</p>
                    <p className="text-xs text-[#71717a] mt-0.5">{item.sub}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section ref={contactFormRef} className="py-20 bg-[#FAFAF9]">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <Reveal direction="left">
              <div className="bg-white border border-border rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
                <h2 className="font-display font-black text-2xl text-[#1c1917] tracking-tight mb-1">Send a message</h2>
                <p className="text-[#71717a] text-sm mb-6">We'll get back to you within 24 hours.</p>
                {sent ? (
                  <div className="flex flex-col items-center py-12 text-center animate-fade-in">
                    <div className="w-14 h-14 bg-[#F4F4F5] rounded-xl flex items-center justify-center mb-4 animate-bounce-in">
                      <CheckCircle2 size={28} className="text-[#1c1917]" />
                    </div>
                    <h3 className="font-display font-black text-xl text-[#1c1917] mb-1">Message sent</h3>
                    <p className="text-[#71717a] text-sm">We'll get back to you within 24 hours.</p>
                    <button onClick={() => setSent(false)} className="mt-5 text-sm text-[#1c1917] font-semibold hover:text-brick transition-colors">Send another</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { key: 'name', label: 'Full Name', placeholder: 'Your name', type: 'text' },
                        { key: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' },
                      ].map((f) => (
                        <div key={f.key}>
                          <label className="block text-xs font-bold text-[#1c1917] mb-1.5">{f.label}</label>
                          <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                            className="w-full px-4 py-2.5 text-sm border border-border rounded-md bg-[#FAFAF9] text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/8 focus:bg-white transition-all" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Subject</label>
                      <input type="text" placeholder="What's this about?" value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm border border-border rounded-md bg-[#FAFAF9] text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/8 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1c1917] mb-1.5">Message</label>
                      <textarea rows={5} placeholder="Tell us how we can help..." value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm border border-border rounded-md bg-[#FAFAF9] text-[#1c1917] placeholder-[#71717a] outline-none focus:border-[#1c1917] focus:ring-2 focus:ring-[#1c1917]/8 focus:bg-white transition-all resize-none" />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full bg-[#1c1917] hover:bg-brick text-white font-display font-bold rounded-md py-3 text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-60">
                      {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={14} /> Send message</>}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>

            <Reveal direction="right" delay={100}>
              <div className="space-y-5">
                <div className="bg-[#1c1917] rounded-xl p-8 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="font-display font-black text-xl text-white mb-2">Find us in Pokhara</h3>
                  <p className="text-white/50 text-sm mb-6 leading-relaxed">Our office is in Nayabazae, Pokhara. Drop by during working hours — we'd love to meet you.</p>
                  <div className="space-y-3">
                    {[
                      { icon: MapPin, text: 'Newroad , Pokhara' },
                      { icon: Phone, text: '+977 01-XXXXXXX' },
                      { icon: Mail, text: 'hello@samanbhandar.com' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-white/50 group cursor-default">
                        <div className="w-7 h-7 bg-white/8 rounded-md flex items-center justify-center shrink-0 group-hover:bg-brick/20 transition-colors duration-300">
                          <item.icon size={14} className="text-white/30 group-hover:text-white transition-colors duration-300" />
                        </div>
                        {item.text}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-6">
                    <a href="#" className="w-8 h-8 bg-white/8 rounded-md flex items-center justify-center text-white/50 hover:bg-white/15 hover:text-white hover:-translate-y-0.5 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                    <a href="#" className="w-8 h-8 bg-white/8 rounded-md flex items-center justify-center text-white/50 hover:bg-white/15 hover:text-white hover:-translate-y-0.5 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    </a>
                  </div>
                </div>

                <div className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                  <h3 className="font-display font-bold text-[#1c1917] mb-4">Quick answers</h3>
                  <div className="space-y-4">
                    {[
                      { q: 'How quickly do you respond?', a: 'We aim to respond within 24 hours on working days.' },
                      { q: 'Can I visit your office?', a: 'Yes — Mon to Fri, 9am to 6pm. No appointment needed.' },
                      { q: 'Do you offer partnerships?', a: 'Yes. Email partnerships@samanbhandar.com to get started.' },
                    ].map((faq, i) => (
                      <div key={i} className="border-b border-border pb-4 last:border-0 last:pb-0">
                        <p className="text-sm font-bold text-[#1c1917] mb-1">{faq.q}</p>
                        <p className="text-xs text-[#71717a] leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <CTABanner />
    </div>
  )
}