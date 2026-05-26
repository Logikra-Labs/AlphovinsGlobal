import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ArrowRight, MessageCircle } from 'lucide-react';

const FAQ_SECTIONS = [
  {
    category: 'Ordering & Products',
    items: [
      {
        q: 'What banana varieties do you sell?',
        a: 'We sell Robusta Banana (ரோபஸ்டா வாழை), Nendran Banana (நேந்திரன் வாழை), Red Banana (செவ்வாழை), and Poovan Banana (பூவன் வாழை). All varieties are freshly harvested from our farms in Tamil Nadu.',
      },
      {
        q: 'What is a "Thar" and how many kilograms is it?',
        a: 'A Thar (தார்) is a full bunch of bananas — the natural cluster harvested directly from the banana plant. The weight per Thar varies by variety (typically 10–25 kg). It\'s popular for families, retailers, and wholesalers who want a whole bunch.',
      },
      {
        q: 'Can I order by the kilogram?',
        a: 'Yes! You can order bananas by the kilogram (kg) or by the full Thar (bunch). Simply add your preferred option to the cart on the Shop page.',
      },
      {
        q: 'Are the bananas organic?',
        a: 'Our Red Banana (Sevvazhai) variety is grown organically. Other varieties are grown using responsible agricultural practices on our Tamil Nadu farms.',
      },
    ],
  },
  {
    category: 'Pricing & Payment',
    items: [
      {
        q: 'Why do banana prices change every day?',
        a: 'Banana prices are market-driven and fluctuate daily based on harvest yields, seasonal availability, demand, and transportation costs. We update prices on our platform regularly to reflect the current market rate.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept UPI (Google Pay, PhonePe, Paytm), debit/credit cards, net banking, and cash on delivery for local orders. International buyers can contact us for export invoice arrangements.',
      },
      {
        q: 'Can I get a custom price for bulk orders?',
        a: 'Absolutely. For bulk or wholesale orders (above 100 kg or 10 Thars), contact us via the Contact page or WhatsApp for a custom export price sheet tailored to your quantity and destination.',
      },
    ],
  },
  {
    category: 'Export & Shipping',
    items: [
      {
        q: 'Do you export internationally?',
        a: 'Yes! We export to over 25 countries including Singapore, UAE, Malaysia, UK, Germany, USA, and more. Contact us for a bulk export quote and we will assist with documentation, packaging, and freight arrangements.',
      },
      {
        q: 'How are the bananas packaged for export?',
        a: 'Bananas for export are carefully graded, cleaned, and packed in food-safe corrugated carton boxes with ventilation. We use refrigerated transport where necessary to maintain freshness during long-haul delivery.',
      },
      {
        q: 'What is the minimum order quantity for export?',
        a: 'For international export, the minimum order is typically one pallet (approx. 800–1000 kg). We can arrange smaller trial shipments for new buyers — contact us to discuss your requirements.',
      },
      {
        q: 'How long does delivery take?',
        a: 'For domestic orders within India: 1–3 business days. For international export: 7–21 days depending on the destination country and shipping route. We will provide a tracking update once your shipment is dispatched.',
      },
    ],
  },
  {
    category: 'Account & Orders',
    items: [
      {
        q: 'Do I need an account to place an order?',
        a: 'You can browse the shop without an account, but you\'ll need to sign in to complete a purchase. Creating an account is free and allows you to track your orders and manage your profile.',
      },
      {
        q: 'How do I track my order?',
        a: 'Once signed in, go to "My Account" to see your order history and status updates. For export shipments, we will share a tracking number via email or WhatsApp after dispatch.',
      },
      {
        q: 'What is your refund policy?',
        a: 'Since bananas are a perishable product, refunds are offered in cases of damaged or incorrect items received. Please contact us within 24 hours of delivery with photos of the issue and we will arrange a resolution.',
      },
    ],
  },
];

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-[18px] border transition-all duration-300 overflow-hidden ${open ? 'border-[rgba(16,185,129,0.35)] bg-[#FAFFFE]' : 'border-[#E8E0D0] bg-white hover:border-[rgba(16,185,129,0.2)]'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className={`font-semibold font-display text-base transition-colors ${open ? 'text-[#10B981]' : 'text-[#0A0A0A]'}`}>
          {question}
        </span>
        <ChevronDown
          size={20}
          className={`text-[#9CA3AF] shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-[#10B981]' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-[#374151] leading-[1.8] text-sm border-t border-[#E8E0D0] pt-4 fade-in">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div style={{ background: 'var(--bg-base)' }}>
      {/* Header */}
      <div className="bg-[#F5F0E8] border-b border-[#E8E0D0] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto slide-up">
          <p className="section-label mb-3">Help Centre</p>
          <h1 className="font-display font-bold tracking-[-0.025em] text-[#0A0A0A] mb-4" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-lg text-[#374151] max-w-xl leading-[1.7]">
            Everything you need to know about ordering, pricing, and exporting bananas with Alphovins.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        {FAQ_SECTIONS.map((section, si) => (
          <div key={section.category} className="slide-up" style={{ animationDelay: `${si * 100}ms` }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-[#ECFDF5] border border-[rgba(16,185,129,0.2)] text-[#10B981] flex items-center justify-center font-bold font-display text-sm">
                {si + 1}
              </span>
              <h2 className="text-xl font-bold text-[#0A0A0A] font-display">{section.category}</h2>
            </div>
            <div className="space-y-3">
              {section.items.map((item) => (
                <FAQItem key={item.q} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="rounded-[24px] bg-[#F5F0E8] border border-[#E8E0D0] p-8 sm:p-12 text-center relative overflow-hidden slide-up">
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 100%, rgba(16,185,129,0.06), transparent 70%)' }} />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-full bg-[#ECFDF5] border border-[rgba(16,185,129,0.2)] flex items-center justify-center text-[#10B981] mx-auto mb-5">
              <MessageCircle size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[#0A0A0A] font-display mb-3">Still have questions?</h2>
            <p className="text-[#374151] mb-8 max-w-md mx-auto leading-[1.7]">
              Our team is happy to help. Send us a message and we'll get back to you quickly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <NavLink to="/contact" className="btn-primary btn-shine px-8 py-3.5">
                Contact Us <ArrowRight size={16} />
              </NavLink>
              <a
                href="https://wa.me/918925011054?text=Hi%2C%20I%20have%20a%20question%20about%20Alphovins"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline px-8 py-3.5"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
