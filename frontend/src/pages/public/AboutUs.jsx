import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Target, Heart, Zap, Users, Building2, MapPin, Star, CheckCircle } from 'lucide-react'
import CTABanner from '../../components/common/CTABanner'
import api from '../../services/api'

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

function Reveal({ children, className = '', delay = 0 }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

const values = [
  { icon: Target, label: 'Mission-driven', desc: 'We exist to make storage and logistics accessible for every Nepali seller, big or small.' },
  { icon: Heart, label: 'Community first', desc: 'Every feature we build starts with feedback from our sellers, hosts and couriers.' },
  { icon: Zap, label: 'Move fast', desc: 'We ship fast, learn fast and iterate on what actually matters to our users.' },
  { icon: Star, label: 'Quality always', desc: 'Every host is verified. Every feature is tested. We never compromise on trust.' },
]

export default function AboutUs() {
  const [heroVisible, setHeroVisible] = useState(false)
  const [publicStats, setPublicStats] = useState(null)

  useEffect(() => { setTimeout(() => setHeroVisible(true), 80) }, [])

  useEffect(() => {
    api.get('/admin/public-stats')
      .then(res => setPublicStats(res.data.data))
      .catch(() => {})
  }, [])

  return (
    <div className="bg-[#FAFAF9] overflow-x-hidden">

      <section className="bg-[#1c1917] py-24 border-b border-white/10">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-600 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-brick text-xs font-bold uppercase tracking-widest mb-4">Our story</p>
            <h1 className="font-display font-black text-5xl sm:text-6xl text-white tracking-tight leading-tight mb-6 max-w-2xl">
              Built in Nepal,<br />for Nepal.
            </h1>
            <p className="text-white/50 text-lg leading-relaxed max-w-xl">
             SamanBhandar was born from a simple frustration. Nepal's growing community of home based sellers had no reliable, affordable way to store and deliver their products.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-b border-border">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, value: `${publicStats?.total_sellers || 0}+`, label: 'Active sellers' },
              { icon: Building2, value: `${publicStats?.total_hosts || 0}+`, label: 'Verified hosts' },
              { icon: MapPin, value: `${publicStats?.total_cities || 0}+`, label: 'Locations covered' },
              { icon: Star, value: '4.8', label: 'Average rating' },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="text-center">
                  <p className="font-display font-black text-4xl text-[#1c1917] mb-1">{stat.value}</p>
                  <p className="text-[#71717a] text-sm">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#FAFAF9]">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <Reveal>
              <p className="text-xs font-bold text-brick uppercase tracking-widest mb-4">Why we built this</p>
              <h2 className="font-display font-black text-4xl text-[#1c1917] tracking-tight mb-6 leading-tight">The problem we saw and decided to fix.</h2>
              <div className="space-y-4 text-[#71717a] text-sm leading-relaxed">
                <p>In early 2025, our founders noticed that thousands of sellers running Instagram and Facebook shops in Nepal were storing products in their bedrooms, hallways and living rooms, which limited their ability to grow.</p>
                <p>At the same time, thousands of Nepalis had unused rooms, garages and godowns sitting empty. We saw an opportunity to connect these two groups and create real value for both sides.</p>
                <p>SamanBhandar launched in mid 2025 as Nepal's first peer to peer micro warehouse marketplace. Within months, hundreds of sellers were storing products with verified hosts across the Pokhara Valley.</p>
              </div>
              <Link to="/register" className="inline-flex items-center gap-2 mt-8 bg-[#1c1917] hover:bg-brick text-white font-display font-bold px-6 py-3.5 rounded-md transition-colors text-sm">
                Join us today <ArrowRight size={16} />
              </Link>
            </Reveal>

            <Reveal delay={150}>
              <div className="space-y-6">
                <div className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 group">
                  <div className="relative h-64 bg-gradient-to-br from-[#1c1917] via-[#2d2522] to-brick overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
                      backgroundSize: '24px 24px'
                    }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                          <Users size={32} className="text-white" />
                        </div>
                        <p className="text-white font-display font-black text-2xl mb-1">{publicStats?.total_sellers || 0}+</p>
                        <p className="text-white/60 text-sm">Sellers joined in 6 months</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 border-t border-border bg-chalk group-hover:bg-white transition-colors duration-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500" />
                      <p className="text-xs font-bold text-[#1c1917]">Fastest growing</p>
                    </div>
                    <p className="text-xs text-[#71717a] mt-1">logistics startup in Nepal — 2025</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-10 h-10 bg-brick-light rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <MapPin size={18} className="text-brick" />
                    </div>
                    <p className="font-display font-black text-xl text-[#1c1917] mb-1">{publicStats?.total_cities || 0}+</p>
                    <p className="text-xs text-[#71717a]">Locations covered</p>
                  </div>
                  <div className="bg-white border border-border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Star size={18} className="text-emerald-600" />
                    </div>
                    <p className="font-display font-black text-xl text-[#1c1917] mb-1">4.8/5</p>
                    <p className="text-xs text-[#71717a]">Average rating</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-y border-border">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-14">
            <p className="text-xs font-bold text-brick uppercase tracking-widest mb-3">Our values</p>
            <h2 className="font-display font-black text-4xl text-[#1c1917] tracking-tight leading-tight">What drives us every day.</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="border border-border rounded-xl p-6 h-full hover:border-[#3a3a3a] hover:shadow-xs transition-all duration-200">
                  <div className="w-9 h-9 bg-[#F4F4F5] rounded-md flex items-center justify-center mb-4">
                    <v.icon size={17} className="text-[#3a3a3a]" />
                  </div>
                  <h4 className="font-display font-bold text-[#1c1917] mb-2">{v.label}</h4>
                  <p className="text-[#71717a] text-sm leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CTABanner />

    </div>
  )
}