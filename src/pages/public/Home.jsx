import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Truck, Globe2, Package, Star, MapPin, Banana } from 'lucide-react';

const BANANA_VARIETIES = [
  { emoji: '🍌', name: 'Robusta Banana', tamil: 'ரோபஸ்டா வாழை', desc: 'The most popular commercial export variety. Sweet, creamy, and rich in potassium. Ideal for bulk export and wholesale.', tags: ['Export Grade', 'Bulk Available'] },
  { emoji: '🍌', name: 'Nendran Banana', tamil: 'நேந்திரன் வாழை', desc: 'A premium starchy banana widely known as Kerala Banana. Prized for chips, cooking, and direct export across the globe.', tags: ['Premium Export', 'Cooking Banana'] },
  { emoji: '🍌', name: 'Red Banana', tamil: 'செவ்வாழை', desc: 'Exotic, high-value Red Banana (Sevvazhai) grown organically in Tamil Nadu. A sought-after variety in international markets.', tags: ['Organic', 'High Value'] },
  { emoji: '🍌', name: 'Poovan Banana', tamil: 'பூவன் வாழை', desc: 'A traditional South Indian variety known for its sweet-tangy taste and long shelf life, popular in domestic and regional markets.', tags: ['Traditional', 'Wholesale'] },
];

const EXPORT_REGIONS = [
  { flag: '🇸🇬', country: 'Singapore' },
  { flag: '🇦🇪', country: 'UAE / Gulf' },
  { flag: '🇲🇾', country: 'Malaysia' },
  { flag: '🇬🇧', country: 'United Kingdom' },
  { flag: '🇺🇸', country: 'United States' },
  { flag: '🇩🇪', country: 'Germany' },
];

const STATS = [
  { value: '4+', label: 'Banana Varieties', icon: <Banana size={20} /> },
  { value: '25+', label: 'Export Countries', icon: <Globe2 size={20} /> },
  { value: '100%', label: 'Farm Fresh', icon: <Leaf size={20} /> },
  { value: '5★', label: 'Quality Rated', icon: <Star size={20} /> },
];

export default function Home() {
  return (
    <div className="w-full">

      {/* ── Hero ── */}
      <section aria-label="Hero" className="relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>
        {/* Subtle radial glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-[200px] -top-[100px] h-[600px] w-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-0 -right-[150px] h-[500px] w-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(110,231,183,0.05) 0%, transparent 70%)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center min-h-[calc(100vh-5rem)] py-20 lg:py-28">

            {/* Text */}
            <div className="slide-in-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[rgba(16,185,129,0.25)] text-[#10B981] text-xs font-semibold font-display mb-8 tracking-wide">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10B981]" />
                </span>
                Fresh Harvest Available Now
              </div>

              <h1 className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] text-[#0A0A0A] mb-6" style={{ fontSize: 'clamp(44px, 6vw, 72px)' }}>
                <span className="flex flex-wrap gap-x-4">
                  <span>Premium</span>
                  <span>Bananas</span>
                </span>
                <span className="gradient-text inline-block">Direct to You.</span>
              </h1>

              <p className="text-lg text-[#374151] mb-10 max-w-xl leading-[1.7]">
                Alphovins Global Agro Exports — a trusted <strong className="font-semibold text-[#0A0A0A]">banana exporter from Tamil Nadu, India</strong>. Order fresh bananas online or request a bulk export quote for your business.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <NavLink to="/shop" id="hero-shop-btn" className="btn-primary btn-shine px-8 py-4 text-base">
                  Shop Now <ArrowRight size={18} />
                </NavLink>
                <NavLink to="/contact" id="hero-bulk-btn" className="btn-outline px-8 py-4 text-base">
                  Bulk Export Inquiry
                </NavLink>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="relative slide-in-right">
              <div className="grid grid-cols-2 gap-4">
                {STATS.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`card p-6 ${i === 1 ? 'bg-[#10B981] border-[#10B981] hover:border-[#10B981]' : ''}`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <p className={`text-[11px] font-bold uppercase tracking-[0.1em] font-display ${i === 1 ? 'text-white/80' : 'text-[#6B7280]'}`}>
                      {stat.label}
                    </p>
                    <p className={`mt-3 font-display text-4xl font-extrabold ${i === 1 ? 'text-white' : 'text-[#10B981]'}`}>
                      {stat.value}
                    </p>
                    <div className={`mt-1.5 ${i === 1 ? 'text-white/70' : 'text-[#6B7280]'}`}>
                      {stat.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <div className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-[rgba(16,185,129,0.4)] p-1">
            <div className="h-2 w-1 rounded-full bg-[#10B981] animate-bounce" />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#6B7280] font-display">Scroll</span>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section aria-label="Trust indicators" className="bg-white border-y border-[#E8E0D0] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-sm text-[#6B7280]">
            {[
              { icon: <Star size={14} className="text-amber-400 fill-amber-400" />, text: 'Export Quality Certified' },
              { icon: <MapPin size={14} className="text-[#10B981]" />, text: 'Farm-to-Export, Tamil Nadu' },
              { icon: <Globe2 size={14} className="text-[#10B981]" />, text: 'Shipping to 25+ Countries' },
              { icon: <Package size={14} className="text-[#10B981]" />, text: 'Bulk Wholesale Available' },
            ].map(item => (
              <span key={item.text} className="flex items-center gap-2 font-medium">{item.icon} {item.text}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section aria-label="Why choose Alphovins" className="py-24 lg:py-32" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16 slide-up">
            <p className="section-label">Why Alphovins</p>
            <h2 className="mt-3 font-display font-bold tracking-[-0.025em] text-[#0A0A0A]" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
              Farm to export,<br /><span className="gradient-text">done right.</span>
            </h2>
            <p className="mt-4 text-[#374151] leading-[1.7] text-lg">
              We control every step from cultivation to packaging — so you always receive the finest quality bananas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Leaf size={22} />, title: 'Farm Fresh', delay: '100ms', desc: 'Harvested at peak ripeness from our Tamil Nadu farms. No middlemen — straight from our fields to your order.' },
              { icon: <ShieldCheck size={22} />, title: 'Export-Grade Quality', delay: '200ms', desc: 'Strict quality control at every step. Only the best bananas make it to your shipment. International food safety standards met.' },
              { icon: <Truck size={22} />, title: 'Reliable Logistics', delay: '300ms', desc: 'Carefully packaged for domestic delivery and long-haul export. We assist with international freight documentation.' },
            ].map(item => (
              <div key={item.title} className="card p-8 slide-up" style={{ animationDelay: item.delay }}>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ECFDF5] border border-[rgba(16,185,129,0.2)] text-[#10B981] mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0A0A0A] font-display mb-3">{item.title}</h3>
                <p className="text-[#374151] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Banana Varieties ── */}
      <section aria-label="Banana varieties" className="py-24 lg:py-32 bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16 slide-up">
            <p className="section-label">Our Varieties</p>
            <h2 className="mt-3 font-display font-bold tracking-[-0.025em] text-[#0A0A0A]" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
              Bananas We <span className="gradient-text">Grow & Export</span>
            </h2>
            <p className="mt-4 text-[#374151] leading-[1.7] text-lg">
              We cultivate premium banana varieties in Tamil Nadu, available for bulk wholesale and international export.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BANANA_VARIETIES.map((variety, i) => (
              <div key={variety.name} className="card p-6 slide-up group" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{variety.emoji}</div>
                <h3 className="text-lg font-bold text-[#0A0A0A] font-display mb-1">{variety.name}</h3>
                <p className="text-xs text-[#10B981] mb-3 font-semibold">{variety.tamil}</p>
                <p className="text-[#374151] text-sm leading-relaxed mb-4">{variety.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {variety.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#10B981] border border-[rgba(16,185,129,0.2)]">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-left mt-10">
            <NavLink to="/shop" id="varieties-shop-btn" className="btn-outline inline-flex">
              View All Products & Prices <ArrowRight size={16} />
            </NavLink>
          </div>
        </div>
      </section>

      {/* ── Export Destinations ── */}
      <section aria-label="Export destinations" className="py-20 bg-white border-y border-[#E8E0D0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-12 slide-up">
            <p className="section-label">Global Reach</p>
            <h2 className="mt-3 font-display font-bold tracking-[-0.025em] text-[#0A0A0A]" style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}>
              We export to <span className="gradient-text">25+ countries</span>
            </h2>
            <p className="mt-3 text-[#374151] leading-[1.7]">
              Fresh bananas from Tamil Nadu farms to buyers across Asia, the Middle East, Europe, and beyond.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {EXPORT_REGIONS.map(r => (
              <div key={r.country} className="flex items-center gap-2 px-4 py-2.5 bg-[#F5F0E8] border border-[#E8E0D0] rounded-2xl text-[#374151] text-sm font-medium hover:border-[rgba(16,185,129,0.35)] hover:bg-[#ECFDF5] transition-colors cursor-default">
                <span className="text-lg">{r.flag}</span> {r.country}
              </div>
            ))}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#ECFDF5] border border-[rgba(16,185,129,0.25)] rounded-2xl text-[#10B981] text-sm font-semibold">
              <Globe2 size={14} /> + More
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section aria-label="Customer testimonials" className="py-24 lg:py-32" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16 slide-up">
            <p className="section-label">What Customers Say</p>
            <h2 className="mt-3 font-display font-bold tracking-[-0.025em] text-[#0A0A0A]" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
              Trusted by buyers <span className="gradient-text">across India & beyond</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Ramesh V.', role: 'Wholesale Retailer, Chennai', quote: 'We have been sourcing Robusta bananas from Alphovins for over 6 months. The quality is consistently excellent and the pricing is fair. Delivery is always on time.', stars: 5 },
              { name: 'Priya S.', role: 'Restaurant Owner, Bangalore', quote: 'The Nendran bananas are the best we have ever received for our kitchen. They are perfect for our traditional dishes. Highly recommend for bulk orders!', stars: 5 },
              { name: 'Khalid M.', role: 'Import Agent, UAE', quote: 'Excellent export quality and proper documentation. The Red Bananas from Alphovins are highly sought after in our Gulf market. Great business to work with.', stars: 5 },
            ].map((t, i) => (
              <div key={t.name} className="card p-7 flex flex-col gap-4 slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <span key={si} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-[#374151] leading-[1.8] text-sm flex-1">"{t.quote}"</p>
                <div className="pt-4 border-t border-[#E8E0D0] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#ECFDF5] border border-[rgba(16,185,129,0.2)] flex items-center justify-center text-[#10B981] font-bold font-display text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-[#0A0A0A] text-sm font-display">{t.name}</p>
                    <p className="text-xs text-[#9CA3AF]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About / SEO Block ── */}
      <section aria-label="About Alphovins" className="py-24 lg:py-32 bg-[#F5F0E8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 slide-up">
          <p className="section-label mb-3">About Us</p>
          <h2 className="font-display font-bold tracking-[-0.025em] text-[#0A0A0A] mb-6" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
            India's Trusted <span className="gradient-text">Banana Exporter</span>
          </h2>
          <p className="text-[#374151] leading-[1.7] mb-6 text-lg">
            Based in <strong className="font-semibold text-[#0A0A0A]">Tamil Nadu, India</strong>, Alphovins Global Agro Exports is a leading supplier of export-quality bananas to domestic and international markets. We specialize in the cultivation and bulk export of <strong className="font-semibold text-[#0A0A0A]">Robusta, Nendran, Red Banana (Sevvazhai), and Poovan</strong> varieties — grown on our certified farms and shipped to buyers across the world.
          </p>
          <p className="text-[#374151] leading-[1.7] mb-10 text-lg">
            Whether you are a <strong className="font-semibold text-[#0A0A0A]">wholesaler, importer, retailer, or individual buyer</strong>, we offer flexible purchase options by the kilogram, by the bunch (thar), or by the pallet for international shipments.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <NavLink to="/contact" id="about-contact-btn" className="btn-primary btn-shine px-8 py-4">
              Request a Bulk Export Quote <ArrowRight size={16} />
            </NavLink>
            <NavLink to="/blog" id="about-blog-btn" className="btn-outline px-8 py-4">
              Market Insights
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
}
