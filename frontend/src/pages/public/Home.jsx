import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import CTABanner from '../../components/common/CTABanner';
import api from '../../services/api';
import useCms from '../../hooks/useCms';

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
  const [ref, inView] = useInView();
  
  const directionClasses = {
    up: inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
    left: inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8',
    right: inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8',
    scale: inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
  };
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${directionClasses[direction]} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      aria-hidden={!inView}
    >
      {children}
    </div>
  );
}

const fallbackSteps = [
  { step_number: '01', title: 'Find a space', description: 'Search by your area. See pricing and host details before you book.', icon: 'Search', display_order: 1 },
  { step_number: '02', title: 'Move your stock in', description: 'Book the space, coordinate with the host, move in on your schedule.', icon: 'Package', display_order: 2 },
  { step_number: '03', title: 'Manage from your phone', description: 'Track stock, chat with your host and request pickups. All in one place.', icon: 'Smartphone', display_order: 3 },
  { step_number: '04', title: 'Scale without stress', description: 'When orders grow, book more space. No lease, no deposit, no commitment.', icon: 'TrendingUp', display_order: 4 },
];

const fallbackFeatures = [
  { title: 'Storage near you', description: 'Verified godowns and rooms across Kathmandu Valley. Filter by price, size and distance.', icon: 'MapPin', image_url: '', display_order: 1 },
  { title: 'Track every item', description: 'Know exactly what you have stored, where it is, and how much is left — updated live.', icon: 'Box', image_url: '', display_order: 2 },
  { title: 'Courier on demand', description: 'Request a pickup from your dashboard. Couriers come to storage, you stay home.', icon: 'Truck', image_url: '', display_order: 3 },
  { title: 'Hosts we verify', description: 'Every storage host is checked by our team before going live. Your goods are safe.', icon: 'Shield', image_url: '', display_order: 4 },
  { title: 'Talk directly', description: 'Message your host or courier without leaving the app. No WhatsApp needed.', icon: 'MessageSquare', image_url: '', display_order: 5 },
  { title: 'Pay your way', description: 'eSewa, Khalti or cash. Get a full invoice for every payment automatically.', icon: 'Package', image_url: '', display_order: 6 },
];

const fallbackTestimonials = [
  { customer_name: 'Sachin', position: 'Instagram seller, Pokhara', rating: 5, review: 'Before this I kept stock in my bedroom. Now I have a proper space 5 minutes away and I can actually take bulk orders.', profile_image: '', display_order: 1 },
  { customer_name: 'Nabin', position: 'Storage host, Pokhara', rating: 5, review: 'My spare room was doing nothing. Now it earns me Rs 8,000 a month and I barely have to do anything.', profile_image: '', display_order: 2 },
  { customer_name: 'Lijas', position: 'Facebook seller, Pokhara', rating: 5, review: 'The inventory tracking alone is worth it. I always know exactly what I have in storage and when pickups are due.', profile_image: '', display_order: 3 },
];

const fallbackFaqs = [
  { question: 'How does SamanBhandar work?', answer: 'Sellers find nearby storage hosts, book a space, store their inventory, and schedule courier pickups with all from one dashboard.', display_order: 1 },
  { question: 'How do I become a storage host?', answer: 'Register as a host, list your unused room or garage, set your price, and start accepting bookings after our team verifies you.', display_order: 2 },
  { question: 'Is my inventory safe?', answer: 'All hosts are verified by our team before going live. You can also read reviews from other sellers before booking.', display_order: 3 },
  { question: 'What payment methods are supported?', answer: 'We support eSewa and Khalti for all payments. Cash is also accepted for in-person arrangements.', display_order: 4 },
  { question: 'Can I cancel a booking?', answer: 'Yes, you can cancel up to 24 hours before your scheduled move-in date for a full refund.', display_order: 5 },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [publicStats, setPublicStats] = useState(null);
  const { cms } = useCms();

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    api.get('/admin/public-stats')
      .then(res => setPublicStats(res.data.data))
      .catch(() => {})
  }, []);

  const steps = cms?.steps?.length ? cms.steps : fallbackSteps;
  const features = cms?.features?.length ? cms.features : fallbackFeatures;
  const testimonials = cms?.testimonials?.length ? cms.testimonials : fallbackTestimonials;
  const faqs = cms?.faqs?.length ? cms.faqs : fallbackFaqs;

  return (
    <main className="bg-[#FAFAF9] overflow-x-hidden">
      
      <section className="relative min-h-screen flex items-center border-b border-border overflow-hidden">
        {cms?.hero?.hero_bg ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${cms.hero.hero_bg})` }} aria-hidden="true" />
        ) : (
          <div className="absolute inset-0 bg-[#FAFAF9]" aria-hidden="true" />
        )}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brick-light rounded-full -translate-y-1/2 translate-x-1/3 opacity-60" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-chalk-dark rounded-full translate-y-1/2 -translate-x-1/3" aria-hidden="true" />

        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <div className={`transition-all duration-700 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                <div className="inline-flex items-center gap-2 border border-border bg-white px-3 py-1.5 rounded-full text-xs font-semibold text-[#1c1917] mb-8 shadow-xs hover:shadow-md transition-shadow">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brick opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brick" />
                  </span>
                  {cms?.hero?.badge || "Nepal's first micro-warehouse marketplace"}
                </div>
              </div>

              <div className={`transition-all duration-700 ease-out delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-[#1c1917] leading-[1.0] tracking-tight mb-6">
                  {cms?.hero?.title || 'Store smart.'}<br />
                  <span className="relative inline-block">
                    <span className="text-brick">{cms?.hero?.title_highlight || 'Sell more.'}</span>
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M3 9C50 3 100 1 150 5C200 9 250 7 297 3" stroke="#C0392B" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
                    </svg>
                  </span>
                </h1>
              </div>

              <div className={`transition-all duration-700 ease-out delay-200 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="text-[#71717a] text-xl leading-relaxed mb-8 max-w-lg">
                  {cms?.hero?.description || "Stop stuffing your room with inventory. Find a safe storage space nearby, keep track of what's where, and handle pickups all from your phone."}
                </p>
              </div>

              <div className={`transition-all duration-700 ease-out delay-300 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex flex-wrap gap-3 mb-10">
                  <Link to={cms?.hero?.cta_primary_link || '/listings'} className="group inline-flex items-center gap-2 bg-[#1c1917] text-white font-display font-bold px-7 py-4 rounded-xl hover:bg-brick focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1c1917] transition-all text-sm shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                    {cms?.hero?.cta_primary_text || 'Find storage near you'} <Icons.ArrowRight size={16} aria-hidden="true" className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to={cms?.hero?.cta_secondary_link || '/register?role=host'} className="group inline-flex items-center gap-2 border border-border bg-white text-[#1c1917] font-display font-bold px-7 py-4 rounded-xl hover:border-[#1c1917] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1c1917] transition-all text-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">
                    {cms?.hero?.cta_secondary_text || 'List your space'}
                  </Link>
                </div>
              </div>

              <div className={`transition-all duration-700 ease-out delay-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center gap-8 pt-6 border-t border-border">
                  <div className="flex items-center gap-2.5 group cursor-default">
                    <div className="w-8 h-8 bg-white border border-border rounded-lg flex items-center justify-center group-hover:bg-[#1c1917] group-hover:border-[#1c1917] transition-all duration-300">
                      <Icons.Users size={14} className="text-[#1c1917] group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-display font-black text-lg text-[#1c1917] leading-none">{publicStats?.total_sellers || 0}+</p>
                      <p className="text-[10px] text-[#71717a] mt-0.5">{cms?.hero?.stat1_label || 'Active sellers'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 group cursor-default">
                    <div className="w-8 h-8 bg-white border border-border rounded-lg flex items-center justify-center group-hover:bg-[#1c1917] group-hover:border-[#1c1917] transition-all duration-300">
                      <Icons.Building2 size={14} className="text-[#1c1917] group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-display font-black text-lg text-[#1c1917] leading-none">{publicStats?.total_hosts || 0}+</p>
                      <p className="text-[10px] text-[#71717a] mt-0.5">{cms?.hero?.stat2_label || 'Verified hosts'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 group cursor-default">
                    <div className="w-8 h-8 bg-white border border-border rounded-lg flex items-center justify-center group-hover:bg-[#1c1917] group-hover:border-[#1c1917] transition-all duration-300">
                      <Icons.MapPin size={14} className="text-[#1c1917] group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-display font-black text-lg text-[#1c1917] leading-none">{publicStats?.total_cities || 0}+</p>
                      <p className="text-[10px] text-[#71717a] mt-0.5">{cms?.hero?.stat3_label || 'Locations'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`hidden lg:block transition-all duration-1000 ease-out delay-300 ${heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <div className="relative">
                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="font-display font-bold text-sm text-[#1c1917]">{cms?.hero?.dashboard_title || 'Storage Overview'}</h2>
                      <p className="text-[10px] text-[#71717a] mt-0.5">{cms?.hero?.dashboard_subtitle || 'Live inventory dashboard'}</p>
                    </div>
                    <span className="text-xs bg-brick-light text-brick font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brick opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brick" />
                      </span>
                      Live
                    </span>
                  </div>

                  <div className="space-y-2.5 mb-5">
                    {publicStats?.recent_bookings?.length > 0 ? publicStats.recent_bookings.map((b, i) => (
                      <div key={b.id} className="p-3.5 bg-chalk rounded-xl border border-border hover:border-[#1c1917]/20 hover:shadow-sm transition-all duration-200 cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-xs font-bold text-[#1c1917]">{b.listing_title}</p>
                            <p className="text-[10px] text-[#71717a] mt-0.5">{b.location} · {b.host_name}</p>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full capitalize">{b.status}</span>
                        </div>
                        <div className="h-1.5 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#1c1917] to-brick rounded-full transition-all duration-1000 ease-out" style={{ width: heroVisible ? `${60 + i * 20}%` : '0%', transitionDelay: `${600 + i * 200}ms` }} />
                        </div>
                      </div>
                    )) : (
                      <>
                        <div className="p-3.5 bg-chalk rounded-xl border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-bold text-[#1c1917]">Ready for bookings</p>
                            <span className="text-[10px] font-bold text-[#71717a]">—</span>
                          </div>
                          <div className="h-1.5 bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#1c1917] to-brick rounded-full transition-all duration-1000 ease-out" style={{ width: heroVisible ? '30%' : '0%', transitionDelay: '600ms' }} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="bg-chalk border border-border rounded-xl p-3 text-center">
                      <p className="font-display font-black text-base text-[#1c1917]">{publicStats?.total_listings || 0}</p>
                      <p className="text-[10px] text-[#71717a] mt-0.5">Spaces</p>
                    </div>
                    <div className="bg-chalk border border-border rounded-xl p-3 text-center">
                      <p className="font-display font-black text-base text-[#1c1917]">Rs {Number(publicStats?.monthly_revenue || 0).toLocaleString()}</p>
                      <p className="text-[10px] text-[#71717a] mt-0.5">This month</p>
                    </div>
                    <div className="bg-chalk border border-border rounded-xl p-3 text-center">
                      <p className="font-display font-black text-base text-[#1c1917]">{publicStats?.total_cities || 0}</p>
                      <p className="text-[10px] text-[#71717a] mt-0.5">Locations</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-5 -right-5 bg-white border border-border rounded-xl px-4 py-3 shadow-sm animate-float-1 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-brick-light flex items-center justify-center">
                      <Icons.Truck size={13} className="text-brick" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1c1917]">{cms?.hero?.floating_card_1_title || 'Pickup confirmed'}</p>
                      <p className="text-[10px] text-[#71717a]">{cms?.hero?.floating_card_1_subtitle || 'Today at 2:00 PM'}</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-5 -left-5 bg-white border border-border rounded-xl px-4 py-3 shadow-sm animate-float-2 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Icons.Check size={13} className="text-emerald-500" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1c1917]">{cms?.hero?.floating_card_2_title || 'Booking approved'}</p>
                      <p className="text-[10px] text-[#71717a]">{cms?.hero?.floating_card_2_subtitle || 'By Host'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      
      <section className="py-24 bg-[#FAFAF9]">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-16" direction="up">
            <p className="text-xs font-bold text-brick uppercase tracking-widest mb-3">{cms?.section_headings?.how_it_works_badge || 'How it works'}</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-[#1c1917] tracking-tight leading-tight max-w-lg">
              {cms?.section_headings?.how_it_works_title || 'Up and running in four steps.'}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => {
              const StepIcon = Icons[step.icon] || Icons.Package;
              return (
                <Reveal key={i} delay={i * 100} direction="scale">
                  <div className="relative group h-full">
                    <div className="bg-white border border-border rounded-xl p-6 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 ease-out h-full">
                      <p className="font-display font-black text-5xl text-border mb-5 group-hover:text-brick-light transition-colors duration-300">{step.step_number || step.num}</p>
                      <h3 className="font-display font-bold text-[#1c1917] mb-2 text-base">{step.title}</h3>
                      <p className="text-[#71717a] text-sm leading-relaxed">{step.description || step.desc}</p>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-border group-hover:bg-[#1c1917]/20 transition-colors z-10" aria-hidden="true" />
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-y border-border">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <Reveal direction="left">
              <p className="text-xs font-bold text-brick uppercase tracking-widest mb-3">{cms?.section_headings?.features_badge || 'What you get'}</p>
              <h2 className="font-display font-black text-4xl lg:text-5xl text-[#1c1917] tracking-tight leading-tight">
                {cms?.section_headings?.features_title || "Everything you need. Nothing you don't."}
              </h2>
            </Reveal>
            <Reveal delay={100} direction="right">
              <p className="text-[#71717a] text-lg leading-relaxed">
                {cms?.section_headings?.features_description || "Built specifically for Nepal's growing community of home-based sellers who need more than just a shelf in their bedroom."}
              </p>
            </Reveal>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const FeatureIcon = Icons[f.icon] || Icons.Package;
              return (
                <Reveal key={i} delay={i * 60} direction="scale">
                  <div className="group flex gap-4 p-5 border border-border rounded-xl hover:border-[#1c1917] hover:bg-chalk hover:shadow-md transition-all duration-300 h-full">
                    <div className="w-10 h-10 bg-chalk rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#1c1917] group-hover:scale-110 transition-all duration-300">
                      <FeatureIcon size={17} className="text-[#1c1917] group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-[#1c1917] mb-1 text-sm">{f.title}</h3>
                      <p className="text-[#71717a] text-xs leading-relaxed">{f.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#FAFAF9]">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-16" direction="up">
            <p className="text-xs font-bold text-brick uppercase tracking-widest mb-3">{cms?.section_headings?.testimonials_badge || 'Real sellers'}</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-[#1c1917] tracking-tight leading-tight">
              {cms?.section_headings?.testimonials_title || "What they're saying."}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 100} direction="up">
                <div className="bg-white border border-border rounded-xl p-6 h-full flex flex-col hover:border-[#3a3a3a] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex gap-0.5 mb-4" aria-label={`Rating: ${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating || 5 }).map((_, j) => (
                      <Icons.Star key={j} size={13} className="fill-mustard text-mustard" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-[#3a3a3a] text-sm leading-relaxed flex-1 mb-6">"{t.review || t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1c1917] to-brick flex items-center justify-center text-white font-display font-black text-sm shrink-0" aria-hidden="true">
                      {t.customer_name?.[0] || t.name?.[0]}
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm text-[#1c1917]">{t.customer_name || t.name}</p>
                      <p className="text-xs text-[#71717a]">{t.position || t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-t border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <Reveal className="mb-12" direction="up">
            <p className="text-xs font-bold text-brick uppercase tracking-widest mb-3">{cms?.section_headings?.faq_badge || 'FAQ'}</p>
            <h2 className="font-display font-black text-4xl text-[#1c1917] tracking-tight leading-tight">{cms?.section_headings?.faq_title || 'Common questions.'}</h2>
          </Reveal>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 50} direction="up">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className={`w-full text-left border rounded-xl px-5 py-4 cursor-pointer transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brick ${
                    openFaq === i ? 'border-[#1c1917] bg-chalk shadow-md' : 'border-border bg-white hover:border-[#3a3a3a]/40 hover:shadow-sm hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-display font-semibold text-sm text-[#1c1917]">{faq.question || faq.q}</span>
                    <div className={`shrink-0 text-[#71717a] transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}>
                      <Icons.ChevronDown size={16} aria-hidden="true" />
                    </div>
                  </div>
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${openFaq === i ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[#71717a] text-sm leading-relaxed">{faq.answer || faq.a}</p>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />

    </main>
  );
}