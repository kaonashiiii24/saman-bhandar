import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, MapPin, Star, CheckCircle } from 'lucide-react'
import * as Icons from 'lucide-react'
import CTABanner from '../../components/common/CTABanner'
import api from '../../services/api'
import useCms from '../../hooks/useCms'

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
    <div ref={ref} className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export default function AboutUs() {
  const [heroVisible, setHeroVisible] = useState(false)
  const [publicStats, setPublicStats] = useState(null)
  const [scrollY, setScrollY] = useState(0)
  const { cms } = useCms()

  useEffect(() => { setTimeout(() => setHeroVisible(true), 80) }, [])

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    api.get('/admin/public-stats')
      .then(res => setPublicStats(res.data.data))
      .catch(() => {})
  }, [])

  const about = cms?.about || {}
  const values = cms?.aboutValues || []

  return (
    <div className="bg-[#FAFAF9] overflow-x-hidden">
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
          style={{ 
            backgroundImage: `url('${about.hero_image || '/images/about-hero.jpg'}')`,
            transform: `translateY(${scrollY * 0.15}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c1917]/90 via-[#1c1917]/70 to-[#1c1917]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/40 via-transparent to-transparent" />
        
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full relative z-10">
          <div className="max-w-2xl">
            <p className={`text-brick text-sm font-bold uppercase tracking-widest mb-6 transition-all duration-700 delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              {about.hero_badge || 'Our story'}
            </p>
            <h1 className={`font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] mb-6 transition-all duration-700 delay-300 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              {about.hero_title || 'Built in Nepal,'}<br />{about.hero_title_line2 || 'for Nepal.'}
            </h1>
            <p className={`text-white/60 text-lg sm:text-xl leading-relaxed max-w-xl mb-8 transition-all duration-700 delay-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              {about.hero_description || "SamanBhandar was born from a simple frustration. Nepal's growing community of home based sellers had no reliable, affordable way to store and deliver their products."}
            </p>
            <div className={`flex flex-wrap gap-3 transition-all duration-700 delay-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <Link
                to={about.hero_cta_link || '/contact'}
                className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-neutral-900 font-display font-bold px-6 py-3.5 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                {about.hero_cta_text || 'Get in Touch'} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-border">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { key: 'total_sellers', label: 'Active sellers', sub: 'across Nepal' },
              { key: 'total_hosts', label: 'Verified hosts', sub: 'manually checked' },
              { key: 'total_cities', label: 'Locations covered', sub: 'and growing' },
              { key: 'rating', label: 'Average rating', sub: 'from reviews', static_value: '4.8★' },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="text-center lg:text-left group cursor-default">
                  <p className="font-display font-black text-3xl text-[#1c1917] group-hover:text-brick transition-colors duration-300">
                    {stat.static_value || (
                      stat.key === 'total_sellers' ? `${publicStats?.total_sellers || 0}+` :
                      stat.key === 'total_hosts' ? `${publicStats?.total_hosts || 0}+` :
                      stat.key === 'total_cities' ? `${publicStats?.total_cities || 0}+` :
                      '4.8★'
                    )}
                  </p>
                  <p className="text-sm font-semibold text-[#3a3a3a] mt-0.5">{stat.label}</p>
                  <p className="text-xs text-[#71717a] mt-0.5">{stat.sub}</p>
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
              <p className="text-xs font-bold text-brick uppercase tracking-widest mb-4">{about.story_badge || 'Why we built this'}</p>
              <h2 className="font-display font-black text-4xl text-[#1c1917] tracking-tight mb-6 leading-tight">{about.story_title || 'The problem we saw and decided to fix.'}</h2>
              <div className="space-y-4 text-[#71717a] text-sm leading-relaxed">
                {(() => {
                  const paragraphs = about.story_paragraphs;
                  if (!paragraphs) return null;
                  const list = Array.isArray(paragraphs)
                    ? paragraphs
                    : typeof paragraphs === 'string'
                      ? paragraphs.split('\n').filter(line => line.trim() !== '')
                      : [];
                  return list.map((p, idx) => <p key={idx}>{p}</p>);
                })()}
              </div>
              <Link to="/register" className="inline-flex items-center gap-2 mt-8 bg-[#1c1917] hover:bg-brick text-white font-display font-bold px-6 py-3.5 rounded-md transition-all duration-300 text-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
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
                    <p className="text-xs text-[#71717a] mt-1">{about.side_card_text || 'logistics startup in Nepal — 2025'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-10 h-10 bg-brick-light rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <MapPin size={18} className="text-brick" />
                    </div>
                    <p className="font-display font-black text-xl text-[#1c1917] mb-1">{publicStats?.total_cities || 0}+</p>
                    <p className="text-xs text-[#71717a]">Locations covered</p>
                  </div>
                  <div className="bg-white border border-border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
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

      {values.length > 0 && (
        <section className="py-24 bg-white border-y border-border">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="mb-14">
              <p className="text-xs font-bold text-brick uppercase tracking-widest mb-3">Our values</p>
              <h2 className="font-display font-black text-4xl text-[#1c1917] tracking-tight leading-tight">What drives us every day.</h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {values.map((v, i) => {
                const ValueIcon = v.icon ? (Icons[v.icon] || Icons.Target) : Icons.Target
                return (
                  <Reveal key={i} delay={i * 80}>
                    <div className="border border-border rounded-xl p-6 h-full hover:border-[#3a3a3a] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                      <div className="w-9 h-9 bg-[#F4F4F5] rounded-md flex items-center justify-center mb-4 group-hover:bg-[#1c1917] transition-colors duration-300">
                        <ValueIcon size={17} className="text-[#3a3a3a]" />
                      </div>
                      <h4 className="font-display font-bold text-[#1c1917] mb-2">{v.label}</h4>
                      <p className="text-[#71717a] text-sm leading-relaxed">{v.description || v.desc}</p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </div>
  )
}