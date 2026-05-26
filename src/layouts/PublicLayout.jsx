import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Store, ShoppingCart, MessageSquare, Menu, X, Info, User, Globe, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import CartDrawer from '../components/public/CartDrawer';
import WhatsAppWidget from '../components/public/WhatsAppWidget';
import EnquiryPopup from '../components/public/EnquiryPopup';

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { cartCount, setIsCartOpen } = useCart();
  const { isCustomer } = useAuth();
  const { currency, setCurrency, currencies } = useCurrency();
  const [showBanner, setShowBanner] = useState(() => {
    return sessionStorage.getItem('seasonal_banner_dismissed') !== 'true';
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { id: '/', label: 'Home', icon: Store },
    { id: '/shop', label: 'Shop', icon: ShoppingCart },
    { id: '/blog', label: 'Insights', icon: Info },
    { id: '/contact', label: 'Contact', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: 'var(--bg-base)', color: 'var(--text-secondary)' }}>

      {/* ── Noise Overlay ── */}
      <div className="pointer-events-none fixed inset-0 z-[5] opacity-[0.025] mix-blend-multiply noise-overlay" aria-hidden="true" />

      {/* ── Seasonal Top Banner ── */}
      {showBanner && (
        <div className="bg-gradient-to-r from-emerald-600 via-[#10B981] to-emerald-700 text-white text-center py-2 px-4 text-xs sm:text-sm font-semibold relative flex items-center justify-center gap-2 z-[60] shadow-sm font-display pr-10">
          <span>🌱 Harvest Season Special: Get special wholesale rates on G9 Cavendish & Nendran Bananas!</span>
          <button 
            onClick={() => navigate('/contact?subject=Harvest Special rates')} 
            className="underline hover:text-emerald-100 transition-colors ml-1 font-bold whitespace-nowrap"
          >
            Get Quote
          </button>
          <button 
            onClick={() => {
              setShowBanner(false);
              sessionStorage.setItem('seasonal_banner_dismissed', 'true');
            }}
            className="absolute right-3 p-1 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Navbar ── */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#FEFAF3]/90 backdrop-blur-xl shadow-[0_1px_0_#E8E0D0]' : 'bg-transparent'}`}>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3">

          {/* Logo */}
          <NavLink to="/" className="group flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E8E0D0] bg-white shadow-sm transition-transform duration-300 group-hover:scale-105">
              <img src="/logo.png" alt="Alphovins Global Agro Exports" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0A0A0A] font-display hidden sm:inline">Alphovins</span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.id}
                to={item.id}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 font-display ${
                    isActive
                      ? 'text-[#10B981] bg-[#ECFDF5]'
                      : 'text-[#374151] hover:text-[#0A0A0A] hover:bg-[#F5F0E8]'
                  }`
                }
              >
                <item.icon size={15} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Currency Selector */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F5F0E8] border border-[#E8E0D0] text-xs font-medium text-[#374151]">
              <Globe size={13} className="text-[#10B981]" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-[#374151] cursor-pointer text-xs"
              >
                {Object.entries(currencies).map(([code, details]) => (
                  <option key={code} value={code} className="bg-white">{details.label}</option>
                ))}
              </select>
            </div>

            {/* Sign In */}
            <NavLink
              to={isCustomer ? "/account" : "/login"}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium font-display border border-[#E8E0D0] text-[#374151] hover:border-[rgba(16,185,129,0.4)] hover:text-[#10B981] hover:bg-[#ECFDF5] transition-all duration-200"
            >
              <User size={15} />
              <span>{isCustomer ? "My Account" : "Sign In"}</span>
            </NavLink>

            {/* Cart */}
            <button
              id="cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-[#E8E0D0] bg-white text-[#374151] hover:border-[rgba(16,185,129,0.4)] hover:text-[#10B981] transition-all duration-200"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#10B981] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-[#E8E0D0] bg-white text-[#374151]"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8E0D0] bg-[#FEFAF3]/95 backdrop-blur-xl fade-in">
            <nav className="px-4 py-3 space-y-1">
              {navItems.map(item => (
                <NavLink
                  key={item.id}
                  to={item.id}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium font-display transition-all duration-200 ${
                      isActive
                        ? 'bg-[#ECFDF5] text-[#10B981]'
                        : 'text-[#374151] hover:text-[#0A0A0A] hover:bg-[#F5F0E8]'
                    }`
                  }
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
              <NavLink
                to={isCustomer ? "/account" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium font-display border border-[#E8E0D0] text-[#374151] hover:border-[rgba(16,185,129,0.4)] hover:bg-[#ECFDF5] hover:text-[#10B981] transition-all mt-1"
              >
                <User size={18} />
                <span>{isCustomer ? "My Account" : "Sign In / Register"}</span>
              </NavLink>
            </nav>
          </div>
        )}
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <CartDrawer />
      <WhatsAppWidget />
      <EnquiryPopup />

      {/* ── Footer ── */}
      <footer className="w-full bg-[#F5F0E8] border-t border-[#E8E0D0] mt-auto">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Brand */}
            <div className="md:col-span-1">
              <NavLink to="/" className="flex items-center gap-3 group mb-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E8E0D0] bg-white">
                  <img src="/logo.png" alt="Alphovins" className="h-full w-full object-cover" />
                </div>
                <span className="font-display text-lg font-bold text-[#0A0A0A]">Alphovins</span>
              </NavLink>
              <p className="text-sm leading-relaxed text-[#6B7280] max-w-xs">
                Premium bananas, farm fresh. Grown in Tamil Nadu and delivered to your doorstep.
              </p>
              <p className="mt-3 text-xs text-[#9CA3AF]">🌱 Grown with care in India</p>
            </div>

            {/* Shop */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B7280] font-display">Shop</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {[
                  { to: '/shop', label: 'All Products' },
                  { to: '/shop', label: 'Nendran Banana' },
                  { to: '/shop', label: 'Robusta Banana' },
                  { to: '/shop', label: 'Red Banana' },
                ].map(l => (
                  <li key={l.label}>
                    <NavLink to={l.to} className="text-[#6B7280] transition-colors hover:text-[#0A0A0A]">{l.label}</NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B7280] font-display">Company</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {[
                  { to: '/', label: 'About Us' },
                  { to: '/faq', label: 'FAQ' },
                  { to: '/blog', label: 'Market Insights' },
                  { to: '/contact', label: 'Contact' },
                  { to: '/terms', label: 'Terms & Conditions' },
                  { to: '/privacy', label: 'Privacy Policy' },
                  { to: '/refund', label: 'Refund Policy' },
                ].map(l => (
                  <li key={l.label}>
                    <NavLink to={l.to} className="text-[#6B7280] transition-colors hover:text-[#0A0A0A]">{l.label}</NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B7280] font-display">Contact</h3>
              <ul className="mt-5 space-y-3 text-sm text-[#6B7280]">
                <li>
                  <a href="mailto:business.alphovins@gmail.com" className="hover:text-[#0A0A0A] transition-colors">
                    business.alphovins@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:+918925011054" className="hover:text-[#0A0A0A] transition-colors">
                    +91 89250 11054
                  </a>
                </li>
                <li className="leading-relaxed">
                  Pampanvilai, Nagercoil<br />Kanyakumari, Tamil Nadu — 629201
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 flex flex-col gap-4 border-t border-[#E8E0D0] pt-8 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[#9CA3AF]">
              © {new Date().getFullYear()} ALPHOVINS GLOBAL AGRO EXPORTS. All rights reserved.
            </p>
            <NavLink to="/admin/login" className="text-xs text-[#D1D5DB] hover:text-[#9CA3AF] transition-colors">
              Admin Portal
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
