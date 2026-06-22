import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'

export default function CTABanner() {
  return (
    <section className="py-16 bg-chalk-dark border-t border-border">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <p className="text-xs font-bold text-brick uppercase tracking-widest mb-3">Get started today</p>
            <h2 className="font-display font-black text-3xl text-[#1c1917] tracking-tight leading-tight mb-3">
              Stop storing stock at home.<br />Find a real space near you.
            </h2>
            <p className="text-[#71717a] text-sm leading-relaxed mb-4">
              Join 500+ sellers across Nepal who've moved their inventory to verified, affordable storage spaces.
            </p>
            <div className="flex flex-wrap gap-4">
              {['No setup fees', 'Cancel anytime', 'Verified hosts only'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-[#52525b]">
                  <div className="w-4 h-4 rounded-full bg-brick-light flex items-center justify-center shrink-0">
                    <Check size={9} className="text-brick" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-[#1c1917] hover:bg-brick text-white font-display font-bold px-6 py-3.5 rounded-md transition-colors text-sm">
              Create free account <ArrowRight size={15} />
            </Link>
            <Link to="/listings" className="inline-flex items-center justify-center gap-2 bg-white border border-border hover:border-[#1c1917] text-[#1c1917] font-display font-bold px-6 py-3.5 rounded-md transition-colors text-sm">
              Browse storage
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}