import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Truck, Globe2, Package, Star, MapPin } from 'lucide-react';

const BANANA_VARIETIES = [
  {
    emoji: '🍌',
    name: 'Robusta Banana',
    tamil: 'ரோபஸ்டா வாழை',
    desc: 'The most popular commercial export variety. Sweet, creamy, and rich in potassium. Ideal for bulk export and wholesale.',
    tags: ['Export Grade', 'Bulk Available'],
  },
  {
    emoji: '🍌',
    name: 'Nendran Banana',
    tamil: 'நேந்திரன் வாழை',
    desc: 'A premium starchy banana widely known as Kerala Banana. Prized for chips, cooking, and direct export across the globe.',
    tags: ['Premium Export', 'Cooking Banana'],
  },
  {
    emoji: '🍌',
    name: 'Red Banana',
    tamil: 'செவ்வாழை',
    desc: 'Exotic, high-value Red Banana (Sevvazhai) grown organically in Tamil Nadu. A sought-after variety in international markets.',
    tags: ['Organic', 'High Value'],
  },
  {
    emoji: '🍌',
    name: 'Poovan Banana',
    tamil: 'பூவன் வாழை',
    desc: 'A traditional South Indian variety known for its sweet-tangy taste and long shelf life, popular in domestic and regional markets.',
    tags: ['Traditional', 'Wholesale'],
  },
];

const EXPORT_REGIONS = [
  { flag: '🇸🇬', country: 'Singapore' },
  { flag: '🇦🇪', country: 'UAE / Gulf' },
  { flag: '🇲🇾', country: 'Malaysia' },
  { flag: '🇬🇧', country: 'United Kingdom' },
  { flag: '🇺🇸', country: 'United States' },
  { flag: '🇩🇪', country: 'Germany' },
];

export default function Home() {
  return (
    <div className="w-full">
      {/* ── Hero Section ── */}
      <section aria-label="Hero" className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-[#020a04] z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left slide-in-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Fresh Harvest Available Now
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
                Premium Bananas <br />
                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-300 bg-clip-text text-transparent">
                  Direct to You.
                </span>
              </h1>

              <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Alphovins Global Agro Exports — a trusted <strong className="text-green-400">banana exporter from Tamil Nadu, India</strong>. 
                Order fresh bananas online by the kilogram or by the bunch, or request a bulk export quote for your business.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <NavLink
                  to="/shop"
                  id="hero-shop-btn"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-green-500 hover:bg-green-400 text-[#020a04] shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all flex items-center justify-center gap-2 group"
                >
                  Shop Now
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </NavLink>
                <NavLink
                  to="/contact"
                  id="hero-bulk-btn"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all flex items-center justify-center"
                >
                  Bulk Export Inquiry
                </NavLink>
              </div>
            </div>

            <div className="relative slide-in-right hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-[-20px] bg-green-500/15 rounded-full blur-[60px]"></div>
                <div className="w-[400px] h-[400px] rounded-full overflow-hidden border-4 border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.25)] relative">
                  <img
                    src="/logo.png"
                    alt="Alphovins Global Agro Exports — Banana Exporter Tamil Nadu India"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section aria-label="Trust indicators" className="bg-[#010602] border-y border-green-900/30 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm text-gray-400">
            <span className="flex items-center gap-2"><Star size={15} className="text-yellow-400 fill-yellow-400" /> Export Quality Certified</span>
            <span className="flex items-center gap-2"><MapPin size={15} className="text-green-400" /> Farm-to-Export, Tamil Nadu</span>
            <span className="flex items-center gap-2"><Globe2 size={15} className="text-green-400" /> Shipping to 25+ Countries</span>
            <span className="flex items-center gap-2"><Package size={15} className="text-green-400" /> Bulk Wholesale Available</span>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section aria-label="Why choose Alphovins" className="bg-[#010602] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 slide-up">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Alphovins?</h2>
            <p className="text-gray-400">
              We are a vertically integrated banana cultivation and export company from Tamil Nadu. 
              We control every step — from planting to packaging — so you receive only the best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Leaf size={28} />, title: 'Farm Fresh', delay: '100ms', desc: 'Harvested at peak ripeness from our Tamil Nadu banana farms and delivered directly. No middlemen, no delays.' },
              { icon: <ShieldCheck size={28} />, title: 'Export-Grade Quality', delay: '200ms', desc: 'Strict quality control ensures only the best bananas make it to your shipment. We meet international food safety standards.' },
              { icon: <Truck size={28} />, title: 'Reliable Export Logistics', delay: '300ms', desc: 'Carefully packaged for long-haul export. We handle domestic delivery and assist with international freight documentation.' },
            ].map((item) => (
              <div key={item.title} className="bg-[#030f05] p-8 rounded-3xl border border-green-900/30 hover:border-green-500/30 transition-colors slide-up" style={{ animationDelay: item.delay }}>
                <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Banana Varieties ── */}
      <section aria-label="Banana varieties we export" className="bg-[#020a04] py-24 border-t border-green-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 slide-up">
            <h2 className="text-3xl font-bold text-white mb-4">
              Banana Varieties We <span className="text-green-400">Grow & Export</span>
            </h2>
            <p className="text-gray-400">
              We cultivate and export multiple premium banana varieties from Tamil Nadu, India. 
              Each variety is available for bulk wholesale and international export.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BANANA_VARIETIES.map((variety, i) => (
              <div
                key={variety.name}
                className="group bg-[#030f05] rounded-3xl border border-green-900/30 hover:border-green-500/40 p-6 transition-all duration-300 slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{variety.emoji}</div>
                <h3 className="text-lg font-bold text-white mb-1">{variety.name}</h3>
                <p className="text-xs text-green-500/70 mb-3 font-medium">{variety.tamil}</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{variety.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {variety.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <NavLink
              to="/shop"
              id="varieties-shop-btn"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 transition-all group"
            >
              View All Products & Prices
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </div>
        </div>
      </section>

      {/* ── Export Destinations ── */}
      <section aria-label="Countries we export bananas to" className="bg-[#010602] py-20 border-t border-green-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 slide-up">
            <h2 className="text-3xl font-bold text-white mb-4">
              Global <span className="text-green-400">Export Destinations</span>
            </h2>
            <p className="text-gray-400">
              We export fresh bananas from Tamil Nadu to buyers across Asia, the Middle East, Europe, and beyond.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {EXPORT_REGIONS.map((r) => (
              <div key={r.country} className="flex items-center gap-2 px-5 py-3 bg-[#030f05] border border-green-900/30 rounded-2xl text-gray-300 text-sm font-medium hover:border-green-500/40 transition-colors">
                <span className="text-xl">{r.flag}</span> {r.country}
              </div>
            ))}
            <div className="flex items-center gap-2 px-5 py-3 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm font-medium">
              <Globe2 size={16} /> + More
            </div>
          </div>
        </div>
      </section>

      {/* ── About / SEO Block ── */}
      <section aria-label="About Alphovins Global Agro Exports" className="bg-[#020a04] py-24 border-t border-green-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center slide-up">
          <h2 className="text-3xl font-bold text-white mb-6">
            India's Trusted Banana Exporter — <span className="text-green-400">Alphovins Global Agro Exports</span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6 text-lg">
            Based in <strong className="text-green-300">Tamil Nadu, India</strong>, Alphovins Global Agro Exports is a leading supplier 
            of export-quality bananas to domestic and international markets. We specialize in the cultivation and bulk export of 
            <strong className="text-green-300"> Robusta, Nendran, Red Banana (Sevvazhai), and Poovan</strong> varieties — 
            grown on our certified farms and shipped to buyers across the world.
          </p>
          <p className="text-gray-400 leading-relaxed mb-10 text-lg">
            Whether you are a <strong className="text-green-300">wholesaler, importer, retailer, or individual buyer</strong>, 
            we offer flexible purchase options: by the kilogram, by the bunch (thar), or by the pallet for international shipments. 
            Contact us for custom bulk export pricing and freight solutions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NavLink
              to="/contact"
              id="about-contact-btn"
              className="px-8 py-4 rounded-xl font-bold bg-green-500 hover:bg-green-400 text-[#020a04] shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex items-center gap-2 group"
            >
              Request a Bulk Export Quote
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </NavLink>
            <NavLink
              to="/blog"
              id="about-blog-btn"
              className="px-8 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all"
            >
              Market Insights
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
}

